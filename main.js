//npm install --save crypto-js
//node main.js

const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0; //Proof-of-work
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }
    //mining - Proof-of-Work
    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty +1).join("0")){
            this.nonce++; //this is the only parameter we can change in the block
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
    }
}

//genesis
class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4; //increase to take longer to add a block to aour blockchain
    }

    createGenesisBlock(){
        return new Block(0, "01/01/2019", "Genesis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        //newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}

//add blocks
let savjeeCoin = new Blockchain();

console.log('Mining block 1...')
savjeeCoin.addBlock(new Block(1, "10/01/2019", { amount: 4 }));

console.log('Mining block 2...')
savjeeCoin.addBlock(new Block(2, "12/01/2019", { amount: 10 }));

console.log(JSON.stringify(savjeeCoin, null, 4));

//check if blockchain is valid
console.log('Is blockchain valid? ' + savjeeCoin.isChainValid())
//try to hack
savjeeCoin.chain[1].data = { amount: 100 };
//try to recalculate the hash
savjeeCoin.chain[1].hash = savjeeCoin.chain[1].calculateHash();
//check if blockchain is valid
console.log('Is blockchain valid? ' + savjeeCoin.isChainValid())




