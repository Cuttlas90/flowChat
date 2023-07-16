//testnet
// import FungibleToken from 0xe9a0766d93b6608b7
// import FlowToken from 0x7e60df042a9c0868
// import MessangerTest3 from 0xe9c2549205cdc2f8
//emulator
import FungibleToken from 0xee82856bf20e2aa6
import FlowToken from 0x0ae53cb6e3f42a79
import MessangerTest3 from 0xf8d6e0586b0a20c7

//0xe9c2549205cdc2f8

// 0x04448ca29cf753bc

// flow transactions send ./cadence/transactions/sendMessage.cdc "Hello Mohsen" 0x045a1763c93006ca --payer=mohsen3 --network=testnet --signer=my-testnet-account


transaction(message: String, reciever: Address ) {

    prepare(account: AuthAccount) {
        // get subscription fee
        let transactionId: String = unsafeRandom().toString()
        let timeStamp: UFix64 = getCurrentBlock().timestamp
        let signature : [UInt8] = [1, 2, 3]
        let signedData : [UInt8] = [1, 2, 3]
        let hashAlgorithm: HashAlgorithm = HashAlgorithm.SHA3_256
        MessangerTest3.sendMessage(
            transactionId: transactionId, 
            sender: account.address, 
            receiver: reciever, 
            message: message, 
            timestamp: timeStamp,
            signature: signature, 
            signedData: signedData, 
            hashAlgorithm: hashAlgorithm
        )
    }

    execute {

    }
}