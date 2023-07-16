import FungibleToken from 0xee82856bf20e2aa6
import FlowToken from 0x0ae53cb6e3f42a79
import MessangerTest4 from 0xf8d6e0586b0a20c7


// flow transactions send ./cadence/transactions/joinToPublicChannel.cdc --signer=mohsen3 --network=testnet


transaction() {
    // let paymentVault: @FungibleToken.Vault
    // let getChannel: &Messanger.getChannel

    prepare(account: AuthAccount) {
        
        // get subscription 
        MessangerTest4.joinToPublicChannel(
            sender: account.address,
            channelId: "testforjointopublicchannel2",
        )
    }

    execute {

    }
}