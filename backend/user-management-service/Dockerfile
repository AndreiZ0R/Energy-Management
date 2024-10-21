FROM maven:3.9.9-eclipse-temurin-17
WORKDIR /app
COPY . /app/
RUN mvn clean install package -DskipTests
EXPOSE 8001
CMD ["mvn", "spring-boot:run"]