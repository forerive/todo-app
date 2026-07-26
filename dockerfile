# Node.js 22を土台にする。
FROM node:22
# 以下の作業は全部/app配下で行うという指示。
WORKDIR /app
COPY package.json yarn.lock ./
# Dockerコンテナの中でyarn installを実行する。Dockerコンテナの中にnode_modulesが作られる。
RUN yarn install
# ソースコード全部をDockerコンテナの中にコピーする。
COPY . .
RUN yarn build
# コンテナが起動したら、yarn start:devが実行される。
CMD ["yarn", "start:prod"]