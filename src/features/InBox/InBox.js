import { useEffect, useRef, useState } from 'react';
import styles from './InBox.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { getFullContacs, getProfile, resetState, selectService, setAddressToGetMessage } from '../service/serviceSlice';
import LoginGif from '../LoginGif/LoginGif';
import * as fcl from "@onflow/fcl";
import { handelTimeShow } from '../functions/handelTimeShow';
import { AppUtils } from "@onflow/fcl"

function InBox({ setShowWindow, setShowSidebar }) {
    const dispatch = useDispatch();
    const userAddress = useSelector(selectService).user.wallet.addr;
    const contactListAPI = useSelector(selectService).getProfile
    const [contactList, setContactList] = useState([]);
    const [showSearch, setShowSearch] = useState(false)
    const [inputSearch, setInputSearch] = useState("")
    const contactDiv = useRef();
    const [activeRow, setActiveRow] = useState("");

    const handelClickContent = (addrs, profile) => {
        setShowWindow('MessageWindow');
        setActiveRow(addrs);
        dispatch(setAddressToGetMessage({ address: addrs, profile: profile }))
    }

    useEffect(() => {
        if (userAddress) {
            dispatch(getFullContacs(userAddress));
        }
    }, [userAddress, dispatch])

    useEffect(() => {
        setContactList(contactListAPI);
    }, [contactListAPI, contactList, setContactList])

    const [newAddress, setNewAddress] = useState();

    const handelAddAddress = () => {
        dispatch(getProfile({ address: newAddress, isUserAddress: false, timeStamp: Date.now() }));
        setNewAddress();
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
        fcl.unauthenticate();
        localStorage.clear()
        dispatch(resetState())
    }


    const runTest =async()=>{
        const MSG = "6d6f6873656e"
        // const MSG = Buffer.from("FOO").toString("hex")
        try {
          console.log(await fcl.currentUser.signUserMessage(MSG))
        } catch (error) {
          console.log(error)
        }
    }
    const veryFy =async()=>{

    }
    return (
        <div className={styles.inBoxContainer}>
            <button onClick={()=>runTest()}>test</button>
            <div className={styles.header}>
                <div className="d-flex align-items-center flex-grow-1 flex-shrink-1 flex-grow-1 text-hover ">
                    <i onClick={() => setShowSidebar(true)} className="bi bi-list fs-3 text-light " role="button"></i>
                    {showSearch
                        ? <div className=' px-3 flex-grow-1 flex-shrink-1 flex-grow-1'>
                            <input value={inputSearch} onChange={(e) => handelSearch(e.target.value)} className={styles.inputSearch} type='text' placeholder='Sarch Name or Address...' />
                        </div>
                        : <span className="ms-4 fs-5 text-light">Flow Chat</span>}
                </div>
                <div className="d-flex align-items-center text-hover">
                    <i className={showSearch ? "bi bi-x-lg fs-4 text-light  " : "bi bi-search fs-4 text-light ms-3"} role="button" onClick={() => { setShowSearch(!showSearch); handelSearch("") }}></i>
                    <i className="bi bi-power fs-4 text-light ms-3" role="button" onClick={() => handelLogOut()}></i>
                </div>
            </div>
            <div ref={contactDiv} className={styles.main}>
                {(userAddress && Object.keys(contactList).length)
                    ? Object.keys(contactList).map((row, index) =>
                        <div key={index} onClick={() => handelClickContent(row, contactList[row])} className={activeRow === row ? `${styles.rowContent} ${styles.active}` : `${styles.rowContent}`} style={{ order: contactList[row].timeStamp ? (Math.floor(contactList[row].timeStamp / 10000) - 16725312) * -1 : 0 }} role="button">
                            <div style={{ backgroundColor: contactList[row].color, borderRadius: "50%" }}>
                                <img src={contactList[row].avatar || "./img/avatar.png"} className={styles.contactImg} alt="" />
                            </div>
                            <div className={styles.contentDetail}>
                                <h6 className={`${styles.contactName} nForSearch`}>{contactList[row].name?.substring(0, 15)}</h6>
                                <span className={`${styles.address} aForSearch` }>{row.substring(0, 24)}</span>
                            </div>
                            <div className={styles.time}>{handelTimeShow(contactList[row].timeStamp)}</div>
                        </div>)
                    : <div className='d-block d-sm-none'>
                        <LoginGif section={!userAddress ? "connectWallet" : !Object.keys(contactList).length && "creatNewChat"} />
                    </div>
                }
            </div>
            <button data-bs-toggle="modal" data-bs-target="#modalAddAddress" className={`${styles.addNewContact} btn btn-success`}>
                <i className="bi bi-pencil-fill fs-5 text-light"></i>
            </button>
            {/* modal add address */}
            <div className="modal fade" id="modalAddAddress" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className={`${styles.modalContent} modal-content`}>
                        <div className="modal-header">
                            <h1 className="modal-title fs-5 text-light" id="staticBackdropLabel">Add New Flow Addres</h1>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <input value={newAddress ? newAddress : ""} onChange={(e) => setNewAddress(e.target.value)} className={styles.inputModal} type='text' placeholder='new address' />
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => handelAddAddress()} type="button" className="btn btn-success">Add Address</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default InBox