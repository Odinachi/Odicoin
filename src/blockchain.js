const { SHA256 } = require('crypto-js')
//const SHA256 = require('crypto-js/sha256')
const EC = require('elliptic').ec
const ec = new EC('secp256k1')


class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.amount = amount
    }

    calculateHash(){
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString()
    }

    signTransaction(signingKey) {
        if (signingKey.getPublic('hex') !== this.fromAddress) {
            throw new Error('you cannot sign transactions for other wallets')
        }

        const hashTx = this.calculateHash()
        const sig = signingKey.sign(hashTx, 'base64')
        this.signature = sig.toDER('hex')
    }

    isValid() {
        if (this.fromAddress ===null) return True;

        if (!this.signature || this.signature.length === 0) {
            throw new Error('No signature in this transaction')
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex')
        return publicKey.verify(this.calculateHash(), this.signature)
    }
}


class Block {
    constructor(index, timestamp, transaction,  previousHash ='') {
        this.timestamp = timestamp
        this.transaction = transaction
        this.previousHash = previousHash
        this.hash = this.calculateHash()
        this.nonce = 0
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString()
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++
            this.hash=this.calculateHash()
        }
    }

    hasValidTransaction(){
        for (const tx of this.transaction){
            if(!tx.isValid()){
                return false
            }
        }
        return true
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()]
        this.difficulty = 10
        this.pendingTransactions = []
        this.miningReward = 100
    }

    createGenesisBlock (){
        return new Block("01/03/2022", 'Genesis Block', '0')
    }

    getLatestBlock() {
        this.chain[this.chain.length - 1]
    }

    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.PendingTransactions)
        block.mineBlock(this.difficulty)

        console.log("block succesfully mined")
        this.chain.push(block)

        this.PendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ]
    }

    addTransaction(transaction) {
        if(!transaction.fromAddress || !transaction.toAddress) {
            throw new Error('Transaction must include from and to address')
        }

        if (!transaction.isValid()){
            throw new Error("cannot add invalid transaction to chain")
        }
        this.PendingTransactions.push(transaction)
    }

    getBalanceOfAddress(address) {
        let balance = 0

        for(const block of this.chain) {
            for(trans of block.transaction) {
                if(trans.fromAddress === address) {
                    balance -= trans.amount
                }

                if(trans.toAddress === address) {
                    balance += trans.amount
                }
            }
        }

        return balance
    }

    isChainValid() {
        for(let i =1; i < this.chain.length; i++) {
            const currentBlock= this.chain(i)
            const previousBlock = this.chain(i-1)

            if(!currentBlock.hasValidTransaction()) {
                return false
            }
            if(currentBlock !== currentBlock.calculateHash()) {
                return false
            }
            
            if(previousBlock.previousHash !== previousBlock.hash){
                return false
            }

        }

        return true
    }
}

module.exports.Blockchain = Blockchain;
module.exports.Block = Block;
module.exports.Transaction = Transaction;