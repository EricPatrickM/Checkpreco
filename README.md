# Checkpreco

## (Somente para Windows) Instale o WSL
- https://www.youtube.com/watch?v=YXBezPlstgA&ab_channel=FabricioVeronez
- https://code.visualstudio.com/docs/remote/wsl-tutorial

## Instale o Docker engine dentro do WSL usando apt
- https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository

### Add Docker's official GPG key:
- sudo apt-get update
- sudo apt-get install ca-certificates curl gnupg
- sudo install -m 0755 -d /etc/apt/keyrings
- curl -fsSL https://download.docker.com/linux/ubuntu/gpg | - sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
- sudo chmod a+r /etc/apt/keyrings/docker.gpg

### Add the repository to Apt sources:
- echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
- sudo apt-get update
- sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
- sudo docker run hello-world

# Crie uma pasta e clone o projeto
-cd ~
-git clone https://github.com/EricPatrickM/Checkpreco
-cd Checkpreco
-docker compose up -d

# As portas que estão rodando está no docker-compose.yaml
