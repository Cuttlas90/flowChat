import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
import "../../flow/config";
import * as fcl from "@onflow/fcl";
const initialState = {
  user: {
    wallet: {},
    profile: {},
    initProfile: {
      status: "",
      error: "",
    },
    setProfileName: {
      status: "",
      error: ""
    },
    setProfileAvatar: {
      status: "",
      error: ""
    },
    setProfileInfo: {
      status: "",
      error: ""
    },
    setProfileColor: {
      status: "",
      error: ""
    },
    getMyContacts: {
      status: "",
      error: "",
      time:"",
      contactsList: {},
      ownedChannel: [],
      followedChannel: []
    },
    getChat: {
      messageList: {}
    },
    getChannelChat: {
      messageList: {}
    },
    sendMessage: {
      sendList: {}
    },
    sendChannelMessage: {
      sendList: {}
    },
    createChannel: {
      status: "",
      error: "",
    },
    joinToPublicChannel: {
      channelList:{}
    },
    joinToPrivateChannel: {
      channelList:{}
    }
  },
  getProfile: {},
  getChannelInfo: {},
  setAddressToGetMessage: {},
  setChannelToGetMessage: {},

};
export const getProfile = createAsyncThunk(
  'getProfile/Service',
  async ({ address, isUserAddress, timeStamp }) => {
    const response = await fcl.query({
      cadence: `
        import Profile from 0xProfile

        pub fun main(address: Address): Profile.ReadOnly? {
          return Profile.read(address)
        }
      `,
      args: (arg, t) => [arg(address, t.Address)]
    })
    var data = { ...response, isUserAddress, timeStamp }
    return data;
  }
);
export const getChannelInfo = createAsyncThunk(
  'getChannelInfo/Service',
  async ({ chanelId }) => {
    const response = await fcl.query({
      cadence: `
        import MessangerTest4 from 0xmessanger

        pub fun main(ChannelId: String): MessangerTest4.ChannelInfo {
          return MessangerTest4.getChannel(channelId: ChannelId)
        }
      `,
      args: (arg, t) => [arg(chanelId, t.String)]
    })
    return response;
  }
);
export const setProfileName = createAsyncThunk(
  'setProfileName/Service',
  async (name) => {
    const transactionId = await fcl.mutate({
      cadence: `
        import Profile from 0xProfile

        transaction(name: String) {
          prepare(account: AuthAccount) {
            account
              .borrow<&Profile.Base{Profile.Owner}>(from: Profile.privatePath)!
              .setName(name)
          }
          
        }
      `,
      args: (arg, t) => [arg(name, t.String)],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 100
    });
     const transaction = fcl.tx(transactionId).onceSealed()
    return transaction
  });
export const setProfileAvatar = createAsyncThunk(
  'setProfileAvatar/Service',
  async (avatarBase64) => {
    const transactionId = await fcl.mutate({
      cadence: `
        import Profile from 0xProfile

        transaction(avatarBase64: String) {
          prepare(account: AuthAccount) {
            account
              .borrow<&Profile.Base{Profile.Owner}>(from: Profile.privatePath)!
              .setAvatar(avatarBase64)
          }
          
        }
      `,
      args: (arg, t) => [arg(avatarBase64, t.String)],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 100
    })
    const transaction = await fcl.tx(transactionId).onceSealed()
    return transaction;
  }
);
export const setProfileInfo = createAsyncThunk(
  'setProfileInfo/Service',
  async (info) => {
    const transactionId = await fcl.mutate({
      cadence: `
        import Profile from 0xProfile

        transaction(info: String) {
          prepare(account: AuthAccount) {
            account
              .borrow<&Profile.Base{Profile.Owner}>(from: Profile.privatePath)!
              .setInfo(info)
          }
          
        }
      `,
      args: (arg, t) => [arg(info, t.String)],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 100
    })
    const transaction = await fcl.tx(transactionId).onceSealed()
    return transaction;
  }
);
export const setProfileColor = createAsyncThunk(
  'setProfileColor/Service',
  async (color) => {
    const transactionId = await fcl.mutate({
      cadence: `
        import Profile from 0xProfile

        transaction(color: String) {
          prepare(account: AuthAccount) {
            account
              .borrow<&Profile.Base{Profile.Owner}>(from: Profile.privatePath)!
              .setColor(color)
          }
          
        }
      `,
      args: (arg, t) => [arg(color, t.String)],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 100
    })
    const transaction = await fcl.tx(transactionId).onceSealed()
    return transaction;
  }
);
export const getMyContacts = createAsyncThunk(
  'getMyContacts/Service',
  async (address) => {
    const list = await fcl.query({
      cadence: `
      import 
      MessangerTest4 from 0xmessanger
      pub fun main(adres:Address): MessangerTest4.Person{
        return  MessangerTest4.getPerson(address:adres)
      }`,
      args: (arg, t) => [arg(address, t.Address)],
    });
    return list;
  }
);



