#!/usr/bin/env bash

echo "Starting to package maven projects"

EMC="Energy Management Core"
ESD="Eureka Service Discovery"
EMG="Energy Management Gateway"
UMS="User Management Service"
DMS="Device Management Service"

BASE_PATH="D:\Facultate\An 4\Sem 1\Sisteme Distribuite (SD)\project\backend"

print_success () {
printf "\n\n\n"
echo "  _____ _   _ _____  _____  _____ _____ _____ "
echo " /  ___| | | /  __ \/  __ \|  ___/  ___/  ___|"
echo " \ \`--. | | | | /  \/| /  \/| |__ \ \`--.\ \`--. "
echo " \`--. \ | | | |    | |    |  __| \`--. \`--. \ "
echo " /\__/ / |_| | \__/\| \__/\| |___/\__/ /\__/ /"
echo " \____/ \___/ \____/ \____/\____/\____/\____/ "
printf "\n\n\n"
}

# ----------- SERVICES & DEPS BUILDING -----------

# Building core
echo "Building ${EMC}..."
# shellcheck disable=SC2164
cd "${BASE_PATH}\energy-management-core"
mvn clean install -DskipTests=true || { echo "FAILED to build ${EMC}" ; exit 1; }
print_success

# Build service discovery
echo "Building ${ESD}..."
# shellcheck disable=SC2164
cd "${BASE_PATH}\eureka-service-discovery"
mvn clean install -DskipTests=true || { echo "FAILED to build ${ESD}" ; exit 2; }
print_success

# Build API Gateway
echo "Building ${EMG}..."
# shellcheck disable=SC2164
cd "${BASE_PATH}\eureka-service-discovery"
mvn clean install -DskipTests=true || { echo "FAILED to build ${EMG}" ; exit 3; }
print_success

# Build UMS
echo "Building ${UMS}..."
# shellcheck disable=SC2164
cd "${BASE_PATH}\user-management-service"
mvn clean install -DskipTests=true || { echo "FAILED to build ${UMS}" ; exit 4; }
print_success

# Build DMS
echo "Building ${DMS}..."
# shellcheck disable=SC2164
cd "${BASE_PATH}\device-management-service"
mvn clean install -DskipTests=true || { echo "FAILED to build ${DMS}" ; exit 5; }
print_success

# ------------------------- DOCKER -------------------------
echo "Running docker compose"
docker-compose up || { echo "Docker compose failed" ; exit 6; }




