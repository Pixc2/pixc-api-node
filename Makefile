up:
	@docker-compose up -d --build

rebuild:
	@docker-compose build --no-cache

down:
	@docker-compose down

ssh:
	@docker-compose exec pixc-api-node sh

test:
	@docker-compose up -d --build
	@docker-compose exec pixc-api-node npm run lint
	@docker-compose exec pixc-api-node npm run jscpd
	@docker-compose exec pixc-api-node npm test
