import styles from './Sidebar.module.css';
function Sidebar({ showSidebar, setShowSidebar }) {
    return (
        <div className={showSidebar ? `${styles.SidebarContainer} ${styles.expandSidebar}` : styles.SidebarContainer}>
            <div className={showSidebar ? `${styles.sidebarActive} ${styles.sidebar}` : styles.sidebar}>
                <div className={styles.heade}>
                    <div className='d-flex align-items-center'>
                        <img className={styles.contactImg} alt="" />
                        <div className='flex-shrink-1 flex-grow-1'>
                            <input className={styles.input} type='text' placeholder='Your Name' />
                            <div style={{ marginTop: "-10px" }}>
                                <span className='text-light ms-2' style={{ fontSize: "14px" }}>{'0Xa26f26sdv2s6v2scscsd5c1sd1c6sd1s65s'.substring(0, 16) + "..."}</span>
                                <i className="bi bi-clipboard ms-2 text-primary"></i>
                            </div>
                        </div>
                    </div>
                    <i onClick={() => setShowSidebar(false)} className="bi bi-arrow-left fs-4 me-3 text-white"></i>
                </div>
                <div className="p-3">
                    <div className="d-flex align-items-center text-light py-2">
                        <div className={styles.icon}>
                            <i className="bi bi-wallet-fill fs-6"></i>
                        </div>
                        <span className="ms-3">Connect to wallet</span>
                    </div>
                    <div className="d-flex align-items-center text-light py-3">
                        <div className={styles.icon}>
                            <i className="bi bi-box-arrow-left"></i>
                        </div>
                        <span className="ms-3">Disconnect</span>
                    </div>
                </div>
            </div>
            <div onClick={() => setShowSidebar(false)} className='100vh flex-grow-1 '></div>
        </div>
    )
}
export default Sidebar;