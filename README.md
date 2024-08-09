#OPStack Ansible Installer

##Requirements

To operate the rest API, a private key file with the name ssh_private_key.pem is required in the root directory. Target servers should be accessible by ssh using that key.

###To run using docker

    - docker version 26
    - docker compose version 2.26

###To run without docker

    - ansile version core 2.17.1
    - node version 20

##Installation

###Docker

```
    docker compose up --build -d
```

###Without Docker

```
    node install
    node app.js

    cp <path to pem file> ./ssh_private_key.pem
    chmod 600 ssh_private_key.pem 

    export ANSIBLE_HOST_KEY_CHECKING=false

    node app.js
```

#REST API

##Launch opstack

###Request

POST /opstack

The request body should be json with the following form.

```
    {
        "host": {
            "address": [ip address of the target machine],
            "port": [optional -ssh port if not 22],
            "user": [username on target machine],
        },
        "l2": {
            "chain_id": [chain id of the l2 chain],
            "chain_name": [name of the l2 chain],
            "native_currency": {
                "name": [optional - defaults to "Ethereum"],
                "symbol: [optional - defaults to "ETH"],
                "decimals": [optional - defaults to 18]
            } 
        }.
        "l1" {
            "rpc" {
                "kind": [The kind of RPC provider, used to inform optimal transactions receipts fetching. Valid options: alchemy, quicknode, infura, parity, nethermind, debug_geth, erigon, basic, any],
                "url": [url of te l1 rpc]
            },
            "native_currency": {
                "name": [optional - defaults to "Ethereum"],
                "symbol: [optional - defaults to "ETH"],
                "decimals": [optional - defaults to 18]
            },
            "block_explorer": {
                "url": [optional - defaults to "https://holesky.etherscan.io"],
                "name": [optional - defaults to "Etherscan"],
                "api": [optional - defaults to "https://api-holesky.etherscan.io/api]"
            }
        },
        "opstack": {
            "admin_private_key": [the private key of the admin account],
            "batcher_private_key": [the private key of the batcher account],
            "proposer_private_key": [the private key of the proposer account],
            "sequencer_private_key": [the private key of the psp sequencer account],
            "domain": [the domain of the l2 node]
        },
        "explorer": {
            "include": [true/false - if true the blockscout explorer will be launched],
            "domain": [domain of the explorer]
        },
        "faucet": {
            "include": [true/false - if true the faucet will be launched],
            "domain": [the domain of the faucet webpage],
            "private_key": [private key of the account that funds the faucet]
        },
        "bridge": {
            "include": [true/false - if true the bridge will be launched],
            "indexer_domain": [domain of the bridge indexer],
            "ui_domain": [domain of the bridge ui]
        },
        "traefik" {
            "http_username": [username for access to the traefik api],
            "http_password": [password for access to the traefik api],
            "resolver_email": [email used by the certificate resolver]
        }
    }
```

The opstack section can alternatiely be of the form

```
    ...
        "opstack": {
            "seed_phrase: [the mnemonic seed phrase],
            "seed_phrase_language": [optional - defaults to english],
            "domain": [the domain of the l2 node]
    },  
    ...
```

in which case the admin, batcher, proposer and sequencer accounts are genetrated from the seed phrase with as the first, second, third and fourth accounts respectively.

## Running the ansible playbook without the API

If running the ansible playbook without using the api, use the following.

```
    ansible-playbook -e [variables] -i [host ip address] opstack.yml
```

with the required variables listed below set either as arguments or using a .ini file.

The json values above correspond to ansible variables with the following names.

   - host.address - ansible_host
   - host.port - ansible_port
   - host.user - ansible_user
   - opstack.admin_private_key - admin_private_key
   - opstack.batcher_private_key - batcher_private_key
   - opstack.proposer_private_key - proposer_private_key
   - opstack.sequencer_private_key - sequencer_private_key
   - opstack.seed_phrase - seed_phrase
   - opstack.domain - domain_name
   - l1_rpc.kind - l1_rpc_kind
   - l1_rpc.url - l1_rpc_url
   - shared.l2_chain_id - l2_chain_id
   - shared.chain_name - chain_name
   - explorer.include - include_explorer
   - explorer.domain - explorer_domain
   - faucet.include - include_faucet
   - faucet.domain - faucet_domain
   - faucet.private_key - faucet_private_key
   - bridge.include - include_bridge
   - bridge.indexer_domain - bridge_indexer_domain
   - bridge.ui_domain - bridge_ui_domain
   - traefik.resolver_email - resolver_email
   - traefik.http_password - http_password
   - traefik.http_username - http_username

In addition, ansible_ssh_private_key_file should be set to ssh_private_key.json, or to the path of your keyfile if different.
