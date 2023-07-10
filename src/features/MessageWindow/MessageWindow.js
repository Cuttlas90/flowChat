import styles from './MessageWindow.module.css'
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getChat, selectService, sendMessage } from '../service/serviceSlice';
import LoginGif from '../LoginGif/LoginGif';
import { handelTimeShow } from '../functions/handelTimeShow';
import { v4 as uuidv4 } from 'uuid';

function MessageWindow({ setShowWindow }) {
    const [searchActivInput, setSearchActivInput] = useState(false);
    const contactInfo = useSelector(selectService).setAddressToGetMessage;
    const userInfo = useSelector(selectService).user;
    const userContacts = useSelector(selectService).user.getMyContacts.contactsList;
    const getChatAPI = useSelector(selectService).user.getChat.messageList;
    const sendMessageAPI = useSelector(selectService).user.sendMessage.sendList;
    const [messages, setMessages] = useState({});
    const dispatch = useDispatch();
    const [inputSearch, setInputSearch] = useState("");
    const messageDiv = useRef();
    const [textMessage, setTextMessage] = useState("");
    useEffect(() => {
        setSearchActivInput(false);
        setInputSearch("");
    }, [contactInfo]);
    useEffect(() => {
        if (contactInfo.address) {
            dispatch(getChat({ userAddress: userInfo.wallet.addr, contactAddress: contactInfo.address }));
        }
    }, [contactInfo.address, userInfo.wallet.addr, dispatch]);
    useEffect(() => {
        setMessages(getChatAPI[contactInfo.address]);
    }, [contactInfo.address, messages, getChatAPI]);
    const handelSearch = (textSearch) => {
        setInputSearch(textSearch);
        var mesage, txtValue;
        var filter = textSearch.toUpperCase();
        var items = messageDiv.current.children;
        console.log(items)
        for (let i = 0; i < items.length; i++) {
            mesage = items[i].getElementsByClassName("Mesage")[0];
            if (mesage) {
                txtValue = mesage.textContent || mesage.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    items[i].style.display = "";
                } else {
                    items[i].style.display = "none";
                }
            }
        }
    }
    const handelSendMessage = (message, type, UUID) => {
        if (message) {
            dispatch(sendMessage(
                {
                    uuid: type === "new" ? uuidv4() : UUID,
                    userAddress: userInfo.wallet.addr,
                    contactAddress: contactInfo.address,
                    message: message
                }
            ))
        }
    }
    console.log(sendMessageAPI)
    return (
        <div className={styles.MessageWindowContainer}>
            <div className={styles.header}>
                <div className="d-flex align-items-center  w-100">
                    <div className="d-flex align-items-center d-sm-none">
                        <i onClick={() => setShowWindow('inbox')} className="bi bi-arrow-left fs-4 me-3" role="button"></i>
                        {!searchActivInput &&
                            <div style={{ backgroundColor: contactInfo.profile?.color, borderRadius: "50%" }}>
                                <img src={contactInfo.profile?.avatar || "./img/avatar.png"} className={styles.contactImg} alt="" />
                            </div>
                        }
                    </div>
                    {!searchActivInput && <div className={styles.contentDetail}>
                        <h6 className={styles.contactName}>{contactInfo.profile?.name}</h6>
                        <span className={styles.address}>{contactInfo.address?.substring(0, 25)}</span>
                    </div>}
                    {searchActivInput &&
                        <div className=' px-3 flex-grow-1 flex-shrink-1'>
                            <input onChange={(e) => handelSearch(e.target.value)} value={inputSearch} className={styles.inputSearch} type='text' placeholder='Sarch in Chat...' />
                        </div>}
                </div>
                <div className="d-flex align-items-center" role="button">
                    <i onClick={() => { setSearchActivInput(!searchActivInput); setInputSearch("") }} className={searchActivInput ? "bi bi-x-lg fs-4 me-3 p-2 text-hover" : "bi bi-search fs-4 me-3 p-2 text-hover"}></i>
                </div>
            </div>
            <div ref={messageDiv} className={styles.main}>
                {(userInfo.wallet.addr && contactInfo.address)
                    ? (messages?.messages?.length > 0)
                        ? messages.messages.map((row, index) =>
                            <div key={index} className='pb-3'>
                                <div style={{ fontSize: "14px" }} className='d-flex justify-content-center text-secondary'>{handelTimeShow(row.timestamp)}</div>
                                <div className={row.sender === userInfo.wallet.addr ? styles.messageOut : styles.messageIn}>
                                    <div style={{ backgroundColor: row.sender === userInfo.wallet.addr ? userInfo.profile?.color : contactInfo.profile?.color, borderRadius: "50%", padding: "1px" }}>
                                        <img src={row.sender === userInfo.wallet.addr ? userInfo.profile?.avatar : contactInfo.profile?.avatar || "./img/avatar.png"} className={styles.contactImg} alt="" />
                                    </div>
                                    <div className='flex-grow-1 flex-shrink-1'>
                                        <span className={row.sender === userInfo.wallet.addr ? 'd-flex justify-content-end Mesage' : 'd-flex justify-content-start Mesage'}>{row.message}</span>
                                    </div>
                                </div>
                            </div>
                        )
                        : <>
                            {messages?.status === "rejected" && <div className='w-100 h-100 d-flex align-items-center justify-content-center text-danger'> <i className="fs-3 me-2 bi bi-exclamation-diamond"></i>!Geting Message has error</div>}
                            {messages?.messages?.length <= 0 && <div className='w-100 h-100 d-flex align-items-center justify-content-center text-success'>No Message</div>}
                        </>

                    : <LoginGif section={!userInfo.wallet.addr ? "connectWallet" : (Object.keys(userContacts).length) ? "selectChat" : "creatNewChat"} />}
            </div>
            {sendMessageAPI[contactInfo.address]
                && Object.keys(sendMessageAPI[contactInfo.address])?.map((row, index) =>
                    <div key={index} className='pb-3'>
                        <div className={styles.messageOut}>
                            <div style={{ backgroundColor: userInfo.profile?.color, borderRadius: "50%", padding: "1px" }}>
                                <img src={userInfo.profile?.avatar || "./img/avatar.png"} className={styles.contactImg} alt="" />
                            </div>
                            <div className='flex-grow-1 flex-shrink-1'>
                                <span className='d-flex justify-content-end Mesage'>{sendMessageAPI[contactInfo.address][row].message}</span>
                                {sendMessageAPI[contactInfo.address][row].status === "loading" && <span className={styles.loading}>loading...</span>}
                                {sendMessageAPI[contactInfo.address][row].status === "idle" && <span className={styles.idle}>idle</span>}
                                {sendMessageAPI[contactInfo.address][row].status === "rejected" && <span className={styles.rejected}>rejected</span>}
                            </div>
                        </div>
                    </div>
                )}
            {messages?.status === "loading"
                &&
                <div className='text-success'>
                    <div className="spinner-grow spinner-grow-sm mx-2 " role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    Updating messages...
                </div>
            }
            <div className={styles.footer}>
                <div className='text-hover'><i className="bi bi-paperclip fs-3" role='button'></i></div>
                <div className='flex-grow-1 flex-shrink-1'>
                    <input disabled={contactInfo.address ? false : true} value={textMessage[contactInfo?.address] || ""} onChange={(e) => setTextMessage((prev) => ({ ...prev, [`${contactInfo?.address}`]: e.target.value }))} tabIndex={0} className={styles.inputMessage} placeholder='write a message ...' />
                </div>
                <div onClick={() => contactInfo.address && handelSendMessage(textMessage[[contactInfo?.address]], "new")} className='text-hover'><i className="bi bi-send me-2 fs-3" role='button'></i></div>
                <div className='text-hover'><i className="bi bi-mic fs-3" role='button'></i></div>
            </div>
        </div >
    )
}
export default MessageWindow