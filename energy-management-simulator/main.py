import csv
import json
import time

import pika
import requests
from pika.adapters.blocking_connection import BlockingChannel


def get_random_device():
    response = requests.get("http://localhost:8003/rest/monitored-devices/random-id")

    if response.status_code == 200:
        data = response.json()
        return data["payload"]
    return None


def stop_simulator(id: str):
    response = requests.post("http://localhost:8003/rest/monitored-devices/stop-simulator", params={'deviceId': id})

    if response.status_code == 200:
        print("Simulator stopped")
    else:
        print(f"Simulator stopped with errors: {response.json()}")


def create_rabbit_connection():
    connection = pika.BlockingConnection(pika.ConnectionParameters("localhost"))
    channel = connection.channel()
    channel.queue_declare(queue=queue, durable=True)
    channel.queue_bind(queue=queue, exchange=exchange, routing_key=routing_key)
    return connection, channel


def publish_message(channel: BlockingChannel, exchange: str, routing_key: str, body):
    channel.basic_publish(exchange, routing_key, json.dumps(body), properties=pika.BasicProperties(delivery_mode=2))


def read_and_process_data(file_name, interval: int, device_id: str):
    connection, channel = create_rabbit_connection()
    try:
        start_time = time.monotonic()
        with open(file_name, "r") as file:
            line = csv.reader(file, delimiter=',')
            for row in line:
                data_to_send = {
                    "timestamp": time.time_ns(),
                    "device_id": device_id,
                    "measurement_value": row[0]
                }
                publish_message(channel, exchange, routing_key, data_to_send)

                print(f"Sent to RabbitMQ: \n{json.dumps(data_to_send)}")
                time.sleep(interval - ((time.monotonic() - start_time) % interval))
            print("Done reading values.")
            stop_simulator(device_id)
    except KeyboardInterrupt:
        stop_simulator(device_id)
        channel.close()
        connection.close()
        print("Stopping simulator")


if __name__ == "__main__":
    exchange = "internal.exchange"
    queue = "internal.monitoring.events"
    routing_key = "internal.monitoring.routing"

    MINUTE = 60
    reading_interval = 10

    device_id = get_random_device()
    if device_id is not None:
        print(f"Simulator started for device: {device_id}")
        read_and_process_data("sensor.csv", reading_interval, device_id)
    else:
        print("Device not found, simulator wont start.")
