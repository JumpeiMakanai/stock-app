# ------------------------------------------------------------
# 開発用ターゲット: ホットリロード (air) ＋ go run 相当
# 使い方:
#   docker build -t gin-dev --target dev .
#   docker run --rm -it -p 8080:8080 -v $(pwd):/app gin-dev
# ------------------------------------------------------------
FROM golang:latest AS dev
WORKDIR /app

# 依存解決をキャッシュするため先にgo.mod/go.sumだけコピー
COPY go.mod go.sum ./
RUN go mod download

# # ホットリロードツール
RUN go install github.com/air-verse/air@latest

# ソース
COPY . .

# 8080で待ち受ける想定（mainで:8080などをListen）
EXPOSE 8080

# Airで監視起動（.air.tomlが無ければデフォルトでmain.goをビルド＆実行）
CMD ["air"]


# ------------------------------------------------------------
# ビルド用ターゲット: 静的バイナリを作成
# ------------------------------------------------------------
FROM golang:latest AS builder
WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# CGO無効の静的リンクでLinuxバイナリを作成
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /server ./...

# ------------------------------------------------------------
# 本番用ターゲット: 超軽量イメージ（distroless）
# 使い方:
#   docker build -t gin-prod --target prod .
#   docker run --rm -p 8080:8080 gin-prod
# ------------------------------------------------------------
FROM gcr.io/distroless/static AS prod
WORKDIR /
COPY --from=builder /server /server
EXPOSE 8080
USER 65532:65532
ENTRYPOINT ["/server"]
