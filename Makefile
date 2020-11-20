PROJECT_ID=${GCP_ID}
ZONE=${GCE_INSTANCE_ZONE}
LOCAL_TAG=${GCE_INSTANCE}-image:$(GITHUB_SHA)
MIGRATE_TAG=${GCE_INSTANCE}-migrate-image:$(GITHUB_SHA)
REMOTE_TAG=gcr.io/$(PROJECT_ID)/$(LOCAL_TAG)
REMOTE_MIGRATE_TAG=gcr.io/$(PROJECT_ID)/$(MIGRATE_TAG)
CONTAINER_NAME=songapp-container
MIGRATE_NAME=migrate-image
# DB_NAME=storybooks
SSH_STRING=${USER}${GCE_INSTANCE}
ssh:
	gcloud compute ssh $(SSH_STRING) \
		--project=$(PROJECT_ID) \
		--zone=$(ZONE)

ssh-cmd:
	@gcloud --quiet compute ssh $(SSH_STRING) --command "$(CMD)"

build:
	docker build -t $(LOCAL_TAG) .

build-migrate:
	docker build -t ${MIGRATE_TAG} ./server

push-migrate:
	docker tag ${MIGRATE_TAG} ${REMOTE_MIGRATE_TAG}
	docker push ${REMOTE_MIGRATE_TAG}

push:
	docker tag $(LOCAL_TAG) $(REMOTE_TAG)
	docker push $(REMOTE_TAG)

deploy: 
	$(MAKE) ssh-cmd CMD='sudo docker-credential-gcr configure-docker'
	@echo "pulling new container image..."
	$(MAKE) ssh-cmd CMD='docker pull $(REMOTE_TAG)'
	@echo "removing old container..."
	-$(MAKE) ssh-cmd CMD='docker container stop $(CONTAINER_NAME)'
	-$(MAKE) ssh-cmd CMD='docker container rm $(CONTAINER_NAME)'
	@echo "starting new container..."
	@$(MAKE) ssh-cmd CMD='\
		docker run -d --name=$(CONTAINER_NAME) \
			--restart=unless-stopped \
			-p 5000:5000 \

sql-init:
	$(MAKE) ssh-cmd CMD='docker run --name mysql -e MYSQL_ROOT_PASSWORD=${PWD} -d mysql:latest'

define SECURE_MYSQL
$(expect -c "
set timeout 10
spawn mysql_secure_installation
expect \"Enter current password for root:\"
send \"${PWD}\r\"
expect \"Would you like to setup VALIDATE PASSWORD plugin?\"
send \"n\r\" 
expect \"Change the password for root ?\"
send \"n\r\"
expect \"Remove anonymous users?\"
send \"y\r\"
expect \"Disallow root login remotely?\"
send \"y\r\"
expect \"Remove test database and access to it?\"
send \"y\r\"
expect \"Reload privilege tables now?\"
send \"y\r\"
expect eof
)"
endef

mysql_secure:
	@$(MAKE) echo "$$SECURE_MYSQL"

restart-sql:
	$(MAKE) ssh-cmd CMD='docker restart mysql'

migrate2:
	$(MAKE) docker run -d --name=$(MIGRATE_NAME)
migrate:
	$(MAKE) ssh-cmd CMD='docker pull $(REMOTE_MIGRATE_TAG)'
	@$(MAKE) ssh-cmd CMD='\
		docker run -d --name=$(MIGRATE_NAME)