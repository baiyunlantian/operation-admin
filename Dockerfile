FROM node:18.16.1
COPY ./ /app
WORKDIR /app

ENV LANG C.UTF-8
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN npm config set registry https://registry.npm.taobao.org
RUN npm install && npm run build

FROM nginx
RUN mkdir /app
COPY --from=0 /app/dist /app
COPY default.conf /etc/nginx/conf.d/default.conf