import FungibleToken from 0xee82856bf20e2aa6
import FlowToken from 0x0ae53cb6e3f42a79
import Messanger from 0xf8d6e0586b0a20c7


// flow transactions send ./cadence/transactions/sendMessagetoChannel.cdc  --network=testnet --signer=my-testnet-account


transaction() {
    // let paymentVault: @FungibleToken.Vault
    // let getChannel: &Messanger.getChannel

    prepare(account: AuthAccount) {
        // get subscription 
        let timestamp: UFix64 = 50000.0
        let message: String = "here you can send a message to public chaanel"

        // log(storePath)
        let storePath1: CapabilityPath = /public/testforjointopublicchannel
        let channel = account.getCapability<&Messanger.Channel>(storePath1).borrow()!

        Messanger.sendMessageToChannel(channel: channel, message: message, timestamp: timestamp)
        


    }

    execute {

    }
}