import React, { useEffect, useState } from 'react';
import './App.css';
import InBox from './features/InBox/InBox'
import MessageWindow from './features/MessageWindow/MessageWindow';
import Sidebar from './features/Sidebar/Sidbar';
import "./flow/config";
import * as fcl from "@onflow/fcl";
import { useDispatch } from 'react-redux';
import { setWalletUser } from './features/service/serviceSlice';

function App() {
  const [showWindow, setShowWindow] = useState('inbox');
  const [showSidebar, setShowSidebar] = useState(false);
  const [user, setUser] = useState({ loggedIn: null });
  const dispatch = useDispatch();
  useEffect(() => {
    try {
      fcl.currentUser.subscribe(setUser);
    } catch (error) {
      console.log(error)
    }
    window.scrollTo(0, document.body.scrollHeight);
  }, []);
  useEffect(() => {
    if (user) {
      dispatch(setWalletUser(user));
    };
  }, [user, dispatch]);
  const test = {type:"file",message:"negar"};
  const testString = JSON.stringify(test);
  return (
    <div className='App'>
      <Sidebar setShowWindow={setShowWindow} setShowSidebar={setShowSidebar} showSidebar={showSidebar} />
      <div className={showWindow === 'inbox' ? 'InBox' : 'InBox d-none d-sm-block'}>
        <InBox setShowWindow={setShowWindow} setShowSidebar={setShowSidebar} />
      </div>
      <div className={showWindow === 'inbox' ? 'MessageWindow d-none d-sm-block' : 'MessageWindow'} >
        <MessageWindow setShowWindow={setShowWindow} showWindow={showWindow}/>
      </div>
    </div>
  );
}

export default App;
