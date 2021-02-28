const EC = require('elliptic').ec
const ec = new EC('secp256k1')


const key = ec.genKeyPair()
const publicKey = key.getPublic('hex')
const PrivateKey = key.getPrivate('hex')


console.log()
console.log("private key :", PrivateKey)

console.log()
console.log("public key :", publicKey)


