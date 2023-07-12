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
      contactsList: {}
    },
    getChat: {
      messageList: {}
    },
    sendMessage: {
      sendList: {}
    }
  },
  getProfile: {},
  setAddressToGetMessage: {},

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
    return transactionId
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
      import MessangerTest from 0xmessanger
      pub fun main(adres:Address): Messanger.Person?{
        return Messanger.getPerson(address:adres)
      }`,
      args: (arg, t) => [arg(address, t.Address)],
    });
    return list;
  }
);
export const getChat = createAsyncThunk(
  'getChat/Service',
  async ({userAddress,contactAddress}) => {
    const chatList = await fcl.query({
      cadence: `
      import MessangerTest from 0xmessanger
      transaction(ChatID: String,Side2: Address): Messanger.Chat {
        prepare(account: AuthAccount){
        return Messanger.getChatpublic(chatID: ChatID, account: account, side2: Side2)
        }
      }`,
      // cadence: `
      // import MessangerTest from 0xmessanger
      // pub fun main(ChatID: String,Side2: Address): Messanger.Chat {
      //   prepare(account: AuthAccount){
      //   return Messanger.getChatpublic(chatID: ChatID, account: account, side2: Side2)
      //   }
      // }`,
      args: (arg, t) => [
        arg(`${userAddress+contactAddress}`, t.String),
        arg(`${contactAddress}`, t.String)
    ],
    })
    return chatList;
  }
);
// [109, 111,104, 115, 101, 110]
export const sendMessage = createAsyncThunk(
  'sendMessage/Service',
  async ({uuid,userAddress,contactAddress,message,timestamp}) => {
    const transactionId = await fcl.mutate({
      cadence: `
      import MessangerTest from 0xmessanger

      transaction(TransactionId: String,Sender:Address,Receiver: Address, Message: String,Signature:String) {
      
        prepare(account: AuthAccount) { 
          let time: UFix64 = getCurrentBlock().timestamp
          let hexSign: [UInt8] = Signature.decodeHex()
          let hexData: [UInt8] = [39,109,111,104,115,101,110,39]
          let x: HashAlgorithm = HashAlgorithm.SHA3_256
          MessangerTest.sendMessage(transactionId:TransactionId,sender:Sender, receiver:Receiver, message:Message, timestamp:time,signature:hexSign,signedData:hexData ,hashAlgorithm:HashAlgorithm.SHA3_256)
        }
      }
      `,      args:(arg,t) => [
        arg(uuid,t.String),
        arg(userAddress,t.Address),
        arg(contactAddress,t.Address),
        arg(message,t.String),
        // arg(timestamp,t.UInt64),
        arg("da2a3235f71661636d79b3a437f8f33c4fdc141b1ba8d8e7cc15303a4b83aa44c22fe116bd6e9462376cd209e91f86e32d8688186d57eeed35c817c3ce4bb513",t.String),
        // arg("e9c2549205cdc2f7",t.String),
        // arg(1,t.Int)
      ],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 100});
    return transactionId;
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
    resetState: (state, action) => { return (initialState) },
    removeFromSenList:(state, action)=>{
      var tempList = {...state.user.sendMessage.sendList[action.payload.contactAddress]};
      delete tempList[action.payload.uuid];
      state.user.sendMessage.sendList[action.payload.contactAddress] = tempList;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state, action) => {
        if (action.meta.arg.isUserAddress) {
          state.user.profile = { ...state.user.profile, status: 'loading' };
        } else {
          state.getProfile[action.meta.arg.address] = { ...state.getProfile[action.meta.arg.address], status: 'loading' };
        }
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        if (action.meta.arg.isUserAddress) {
          state.user.profile = { ...action.payload, status: "idle" };
        } else {
          state.getProfile[action.meta.arg.address] = { ...action.payload, status: "idle" };
        }
      })
      .addCase(getProfile.rejected, (state, action) => {
        if (action.meta.arg.isUserAddress) {
          state.user.profile = { ...state.user.profile, status: 'rejected' };
        } else {
          state.getProfile[action.meta.arg.address] = { ...state.getProfile[action.meta.arg.address], status: 'rejected' };
        }
      });
    builder
      .addCase(initProfile.pending, (state) => {
        state.user.initProfile.status = 'loading';
        state.user.initProfile.error = '';
      })
      .addCase(initProfile.fulfilled, (state) => {
        state.user.initProfile.status = 'idle';
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
      .addCase(setProfileName.fulfilled, (state) => {
        state.user.setProfileName.status = 'idle';
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
      .addCase(setProfileAvatar.fulfilled, (state) => {
        state.user.setProfileAvatar.status = 'idle';
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
      .addCase(setProfileInfo.fulfilled, (state) => {
        state.user.setProfileInfo.status = 'idle';
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
      .addCase(setProfileColor.fulfilled, (state) => {
        state.user.setProfileColor.status = 'idle';
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
      })
      .addCase(getMyContacts.rejected, (state, action) => {
        state.user.getMyContacts.status = 'rejected';
        state.user.getMyContacts.error = action?.error;
      });
    builder
      .addCase(getChat.pending, (state,action) => {
        state.user.getChat.messageList[action.meta.arg.contactAddress]={...state.user.getChat.messageList[action.meta.arg.contactAddress],status:"loading",error:""};
      })
      .addCase(getChat.fulfilled, (state, action) => {
        state.user.getChat.messageList[action.meta.arg.contactAddress] ={...{},"messages":action.payload.messages,status:"idle",error:""};
        var sendMessageList =current(state).user.sendMessage.sendList[action.meta.arg.contactAddress];
        var tempList = {...sendMessageList};
        var messges = [...action.payload.messages]
        if (sendMessageList){
          var sendmessagUuIds = Object.keys(sendMessageList);
          for (let uuid of sendmessagUuIds){
            let timestamp = sendMessageList[uuid].timestamp;
            let finded = messges.find(item=>item.timestamp === timestamp);
            if (finded){
              delete tempList[uuid];
            }
          } 
          state.user.sendMessage.sendList[action.meta.arg.contactAddress]= {...tempList};
          console.log("sendMessageList")
          console.log(sendMessageList)
        }
      })
      .addCase(getChat.rejected, (state, action) => {
        state.user.getChat.messageList[action.meta.arg.contactAddress] ={...{},status:"rejected",error:action?.error};
      });
    builder
      .addCase(sendMessage.pending, (state,action) => {
        state.user.sendMessage.sendList[action.meta.arg.contactAddress]={...state.user.sendMessage.sendList[action.meta.arg.contactAddress],[action.meta.arg.uuid]:{...action.meta.arg,"txId":action.payload,"status":"loading"}};
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.user.sendMessage.sendList[action.meta.arg.contactAddress]={...state.user.sendMessage.sendList[action.meta.arg.contactAddress],[action.meta.arg.uuid]:{...action.meta.arg,"txId":action.payload,"status":"idle"}};
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.user.sendMessage.sendList[action.meta.arg.contactAddress]={...state.user.sendMessage.sendList[action.meta.arg.contactAddress],[action.meta.arg.uuid]:{...action.meta.arg,"txId":action.payload,"status":"rejected"}};
      });
  },
});

export const { setWalletUser, setAddressToGetMessage, resetState ,removeFromSenList} = serviceSlice.actions;

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
  myContacts = { ...myContacts, "0x04448ca29cf753bc": "1672531200000", "0xe9c2549205cdc2f7": "1688837179055", "0xe9c2549205cdc2f6": "1688837179033" }
  let sortedContacs = [];
  if (myContacts) {
    for (var contactAddress in myContacts) {
      sortedContacs.push({ address: contactAddress, timeStamp: myContacts[contactAddress] });
    }
    sortedContacs.sort((a, b) => (a.timeStamp < b.timeStamp) ? 1 : ((b.timeStamp < a.timeStamp) ? -1 : 0));
    // console.log(sortedContacs)
    for (let i = 0; i < sortedContacs.length; i++) {
      await dispatch(getProfile({ address: sortedContacs[i].address, isUserAddress: false, timeStamp: sortedContacs[i].timeStamp }))
    }
  }
};

export default serviceSlice.reducer;
