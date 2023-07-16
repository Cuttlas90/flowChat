//testnet
// import FungibleToken from 0xe9a0766d93b6608b7
// import FlowToken from 0x7e60df042a9c0868
// import MessangerTest3 from 0xe9c2549205cdc2f8
//emulator
import FungibleToken from 0xee82856bf20e2aa6
import FlowToken from 0x0ae53cb6e3f42a79
import MessangerTest3 from 0xf8d6e0586b0a20c7

// flow scripts execute ./cadence/scripts/getChat.cdc 0xf8d6e0586b0a20c7 0x045a1763c93006ca --network=testnet

pub fun main(account: Address, side2: Address): MessangerTest3.Chat {

  let signature : [UInt8] = [1, 2, 3]
  let signedData : [UInt8] = [1, 2, 3]
  let hashAlgorithm: HashAlgorithm = HashAlgorithm.SHA3_256



  let chatID: String = account.toString().concat(side2.toString())
  return MessangerTest3.getChatpublic(
        chatID: chatID, 
        account: account, 
        side2: side2,
        signature: signature, 
        signedData: signedData, 
        hashAlgorithm: hashAlgorithm)
}