export const getChat = createAsyncThunk(
  'getChat/Service',
  async ({ userAddress, contactAddress }) => {
    const chatList = await fcl.query({
      cadence: `
      import MessangerTest4 from 0xmessanger
      pub fun main (ChatID: String,Account: Address,Side2: Address): MessangerTest4.Chat? {
        let hexData: [UInt8] = [109, 111, 104, 115, 101, 110]
        return MessangerTest4.getChatpublic(chatID: ChatID,account:Account,side2:Side2,signature:hexData,signedData:hexData,hashAlgorithm:HashAlgorithm.SHA3_256)
      }`,
      // cadence: `
      // import MessangerTest4 from 0xmessanger
      // pub fun main(ChatID: String,Side2: Address): Messanger.Chat {
      //   prepare(account: AuthAccount){
      //   return Messanger.getChatpublic(chatID: ChatID, account: account, side2: Side2)
      //   }
      // }`,
      args: (arg, t) => [
        arg(`${userAddress + contactAddress}`, t.String),
        arg(`${userAddress}`, t.Address),
        arg(`${contactAddress}`, t.Address),
      ],
    })
    return chatList;
  }
);
export const getChannelChat = createAsyncThunk(
  'getChannelChat/Service',
  async ({ userAddress, channelId }) => {
    const chatList = await fcl.query({
      cadence: `
      import MessangerTest4 from 0xmessanger
      pub fun main (Account:Address,ChannelId:String): [MessangerTest4.ChannelMessage] {
        let hexData: [UInt8] = [109, 111, 104, 115, 101, 110]
        return MessangerTest4.getChannelMessage(account:Account,channelId:ChannelId,signature:hexData,signedData:hexData,hashAlgorithm:HashAlgorithm.SHA3_256)
      }`,
      args: (arg, t) => [
        arg(`${userAddress}`, t.Address),
        arg(`${channelId}`, t.String),
      ],
    })
    return chatList;
  }
);
// [39,109,111,104,115,101,110,39]
// let time: UFix64 = getCurrentBlock().timestamp
export const sendMessage = createAsyncThunk(
  'sendMessage/Service',
  async ({ uuid, userAddress, contactAddress, message, timestamp }) => {
    const transactionId = await fcl.mutate({
      cadence: `
      import MessangerTest4 from 0xmessanger

      transaction(TransactionId: String,Sender:Address,Receiver: Address, Message: String,Timestamp:UFix64,Signature:String,SignedData:String) {
      
        prepare(account: AuthAccount) { 
          let hexSign: [UInt8] = Signature.decodeHex()
          let hexData: [UInt8] = [109, 111, 104, 115, 101, 110]
          let x: HashAlgorithm = HashAlgorithm.SHA3_256
          MessangerTest4.sendMessage(transactionId:TransactionId,sender:Sender, receiver:Receiver, message:Message, timestamp:Timestamp,signature:hexSign,signedData:hexData ,hashAlgorithm:HashAlgorithm.SHA3_256)
        }
      }
      `, args: (arg, t) => [
        arg(uuid, t.String),
        arg(userAddress, t.Address),
        arg(contactAddress, t.Address),
        arg(message, t.String),
        arg(timestamp, t.UFix64),
        arg("ffdb763962860f6537adf4c4bfeac925f5399658df60a3077e064d78d3c8a9d448efbe118ee866603d71501a26fc00a0d77e5851f56abea975103cff2f03000e", t.String),
        //arg("da2a3235f71661636d79b3a437f8f33c4fdc141b1ba8d8e7cc15303a4b83aa44c22fe116bd6e9462376cd209e91f86e32d8688186d57eeed35c817c3ce4bb513",t.String),
        arg(`6d6f6873656e`, t.String),
      ],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 400
    });
    const transaction = fcl.tx(transactionId).onceSealed()
    return transaction
  }
);
export const sendChannelMessage = createAsyncThunk(
  'sendChannelMessage/Service',
  async ({ channel, message, timestamp ,typeChannel,sender}) => {
    const transactionId = await fcl.mutate({
      cadence:
      typeChannel ? `
      import MessangerTest4 from 0xmessanger

      transaction(Message: String, Timestamp: UFix64 , Sender:Address) {
      
        prepare(account: AuthAccount) { 
          let hexData: [UInt8] = [109, 111, 104, 115, 101, 110]
          let storePath1: CapabilityPath =/public/${channel}
          let channel = account.getCapability<&MessangerTest4.Channel>(storePath1).borrow()!

          MessangerTest4.sendMessageToChannel(channel: channel, message: Message, timestamp: Timestamp,sender:Sender,signature:hexData,signedData:hexData,hashAlgorithm:HashAlgorithm.SHA3_256)
        }
      }
      `:
      `
      import MessangerTest4 from 0xmessanger
      
      transaction(Message: String, Timestamp: UFix64 , Sender:Address) {
        
        prepare(account: AuthAccount) { 
          let hexData: [UInt8] = [109, 111, 104, 115, 101, 110]
          let storePath1: CapabilityPath =/private/${channel}
          let channel = account.getCapability<&MessangerTest4.Channel>(storePath1).borrow()!

          MessangerTest4.sendMessageToChannel(channel: channel, message: Message, timestamp: Timestamp,sender:Sender,signature:hexData,signedData:hexData,hashAlgorithm:HashAlgorithm.SHA3_256)
        }
      }
      `
      , args: (arg, t) => [
        arg(message, t.String),
        arg(timestamp, t.UFix64),
        arg(sender, t.Address),
      ],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 400
    });
    const transaction = fcl.tx(transactionId).onceSealed()
    return transaction  
  });

