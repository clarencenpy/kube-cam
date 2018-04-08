FROM node:8.5.0 as webpack

COPY package.json /package.json
COPY package-lock.json /package-lock.json
COPY webpack.common.js /webpack.common.js
COPY webpack.prod.js /webpack.prod.js
COPY .babelrc /.babelrc
COPY src/ /src

RUN npm install
RUN npm run build


FROM nginx:1.13

COPY --from=webpack /dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
