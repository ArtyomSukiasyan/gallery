build:
	docker compose build --no-cache gallery-next

start:
	docker compose up -d

stop:
	docker compose down