export const createChannel = createAsyncThunk(
  'createChannel/Service',
  async ({ uuid, userAddress, channelTyple, subscribeFee }) => {
    const transactionId = await fcl.mutate({
      cadence: `
      import MessangerTest4 from 0xmessanger

      transaction(Id: String, Owner: Address, ChannelType: Bool, SubscribeFee: UFix64) {
      
        prepare(account: AuthAccount) { 
        let storePath1: StoragePath = /storage/${uuid}
        let pubPath1: PublicPath = /public/${uuid}
        let privPath1: PrivatePath = /private/${uuid}

        let storePath2: Path = /storage/${uuid}
        let pubPath2: Path = /public/${uuid}
        let privPath2: Path = /private/${uuid}
        
        let capPubPath2: CapabilityPath = /public/${uuid}
        let capPrivPath2: CapabilityPath = /private/${uuid}
        let chan <- MessangerTest4.createChannel(id: Id, owner: Owner, channelType: ChannelType, subscribeFee: SubscribeFee)
        account.save(<- chan, to:storePath1)
        if ChannelType {
            account.link<&MessangerTest4.Channel>(capPubPath2, target: storePath2)
            let capabilityReference = account.getCapability<&MessangerTest4.Channel>(pubPath1)
            MessangerTest4.updateChannesList(uuid: Id, ref: capabilityReference)
        } else {
            account.link<&MessangerTest4.Channel>(capPrivPath2, target: storePath2)
            let capabilityReference = account.getCapability<&MessangerTest4.Channel>(privPath1)
            MessangerTest4.updateChannesList(uuid: Id, ref: capabilityReference)
        }
        }
      }
      `, args: (arg, t) => [
        arg(uuid, t.String),
        arg(userAddress, t.Address),
        arg(channelTyple, t.Bool),
        arg(subscribeFee,t.UFix64),
      ],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 200
    });
    const transaction = fcl.tx(transactionId).onceSealed()
    return transaction
  }
);
export const joinToPublicChannel = createAsyncThunk(
  'joinToPublicChannel/Service',
  async ({ channelId, sender }) => {
    const transactionId = await fcl.mutate({
      cadence: `
      import MessangerTest4 from 0xmessanger

      transaction( Sender: Address ,ChannelId: String) {
      
        prepare(account: AuthAccount) { 
          MessangerTest4.joinToPublicChannel(sender: Sender,channelId: ChannelId)
        }
      }
      `, args: (arg, t) => [
        arg(sender, t.Address),
        arg(channelId, t.String)
      ],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 200
    });
    const transaction = fcl.tx(transactionId).onceSealed()
    return transaction
  }
);
export const joinToPrivateChannel = createAsyncThunk(
  'joinToPrivateChannel/Service',
  async ({ channelId, amount }) => {
    const transactionId = await fcl.mutate({
      cadence: `
      import MessangerTest4 from 0xe9c2549205cdc2f8
      import FlowToken from 0x7e60df042a9c0868
      import FungibleToken from 0x9a0766d93b6608b7
      

      transaction(amount: UFix64, ChannelId: String) {
        
        prepare(signer: AuthAccount) {
          let vaultRef = signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
          ?? panic("Could not borrow reference to the owner's Vault!")
    
            MessangerTest4.joinToPrivateChannel(sender: signer.address,channelId: ChannelId, amount: amount, payment: <- vaultRef.withdraw(amount: amount))
    }
    }
      `, args: (arg, t) => [
        arg(amount, t.UFix64),
        arg(channelId, t.String)
      ],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 200
    });
    const transaction = fcl.tx(transactionId).onceSealed()
    return transaction
  }
);
export const initProfile = createAsyncThunk(
  'initProfile/Service',
  async () => {
    const transactionId = await fcl.mutate({
      cadence: `
          import Profile from 0xProfile
  
          transaction {
            prepare(account: AuthAccount) {
              // Only initialize the account if it hasn't already been initialized
              if (!Profile.check(account.address)) {
                // This creates and stores the profile in the user's account
                account.save(<- Profile.new(), to: Profile.privatePath)
  
                // This creates the public capability that lets applications read the profile's info
                account.link<&Profile.Base{Profile.Public}>(Profile.publicPath, target: Profile.privatePath)
              }
            }
          }
        `,
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 100
    })
    const transaction = await fcl.tx(transactionId).onceSealed()
    return transaction;
  }
);

