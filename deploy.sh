#!/bin/sh

docker-compose -f frontend/docker-compose-frontend.yml  down
docker-compose -f backend/docker-compose-backend.yml down

docker-compose -f frontend/docker-compose-frontend.yml up -d
docker-compose -f backend/docker-compose-backend.yml up -d