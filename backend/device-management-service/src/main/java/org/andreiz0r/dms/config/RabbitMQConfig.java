package org.andreiz0r.dms.config;

import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Value("${rabbit.queue.user-events}")
    private String userEventsQueue;

    @Value("${rabbit.queue.device-events}")
    private String deviceEventsQueue;

    @Value("${rabbit.exchange.name}")
    private String exchange;

    @Value("${rabbit.routing.key.user-events}")
    private String userEventsRoutingKey;

    @Value("${rabbit.routing.key.device-events}")
    private String deviceEventsRoutingKey;

    @Bean
    public Queue userEventsQueue() {
        return new Queue(userEventsQueue, true);
    }

    @Bean
    public Queue deviceEventsQueue() {
        return new Queue(deviceEventsQueue, true);
    }

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(exchange);
    }

    @Bean
    public Binding userEventsBinding() {
        return BindingBuilder.bind(userEventsQueue()).to(exchange()).with(userEventsRoutingKey);
    }

    @Bean
    public Binding deviceEventsBinding() {
        return BindingBuilder.bind(deviceEventsQueue()).to(exchange()).with(deviceEventsRoutingKey);
    }

    @Bean
    public MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public AmqpTemplate amqpTemplate(final ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(messageConverter());
        return rabbitTemplate;
    }
}
