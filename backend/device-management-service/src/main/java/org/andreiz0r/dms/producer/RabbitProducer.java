package org.andreiz0r.dms.producer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.andreiz0r.core.event.AbstractEvent;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class RabbitProducer {

    @Value("${rabbit.exchange.name}")
    private String exchange;

    @Value("${rabbit.routing.key.device-events}")
    private String routingKey;

    private final RabbitTemplate rabbitTemplate;

    // Todo: maybe configure exchange & routing a bit better
    public <T extends AbstractEvent<?>> void produce(final T event) {
        log.info("Event sent to exchange {}: {}", exchange, event);
        rabbitTemplate.convertAndSend(exchange, routingKey, event);
    }
}