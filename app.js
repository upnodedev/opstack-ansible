const express = require('express');
const app = express();
const {exec} = require('child_process')
require('dotenv').config()

let port = 3000
if(process.env.OPSTACK_API_PORT){
    port = Number(process.env.OPSTACK_API_PORT)
}

app.listen(port, () => {
 console.log("Server running on port " + port);
});

app.use(express.json());

// launches opstack on a server - see README.md for the required jaon body
app.post("/opstack", (req, res, next) => {
 const request = req.body;

 ansiblePrivateKeyFile = "./ssh_private_key.pem"
 
 // map the json to ansible variables
 let ansibleVars={
    ansible_host: request.host.address,
    ansible_port: request.host.port || 22,
    ansible_user: request.host.user,
    ansible_ssh_private_key_file: ansiblePrivateKeyFile,
    admin_private_key: request.opstack.admin_private_key,
    batcher_private_key: request.opstack.batcher_private_key,
    proposer_private_key: request.opstack.proposer_private_key,
    sequencer_private_key: request.opstack.sequencer_private_key,
    seed_phrase: request.opstack.seed_phrase,
    seed_phrase_language: request.opstack.seed_phrase_language,
    l1_rpc_kind: request.l1_rpc.kind,
    l1_rpc_url: request.l1_rpc.url,
    l2_chain_id: request.shared.l2_chain_id,
    chain_name: request.shared.chain_name,
    domain_name: request.opstack.domain,
    include_explorer: request.explorer.include,
    explorer_domain: request.explorer.domain,
    include_faucet: request.faucet.include,
    faucet_domain: request.faucet.domain,
    faucet_private_key: request.faucet.private_key,
    include_bridge: request.bridge.include,
    bridge_indexer_domain: request.bridge.indexer_domain,
    bridge_ui_domain: request.bridge.ui_domain,
    resolver_email: request.traefik.resolver_email,
    http_password: request.traefik.http_password,
    http_username: request.traefik.http_username
 }

 // construct the ansible-playbook command
 commandString = 'ansible-playbook -e "'

  let first = true
 for(const [name, value] of Object.entries(ansibleVars)){
    if (first == true) {
        first = false
    }
    else {
        commandString += ' '
    }
    if( value !== undefined){
        commandString += name + '=' + value
    }
 }
 
 commandString += '" -i '

 commandString += request.host.address
 
 commandString += ', ./opstack.yml'

 // execute the command
 exec(commandString, (error, stdout, stderr) => {
    commandOutputs = {
        error: error,
        stdOut: stdout,
        stdErr: stderr
    }
    res.json(commandOutputs)
 })

});