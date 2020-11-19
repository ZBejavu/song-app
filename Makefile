PROJECT_ID=${GCP_ID}
ZONE=${GCE_INSTANCE_ZONE}
LOCAL_TAG=${GCE_INSTANCE}-image:$(GITHUB_SHA)
MIGRATE_TAG=${GCE_INSTANCE}-migrate-image:$(GITHUB_SHA)
REMOTE_TAG=gcr.io/$(PROJECT_ID)/$(LOCAL_TAG)
REMOTE_MIGRATE_TAG=gcr.io/$(PROJECT_ID)/$(MIGRATE_TAG)
CONTAINER_NAME=songapp-container
# DB_NAME=storybooks
SSH_STRING=${USER}${GCE_INSTANCE}
ssh:
	gcloud compute ssh $(SSH_STRING) \
		--project=$(PROJECT_ID) \
		--zone=$(ZONE)

ssh-cmd:
	@gcloud --quiet compute ssh --zone $(ZONE) ${GCE_INSTANCE} --command "$(CMD)"

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