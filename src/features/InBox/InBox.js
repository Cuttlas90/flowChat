import { useEffect, useRef, useState } from 'react';
import styles from './InBox.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { getFullContacs, getProfile, resetState, selectService, setAddressToGetMessage } from '../service/serviceSlice';
function InBox({ setShowWindow, setShowSidebar }) {
    const dispatch = useDispatch();
    const userAddress = useSelector(selectService).user.wallet.addr;
    const contactListAPI = useSelector(selectService).getProfile
    const [contactList, setContactList] = useState([]);
    const [showSearch, setShowSearch] = useState(false)
    const [inputSearch, setInputSearch] = useState("")
    const contactDiv = useRef();

    const handelClickContent = (addrs, profile) => {
        setShowWindow('MessageWindow');
        dispatch(setAddressToGetMessage({ address: addrs, profile: profile }))
    }

    useEffect(() => {
        if (userAddress) {
            dispatch(getFullContacs(userAddress));
        }
    }, [userAddress,dispatch])

    // should edit
    useEffect(() => {
        setContactList(contactListAPI);
    }, [contactListAPI, contactList, setContactList])

    const [newAddress, setNewAddress] = useState();

    const handelTimeShow = (time) => {
        const today = new Date();
        const todayMinutes = today.getMinutes();
        const todayHours = today.getHours();
        const todayDate = today.getDate();
        const todayMonth = today.getMonth();
        const todayYear = today.getFullYear();
        const date = new Date(Number(time));
        const minutes = today.getMinutes();
        const hours = today.getHours();
        const day = date.getDate();
        const mounth = date.getMonth();
        const year = date.getFullYear();

        if (year === todayYear && mounth === todayMonth && todayDate === day && hours === todayHours && minutes === todayMinutes) {
            return `now`;
        }
        if (year === todayYear && mounth === todayMonth && todayDate === day) {
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        }
        if (year === todayYear && mounth === todayMonth && todayDate !== day && Number(Date.now()) - Number(time) < (7 * 24 * 3600 * 1000)) {
            const options1 = { weekday: 'long' }
            return date.toLocaleDateString('en-US', options1);
        }
        if (year === todayYear && todayDate !== day && (mounth !== todayMonth || Date.now() - time >= (7 * 24 * 3600 * 1000))) {
            const options2 = { month: 'short', day: 'numeric' }
            return date.toLocaleDateString('en-US', options2);
        }
        if (year !== todayYear) {
            return date.toLocaleDateString('en-US', 'YYYY,MM,DD');
        }
    }
    const handelAddAddress = () => {
        dispatch(getProfile({ address: newAddress, isUserAddress: false, timeStamp: Date.now() }));
        setNewAddress();
    }

    const handelSearch = (textSearch) => {
        setInputSearch(textSearch);
        var address,name, txtValue1,txtValue2;
        var filter = textSearch.toUpperCase();
        var items  = contactDiv.current.children;
        console.log(items)
        for (let i = 0; i < items.length; i++) {
            address = items[i].getElementsByTagName("span")[0];
            name = items[i].getElementsByTagName("h6")[0];
            txtValue1 = address.textContent || address.innerText;
            txtValue2 = name.textContent || name.innerText;
            if (txtValue1.toUpperCase().indexOf(filter) > -1 || txtValue2.toUpperCase().indexOf(filter) > -1 ) {
                items[i].style.display = "";
            } else {
                items[i].style.display = "none";
            }
        }
    }

    const handelLogOut = () => {
        // fcl.unauthenticate();
        localStorage.clear()
        dispatch(resetState())
    }
    return (
        <div className={styles.inBoxContainer}>
            <div className={styles.header}>
                <div className="d-flex align-items-center flex-grow-1 flex-shrink-1 flex-grow-1 ">
                    <i onClick={() => setShowSidebar(true)} className="bi bi-list fs-3 text-light " role="button"></i>
                    {showSearch
                        ? <div className=' px-3 flex-grow-1 flex-shrink-1 flex-grow-1'>
                            <input value={inputSearch} onChange={(e) => handelSearch(e.target.value)} className={styles.inputSearch} type='text' placeholder='Sarch Name or Address...' />
                        </div>
                        : <span className="ms-4 fs-5 text-light">Flow Chat</span>}
                </div>
                <div className="d-flex align-items-center">
                    <i className={showSearch ? "bi bi-x-lg fs-4 text-light " : "bi bi-search fs-4 text-light ms-3"} role="button" onClick={() => {setShowSearch(!showSearch);handelSearch("")}}></i>
                    <i className="bi bi-power fs-4 text-light ms-3" role="button" onClick={()=>handelLogOut()}></i>
                </div>
            </div>
            <div ref={contactDiv} className={styles.main}>
                {Object.keys(contactList).map((row, index) =>
                    <div key={index} onClick={() => handelClickContent(row, contactList[row])} className={`${styles.rowContent} ${styles.active}`} style={{ order: contactList[row].timeStamp ? (Math.floor(contactList[row].timeStamp / 10000) - 16725312) * -1 : 0 }} role="button">
                        <div style={{ backgroundColor: contactList[row].color, borderRadius: "50%" }}>
                            <img src={contactList[row].avatar || "./img/avatar.png"} className={styles.contactImg} alt="" />
                        </div>
                        <div className={styles.contentDetail}>
                            <h6 className={styles.contactName}>{contactList[row].name?.substring(0, 15)}</h6>
                            <span className={styles.address}>{row.substring(0, 24)}</span>
                        </div>
                        <div className={styles.time}>{handelTimeShow(contactList[row].timeStamp)}</div>
                    </div>)}
            </div>
            <button data-bs-toggle="modal" data-bs-target="#modalAddAddress" className={`${styles.addNewContact} btn btn-primary`}>
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
                            <button onClick={() => handelAddAddress()} type="button" className="btn btn-primary">Add Address</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default InBox