export const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {
    setWalletUser: (state, action) => {
      state.user.wallet = action.payload
    },
    setAddressToGetMessage: (state, action) => {
      state.setAddressToGetMessage = action.payload
    },
    setChannelToGetMessage: (state, action) => {
      state.setChannelToGetMessage = action.payload
    },
    resetState: (state, action) => { return (initialState) },
    removeFromSenList: (state, action) => {
      var tempList = { ...current(state).user.sendMessage.sendList[action.payload.contactAddress] };
      delete tempList[action.payload.uuid];
      state.user.sendMessage.sendList[action.payload.contactAddress] = tempList;
    },
    removeFromChannelSenList: (state, action) => {
      var tempList = { ...current(state).user.sendChannelMessage.sendList[action.payload.channel] };
      delete tempList[action.payload.timestamp];
      state.user.sendChannelMessage.sendList[action.payload.channel] = tempList;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state, action) => {
        if (action.meta.arg.isUserAddress) {
          state.user.profile = { ...state.user.profile, status: 'loading',"timeStamp":action.meta.arg.timeStamp  };
        } else {
          state.getProfile[action.meta.arg.address] = { ...state.getProfile[action.meta.arg.address], status: 'loading',"timeStamp":action.meta.arg.timeStamp };
        }
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        if (action.meta.arg.isUserAddress) {
          state.user.profile = { ...action.payload, status: "idle","timeStamp":action.meta.arg.timeStamp  };
        } else {
          state.getProfile[action.meta.arg.address] = { ...action.payload, status: "idle","timeStamp":action.meta.arg.timeStamp  };
        }
      })
      .addCase(getProfile.rejected, (state, action) => {
        if (action.meta.arg.isUserAddress) {
          state.user.profile = { ...state.user.profile, status: 'rejected',"timeStamp":action.meta.arg.timeStamp  };
        } else {
          state.getProfile[action.meta.arg.address] = { ...state.getProfile[action.meta.arg.address], status: 'rejected',"timeStamp":action.meta.arg.timeStamp  };
        }
      });
    builder
      .addCase(getChannelInfo.pending, (state, action) => {
        state.getChannelInfo[action.meta.arg.chanelId] = { ...state.getChannelInfo[action.meta.arg.chanelId], status: 'loading' };
      })
      .addCase(getChannelInfo.fulfilled, (state, action) => {
        state.getChannelInfo[action.meta.arg.chanelId] = { ...action.payload, status: "idle" };
      })
      .addCase(getChannelInfo.rejected, (state, action) => {
        state.getChannelInfo[action.meta.arg.chanelId] = { ...state.getChannelInfo[action.meta.arg.chanelId], status: 'rejected' };
      });
    builder
      .addCase(initProfile.pending, (state) => {
        state.user.initProfile.status = 'loading';
        state.user.initProfile.error = '';
      })
      .addCase(initProfile.fulfilled, (state,action) => {
        if (action.payload.statusCode === 0){
        state.user.initProfile.status = 'idle';
      }else{
          state.user.initProfile.status = 'rejected';
          state.user.initProfile.error = action.payload.errorMessage;
        }
      })
      .addCase(initProfile.rejected, (state, action) => {
        state.user.initProfile.status = 'rejected';
        state.user.initProfile.error = action?.error;
      });
    builder
      .addCase(setProfileName.pending, (state) => {
        state.user.setProfileName.status = 'loading';
        state.user.setProfileName.error = '';
      })
      .addCase(setProfileName.fulfilled, (state,action) => {
        if (action.payload.statusCode === 0){
          state.user.setProfileName.status = 'idle';
        }else{
          state.user.setProfileName.status = 'rejected';
          state.user.setProfileName.error = action.payload.errorMessage;
        }
      })
      .addCase(setProfileName.rejected, (state, action) => {
        state.user.setProfileName.status = 'rejected';
        state.user.setProfileName.error = action?.error;
      });
    builder
      .addCase(setProfileAvatar.pending, (state) => {
        state.user.setProfileAvatar.status = 'loading';
        state.user.setProfileAvatar.error = '';
      })
      .addCase(setProfileAvatar.fulfilled, (state,action) => {
        if (action.payload.statusCode === 0){
        state.user.setProfileAvatar.status = 'idle';
      }else{
          state.user.setProfileAvatar.status = 'rejected';
          state.user.setProfileAvatar.error = action.payload.errorMessage;
        }
      })
      .addCase(setProfileAvatar.rejected, (state, action) => {
        state.user.setProfileAvatar.status = 'rejected';
        state.user.setProfileAvatar.error = action?.error;
      });
    builder
      .addCase(setProfileInfo.pending, (state) => {
        state.user.setProfileInfo.status = 'loading';
        state.user.setProfileInfo.error = '';
      })
      .addCase(setProfileInfo.fulfilled, (state,action) => {
        if (action.payload.statusCode === 0){
        state.user.setProfileInfo.status = 'idle';
      }else{
          state.user.setProfileInfo.status = 'rejected';
          state.user.setProfileInfo.error = action.payload.errorMessage;
        }
      })
      .addCase(setProfileInfo.rejected, (state, action) => {
        state.user.setProfileInfo.status = 'rejected';
        state.user.setProfileInfo.error = action?.error;
      });
    builder
      .addCase(setProfileColor.pending, (state) => {
        state.user.setProfileColor.status = 'loading';
        state.user.setProfileColor.error = '';
      })
      .addCase(setProfileColor.fulfilled, (state,action) => {
        if (action.payload.statusCode === 0){
        state.user.setProfileColor.status = 'idle';
      }else{
          state.user.setProfileColor.status = 'rejected';
          state.user.setProfileColor.error = action.payload.errorMessage;
        }
      })
      .addCase(setProfileColor.rejected, (state, action) => {
        state.user.setProfileColor.status = 'rejected';
        state.user.setProfileColor.error = action?.error;
      });
    builder
      .addCase(getMyContacts.pending, (state) => {
        state.user.getMyContacts.status = 'loading';
        state.user.getMyContacts.error = '';
      })
      .addCase(getMyContacts.fulfilled, (state, action) => {
        state.user.getMyContacts.status = 'idle';
        state.user.getMyContacts.contactsList = action.payload.contacts;
        state.user.getMyContacts.ownedChannel = action.payload.ownedChannel;
        state.user.getMyContacts.followedChannel = action.payload.followedChannel;
        state.user.getMyContacts.time=Date.now();
      })
      .addCase(getMyContacts.rejected, (state, action) => {
        state.user.getMyContacts.status = 'rejected';
        state.user.getMyContacts.error = action?.error;
      });
    builder
      .addCase(createChannel.pending, (state) => {
        state.user.createChannel.status = 'loading';
        state.user.createChannel.error = '';
      })
      .addCase(createChannel.fulfilled, (state, action) => {
        if (action.payload.statusCode === 0){
        state.user.createChannel.status = 'idle';
      }else{
          state.user.createChannel.status = 'rejected';
          state.user.createChannel.error = action.payload.errorMessage;
        }
      })
      .addCase(createChannel.rejected, (state, action) => {
        state.user.createChannel.status = 'rejected';
        state.user.createChannel.error = action?.error;
      });
    builder
      .addCase(joinToPublicChannel.pending, (state,action) => {
        state.user.joinToPublicChannel.channelList[action.meta.arg.channelId] = {...state.user.joinToPublicChannel.channelList[action.meta.arg.channelId],"status":'loading',"error":""};
      })
      .addCase(joinToPublicChannel.fulfilled, (state, action) => {
        if (action.payload.statusCode === 0){
          state.user.joinToPublicChannel.channelList[action.meta.arg.channelId] = {...state.user.joinToPublicChannel.channelList[action.meta.arg.channelId],"status":'idle',"error":""};
        }else{
        state.user.joinToPublicChannel.channelList[action.meta.arg.channelId] = {...state.user.joinToPublicChannel.channelList[action.meta.arg.channelId],"status":'rejected',"error":action.payload.errorMessage};
        }
      })
      .addCase(joinToPublicChannel.rejected, (state, action) => {
        state.user.joinToPublicChannel.channelList[action.meta.arg.channelId] = {...state.user.joinToPublicChannel.channelList[action.meta.arg.channelId],"status":'rejected',"error":action.error};
      });
    builder
      .addCase(joinToPrivateChannel.pending, (state,action) => {
        state.user.joinToPrivateChannel.channelList[action.meta.arg.channelId] = {...state.user.joinToPrivateChannel.channelList[action.meta.arg.channelId],"status":'loading',"error":""};
      })
      .addCase(joinToPrivateChannel.fulfilled, (state, action) => {
        if (action.payload.statusCode === 0){
          state.user.joinToPrivateChannel.channelList[action.meta.arg.channelId] = {...state.user.joinToPrivateChannel.channelList[action.meta.arg.channelId],"status":'idle',"error":""};
        }else{
        state.user.joinToPrivateChannel.channelList[action.meta.arg.channelId] = {...state.user.joinToPrivateChannel.channelList[action.meta.arg.channelId],"status":'rejected',"error":action.payload.errorMessage};
      }
    })
    .addCase(joinToPrivateChannel.rejected, (state, action) => {
        state.user.joinToPrivateChannel.channelList[action.meta.arg.channelId] = {...state.user.joinToPrivateChannel.channelList[action.meta.arg.channelId],"status":'rejected',"error":action.error};
      });
    builder
      .addCase(getChat.pending, (state, action) => {
        state.user.getChat.messageList[action.meta.arg.contactAddress] = { ...state.user.getChat.messageList[action.meta.arg.contactAddress], status: "loading", error: "" };
      })
      .addCase(getChat.fulfilled, (state, action) => {
        state.user.getChat.messageList[action.meta.arg.contactAddress] = { ...{}, "messages": action.payload?.messages, status: "idle","time":Date.now(), error: "" };
        if (action.payload?.messages) {
          var sendMessageList = current(state).user.sendMessage.sendList[action.meta.arg.contactAddress];
          var tempList = { ...sendMessageList };
          var messges = [...action.payload?.messages]
          if (sendMessageList) {
            var sendmessagUuIds = Object.keys(sendMessageList);
            for (let uuid of sendmessagUuIds) {
              let finded = messges.find(item => uuid === item.messageId);
              if (finded) {
                delete tempList[uuid];
              }
            }
            state.user.sendMessage.sendList[action.meta.arg.contactAddress] = { ...tempList };
          }
        }
      })
      .addCase(getChat.rejected, (state, action) => {
        state.user.getChat.messageList[action.meta.arg.contactAddress] = { ...{}, status: "rejected", error: action?.error };
      });
    builder
      .addCase(getChannelChat.pending, (state, action) => {
        state.user.getChannelChat.messageList[action.meta.arg.channelId] = { ...state.user.getChannelChat.messageList[action.meta.arg.channelId], status: "loading", error: "" };
      })
      .addCase(getChannelChat.fulfilled, (state, action) => {
        state.user.getChannelChat.messageList[action.meta.arg.channelId] = { ...{}, "messages": action.payload, status: "idle","time":Date.now(), error: "" };
        if (action.payload) {
          var sendMessageList = current(state).user.sendChannelMessage.sendList[action.meta.arg.channelId];
          var tempList = { ...sendMessageList };
          var messges = [...action.payload]
          if (sendMessageList) {
            var sendmessagTimes = Object.keys(sendMessageList);
            for (let timsMessage of sendmessagTimes) {
              let finded = messges.find(item => Number(item.timestamp) === Number(timsMessage));
              if (finded) {
                delete tempList[timsMessage];
              }
            }
            state.user.sendChannelMessage.sendList[action.meta.arg.channelId] = { ...tempList };
          }
        }
      })
      .addCase(getChannelChat.rejected, (state, action) => {
        state.user.getChannelChat.messageList[action.meta.arg.channelId] = { ...{}, status: "rejected", error: action?.error };
      });
    builder
      .addCase(sendMessage.pending, (state, action) => {
        state.user.sendMessage.sendList[action.meta.arg.contactAddress] = { ...state.user.sendMessage.sendList[action.meta.arg.contactAddress], [action.meta.arg.uuid]: { ...action.meta.arg, "status": "loading","error":"" } };
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        if (action.payload.statusCode === 0){
        state.user.sendMessage.sendList[action.meta.arg.contactAddress] = { ...state.user.sendMessage.sendList[action.meta.arg.contactAddress], [action.meta.arg.uuid]: { ...action.meta.arg,"status": "idle" } };
      }else{
          state.user.sendMessage.sendList[action.meta.arg.contactAddress] = { ...state.user.sendMessage.sendList[action.meta.arg.contactAddress], [action.meta.arg.uuid]: { ...action.meta.arg,"status": "rejected","error":action.payload.errorMessage } };
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.user.sendMessage.sendList[action.meta.arg.contactAddress] = { ...state.user.sendMessage.sendList[action.meta.arg.contactAddress], [action.meta.arg.uuid]: { ...action.meta.arg,"status": "rejected","error":action.error } };
      });
    builder
      .addCase(sendChannelMessage.pending, (state, action) => {
        state.user.sendChannelMessage.sendList[action.meta.arg.channel] = { ...state.user.sendChannelMessage.sendList[action.meta.arg.channel], [action.meta.arg.timestamp]: { ...action.meta.arg,"status": "loading","error":"" } };
      })
      .addCase(sendChannelMessage.fulfilled, (state, action) => {
        if (action.payload.statusCode === 0){
        state.user.sendChannelMessage.sendList[action.meta.arg.channel] = { ...state.user.sendChannelMessage.sendList[action.meta.arg.channel], [action.meta.arg.timestamp]: { ...action.meta.arg,"status": "idle" } };
      }else{
          state.user.sendChannelMessage.sendList[action.meta.arg.channel] = { ...state.user.sendChannelMessage.sendList[action.meta.arg.channel], [action.meta.arg.timestamp]: { ...action.meta.arg,"status": "rejected","error":action.payload.errorMessage } };
        }
      })
      .addCase(sendChannelMessage.rejected, (state, action) => {
        state.user.sendChannelMessage.sendList[action.meta.arg.channel] = { ...state.user.sendChannelMessage.sendList[action.meta.arg.channel], [action.meta.arg.timestamp]: { ...action.meta.arg,"status": "rejected","error":action.error } };
      });
  },
});

