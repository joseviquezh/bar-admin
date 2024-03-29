# Use an official Python runtime as a parent image
FROM python:3.8

RUN apt-get update -y && apt-get upgrade -y && apt-get install -y default-libmysqlclient-dev default-mysql-client

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt /app/
RUN pip install -r requirements.txt

# Copy the project code into the container
COPY . /app/

# Make sure the entrypoint file has execution permisions
RUN chmod +x /app/docker-entrypoint.sh

ENTRYPOINT ["/app/docker-entrypoint.sh"]