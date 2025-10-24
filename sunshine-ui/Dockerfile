FROM nginx:latest

EXPOSE 80

COPY provisioning/nginx/sunshine-react.conf /etc/nginx/conf.d/

COPY build/ /usr/share/nginx/html/


# # step 1

# FROM node:10-alpine as build-step

# RUN mkdir /app

# WORKDIR /app

# COPY package.json /app

# RUN npm install

# COPY . /app

# RUN npm run build

# # step 2

# FROM nginx:1.17.1-alpine

# COPY --from=build-step /app/build /usr/share/nginx/html