export const { setWalletUser, setAddressToGetMessage, resetState, removeFromSenList,removeFromChannelSenList, setChannelToGetMessage } = serviceSlice.actions;

export const selectService = (state) => state.service;

export const initProfileAndSetName = (name) => async (dispatch, getState) => {
  var hasProfile = selectService(getState()).user.profile.address;
  if (!hasProfile) {
    await dispatch(initProfile());
    var initStatus = selectService(getState()).user.initProfile.status;
    if (initStatus === "idle") {
      await dispatch(setProfileName(name));
    };
  } else {
    await dispatch(setProfileName(name));
  }
  var setNameStatus = selectService(getState()).user.setProfileName.status;
  var address = selectService(getState()).user.wallet.addr;
  if (setNameStatus === "idle") {
    dispatch(getProfile({ address: address, isUserAddress: true }));
  };
};
export const initProfileAndSetAvatar = (avatar) => async (dispatch, getState) => {
  var hasProfile = selectService(getState()).user.profile.address;
  if (!hasProfile) {
    await dispatch(initProfile());
    var initStatus = selectService(getState()).user.initProfile.status;
    if (initStatus === "idle") {
      await dispatch(setProfileAvatar(avatar));
    };
  } else {
    await dispatch(setProfileAvatar(avatar));
  }
  var setAvatarStatus = selectService(getState()).user.setProfileAvatar.status;
  var address = selectService(getState()).user.wallet.addr;
  if (setAvatarStatus === "idle") {
    dispatch(getProfile({ address: address, isUserAddress: true }));
  };
};
export const initProfileAndSetInfo = (info) => async (dispatch, getState) => {
  var hasProfile = selectService(getState()).user.profile.address;
  if (!hasProfile) {
    await dispatch(initProfile());
    var initStatus = selectService(getState()).user.initProfile.status;
    if (initStatus === "idle") {
      await dispatch(setProfileInfo(info));
    };
  } else {
    await dispatch(setProfileInfo(info));
  }
  var setInfoStatus = selectService(getState()).user.setProfileInfo.status;
  var address = selectService(getState()).user.wallet.addr;
  if (setInfoStatus === "idle") {
    dispatch(getProfile({ address: address, isUserAddress: true }));
  };
};
export const initProfileAndSetColor = (color) => async (dispatch, getState) => {
  var hasProfile = selectService(getState()).user.profile.address;
  if (!hasProfile) {
    await dispatch(initProfile());
    var initStatus = selectService(getState()).user.initProfile.status;
    if (initStatus === "idle") {
      await dispatch(setProfileColor(color));
    };
  } else {
    await dispatch(setProfileColor(color));
  }
  var setColorStatus = selectService(getState()).user.setProfileColor.status;
  var address = selectService(getState()).user.wallet.addr;
  if (setColorStatus === "idle") {
    dispatch(getProfile({ address: address, isUserAddress: true }));
  };
};
export const getFullContacs = (userAddress) => async (dispatch, getState) => {

  await dispatch(getMyContacts(userAddress));
  var myContacts = selectService(getState()).user.getMyContacts.contactsList;
  var myOwnedChannel = selectService(getState()).user.getMyContacts.ownedChannel;
  var myFollowedChannel = selectService(getState()).user.getMyContacts.followedChannel;

  let sortedContacs = [];
  if (myContacts) {
    for (var contactAddress in myContacts) {
      sortedContacs.push({ address: contactAddress, timeStamp: myContacts[contactAddress] });
    }
    sortedContacs.sort((a, b) => (a.timeStamp < b.timeStamp) ? 1 : ((b.timeStamp < a.timeStamp) ? -1 : 0));
    for (let i = 0; i < sortedContacs.length; i++) {
      await dispatch(getProfile({ address: sortedContacs[i].address, isUserAddress: false, timeStamp: sortedContacs[i].timeStamp }))
    }
  }
  var mixChanels = [...myOwnedChannel, ...myFollowedChannel]
  for (let channel in mixChanels) {
    await dispatch(getChannelInfo({ chanelId: mixChanels[channel] }));
  }
};

export default serviceSlice.reducer;
