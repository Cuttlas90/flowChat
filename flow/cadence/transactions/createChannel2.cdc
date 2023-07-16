//testnet
// import FungibleToken from 0xe9a0766d93b6608b7
// import FlowToken from 0x7e60df042a9c0868
// import MessangerTest3 from 0xe9c2549205cdc2f8
//emulator
import FungibleToken from 0xee82856bf20e2aa6
import FlowToken from 0x0ae53cb6e3f42a79
import MessangerTest4 from 0xf8d6e0586b0a20c7


// flow transactions send ./cadence/transactions/createChannel2.cdc false  --network=testnet --signer=my-testnet-account


transaction(channelType: Bool) {
    // let paymentVault: @FungibleToken.Vault
    // let getChannel: &Messanger.getChannel

    prepare(account: AuthAccount) {
        // get subscription 
        let subscribeFee: UFix64 = 0.0001
        let id: String = "testforjointoprivatechannel3"
        // log(chan.uuid)
        // let uuid = chan.uuid
        let storePath: String = "/storage/".concat(id)
        let pubPath: String = "/public/".concat(id)
        let privPath: String = "/private/".concat(id)
        // log(storePath)
        let storePath1: StoragePath = /storage/testforjointoprivatechannel3
        let pubPath1: PublicPath = /public/testforjointoprivatechannel3
        let privPath1: PrivatePath = /private/testforjointoprivatechannel3

        let storePath2: Path = /storage/testforjointoprivatechannel3
        let pubPath2: Path = /public/testforjointoprivatechannel3
        let privPath2: Path = /private/testforjointoprivatechannel3
        
        let capPubPath2: CapabilityPath = /public/testforjointoprivatechannel3
        let capPrivPath2: CapabilityPath = /private/testforjointoprivatechannel3
        let chan <- MessangerTest4.createChannel(id: id, owner: account.address, channelType: channelType, subscribeFee: subscribeFee)
        
        account.save(<- chan, to:storePath1)
        if channelType {
            account.link<&MessangerTest4.Channel>(capPubPath2, target: storePath2)
            let capabilityReference = account.getCapability<&MessangerTest4.Channel>(pubPath1)
            MessangerTest4.updateChannesList(uuid: id, ref: capabilityReference)
        } else {
            account.link<&MessangerTest4.Channel>(capPrivPath2, target: storePath2)
            let capabilityReference = account.getCapability<&MessangerTest4.Channel>(privPath1)
            MessangerTest4.updateChannesList(uuid: id, ref: capabilityReference)
        }

    }

    execute {

    }
}