import FungibleToken from 0xee82856bf20e2aa6
import FlowToken from 0x0ae53cb6e3f42a79
import Messanger from 0xf8d6e0586b0a20c7

// flow transactions send ./cadence/transactions/getChatPublic.cdc true  --network=testnet --signer=my-testnet-account


transaction() {
    // let paymentVault: @FungibleToken.Vault
    // let getChannel: &Messanger.getChannel
    let chats: Messanger.Chat
    prepare(account: AuthAccount) {
        // get subscription 
        self.chats = Messanger.getChatpublic(chatID: "0xf8d6e0586b0a20c70x045a1763c93006ca", account: account, side2: 0x045a1763c93006ca)
    }

    execute {
        
        }
}