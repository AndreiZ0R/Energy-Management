FROM eclipse-temurin:20-alpine
LABEL authors="AndreiZ0R"
EXPOSE 8002
ADD target/device-management-service.jar device-management-service.jar
ENTRYPOINT ["java","-jar","/device-management-service.jar"]
