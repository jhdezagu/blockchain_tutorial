//npm install --save crypto-js
//node main.js

//insert new coins in the system to start our cryptocurrency

const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(fromAddress, toAddress, amount){ //a transaction comes from someone, goes to someone and contains an amount of money
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}
class Block{
    constructor(timestamp, transactions, previousHash = ''){
        //this.index = index; //not needed in blockchain
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0; //Proof-of-work
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }
    //mining - Proof-of-Work - Makes sure there is only a block create after a certain amount of minutes
    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
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
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock(){
        return new Block("01/01/2019", "Genesis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress){ //pass along wallet address - if I succesfully mine send me the reward
        let block = new Block(Date.now(), this.pendingTransactions); //too many pending transactions in reality
        block.mineBlock(this.difficulty);

        console.log('Blok successfully mined!');
        this.chain.push(block);

        this.pendingTransactions = [ new Transaction(null, miningRewardAddress, this.miningReward)];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for (const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }
        return balance;
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
let bitCoin = new Blockchain();
bitCoin.createTransaction(new Transaction('address 1', 'address 2', 100));
bitCoin.createTransaction(new Transaction('address 2', 'address 1', 50));

console.log('\nStarting the miner...');
bitCoin.minePendingTransactions('jesus-address');

console.log('\nBalance of Jesus is', bitCoin.getBalanceOfAddress('jesus-address'));


console.log('\nStarting the miner again...');
bitCoin.minePendingTransactions('jesus-address');

console.log('\nBalance of Jesus is', bitCoin.getBalanceOfAddress('jesus-address'));


