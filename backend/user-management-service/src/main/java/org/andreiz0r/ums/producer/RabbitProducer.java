package org.andreiz0r.ums.producer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class RabbitProducer {

    @Value("${rabbit.exchange.name}")
    private String exchange;

    @Value("${rabbit.routing.key}")
    private String routingKey;

    private final RabbitTemplate rabbitTemplate;

    // Todo: maybe configure exchange & routing a bit better
    public void produce(final Object object) {
        log.info("Message sent to exchange {}: {}", exchange, object);
        rabbitTemplate.convertAndSend(exchange, routingKey, object);
    }
}