import FungibleToken from 0xee82856bf20e2aa6
import FlowToken from 0x0ae53cb6e3f42a79
import MessangerTest4 from 0xf8d6e0586b0a20c7

// flow transactions send ./cadence/transactions/createChannel.cdc true  --network=testnet --signer=my-testnet-account


transaction(channelType: Bool) {
    // let paymentVault: @FungibleToken.Vault
    // let getChannel: &Messanger.getChannel

    prepare(account: AuthAccount) {
        // get subscription 
        let subscribeFee: UFix64 = 0.00001
        let id: String = "testforjointopublicchannel2"
        // log(chan.uuid)
        // let uuid = chan.uuid
        let storePath: String = "/storage/".concat(id)
        let pubPath: String = "/public/".concat(id)
        let privPath: String = "/private/".concat(id)
        // log(storePath)
        let storePath1: StoragePath = /storage/testforjointopublicchannel2
        let pubPath1: PublicPath = /public/testforjointopublicchannel2
        let privPath1: PrivatePath = /private/testforjointopublicchannel2

        let storePath2: Path = /storage/testforjointopublicchannel2
        let pubPath2: Path = /public/testforjointopublicchannel2
        let privPath2: Path = /private/testforjointopublicchannel2
        
        let capPubPath2: CapabilityPath = /public/testforjointopublicchannel2
        let capPrivPath2: CapabilityPath = /private/testforjointopublicchannel2
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