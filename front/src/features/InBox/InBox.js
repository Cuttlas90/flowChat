import { useEffect, useRef, useState } from 'react';
import styles from './InBox.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { createChannel, getChannelInfo, getFullContacs, getProfile, resetState, selectService, setAddressToGetMessage, setChannelToGetMessage } from '../service/serviceSlice';
import LoginGif from '../LoginGif/LoginGif';
import * as fcl from "@onflow/fcl";
import { handelTimeShow } from '../functions/handelTimeShow';

function InBox({ setShowWindow, setShowSidebar }) {
    const dispatch = useDispatch();
    const userAddress = useSelector(selectService).user.wallet.addr;
    const contactListAPI = useSelector(selectService).getProfile
    const getMyContactsAPI = useSelector(selectService).user.getMyContacts
    const [contactList, setContactList] = useState([]);
    const [showSearch, setShowSearch] = useState(false)
    const [inputSearch, setInputSearch] = useState("")
    const contactDiv = useRef();
    const [activeRow, setActiveRow] = useState("");
    const [modalSection, setModalSection] = useState("");
    const [newChanel, setNewChanel] = useState("");
    const [searchChanel, setSearchChanel] = useState("");
    const createChannelAPI = useSelector(selectService).user.createChannel;
    const [patternError, setPatternError] = useState("");
    const [channelType, setChannelType] = useState(false);
    const [chanelFee, setChanelFee] = useState("");
    const myChanels = useSelector(selectService).getChannelInfo;
    const [callCreateChannel, SetCallCreateChannel] = useState(false);

    const handelClickContent = (addrs, profile, section) => {
        setShowWindow(section);
        setActiveRow(addrs);
        dispatch(setAddressToGetMessage({ address: addrs, profile: profile }))
    }
    const handelClickChanel = (chanel, profilchanelInfo, section) => {
        setShowWindow(section);
        setActiveRow(chanel);
        dispatch(setChannelToGetMessage({ channel: chanel, profilchanelInfo: profilchanelInfo }))
    }



    // console.log(crypto.randomBytes(32).toString('hex'))
    useEffect(() => {
        if (userAddress) {
            dispatch(getFullContacs(userAddress));
        }
    }, [userAddress, dispatch])

    useEffect(() => {
        setContactList(contactListAPI);
    }, [contactListAPI, contactList, setContactList])

    const [newAddress, setNewAddress] = useState();

    useEffect(() => {
        if (createChannelAPI.status === "idle") {
            dispatch(getFullContacs(userAddress));
        }
    }, [createChannelAPI, dispatch, userAddress]);

    const handelAddAddress = (section) => {
        if (section === "chat") {
            console.log()
            dispatch(getProfile({ address: newAddress, isUserAddress: false, timeStamp: Math.ceil(Number(Date.now())/1000) }));
            // handelClickContent(newAddress, "", "ChatView")
        }
        if (section === "search") {
            console.log(searchChanel)
            dispatch(getChannelInfo({ chanelId: searchChanel }));
        }
        if (section === "chanel") {
            if (newChanel !== "") {
                if (patternError === "ok") {
                    SetCallCreateChannel(true);
                    dispatch(createChannel({
                        uuid: newChanel,
                        userAddress: userAddress,
                        channelTyple: !channelType,
                        subscribeFee: !channelType ? "0.00000000" : Number.parseFloat(chanelFee).toFixed(8)
                    }))
                }
            }

        }

    }

    const handelSearch = (textSearch) => {
        setInputSearch(textSearch);
        var address, name, txtValue1, txtValue2;
        var filter = textSearch.toUpperCase();
        var items = contactDiv.current.children;
        console.log(items)
        for (let i = 0; i < items.length; i++) {
            address = items[i].getElementsByClassName("aForSearch")[0];
            name = items[i].getElementsByClassName("nForSearch")[0];
            console.log(address)
            if (address || name) {
                txtValue1 = address.textContent || address.innerText;
                txtValue2 = name.textContent || name.innerText;
                if (txtValue1.toUpperCase().indexOf(filter) > -1 || txtValue2.toUpperCase().indexOf(filter) > -1) {
                    items[i].style.display = "";
                } else {
                    items[i].style.display = "none";
                }
            }
        }
    }

    const handelLogOut = () => {
        setShowWindow("inbox")
        fcl.unauthenticate();
        localStorage.clear()
        dispatch(resetState())
    }


    // const runTest = async () => {
    //     console.log(`${168254125441}.0`)
    //     // var mess = hashMsg(`'mohsen'`)
    //     var mess = "mohsen"
    //     const MSG = Buffer.from(mess).toString("hex")
    //     console.log(MSG)
    //     var signetur;
    //     try {
    //         signetur = await fcl.currentUser.signUserMessage(MSG)
    //     } catch (error) {
    //         console.log(error)
    //     }

    //     console.log(signetur);

    // var test = Test()
    // }
    // const hashMsg = (msg) => {
    //     const sha = new SHA3(256);
    //     return sha.update(toBytesWithTag(msg)).digest();
    // };
    // const toBytesWithTag = (str) => {
    //     const tagBytes = Buffer.alloc(32);
    //     Buffer.from('FLOW-V0.0-user').copy(tagBytes);
    //     const strBytes = Buffer.from(str);
    //     return Buffer.concat([tagBytes, strBytes]);
    // }

    // const verify = async () => {
    //     console.log(window.user)
    //     var msg = "mohsen"
    //     var compSigs = "123"


    //     let compSig = compSigs.length > 0 ? compSigs[0] : null;

    //     if (window.user && compSig) {
    //         axios.post('/login', {
    //             message: msg,
    //             address: compSig.addr,
    //             signature: compSig.signature,
    //             keyId: compSig.keyId
    //         })
    //             .then(function (response) {
    //                 console.log(response);
    //                 //Here you can check the response from your back-end
    //             })
    //             .catch(function (error) {
    //                 console.log(error);
    //             });
    //     }
    // }

    const checkPattern = (str) => {
        if (str.length > 50) {
            setPatternError("only 50 character is valid")
            return
        }
        var onlyString = /[a-zA-Z]/;
        var allPattern = /[a-zA-Z0-9]/
        if (!allPattern.test(str)) {
            setPatternError("only a-z,A-Z and number is Valid")
            return
        }
        for (let i = 0; i < str.length; i++) {
            if (!onlyString.test(str[0])) {
                setPatternError("should first a-z and A-Z")
                return
            }
            if (!onlyString.test(str[i])) {
                setPatternError("should first a-z and A-Z")
                return
            }
        }
        return setPatternError("ok");
    }
    return (
        <div className={styles.inBoxContainer}>
            {/* <button onClick={() => runTest()}>test</button>
            <button onClick={() => verify()}>verify</button> */}
            <div className={styles.header}>
                <div className="d-flex align-items-center flex-grow-1 flex-shrink-1 flex-grow-1 text-hover ">
                    <i onClick={() => setShowSidebar(true)} className="bi bi-list fs-3 text-light " role="button"></i>
                    {showSearch
                        ? <div className=' px-3 flex-grow-1 flex-shrink-1 flex-grow-1'>
                            <input value={inputSearch} onChange={(e) => handelSearch(e.target.value)} className={styles.inputSearch} type='text' placeholder='Sarch Name or Address...' />
                        </div>
                        : <div className='d-flex align-items-center justify-content-between flex-grow-1 flex-shrink-1'>
                            <span className="ms-4 fs-5 text-light">Flow Chat</span>
                            <div style={{marginRight:"-10px"}}>
                                <div className='d-flex align-items-center text-light' role='button' style={{ width: "70px" }} onClick={() => dispatch(getFullContacs(userAddress))}>
                                    <span className={getMyContactsAPI?.status === "rejected" ? "text-daanger" : "text-success"}>{getMyContactsAPI?.time && handelTimeShow(getMyContactsAPI?.time / 1000)}</span>
                                    <i className={getMyContactsAPI?.status === "loading" ? `${styles.cyncSpinner} bi bi-arrow-repeat fs-4 px-2 text-hover ms-auto` : getMyContactsAPI?.status === "rejected" ? "bi bi-arrow-repeat fs-4 px-2 text-danger ms-auto" : "bi bi-arrow-repeat fs-4 px-2 text-hover ms-auto"}></i>
                                </div>
                                <div className={getMyContactsAPI?.status === "rejected" ? "text-daanger" : "text-success"} style={{ fontSize: "15px", marginTop: "-10px" }}>Last sync</div>
                            </div>
                        </div>
                    }
                </div>
                <div className="d-flex align-items-center text-hover">
                    <i className={showSearch ? "bi bi-x-lg fs-4 text-light  " : "bi bi-search fs-4 text-light ms-3"} role="button" onClick={() => { setShowSearch(!showSearch); handelSearch("") }}></i>
                    <i className="bi bi-power fs-4 text-light ms-3" role="button" onClick={() => handelLogOut()}></i>
                </div>
            </div>
            <div ref={contactDiv} className={styles.main}>
                {(userAddress && Object.keys(contactList).length)
                    && Object.keys(contactList).map((row, index) =>
                        <div key={index} onClick={() => handelClickContent(row, contactList[row], "ChatView")} className={activeRow === row ? `${styles.rowContent} ${styles.active}` : `${styles.rowContent}`} style={{ order: contactList[row].timeStamp ? (Math.floor(contactList[row].timeStamp) - 16725312) * -1 : 0 }} role="button">
                            <div style={{ backgroundColor: contactList[row].color, borderRadius: "50%" }}>
                                <img src={contactList[row].avatar || "./img/avatar.png"} className={styles.contactImg} alt="" />
                            </div>
                            <div className={styles.contentDetail}>
                                <h6 className={`${styles.contactName} nForSearch`}>{contactList[row].name?.substring(0, 15)}</h6>
                                <span className={`${styles.address} aForSearch`}>{row.substring(0, 24)}</span>
                            </div>
                            <div className={styles.time}>{handelTimeShow(contactList[row].timeStamp)}</div>
                        </div>)
                }
                {(myChanels && Object.keys(myChanels).length)
                    && Object.keys(myChanels).map((row, index) => myChanels[row].status === "idle" &&
                        <div key={index} onClick={() => handelClickChanel(row, myChanels[row], "ChanelView")} className={activeRow === row ? `${styles.rowContent} ${styles.active}` : `${styles.rowContent}`} style={{ order: myChanels[row].LastMessageTimeStamp ? (Math.floor(myChanels[row].LastMessageTimeStamp) - 16725312) * -1 : 0 }} role="button">
                            <div className='d-flex align-items-center justify-content-center' style={{ backgroundColor: "var(--bs-success)", width: "50px", height: "50px", borderRadius: "50%" }}>
                                <i className='bi bi-megaphone-fill fs-4 text-light'></i>
                            </div>
                            <div className={styles.contentDetail}>
                                <h6 className={`${styles.contactName} nForSearch`}>{row}</h6>
                                <span className={`${styles.address} aForSearch`}>{myChanels[row]?.owner?.substring(0, 24)}</span>
                            </div>
                            <div className={styles.time}>{handelTimeShow(myChanels[row]?.LastMessageTimeStamp)}</div>
                        </div>)
                }
                {(!Object.keys(contactList).length && !Object.keys(myChanels).length)
                    && <div className='d-block d-sm-none'>
                        <LoginGif section={!userAddress ? "connectWallet" : !Object.keys(contactList).length && "creatNewChat"} />
                    </div>}
            </div>
            {/* <button  className={`${styles.addNewContact} btn btn-success`}>
                <i className="bi bi-pencil-fill fs-5 text-light"></i>
            </button> */}

            <div className={styles.containerFloating}>
                <div onClick={() => { setModalSection("search"); setSearchChanel("") }} data-bs-toggle="modal" data-bs-target="#modalAddAddress" title='Search Chanel' className={`${styles.nd4} ${styles.nds}`}><img className={styles.reminder} alt='' />
                    <i className="bi bi-search fs-4 text-light" style={{ marginLeft: "8px" }}></i>
                </div>
                <div onClick={() => { setModalSection("chanel"); SetCallCreateChannel(false) }} data-bs-toggle="modal" data-bs-target="#modalAddAddress" title='Create Chanel' className={`${styles.nd3} ${styles.nds}`}>
                    <i className="bi bi-megaphone-fill fs-4 text-light" style={{ marginLeft: "8px" }}></i>
                    {/* <p className={styles.letter}>CH</p> */}
                </div>
                <div onClick={() => setModalSection("chat")} data-bs-toggle="modal" data-bs-target="#modalAddAddress" title='New chat' className={`${styles.nd1} ${styles.nds}`}>
                    <i className="bi bi-chat-dots-fill fs-3 text-light"></i>
                </div>
                <div className={styles.floatingButton}>
                    <p className={styles.plus}>+</p>
                    <i className={`${styles.edit} bi bi-pencil-fill fs-3 text-light`}></i>
                </div>
            </div>

            {/* modal add address */}
            <div className="modal fade" id="modalAddAddress"  >
                <div className="modal-dialog">
                    <div className={`${styles.modalContent} modal-content`}>
                        <div className="modal-header">
                            {modalSection === "chat" && <h1 className="modal-title fs-5 text-light" id="staticBackdropLabel">Add New Flow Addres</h1>}
                            {modalSection === "search" && <h1 className="modal-title fs-5 text-light" id="staticBackdropLabel">Search Chanel</h1>}
                            {modalSection === "chanel" && <h1 className="modal-title fs-5 text-light" id="staticBackdropLabel">Create Chanel</h1>}
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {modalSection === "chat" && <input value={newAddress ? newAddress : ""} onChange={(e) => setNewAddress(e.target.value)} className={styles.inputModal} type='text' placeholder='new address' />}
                            {modalSection === "search" &&
                                <div className='d-flex align-items-center'>
                                    <input style={{ maxWidth: "150px" }} value={searchChanel ? searchChanel : ""} onChange={(e) => setSearchChanel(e.target.value)} className={styles.inputModal} type='text' placeholder='Search id chanel' />
                                    <button onClick={() => handelAddAddress("search")} className='btn btn-outline-success p-0 m-0 border-0'><i className="bi bi-search fs-4 px-1 " style={{ marginLeft: "0" }}></i></button>
                                    {myChanels[searchChanel]?.status === "idle"
                                        && <button onClick={() => handelClickChanel(searchChanel, myChanels[searchChanel], "ChanelView")} data-bs-dismiss="modal" aria-label="Close" className='btn btn-outline-success ms-3 d-flex align-items-center'><i className="bi bi-eye-fill fs-4 px-1 " style={{ marginLeft: "0" }}></i> View Channel</button>
                                    }
                                    {myChanels[searchChanel]?.status === "rejected" && <span className='text-danger ms-3'>Channel {searchChanel} not find </span>}
                                    {myChanels[searchChanel]?.status === "loading"
                                        &&
                                        <div className='text-success'>
                                            <div className="spinner-grow spinner-grow-sm mx-2 " role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            Searching Chanel...
                                        </div>
                                    }
                                </div>
                            }
                            {modalSection === "chanel" &&
                                <div>
                                    <div className='d-flex py-2'>
                                        <label className='text-light'>Name:</label>
                                        <input value={newChanel ? newChanel : ""} onChange={(e) => { setNewChanel(e.target.value); checkPattern(e.target.value) }} className={styles.inputModal} type='text' placeholder='Name Of new Chanel' />
                                    </div>
                                    <div className=''>
                                        <div className="form-check py-2">
                                            <input className="form-check-input" type="checkbox" value={channelType} onChange={(e) => setChannelType(e.target.checked)} />
                                            <label className="form-check-label text-light">
                                                Paid  Membership
                                            </label>
                                        </div>
                                        {channelType
                                            && <div className='d-flex py-2'>
                                                <label className='text-light'>Chanel Memmbership fee:</label>
                                                <input style={{ maxWidth: "80px" }} value={chanelFee ? chanelFee : ""} onChange={(e) => { setChanelFee(e.target.value) }} className={styles.inputModal} type='number' inputMode='number' placeholder='fee' min={0} max={10} step={0.01} />
                                            </div>}
                                    </div>
                                </div>}
                            {(modalSection === "chanel" && createChannelAPI.status === "loading") &&
                                <div className='text-success'>
                                    <div className="spinner-grow spinner-grow-sm mx-2 " role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    Creating Chanel...
                                </div>
                            }
                            {(modalSection === "chanel" && createChannelAPI.status === "rejected" && callCreateChannel) &&
                                <div className='flex-grow-1 flex-shrink-1 d-flex align-items-center justify-content-center text-danger'> <i className="fs-3 me-2 bi bi-exclamation-diamond"></i>!Creating Channel has error</div>
                            }
                            {(modalSection === "chanel" && createChannelAPI.status === "idle" && callCreateChannel) &&
                                <div className='flex-grow-1 flex-shrink-1 d-flex align-items-center justify-content-center text-success'> <i className="fs-3 me-2 bi bi-check2-circle"></i>!Creating Channel has error</div>
                            }
                            {(modalSection === "chanel" && patternError !== "ok" && newChanel !== "") && <div className='text-danger'>{patternError}</div>}
                        </div>
                        <div className="modal-footer">
                            {modalSection === "chat" && <button onClick={() => handelAddAddress("chat")} type="button" data-bs-dismiss="modal" aria-label="Close" className="btn btn-success">Add Address</button>}
                            {modalSection === "search" && <button type="button" data-bs-dismiss="modal" aria-label="Close" className="btn btn-success">Cancel</button>}
                            {modalSection === "chanel" && <button onClick={() => handelAddAddress("chanel")} type="button" className="btn btn-success">Add Chanel</button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default InBox