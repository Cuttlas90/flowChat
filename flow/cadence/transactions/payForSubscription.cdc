//testnet
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868
import MessangerTest4 from 0xe9c2549205cdc2f8
//emulator
// import FungibleToken from 0xee82856bf20e2aa6
// import FlowToken from 0x0ae53cb6e3f42a79
// import MessangerTest4 from 0xf8d6e0586b0a20c7

// flow transactions send ./cadence/transactions/payForSubscription.cdc 4.0 paidD --signer=mohsen3 --network=testnet

transaction(amount: UFix64, channelId: String) {

    // The Vault resource that holds the tokens that are being transfered
    let sentVault: @FungibleToken.Vault

    prepare(signer: AuthAccount) {
        // Get a reference to the signer's stored vault
        let vaultRef = signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Could not borrow reference to the owner's Vault!")

        // Withdraw tokens from the signer's stored vault
        self.sentVault <- vaultRef.withdraw(amount: amount)
    }

    execute {
        MessangerTest4.joinToPrivateChannel(sender: 0x045a1763c93006ca,
        channelId: channelId,
        amount: amount,
        payment: <- self.sentVault)
        // Get the recipient's public account object
        // Get a reference to the recipient's Receiver

        // Deposit the withdrawn tokens in the recipient's receiver
        // receiverRef.deposit(from: <-self.sentVault)
    }
}