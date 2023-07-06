import React, { useState } from 'react';
import './App.css';
import InBox from './features/InBox/InBox'
import MessageWindow from './features/MessageWindow/MessageWindow';
import Sidebar from './features/Sidebar/Sidbar';


function App() {
  const [showWindow,setShowWindow]=useState('inbox');
  const [showSidebar,setShowSidebar] = useState(false);
  return (
    <div className='App'>
      <Sidebar setShowSidebar={setShowSidebar} showSidebar = {showSidebar}/>
      <div className={showWindow === 'inbox'?'InBox':'InBox d-none d-sm-block'}>
        <InBox setShowWindow={setShowWindow} setShowSidebar={setShowSidebar}/>
      </div>
      <div className={showWindow==='inbox'? 'MessageWindow d-none d-sm-block' :'MessageWindow'} >
        <MessageWindow setShowWindow={setShowWindow}/>
      </div>
    </div>
  );
}

export default App;
