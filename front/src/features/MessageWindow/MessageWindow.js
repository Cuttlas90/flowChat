import styles from './MessageWindow.module.css'
import { useState } from 'react';

function MessageWindow({ setShowWindow }) {
    const [searchActivInput, setSearchActivInput] = useState(false);

    return (
        <div className={styles.MessageWindowContainer}>
            <div className={styles.header}>
                <div className="d-flex align-items-center  w-100">
                    <div className="d-flex align-items-center d-sm-none">
                        <i onClick={() => setShowWindow('inbox')} className="bi bi-arrow-left fs-4 me-3"></i>
                        {!searchActivInput && <img className={styles.contactImg} alt="" />}
                    </div>
                    {!searchActivInput && <div className={styles.contentDetail}>
                        <h6 className={styles.contactName}>Shahed Moez</h6>
                        <span className={styles.address}>0X24Character not more26</span>
                    </div>}
                    {searchActivInput &&
                        <div className=' px-3 flex-grow-1 flex-shrink-1'>
                            <input className={styles.inputSearch} onBlur={() => setSearchActivInput(false)} type='text' placeholder='Sarch in Chat...' />
                        </div>}
                </div>
                <div className="d-flex align-items-center">
                    <i onClick={() => setSearchActivInput(true)} className="bi bi-search fs-4 me-3 p-2"></i>
                </div>
            </div>
            <div className={styles.main}>
                        <div className={styles.messageIn}>
                            <img src='' alt=''/>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                        </div>
                        <div className={styles.messageIn}>
                            <img src='' alt=''/>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                        </div>
            </div>
            <div className={styles.footer}>
                        <div><i className="bi bi-paperclip fs-3"></i></div>
                        <div className='flex-grow-1 flex-shrink-1'>
                            <input tabIndex={0} className={styles.inputMessage} placeholder='write a message ...'/>
                        </div>
                        <div><i class="bi bi-mic fs-3"></i></div>
            </div>
        </div>
    )
}
export default MessageWindow