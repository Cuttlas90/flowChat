import { useEffect, useState } from 'react';
import styles from './InBox.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { getFullContacs, getMyContacts, selectService } from '../service/serviceSlice';
function InBox({ setShowWindow, setShowSidebar }) {
    const dispatch = useDispatch();
    const userAddress = useSelector(selectService).user.wallet.addr;
    const handelClickContent = () => {
        setShowWindow('MessageWindow');
    }

    useEffect(() => {
        if (userAddress) {
            dispatch(getFullContacs(userAddress));
        }
    }, [userAddress])

    // should edit
    const [contactList, setContactList] = useState([
        { name: 'shahed moez', address: '0Xa26f26sdv2s6v2scscsd5c1sd1c6sd1s65s', time: "1688208653368" },
        { name: 'shahed moez', address: '0Xa26f26sdv2s6v2scscsd5c1sd1c6sd1s65s', time: "1688700000000" },
        { name: 'Elahe Hedayati', address: '0Xa26f26sdv2s6v2scscsd5c1sd1c6sd1s65s', time: "1685206615080" },
        { name: 'Mohsen Barekati', address: '0Xa26f26sdv2s6v2scscsd5c1sd1c6sd1s65s', time: "1638206615080" },
    ])

    const [newAddress, setNewAddress] = useState();

    const handelTimeShow = (time) => {
        const today = new Date();
        const todayDate = today.getDate();
        const todayMonth = today.getMonth();
        const todayYear = today.getFullYear();
        const date = new Date(Number(time));
        const day = date.getDate();
        const mounth = date.getMonth();
        const year = date.getFullYear();

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
        setContactList(prev => [{ name: 'new Address', address: newAddress, time: Date.now() }, ...prev]);
        setNewAddress();
    }
    return (
        <div className={styles.inBoxContainer}>
            <div className={styles.header}>
                <div className="d-flex align-items-center">
                    <i onClick={() => setShowSidebar(true)} className="bi bi-list fs-3 text-light"></i>
                    <span className="ms-4 fs-5 text-light">Flow Chat</span>
                </div>
                <div className="d-flex align-items-center">
                    <i className="bi bi-unlock fs-4 text-light"></i>
                    <i className="bi bi-search fs-4 text-light ms-3"></i>
                </div>
            </div>
            <div className={styles.main}>
                {contactList.map((row, index) =>
                    <div key={index} onClick={() => handelClickContent(row)} className={`${styles.rowContent} ${styles.active}`}>
                        <img className={styles.contactImg} alt="" />
                        <div className={styles.contentDetail}>
                            <h6 className={styles.contactName}>{row.name.substring(0, 15)}</h6>
                            <span className={styles.address}>{row.address.substring(0, 24)}</span>
                        </div>
                        <div className={styles.time}>{handelTimeShow(row.time)}</div>
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