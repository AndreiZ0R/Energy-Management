FROM eclipse-temurin:20-alpine
LABEL authors="AndreiZ0R"
RUN apk add --no-cache curl
EXPOSE 8004
ADD target/chat-service.jar chat-service.jar
ENTRYPOINT ["java","-jar","/chat-service.jar"]