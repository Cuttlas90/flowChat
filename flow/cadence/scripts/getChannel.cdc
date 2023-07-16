//testnet
// import FungibleToken from 0xe9a0766d93b6608b7
// import FlowToken from 0x7e60df042a9c0868
// import MessangerTest3 from 0xe9c2549205cdc2f8
//emulator
import FungibleToken from 0xee82856bf20e2aa6
import FlowToken from 0x0ae53cb6e3f42a79
import MessangerTest3 from 0xf8d6e0586b0a20c7

// flow scripts execute ./cadence/scripts/getChannel.cdc testforjointoprivatechannel2 --network=testnet

pub fun main(channelId: String): MessangerTest4.ChannelInfo {
  return MessangerTest4.getChannel(channelId: channelId)
}