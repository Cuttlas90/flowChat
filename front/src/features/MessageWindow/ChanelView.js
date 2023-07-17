import styles from './MessageWindow.module.css'
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectService, sendChannelMessage, removeFromChannelSenList, getChannelChat, joinToPublicChannel, getFullContacs, joinToPrivateChannel } from '../service/serviceSlice';
import { handelTimeShow } from '../functions/handelTimeShow';
import HandelTransAction from './HandelTransAction';
import HandelMessage from './HandelMessage';
import VoiceMessages from '../VoiceMessages/VoiceMessages';
import FileMessages from '../FileMessages/FileMessages';


function ChanelView({ setShowWindow }) {
    const [searchActivInput, setSearchActivInput] = useState(false);
    const channelInfo = useSelector(selectService).setChannelToGetMessage;
    const userInfo = useSelector(selectService).user;
    const getChatAPI = useSelector(selectService).user.getChannelChat.messageList;
    const sendMessageAPI = useSelector(selectService).user.sendChannelMessage.sendList;
    const [messages, setMessages] = useState({});
    const dispatch = useDispatch();
    const [inputSearch, setInputSearch] = useState("");
    const messageDiv = useRef();
    const [textMessage, setTextMessage] = useState("");
    const joinToPublicChannelAPI = useSelector(selectService).user.joinToPublicChannel;
    const joinToPrivateChannelAPI = useSelector(selectService).user.joinToPrivateChannel;
    const myFollowedChannels = useSelector(selectService).user.getMyContacts?.followedChannel;
    const [isRecordSection, setIsRecordSection] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [voiceMessage, setVoiceMessage] = useState("");
    const [showmodalFile,setShowmodalFile]=useState(false)
    const [inputFile,setInputFile]=useState(false);
    const [activeDrag, setActiveDrag] = useState("")
    const [timerEvent,setTimerEvent]=useState(null);
    const stopRef = useRef(null);


    useEffect(() => {
        setIsRecordSection(false);
        setIsRecording(false);
        setVoiceMessage("")
    }, [channelInfo])
    useEffect(() => {
        if (joinToPublicChannelAPI.status === 'idle') {
            dispatch(getFullContacs(userInfo.wallet.addr));
        }
    }, [joinToPublicChannelAPI, dispatch, userInfo.wallet.addr]);
    useEffect(() => {
        if (joinToPrivateChannelAPI.status === 'idle') {
            dispatch(getFullContacs(userInfo.wallet.addr));
        }
    }, [joinToPrivateChannelAPI, dispatch, userInfo.wallet.addr]);

    useEffect(() => {
        setSearchActivInput(false);
        setInputSearch("");
    }, [channelInfo]);
    useEffect(() => {
        if (channelInfo.channel) {
            dispatch(getChannelChat({ userAddress: userInfo.wallet.addr, channelId: channelInfo.channel }));
        }
    }, [channelInfo.channel, userInfo.wallet.addr, dispatch]);
    useEffect(() => {
        setMessages(getChatAPI[channelInfo.channel]);
    }, [channelInfo.channel, messages, getChatAPI]);
    const handelSearch = (textSearch) => {
        setInputSearch(textSearch);
        var mesage, txtValue;
        var filter = textSearch.toUpperCase();
        var items = messageDiv.current.children;
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
    const handelSendChannelMessage = ({ message, type, timestamp, MSGtype }) => {
        if (message) {
            if (MSGtype === "text") {
                dispatch(sendChannelMessage(
                    {
                        channel: channelInfo.channel,
                        typeChannel: channelInfo.profilchanelInfo.channelType,
                        message: type === "new" ? JSON.stringify({ "type": MSGtype, "message": message }) : message,
                        timestamp: type === "new" ? Number.parseFloat(Math.ceil(new Date().getTime() / 1000)).toFixed(8) : timestamp,
                        sender: userInfo.wallet.addr,
                    }));
                setTextMessage((prev) => ({ ...prev, [`${channelInfo?.channel}`]: "" }))
            }
        };
        if (MSGtype === "voice") {
            dispatch(sendChannelMessage(
                {
                    channel: channelInfo.channel,
                    typeChannel: channelInfo.profilchanelInfo.channelType,
                    message: type === "new" ? JSON.stringify({ "type": MSGtype, "message": message }) : message,
                    timestamp: type === "new" ? Number.parseFloat(Math.ceil(new Date().getTime() / 1000)).toFixed(8) : timestamp,
                    sender: userInfo.wallet.addr,
                }));
            setVoiceMessage("");
            setIsRecordSection(false);
        };
        if (MSGtype === "file" || MSGtype === "image") {
            dispatch(sendChannelMessage(
                {
                    channel: channelInfo.channel,
                    typeChannel: channelInfo.profilchanelInfo.channelType,
                    message: type === "new" ? JSON.stringify({ "type": MSGtype, "message": message }) : message,
                    timestamp: type === "new" ? Number.parseFloat(Math.ceil(new Date().getTime() / 1000)).toFixed(8) : timestamp,
                    sender: userInfo.wallet.addr,
                }));
                setInputFile("");
        };
    }
    const handelDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log(e.type)
        switch (e.type) {
            case "dragenter":
                // setActiveDrag("activeDrag")
                break;
            case "dragover":
                setActiveDrag("activeDrag")
                break;
            case "dragleave":
                if (timerEvent) {
                    clearTimeout(timerEvent);
                }
            const timer = setTimeout(() => {
                setActiveDrag("")
            }, 1000);
            setTimerEvent(timer);
                break;
            case "drop":
                setActiveDrag("")
                setInputFile(e.dataTransfer.files)
                setShowmodalFile(true);
                break;
            default:
                break;
        }
    }
    return (
        <div onDragEnter={(e) => handelDrag(e)} onDragLeave={(e) => handelDrag(e)} onDragOver={(e) => handelDrag(e)} onDrop={(e) => handelDrag(e)} onDropCapture={(e) => handelDrag(e)}  className={`${styles.MessageWindowContainer} ${styles[activeDrag]}`}>
            <div className={styles.drapWindow}>
                <div className='d-flex align-items-center'>
                    <i className="bi bi-cloud-arrow-up fs-1 me-3"></i>
                    <span className='fs-2'>
                        Upload File...
                    </span>
                </div>
            </div>
            <div className={styles.header}>
                <div className="d-flex align-items-center  w-100">
                    <div className="d-flex align-items-center d-sm-none">
                        <i onClick={() => setShowWindow('inbox')} className="bi bi-arrow-left fs-4 me-3" role="button"></i>
                        {!searchActivInput &&
                            <div style={{ backgroundColor: "red", borderRadius: "50%" }}>
                                <img src={"./img/avatar.png"} className={styles.contactImg} alt="" />
                            </div>
                        }
                    </div>
                    {!searchActivInput && <div className={styles.contentDetail}>
                        <h6 className={styles.contactName}>{channelInfo.channel}</h6>
                    </div>}
                    {searchActivInput &&
                        <div className=' px-3 flex-grow-1 flex-shrink-1'>
                            <input onChange={(e) => handelSearch(e.target.value)} value={inputSearch} className={styles.inputSearch} type='text' placeholder='Sarch in Chat...' />
                        </div>}
                </div>
                <div className="d-flex align-items-center" role="button">
                </div>
                <div className="d-flex align-items-center">
                    <i onClick={() => { setSearchActivInput(!searchActivInput); setInputSearch("") }} className={searchActivInput ? "bi bi-x-lg fs-4 me-3 p-2 text-hover" : "bi bi-search fs-4 me-3 p-2 text-hover"}></i>
                    <div>
                        <div className='d-flex align-items-center' style={{ width: "70px" }} onClick={() => dispatch(getChannelChat({ userAddress: userInfo.wallet.addr, channelId: channelInfo.channel }))}>
                            <span className={messages.status === "rejected" ? "text-daanger" : "text-success"}>{messages?.time && handelTimeShow(messages?.time / 1000)}</span>
                            <i className={messages.status === "loading" ? `${styles.cyncSpinner} bi bi-arrow-repeat fs-4 px-2 text-hover ms-auto` : messages.status === "rejected" ? "bi bi-arrow-repeat fs-4 px-2 text-danger ms-auto" : "bi bi-arrow-repeat fs-4 px-2 text-hover ms-auto"}></i>
                        </div>
                        <div className={messages.status === "rejected" ? "text-daanger" : "text-success"} style={{ fontSize: "15px", marginTop: "-10px" }}>Last sync</div>
                    </div>
                </div>
            </div>
            <div ref={messageDiv} className={styles.main}>
                {userInfo.wallet.addr && channelInfo.channel && (myFollowedChannels.find(item => item === channelInfo.channel) || userInfo.wallet.addr?.toLowerCase() === channelInfo.profilchanelInfo.owner?.toLowerCase())
                    ? (messages?.messages?.length > 0)
                        ? messages.messages.map((row, index) =>
                            <div key={index} className='pb-3'>
                                <div style={{ fontSize: "14px" }} className='d-flex justify-content-center text-secondary'>{handelTimeShow(row.timestamp)}</div>
                                <div className={`${styles.messageOut} ms-0`}>
                                    <div className='flex-grow-1 flex-shrink-1'>
                                        <span className={'d-flex justify-content-start Mesage'}><HandelMessage MSG={row.message} /></span>
                                    </div>
                                </div>
                            </div>
                        )
                        : <>
                            {messages?.status === "rejected" && <div className='flex-grow-1 flex-shrink-1 d-flex align-items-center justify-content-center text-danger'> <i className="fs-3 me-2 bi bi-exclamation-diamond"></i>!Geting Message has error</div>}
                            {messages?.messages?.length <= 0 && <div className='flex-grow-1 flex-shrink-1 d-flex align-items-center justify-content-center text-success'>No Message</div>}
                        </>
                    : <div className='text-success flex-grow-1 flex-shrink-1 d-flex align-items-center justify-content-center'>Flow this Channel to view messages</div>
                }
                {sendMessageAPI[channelInfo.channel]
                    && Object.keys(sendMessageAPI[channelInfo.channel])?.map((row, index) =>
                        <div key={index} className='pb-3 position-relative' style={{ zIndex: "1" }}>
                            {sendMessageAPI[channelInfo.channel][row].status === "rejected"
                                &&
                                <i className="bi bi-x-circle fs-6 text-danger position-absolute" onClick={() => dispatch(removeFromChannelSenList({ channel: channelInfo.channel, timestamp: row }))} style={{ top: "-12px", left: "-12px" }} role='button'></i>
                            }
                            <div className={`${styles.messageOut} ms-0`}>
                                <div className={sendMessageAPI[channelInfo.channel][row].status === "rejected" ? `${styles.rejected} ${styles.status}` : styles.status}>
                                    <span className='d-flex justify-content-start Mesage'><HandelMessage MSG={sendMessageAPI[channelInfo.channel][row].message} /></span>
                                    <HandelTransAction
                                        userAddress={userInfo.wallet.addr}
                                        contactAddress={channelInfo.channel}
                                        actionFunc={handelSendChannelMessage}
                                        message={sendMessageAPI[channelInfo.channel][row].message}
                                        timestamp={sendMessageAPI[channelInfo.channel][row].timestamp}
                                        status={sendMessageAPI[channelInfo.channel][row].status}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
            </div>
            {messages?.status === "loading"
                &&
                <div className='text-success'>
                    <div className="spinner-grow spinner-grow-sm mx-2 " role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    Updating messages...
                </div>
            }
            {(userInfo.wallet.addr?.toLowerCase() === channelInfo.profilchanelInfo.owner?.toLowerCase())
                ? <>
                    {isRecordSection
                        ? <div className={styles.footer}>
                            <>
                                {isRecording
                                    ? <div className='text-danger'>
                                        <div className="spinner-grow spinner-grow-sm mx-2 " role="status">
                                            <span className="visually-hidden">Recording</span>
                                        </div>
                                    </div>
                                    : <div onClick={() => { setIsRecordSection(false); setVoiceMessage("") }} className='text-hover text-danger'><i className="bi bi-x-circle fs-3" role='button'></i></div>
                                }
                                <div className='flex-grow-1 flex-shrink-1 px-2'>
                                    <VoiceMessages stopRef={stopRef} mode={isRecording ? "recording" : "playMode"} setVoiceMessage={setVoiceMessage} />
                                </div>
                                {isRecording
                                    ? <div ref={stopRef} onClick={() => setIsRecording(false)} className='text-hover'><i className="bi bi-stop-circle-fill fs-3" role='button'></i></div>
                                    : <div onClick={() => channelInfo.channel && handelSendChannelMessage({ message: voiceMessage, type: "new", timestamp: "", MSGtype: "voice" })} className='text-hover'><i className="bi bi-send me-2 fs-3" role='button'></i></div>
                                }
                            </>
                        </div>
                        : <div className={styles.footer}>
                            <div className='text-hover position-relative' role='buttom'>
                            <input key={Math.random().toString(36)} className={styles.inputFile} type='file' onChange={(e)=>{setInputFile(e.target.files);setShowmodalFile(true)}}/>
                                <i className="bi bi-paperclip fs-3" role='button'></i>
                            </div>
                            <div className='flex-grow-1 flex-shrink-1'>
                                <input onKeyUp={(e) => e.key === "Enter" && handelSendChannelMessage({ message: textMessage[[channelInfo?.channel]], type: "new", timestamp: "", MSGtype: "text" })} disabled={channelInfo.channel ? false : true} value={textMessage[channelInfo?.channel] || ""} onChange={(e) => setTextMessage((prev) => ({ ...prev, [`${channelInfo?.channel}`]: e.target.value }))} tabIndex={0} className={styles.inputMessage} placeholder='write a message ...' />
                            </div>
                            <div onClick={() => channelInfo.channel && handelSendChannelMessage({ message: textMessage[[channelInfo?.channel]], type: "new", timestamp: "", MSGtype: "text" })} className='text-hover'><i className="bi bi-send me-2 fs-3" role='button'></i></div>
                            <div onClick={() => { setIsRecordSection(true); setIsRecording(true) }} className='text-hover'><i className="bi bi-mic fs-3" role='button'></i></div>
                        </div>}
                </>
                : myFollowedChannels.find(item => item === channelInfo.channel)
                    ? <div className={styles.footer}>
                        <div className='d-flex align-items-center justify-content-center w-100'>
                            <i className="bi bi-person-hearts fs-4 me-2 text-success"></i>
                            <span>{channelInfo.channel} has {channelInfo.profilchanelInfo.followers.length} member(s)</span>
                        </div>
                    </div>
                    : <div className={styles.footer}>
                        {channelInfo.profilchanelInfo.channelType
                            ? <div className='w-100'>
                                {(joinToPublicChannelAPI.channelList[channelInfo.channel]?.status === "" || joinToPublicChannelAPI.channelList[channelInfo.channel] === undefined) &&
                                    <button onClick={() => dispatch(joinToPublicChannel({ channelId: channelInfo.channel, sender: userInfo.wallet.addr }))} className='btn btn-outline-success d-block mx-auto'>
                                        <span>Join to {channelInfo.channel}</span>
                                    </button>
                                }
                                {joinToPublicChannelAPI.channelList[channelInfo.channel]?.status === "rejected" &&
                                    <button onClick={() => dispatch(joinToPublicChannel({ channelId: channelInfo.channel, sender: userInfo.wallet.addr }))} className='btn btn-outline-danger d-block mx-auto'>
                                        <span>Try again to join {channelInfo.channel}</span>
                                    </button>
                                }
                                {joinToPublicChannelAPI.channelList[channelInfo.channel]?.status === "loading" && <div className='text-success'>
                                    <div className="spinner-grow spinner-grow-sm mx-2 " role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    Joining to {channelInfo.channel}...
                                </div>}
                                {joinToPublicChannelAPI?.channelList[channelInfo.channel]?.status === "idle" && <span className='text-success'> You joind Successfuly!</span>}
                            </div>
                            : <button className='btn btn-outline-success d-block mx-auto' data-bs-toggle="modal" data-bs-target="#modalJoin">Join to {channelInfo.channel} </button>
                        }
                    </div>}
            <div className="modal fade" id="modalJoin"  >
                <div className="modal-dialog">
                    <div className={`${styles.modalContent} modal-content`}>
                        <div className="modal-header">
                            <h1 className="modal-title fs-5 text-light" id="staticBackdropLabel">Join to Paid Membership Channel</h1>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div style={{ fontSize: "14px", color: "var(--bs-gray-400)" }}>Channel Name: <span className='text-light' style={{ fontSize: "18px" }}>{channelInfo.profilchanelInfo.id}</span></div>
                            <div style={{ fontSize: "14px", color: "var(--bs-gray-400)" }}>Owner Addres: <span className='text-light' style={{ fontSize: "18px" }}>{channelInfo.profilchanelInfo?.owner}</span></div>
                            <div style={{ fontSize: "14px", color: "var(--bs-gray-400)" }}>Member count: <span className='text-light' style={{ fontSize: "18px" }}>{channelInfo.profilchanelInfo.followers.length || 0}</span></div>
                            <div style={{ fontSize: "14px", color: "var(--bs-gray-400)" }}>Subscribtion fee : <span className='text-light' style={{ fontSize: "18px" }}>{channelInfo.profilchanelInfo.subscribeFee} <small>flow</small></span></div>
                        </div>
                        <div className="modal-footer">
                            {(joinToPrivateChannelAPI.channelList[channelInfo.channel]?.status === "" || joinToPrivateChannelAPI.channelList[channelInfo.channel] === undefined) &&
                                <button onClick={() => dispatch(joinToPrivateChannel({ channelId: channelInfo.channel, amount: channelInfo.profilchanelInfo.subscribeFee }))} type="button" className="btn btn-success d-block mx-auto">Join To: {channelInfo.channel}</button>
                            }
                            {joinToPrivateChannelAPI.channelList[channelInfo.channel]?.status === "rejected" &&
                                <button onClick={() => dispatch(joinToPrivateChannel({ channelId: channelInfo.channel, amount: channelInfo.profilchanelInfo.subscribeFee }))} type="button" className="btn btn-danger d-block mx-auto">Try again to Join To: {channelInfo.channel}</button>
                            }
                            {joinToPrivateChannelAPI.channelList[channelInfo.channel]?.status === "loading" &&
                                <div className='text-success mx-auto'>
                                    <div className="spinner-grow spinner-grow-sm mx-2 " role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    Joining to {channelInfo.channel}...
                                </div>}
                            {joinToPrivateChannelAPI.channelList[channelInfo.channel]?.status === "idle" && <span className='text-success'> You joind Successfuly!</span>}
                        </div>
                    </div>
                </div>
            </div>
            {showmodalFile && <FileMessages  inputFile={inputFile} setShowmodalFile={setShowmodalFile} setInputFile={setInputFile} actionFunc={handelSendChannelMessage}/>}
        </div>
    )
}
export default ChanelView