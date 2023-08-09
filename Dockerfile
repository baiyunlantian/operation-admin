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

CMD find /app/static/js -type f -name "app.*.js" -exec sed -i "s/VUE_APP_BASE_API_ENV/https:\/\/$BASE_API/g" {} + && nginx -g 'daemon off;'