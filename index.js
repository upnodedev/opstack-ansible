const express = require('express');
const app = express();
ansible = require('node-ansible')

let port = process.env.OPSTACK_API_PORT

app.listen(port, () => {
 console.log("Server running on port 3000");
});

app.use(express.json()); // for parsing application/json

app.post("/opstack", (req, res, next) => {
 const message = req.body.message;

/*
user_email=''
http_username=test
http_password=test
*/
 ansiblePrivateKeyFile=process.env.OPSTACK_PRIVATE_KEY_FILE//"../../Test_servers.pem" 
 
 // todo - group json by relevant service

 res.json({"receivedMessage": message});
 let ansible_vars={
    target: 'node',
    ansible_host: message.host,
    ansible_port: 22,
    setup_user: message.setup_user,
    ansible_user: message.user,
    admin_private_key: message.addresses.admin_private_key,
    batcher_private_key: message.addresses.batcher_private_key,
    proposer_private_key: message.addresses.proposer_private_key,
    sequencer_private_key: message.addresses.sequencer_private_key,
    l1_rpc_kind: message.l1_rpc.kind,
    l1_rpc_url: message.l1_rpc.url,
    domain_name: message.domains.opstack,
    explorer_domain: message.domains.explorer,
    faucet_domain: message.domains.faucet,
    user_email: message.user_email,
    http_password: message.http_password,
    http_username: message.http_username
 }
 let command = ansible.Playbook().playbook('opstack.yml').variables(ansible_vars)
});