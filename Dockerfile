# Rewardo 開発用 Dockerfile
# Node 20 Alpine ベース。本番ではなく開発サーバー（next dev）を起動する想定。

FROM node:20-alpine

# 作業ディレクトリ
WORKDIR /app

# 依存関係ファイルを先にコピーしてキャッシュを活用する
COPY package.json package-lock.json* ./

# 依存関係インストール（node_modules はここで生成される）
RUN npm ci

# ソースコードをコピー（.dockerignore で node_modules 等は除外済み）
COPY . .

# Next.js dev サーバーのデフォルトポート
EXPOSE 3000

# ホットリロード対応のため next dev を使う
CMD ["npm", "run", "dev"]
