import ChanelView from './ChanelView'
import ChatView from './ChatView.js'

function MessageWindow({ showWindow, setShowWindow }) {
    console.log("message window")
    return (
        <>
            {showWindow === "ChanelView" && <ChanelView setShowWindow={setShowWindow} />}
            {(showWindow === "ChatView"|| showWindow === "inbox")&&<ChatView setShowWindow={setShowWindow} />}
        </>
    )
}
export default MessageWindow