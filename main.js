SHA256 = require('crypto-js/sha256')


class Block {
    constructor(index, timestamp, data,  previousHash ='') {
        this.index = index
        this.timestamp = timestamp
        this.data = data
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
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()]
        this.difficulty = 10
    }

    createGenesisBlock (){
        return new Block(0, "01/03/2022", 'Genesis Block', '0')
    }

    getLatestBlock() {
        this.chain[this.chain.lenght - 1]
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty)
        this.chain.push(newBlock);
    }

    isChainValid() {
        for(let i =1; i < this.chain.length; i++) {
            const currentBlock= this.chain(i)
            const previousBlock = this.chain(i-1)

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

let odicoin = new Blockchain()
odicoin.addBlock(new Block(1, "20/2/2022", {amount: 8}))
odicoin.addBlock(new Block(1, "20/2/2023", {amount: 12}))
odicoin.addBlock(new Block(1, "20/2/2024", {amount: 80}))