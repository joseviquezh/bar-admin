# docker run --rm --init --name danubio_backend -v .:/app -p 8000:8000 --env-file .env.prod danubio-backend


aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 497631166558.dkr.ecr.us-east-1.amazonaws.com
docker build -t danubio-backend . 
docker tag danubio-backend 497631166558.dkr.ecr.us-east-1.amazonaws.com/danubio-app:latest 
docker push 497631166558.dkr.ecr.us-east-1.amazonaws.com/danubio-app:latest
aws ecs update-service --cluster DanubioBackend --service web --force-new-deployment --region us-east-1 --no-cli-pager