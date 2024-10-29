FROM eclipse-temurin:20-alpine
LABEL authors="AndreiZ0R"
RUN apk add --no-cache curl
EXPOSE 8761
ADD target/eureka-service-discovery.jar eureka-service-discovery.jar
ENTRYPOINT ["java","-jar","/eureka-service-discovery.jar"]
