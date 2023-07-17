import ChanelView from './ChanelView'
import ChatView from './ChatView.js'

function MessageWindow({ showWindow, setShowWindow }) {
    return (
        <>
            {showWindow === "ChanelView" && <ChanelView setShowWindow={setShowWindow} />}
            {(showWindow === "ChatView"|| showWindow === "inbox")&&<ChatView setShowWindow={setShowWindow} />}
        </>
    )
}
export default MessageWindow