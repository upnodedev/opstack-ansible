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

/*
{
    host: {
        address: <host ip>
        port: <ssh port if not 22>
        user: <username on host>
    }
    shared: {
        http_username:
        http_password:
        user_email:
        l2_chain_id:
        chain:name:
    }
    l1_rpc: {
        kind:
        url:
    }
    opstack: {
        admin_private_key:
        batcher_private_key:
        proposer_private_key:
        sequencer_private_key:
        domain:
    }
    explorer: {
        domain:
    }
    faucet: {
        domain:
        private_key:
    }
    bridge: {
        indexer_domain:
        ui_domain:
        l1_portal_address:
    }
}
*/

app.post("/opstack", (req, res, next) => {
 const request = req.body;

 ansiblePrivateKeyFile=process.env.OPSTACK_PRIVATE_KEY_FILE
 
 let ansibleVars={
    target: 'node',
    ansible_host: request.host.address,
    ansible_port: request.host.port || 22,
    ansible_user: request.host.user,
    ansible_ssh_private_key_file: ansiblePrivateKeyFile,
    admin_private_key: request.opstack.admin_private_key,
    batcher_private_key: request.opstack.batcher_private_key,
    proposer_private_key: request.opstack.proposer_private_key,
    sequencer_private_key: request.opstack.sequencer_private_key,
    l1_rpc_kind: request.l1_rpc.kind,
    l1_rpc_url: request.l1_rpc.url,
    l2_chain_id: request.shared.l2_chain_id,
    chain_name: request.shared.chain_name,
    domain_name: request.opstack.domain,
    explorer_domain: request.explorer.domain,
    faucet_domain: request.faucet.domain,
    faucet_private_key: request.faucet.private_key,
    bridge_indexer_domain: request.bridge.indexer_domain,
    bridge_ui_domain: request.bridge.ui_domain,
    l1_portal_address: request.bridge.l1_portal_address,
    user_email: request.shared.user_email,
    http_password: request.shared.http_password,
    http_username: request.shared.http_username
 }

 commandString = 'ansible-playbook -e "'

  let first = true
 for(const [name, value] of Object.entries(ansibleVars)){
    if (first == true) {
        first = false
    }
    else {
        commandString += ' '
    }
    commandString += name + '=' + value
 }
 
 commandString += '" -i '

 commandString += request.host.address
 
 commandString += ', ./opstack.yml'

 exec(commandString, (error, stdout, stderr) => {
    commandOutputs = {
        error: error,
        stdOut: stdout,
        stdErr: stderr
    }
    res.json(commandOutputs)
 })

});