FROM eclipse-temurin:20-alpine
LABEL authors="AndreiZ0R"
RUN apk add --no-cache curl
EXPOSE 8000
ADD target/energy-management-gateway.jar energy-management-gateway.jar
ENTRYPOINT ["java","-jar","/energy-management-gateway.jar"]