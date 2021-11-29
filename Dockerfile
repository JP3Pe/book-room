FROM node:14.16.1

# 앱 디렉터리 생성
WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

# 앱 소스 추가
COPY . .

# prod 환경으로 빌드
RUN yarn run build

CMD [ "yarn", "run", "start" ]