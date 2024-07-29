const express = require('express');
const app = express();
ansible = require('node-ansible')

let port = process.env.OPSTACK_API_PORT || 3000

app.listen(port, () => {
 console.log("Server running on port " + port);
});

app.use(express.json()); // for parsing application/json

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
    }
    bridge: {
        indexer_domain:
        ui_domain:
    }
}
*/

app.post("/opstack", (req, res, next) => {
 const message = req.body.message;

 ansiblePrivateKeyFile=process.env.OPSTACK_PRIVATE_KEY_FILE//"../../Test_servers.pem" 
 
 res.json({"receivedMessage": message});
 let ansible_vars={
    target: 'node',
    ansible_host: message.host.address,
    ansible_port: message.host.port || 22,
    ansible_user: message.host.user,
    admin_private_key: message.opstack.admin_private_key,
    batcher_private_key: message.opstack.batcher_private_key,
    proposer_private_key: message.opstack.proposer_private_key,
    sequencer_private_key: message.opstack.sequencer_private_key,
    l1_rpc_kind: message.l1_rpc.kind,
    l1_rpc_url: message.l1_rpc.url,
    domain_name: message.opstack.domain,
    explorer_domain: message.explorer.domain,
    faucet_domain: message.faucet.domain,
    bridge_indexer_domain: message.bridge.indexer_domain,
    bridge_ui_domain: message.bridge.ui_domain,
    user_email: message.shared.user_email,
    http_password: message.shared.http_password,
    http_username: message.shared.http_username
 }
 let command = ansible.Playbook().playbook('opstack.yml').variables(ansible_vars)
});