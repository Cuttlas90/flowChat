import FungibleToken from 0xee82856bf20e2aa6
import FlowToken from 0x0ae53cb6e3f42a79
import Messanger from 0xf8d6e0586b0a20c7

// flow scripts execute ./cadence/scripts/getAllrelations.cdc --network=testnet

pub fun main(): [String] {
  return Messanger.getAllrelations()
}