FROM eclipse-temurin:20-alpine
LABEL authors="AndreiZ0R"
EXPOSE 8001
ADD target/user-management-service.jar user-management-service.jar
ENTRYPOINT ["java","-jar","/user-management-service.jar"]
