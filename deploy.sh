#!/bin/sh

cp ./backend/.env .env

docker-compose -f frontend/docker-compose.yml  down
docker-compose -f backend/docker-compose.yml down

docker-compose -f frontend/docker-compose.yml  build
docker-compose -f backend/docker-compose.yml build

docker-compose -f frontend/docker-compose.yml up -d
docker-compose -f backend/docker-compose.yml up -d

