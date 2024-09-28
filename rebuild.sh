#!/bin/bash

# 컨테이너 중지 및 제거
echo "컨테이너를 중지하고 제거합니다..."
docker stop freelancer_platform-react freelancer_platform-fastapi
docker rm freelancer_platform-react freelancer_platform-fastapi

# 캐시 정리
echo "모든 캐시를 정리합니다..."
docker system prune -af

# 이미지 제거
echo "이미지를 제거합니다..."
docker rmi freelancer_platform-react freelancer_platform-fastapi

echo "모든 작업이 완료되었습니다."

docker-compose up --build