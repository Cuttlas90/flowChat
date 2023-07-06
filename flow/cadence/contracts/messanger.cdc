
// Define the MessageHistory smart contract
pub contract MessageHistory {

// Define the VoiceMessage struct to store message details
    pub struct VoiceMessage {
        pub var sender: Address
        pub var receiver: Address
        pub var message: String
        pub var timestamp: UInt64

        init(sender: Address, receiver: Address, message: String, timestamp: UInt64) {
            self.sender = sender
            self.receiver = receiver
            self.message = message
            self.timestamp = timestamp
        }
    }

    pub struct Person {
        pub var address: Address
        pub var name: String
        pub var contacts: {Address: UInt64}

        init(address: Address) {
            self.address = address
            self.name = ""
            self.contacts = {}
        }

        pub fun addNewContact(contact: Address, timestamp: UInt64) {
            self.contacts.insert(key: contact, timestamp)
        }

        pub fun updateContactTime(contact: Address, timestamp: UInt64) {
            self.contacts[contact] = timestamp
        }

        pub fun addPersonName(name: String) {
            self.name = "String"
        }
    }

    pub struct Chat {
        pub var id: String
        pub var messages: [VoiceMessage]

        init(id: String, message: VoiceMessage) {
            self.id = id
            self.messages = [message]
        }

        pub fun addNewMessage(message: VoiceMessage) {
            self.messages.append(message)
        }

    }

    

    pub let messages: {String: VoiceMessage}
    pub let chats: {String: Chat}
    pub let persons: {Address: Person}
    pub let relations: [String]

    // The init() function is required if the contract contains any fields.
    init() {
        self.messages = {}
        self.chats = {}
        self.persons = {}
        self.relations = []
    }


    pub fun getAllPersons(): {Address: Person} {
        return self.persons
    }

    pub fun getAllrelations(): [String] {
        return self.relations
    }

    pub fun getAllChats(): {String: Chat} {
        return self.chats
    }

    pub fun getAllMessages(): {String: VoiceMessage} {
        return self.messages
    }


    pub fun getPerson(address: Address): Person? {
        pre { 
            self.persons[address] == nil: "this person is not exist"
        }
        return self.persons[address]
    }

    pub fun getChat(chatID: String): Chat? {
        pre { 
            self.chats[chatID] == nil: "this chat is not exist"
        }
        return self.chats[chatID]
    }

    // Function to store a voice message
    pub fun storeMessage(
        messageId: String,
        sender: Address,
        receiver: Address,
        message: String,
        timestamp: UInt64
    ) {

        let newMessage = VoiceMessage(
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
    pub fun chatsDictionaryUpdater(side1: Address, side2: Address, message: VoiceMessage) {
        let a = side1.toString().concat(side2.toString())

        if self.chats.containsKey(a) {
            var chatA: Chat = self.getChat(chatID: a)!
            chatA.addNewMessage(message: message)
            self.chats[a] = chatA
        } else {
            var chatA: Chat = self.Chat(id: a, message: message)
            self.chats.insert(key: a, chatA)
        }
    }
    // add a contact if its not exist
    pub fun checkOrAddPersons(address: Address) {
        if !(self.persons.containsKey(address)) {
            var newPerson: Person = self.Person(address: address)
            log(newPerson)
            self.persons.insert(key: address, newPerson)
        }
    }

    // check if they are in contact list if not create a relation between them
    pub fun checkOrAddRelation(side1: Address, side2: Address) {
        let a = side1.toString().concat(side2.toString())
        if !(self.relations.contains(a)) {
            self.relations.append(a)
            let b = side2.toString().concat(side1.toString())
            self.relations.append(b)
        }
    }
    // check and update contact list of a person
    pub fun chackAndUpdateContact(side1: Address, side2: Address, timestamp: UInt64) {

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

    // Function to update the lists based on a transaction
    pub fun updateLists(transactionId: String, sender: Address, receiver: Address, message: String, timestamp: UInt64) {
        self.checkOrAddPersons(address: sender)
        self.checkOrAddPersons(address: receiver)
        self.checkOrAddRelation(side1: sender, side2: receiver)
        self.chackAndUpdateContact(side1: sender, side2: receiver, timestamp: timestamp)
        self.chackAndUpdateContact(side1: receiver, side2: sender, timestamp: timestamp)
        self.storeMessage(messageId: transactionId, sender: sender, receiver: receiver, message: message, timestamp: timestamp)
    }
}