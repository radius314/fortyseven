.PHONY: run run-as-slack build

build:
	docker-compose build

run: # https://github.com/docker/compose/issues/1259
	docker-compose run -e ADAPTER=shell -e HUBOT_NAME=fortyseven --service-ports fortyseven

run-as-slack:
	# run as test bot "koala", turn debugger on by default
	docker-compose run -e INSPECT=true -e ADAPTER=slack -e HUBOT_NAME=sevenforty --service-ports fortyseven
