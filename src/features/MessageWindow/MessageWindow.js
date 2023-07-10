import styles from './MessageWindow.module.css'
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectService } from '../service/serviceSlice';

function MessageWindow({ setShowWindow }) {
    const [searchActivInput, setSearchActivInput] = useState(false);
    const contactInfo = useSelector(selectService).setAddressToGetMessage;
useEffect(()=>{
setSearchActivInput(false);
},[contactInfo])
    return (
        <div className={styles.MessageWindowContainer}>
            <div className={styles.header}>
                <div className="d-flex align-items-center  w-100">
                    <div className="d-flex align-items-center d-sm-none">
                        <i onClick={() => setShowWindow('inbox')} className="bi bi-arrow-left fs-4 me-3" role="button"></i>
                        {!searchActivInput &&
                            <div style={{backgroundColor:contactInfo.profile?.color, borderRadius:"50%"}}>
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
                            <input className={styles.inputSearch}  type='text' placeholder='Sarch in Chat...' />
                        </div>}
                </div>
                <div className="d-flex align-items-center" role="button">
                    <i onClick={() => setSearchActivInput(!searchActivInput)} className={searchActivInput?"bi bi-x-lg fs-4 me-3 p-2":"bi bi-search fs-4 me-3 p-2"}></i>
                </div>
            </div>
            <div className={styles.main}>
                <div className={styles.messageIn}>
                    <img src='' alt='' />
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>
                <div className={styles.messageIn}>
                    <img src='' alt='' />
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>
            </div>
            <div className={styles.footer}>
                <div><i className="bi bi-paperclip fs-3"></i></div>
                <div className='flex-grow-1 flex-shrink-1'>
                    <input tabIndex={0} className={styles.inputMessage} placeholder='write a message ...' />
                </div>
                <div><i className="bi bi-mic fs-3"></i></div>
            </div>
        </div>
    )
}
export default MessageWindow