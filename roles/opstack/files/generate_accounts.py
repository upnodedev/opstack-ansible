#!/usr/bin/env python3

from hdwallet import BIP44HDWallet
from hdwallet.cryptocurrencies import EthereumMainnet
from hdwallet.derivations import BIP44Derivation
from hdwallet.utils import generate_mnemonic
from typing import Optional
import sys
import json

def get_account_and_key(addressIndex):
    bip44_derivation_admin: BIP44Derivation = BIP44Derivation(
        cryptocurrency=EthereumMainnet, account=0, change=False, address=addressIndex
    )
    bip44_hdwallet.from_path(path=bip44_derivation_admin)
    account = bip44_hdwallet.address()
    key = bip44_hdwallet.private_key()
    bip44_hdwallet.clean_derivation()
    return (account, key)

def get_account_from_key(privateKey):
    strippedPrivateKey = privateKey.removeprefix("0x")
    bip44_hdwallet.from_private_key(strippedPrivateKey)
    account = bip44_hdwallet.address()
    bip44_hdwallet.clean_derivation()
    return account
    

# read args into variables and generate mnemonic if required    
keyMode = "mnemonic"
if len(sys.argv) >= 2:
    keyMode = sys.argv[1]

# Generate mnemonic words or retrive mnemonic from args
mnemonicLanguage="english"
mnemonicText = ""
adminKey = ""
batcherKey = ""
proposerKey = ""
sequencerKey = ""

match keyMode:
    case "mnemonic":
        # Generate mnemonic words or retrive mnemonic from args
        if len(sys.argv) >= 3:
            mnemonicLanguage = sys.argv[2]
        if len(sys.argv) >= 4:
            mnemonicText = sys.argv[3]
        else:
            mnemonicText = generate_mnemonic(language=mnemonicLanguage, strength=128)
    case "privateKey":
        adminKey = mnemonicLanguage = sys.argv[2]
        batcherKey = mnemonicLanguage = sys.argv[3]
        proposerKey = mnemonicLanguage = sys.argv[4]
        sequencerKey = mnemonicLanguage = sys.argv[5]

# Secret passphrase/password for mnemonic
PASSPHRASE: Optional[str] = None  # "meherett"

# Initialize Ethereum mainnet BIP44HDWallet
bip44_hdwallet: BIP44HDWallet = BIP44HDWallet(cryptocurrency=EthereumMainnet)

# Generate accounts or extract account details
match keyMode:
    case "mnemonic":
        # Generate required accounts from mnemonic

        # Get Ethereum BIP44HDWallet from mnemonic
        bip44_hdwallet.from_mnemonic(
            mnemonic=mnemonicText, language=mnemonicLanguage, passphrase=PASSPHRASE
        )
        # Clean default BIP44 derivation indexes/paths

        bip44_hdwallet.clean_derivation()
        admin = get_account_and_key(0)
        adminAccount = admin[0]
        adminKey = admin[1]

        batcher = get_account_and_key(1)
        batcherAccount = batcher[0]
        batcherKey = batcher[1]

        proposer = get_account_and_key(2)
        proposerAccount = proposer[0]
        proposerKey = proposer[1]

        sequencer = get_account_and_key(3)
        sequencerAccount = sequencer[0]
        sequencerKey = sequencer[1]
    case "privateKey":
        # Extract account IDs from private keys
        mnemonic=""
        adminAccount = get_account_from_key(adminKey)
        batcherAccount = get_account_from_key(batcherKey)
        proposerAccount = get_account_from_key(proposerKey)
        sequencerAccount = get_account_from_key(sequencerKey)

output = {
    "mnemonic" : bip44_hdwallet.mnemonic(),
    "adminAccount" : adminAccount,
    "adminKey" : adminKey,
    "batcherAccount" : batcherAccount,
    "batcherKey" : batcherKey,
    "proposerAccount" : proposerAccount,
    "proposerKey" : proposerKey,
    "sequencerAccount" : sequencerAccount,
    "sequencerKey" : sequencerKey
}

print(json.dumps(output))