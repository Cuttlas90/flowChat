import FungibleToken from 0x9a0766d93b6608b7


/*

Messenger enables users to communicate with each other through two distinct methods:
Chats and Channels.

Chats facilitate the exchange of various types of messages, including text, voice, 
and pictures, among individuals. This feature is exclusively accessible to 
parties involved in the conversation.

Channels, on the other hand, can be either public or private. 
Both types of channels are stored as resources with specific storage paths. 
Public channels allow anyone to join by utilizing its unique identification code. 
On the contrary, private channels require a subscription fee, 
determined by the channel administrator, to be paid by individuals seeking access.

*/


// Define the Messanger smart contract
//



pub contract MessangerTest4 {

    ////////////////// Structs and Resouces ////////////////////


    // Define the Message struct to store chat message details
    pub struct Message {
        pub var messageId: String
        pub var sender: Address
        pub var receiver: Address
        pub var message: String
        pub var timestamp: UFix64
        
        // initialize a message to store chat message
        init(messageId: String, sender: Address, receiver: Address, message: String, timestamp: UFix64) {
            self.messageId = messageId
            self.sender = sender
            self.receiver = receiver
            self.message = message
            self.timestamp = timestamp
        }
    }

    
    // Define the Channel Message struct to store channel message details
    pub struct ChannelMessage {
        pub var channelID: String
        pub var message: String
        pub var timestamp: UFix64

        // initialize a message to store channel
        init(channelID: String, message: String, timestamp: UFix64) {
            self.channelID = channelID
            self.message = message
            self.timestamp = timestamp
        }
    }

    // channels are similar to chat but only owner can send mesage to them
    // channels can be public or private
    // private channel can have subscribeFee, the followers should pay this fee


    // The channel resource stores all the messages sent by the owner in acount storage space.
    // Depending on whether the channel is public or private,
    // this storage space will be linked to either acount public or private space.
    // The reference to these storage spaces will be stored in the contract.
    // These references serve as a means to grant access to the followers, enabling them to read the messages.

    pub resource Channel {
        pub var id: String
        pub var messages: [ChannelMessage]
        pub var channelType: Bool // public: True, private: False
        pub var subscribeFee: UFix64

        init(id: String, owner: Address, channelType: Bool, subscribeFee:UFix64) {
            self.id = id
            self.messages = []
            self.channelType = channelType
            self.subscribeFee = subscribeFee
        }


        access(contract) fun addNewMessage(message: ChannelMessage) {
            self.messages.append(message)
        }
    }

    // ChannelInfo is similar to channel resource but it remain on blockchain and allows
    // contract logic for checking follower and retrieving data about the channel
    pub struct ChannelInfo {
        pub var followers: [Address]
        pub var id: String
        pub var owner: Address
        pub var channelType: Bool // public: True, private: False
        pub var subscribeFee: UFix64
        pub var LastMessageTimeStamp: UFix64

        init(id: String, owner: Address, channelType: Bool, subscribeFee:UFix64) {
            self.followers = []
            self.id = id
            self.owner = owner
            self.channelType = channelType
            self.subscribeFee = subscribeFee
            self.LastMessageTimeStamp = 0.0
        }

        // Update follower list of the channel
        // only people who followed the channel can have acess to its messages
        access(contract) fun addNewfollower(follower: Address) {
            self.followers.append(follower)
        }
        
        access(contract) fun updateLastTimeStamp(timestamp: UFix64) {
            self.LastMessageTimeStamp = timestamp
        }
    }

    // person structure keeps data of a user in its self

    pub struct Person {
        pub var address: Address
        pub var name: String
        pub var contacts: {Address: UFix64}
        pub var ownedChannel: [String]
        pub var followedChannel: [String]

        init(address: Address) {
            self.address = address
            self.name = ""
            self.contacts = {}
            self.ownedChannel = []
            self.followedChannel = []
        }

        access(contract) fun addNewContact(contact: Address, timestamp: UFix64) {
            self.contacts.insert(key: contact, timestamp)
        }
        
        access(contract) fun addNewOwnedChannel(id: String) {
            self.ownedChannel.append(id)
        }
        
        access(contract) fun addNewFollowedChannel(id: String) {
            self.followedChannel.append(id)
        }

        access(contract) fun updateContactTime(contact: Address, timestamp: UFix64) {
            self.contacts[contact] = timestamp
        }

        access(contract) fun addPersonName(name: String) {
            self.name = "String"
        }
    }

    // Chat structure keep message between two person in its self
    // Chat id is create by concating sender and reciever addresses

    pub struct Chat {
        pub var id: String
        pub var messages: [Message]

        init(id: String, message: Message) {
            self.id = id
            self.messages = [message]
        }

        access(contract) fun addNewMessage(message: Message) {
            self.messages.append(message)
        }
    }

    ////////////////// Lists ////////////////////
    // lists helps contract to track relations and data
    //
    // strore all messages
    access(contract) let messages: {String: Message}

    // store all chats as dictionary while their id is key
    access(contract) let chats: {String: Chat}
    
    // store all persons as dictionary while user address is key
    access(contract) let persons: {Address: Person}

    // keeps channel reference to grant access for reading messages
    access(contract) let channels: {String: Capability<&Channel>}

    // keeps channel informations
    access(contract) let channelsInfo: {String: ChannelInfo}

    // The init() function is required if the contract contains any fields.
    init() {
        self.messages = {}
        self.chats = {}
        self.persons = {}
        // self.relations = []
        self.channels = {}
        self.channelsInfo = {}
    }


    ///////////////////// private functions ////////////////////



    // updateFollwerList is helper function that is used by joinToPublicChannel and
    // joinToPrivateChannel to update follower list of a channel

    access(contract) fun updateFollwerList(channel: ChannelInfo, follower: Address) {
        pre {
            self.channels.containsKey(channel.id): "this channel do not exist"
            !self.channelsInfo[channel.id]!.followers.contains(follower): "this channeled is followed by this member"
        }
        self.channelsInfo[channel.id]!.addNewfollower(follower: follower)
    }

    

    access(contract) fun getChat(chatID: String): Chat {
        pre { 
            self.chats.containsKey(chatID)
                : "this chat is not exist"
        }
        return self.chats[chatID]!
    }
    

    // Function to store a voice message
    access(contract) fun storeMessage(
        messageId: String,
        sender: Address,
        receiver: Address,
        message: String,
        timestamp: UFix64
    ) {

        let newMessage = Message(
            messageId: messageId,
            sender: sender,
            receiver: receiver,
            message: message,
            timestamp: timestamp
        )

        self.messages[messageId] = newMessage

        self.chatsDictionaryUpdater(side1: sender, side2: receiver, message: newMessage)
        self.chatsDictionaryUpdater(side1: receiver, side2: sender, message: newMessage)

    }
    
    // chats dectionary updater
    access(contract) fun chatsDictionaryUpdater(side1: Address, side2: Address, message: Message) {
        let a = side1.toString().concat(side2.toString())

        if self.chats.containsKey(a) {
            var chatA: Chat = self.getChat(chatID: a)
            chatA.addNewMessage(message: message)
            self.chats[a] = chatA
        } else {
            var chatA: Chat = self.Chat(id: a, message: message)
            self.chats.insert(key: a, chatA)
        }
    }
    // add a contact if its not exist
    access(contract) fun checkOrAddPersons(address: Address) {
        if !(self.persons.containsKey(address)) {
            var newPerson: Person = self.Person(address: address)
            log(newPerson)
            self.persons.insert(key: address, newPerson)
        }
    }

    // check and update contact list of a person
    access(contract) fun chackAndUpdateContact(side1: Address, side2: Address, timestamp: UFix64) {

        let condition: Bool = (self.persons[side1]?.contacts?.containsKey(side2))!
        if  !condition {
            let updatedPerson: Person = self.persons[side1]!
            updatedPerson.addNewContact(contact: side2, timestamp: timestamp)
            self.persons[side1] = updatedPerson
        } else {
            let updatedPerson: Person = self.persons[side1]!
            updatedPerson.updateContactTime(contact: side2, timestamp: timestamp)
            self.persons[side1] = updatedPerson
        }
        
    }


    ///////////////////// public functions ////////////////////
    
    // sendMessageToChannel gets channel reference, create a new message
    // and add it to the channel message list
    // it makes sure the channel existance and only owner can add message to it.

    pub fun sendMessageToChannel(
        channel: &Channel, 
        message: String, 
        timestamp: UFix64,
        sender: Address, 
        signature: [UInt8], 
        signedData: [UInt8], 
        hashAlgorithm: HashAlgorithm
    ) {

        pre { 
            self.channels.containsKey(channel.id): "this channel do not exist"
            // getAccount(sender).keys.get(keyIndex: 0)!.publicKey
            // .verify(signature: signature, signedData: signedData, domainSeparationTag: "", hashAlgorithm: hashAlgorithm)
            // : "Sender Account is not matched with transaction Sender Account"
            self.channelsInfo[channel.id]!.owner == sender: "Transation sender is not owner of channel"
        }

        let newMessage = ChannelMessage(
            channelID: channel.id,
            message: message,
            timestamp: timestamp,
        )
        channel.addNewMessage(message: newMessage)
        var channelToUpdate = self.channelsInfo[channel.id]!
        channelToUpdate.updateLastTimeStamp(timestamp: timestamp)
        self.channelsInfo[channel.id] = channelToUpdate
    }
    
    // createChannel allows users to create a public or private channel
    // the new channel resource will be store in storage space.
    // its reference will be store in contract to rant access to followers

    pub fun createChannel(
        id: String,
        owner: Address,
        channelType: Bool,
        subscribeFee: UFix64,
    ): @Channel {
        if !self.persons.containsKey(owner){
            self.checkOrAddPersons(address: owner)
        }
        var ownerUser = self.getPerson(address: owner)
        // let id = owner.toString().concat(ownerUser.ownedChannel.length.toString())
        let newChannel <- create self.Channel(
            id: id,
            owner: owner, 
            channelType: channelType, 
            subscribeFee: subscribeFee
        )

        let newChannelInfo = self.ChannelInfo(
            id: id,
            owner: owner,
            channelType: channelType,
            subscribeFee: subscribeFee,
        )
        self.channelsInfo.insert(key: id, newChannelInfo)

        ownerUser.addNewOwnedChannel(id: id)

        // update persons list
        self.persons[owner] = ownerUser
        return <- newChannel
    }
    
    // joinToPublicChannel allows everyone join a public channel, there is no restriction, even other people can
    // add other users to a channel 

    access(all) fun joinToPublicChannel(
        sender: Address,
        channelId: String,
    ) {
        pre { 
            self.channels.containsKey(channelId): "this channel do not exist"
            self.channelsInfo[channelId]!.channelType: "this channel is not public"
        }

        // check sender is exist, if not creeate it
        self.checkOrAddPersons(address: sender)

        // update channel follower list
        self.updateFollwerList(channel: self.channelsInfo[channelId]!, follower: sender)
        
 
        // update user followed Channel
        let joinedPerson = self.getPerson(address: sender)
        joinedPerson.addNewFollowedChannel(id: channelId)

        // update persons list
        self.persons[sender] = joinedPerson
    }

    // joinToPublicChannel allows everyone join a public channel, there is no restriction, even other people can
    // add other users to a channel 

    access(all) fun joinToPrivateChannel(
        sender: Address,
        channelId: String,
        amount: UFix64,
        payment: @FungibleToken.Vault,
    ) {
        pre { 
            // self.persons.containsKey(sender): "this person do not exist"
            self.channels.containsKey(channelId): "this channel do not exist"
            self.channelsInfo[channelId]!.channelType == false: "this channel is not private"
            self.channelsInfo[channelId]!.subscribeFee <= amount: "transaction amount is not enough for subscribtion"
        }
        //
        // send transaction for owner
        let owner = self.getChannel(channelId: channelId).owner
        let recipientAccount = getAccount(owner)

        // Get a reference to the recipient's Receiver
        let receiverRef = recipientAccount.getCapability(/public/flowTokenReceiver)!
            .borrow<&{FungibleToken.Receiver}>()
            ?? panic("Could not borrow receiver reference to the recipient's Vault")
        // Pay subscribtion fee to channel owner
        receiverRef.deposit(from: <- payment)

        // check sender exists
        self.checkOrAddPersons(address: sender)
        // update channel follwers
        self.updateFollwerList(channel: self.channelsInfo[channelId]!, follower: sender)

        // update user followed Channel
        self.getPerson(address: sender).addNewFollowedChannel(id: channelId)
        let joinedPerson = self.getPerson(address: sender)
        self.persons[sender] = joinedPerson
    }

    // Add channel reference to contract
    access(all) fun updateChannesList(uuid: String, ref: Capability<&Channel>) {
        pre {
            !self.channels.containsKey(uuid): "this channel already exist"
        }
        self.channels.insert(key: uuid, ref)
    }

    // Using this function Followers can get the channel messages
    access(all) fun getChannelMessage(
        account: Address, 
        channelId: String,
        signature: [UInt8], 
        signedData: [UInt8], 
        hashAlgorithm: HashAlgorithm
    ): [ChannelMessage] {
        pre {
            // getAccount(account).keys.get(keyIndex: 0)!.publicKey
            // .verify(signature: signature, signedData: signedData, domainSeparationTag: "", hashAlgorithm: hashAlgorithm): "Sender Account is not matched with transaction Sender Account"
            self.channels.containsKey(channelId)
            : "this channel do not exist"
            self.channelsInfo[channelId]!.followers.contains(account) 
            || self.channelsInfo[channelId]!.owner == account
            : "this user is not follwer of this channel nor owner"
        }
        return self.channels[channelId]!.borrow()!.messages
    }

    access(all) fun getAllPersons(): {Address: Person} {
        return self.persons
    }

    access(all) fun getAllChats(): {String: Chat} {
        return self.chats
    }

    access(all) fun getAllMessages(): {String: Message} {
        return self.messages
    }
    access(all) fun getAllChannels(): {String: ChannelInfo} {
        return self.channelsInfo
    }

    access(all) fun getPerson(address: Address): Person {
        pre { 
            self.persons.containsKey(address): "this person do not exist"
        }
        return self.persons[address]!
    }

    access(all) fun getChatpublic(
        chatID: String, 
        account: Address, 
        side2: Address,
        signature: [UInt8], 
        signedData: [UInt8], 
        hashAlgorithm: HashAlgorithm
    ): Chat {

        pre { 
            // getAccount(account).keys.get(keyIndex: 0)!.publicKey
            // .verify(signature: signature, signedData: signedData, domainSeparationTag: "", hashAlgorithm: hashAlgorithm): "Sender Account is not matched with transaction Sender Account"
            self.chats.containsKey(chatID)
                : "this chat is not exist"
            (account.toString().concat(side2.toString()) == chatID 
            || side2.toString().concat(account.toString()) == chatID)
                : "the requester is not owner of chat"
        }
        return self.chats[chatID]!
    }
    
    
    
    access(all) fun checkChannelName(channelId: String): Bool {
        if self.channelsInfo.containsKey(channelId) {
            return true
        } else {
            return false
        }
    }

    access(all) fun getChannel(channelId: String): ChannelInfo {
        pre { 
            self.channelsInfo.containsKey(channelId): "this channel do not exist"
        }
        return self.channelsInfo[channelId]!
    }

    // Function to update the lists based on a transaction
    access(all) fun sendMessage(
        transactionId: String, 
        sender: Address, 
        receiver: Address, 
        message: String, 
        timestamp: UFix64,
        signature: [UInt8], 
        signedData: [UInt8], 
        hashAlgorithm: HashAlgorithm
    ) {
        pre {
            // getAccount(sender).keys.get(keyIndex: 0)!.publicKey
            // .verify(signature: signature, signedData: signedData, domainSeparationTag: "", hashAlgorithm: hashAlgorithm)
            // : "Sender Account is not matched with transaction Sender Account"
        }
        
        // let sender = senderAccount.address
        self.checkOrAddPersons(address: sender)
        self.checkOrAddPersons(address: receiver)
        // self.checkOrAddRelation(side1: sender, side2: receiver)
        self.chackAndUpdateContact(side1: sender, side2: receiver, timestamp: timestamp)
        self.chackAndUpdateContact(side1: receiver, side2: sender, timestamp: timestamp)
        self.storeMessage(messageId: transactionId, sender: sender, receiver: receiver, message: message, timestamp: timestamp)
    }
}