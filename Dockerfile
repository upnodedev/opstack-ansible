FROM node:20

ENV ANSIBLE_HOST_KEY_CHECKING False

RUN apt update
RUN apt install curl python3 python3-pip sshpass wget gpg -y
RUN apt install git -y

ENV UBUNTU_CODENAME=jammy
RUN wget -O- "https://keyserver.ubuntu.com/pks/lookup?fingerprint=on&op=get&search=0x6125E2A8C77F2818FB7BD15B93C4A3FD7BB9C367" | gpg --dearmour -o /usr/share/keyrings/ansible-archive-keyring.gpg
RUN echo "deb [signed-by=/usr/share/keyrings/ansible-archive-keyring.gpg] http://ppa.launchpad.net/ansible/ansible/ubuntu $UBUNTU_CODENAME main" | tee /etc/apt/sources.list.d/ansible.list
RUN apt update 
RUN apt install ansible -y

WORKDIR /app

COPY . /app

RUN chmod 600 ssh_private_key.pem

RUN npm install

COPY --chown=node:node . .

EXPOSE $OPSTACK_API_PORT

CMD [ "node", "app.js" ]