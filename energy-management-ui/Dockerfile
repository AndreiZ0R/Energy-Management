FROM node:20-alpine
WORKDIR /app
COPY package*.json .
RUN yarn install
COPY . .
EXPOSE 5173
CMD ["yarn", "dev", "--host", "0.0.0.0"]

#FROM node:20-alpine as build
#WORKDIR /app
#COPY package*.json .
#RUN yarn install
#COPY . .
#RUN yarn build
#
## Stage 2: Production Stage
#FROM nginx:stable-alpine
#
## Copy built assets from the build stage
#COPY --from=build app/build /usr/share/nginx/html
#
## Copy custom Nginx configuration
#COPY default.conf /etc/nginx/conf.d/default.conf
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]