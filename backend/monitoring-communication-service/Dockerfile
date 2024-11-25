FROM eclipse-temurin:20-alpine
LABEL authors="AndreiZ0R"
EXPOSE 8003
ADD target/monitoring-communication-service.jar monitoring-communication-service.jar
ENTRYPOINT ["java","-jar","/monitoring-communication-service.jar"]
