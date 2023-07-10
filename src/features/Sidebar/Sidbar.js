import { useEffect, useState } from 'react';
import styles from './Sidebar.module.css';
import * as fcl from "@onflow/fcl";
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, resetState, initProfileAndSetAvatar, initProfileAndSetColor, initProfileAndSetInfo, initProfileAndSetName, selectService } from '../service/serviceSlice';
import Compressor from 'compressorjs';

function Sidebar({ showSidebar, setShowSidebar }) {
    const dispatch = useDispatch();
    const userInfo = useSelector(selectService).user;
    const [userProfile, setUserProfile] = useState();
    const [isCollapes, setIsCollaped] = useState(false);

    const handelLogOut = () => {
        fcl.unauthenticate();
        localStorage.clear()
        dispatch(resetState())
    }
    const handelSetAvatar = () => {
        if (userProfile.avatar[0]) {
            var comsFileBase64;
            new Compressor(userProfile.avatar[0], {
                quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
                maxWidth: 75,
                maxHeight: 75,
                success: async (compressedResult) => {
                    console.log(compressedResult)
                    comsFileBase64 = await convertToBase64(compressedResult);
                    console.log(comsFileBase64)
                    dispatch(initProfileAndSetAvatar(comsFileBase64))
                },
            });
        }
    }
    async function convertToBase64(imageFile) {
        const fileReader = new FileReader();
        return new Promise((resolve, reject) => {
            fileReader.onerror = () => {
                fileReader.abort();
                reject(new DOMException("Problem parsing input file."));
            };

            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.readAsDataURL(imageFile);
        });
    }

    useEffect(() => {
        if (userInfo.wallet.addr)
            dispatch(getProfile({ address: userInfo.wallet.addr, isUserAddress: true }));
    }, [userInfo.wallet.addr, dispatch]);

    useEffect(() => {
        setUserProfile(userInfo.profile);
    }, [userInfo.profile])

    return (
        <div className={showSidebar ? `${styles.SidebarContainer} ${styles.expandSidebar}` : styles.SidebarContainer}>
            <div className={showSidebar ? `${styles.sidebarActive} ${styles.sidebar}` : styles.sidebar}>
                <div className={styles.heade}>
                    <div className='d-flex align-items-center'>
                        <div className={styles.contactImg} style={{ backgroundColor: userProfile?.color }}>
                            <img src={userProfile?.avatar || "./img/avatar.png"} alt="" />
                            {/* <input type='file' onChange={(e) => handelSetPhotoProfile(e)} className={styles.inputFile} /> */}
                        </div>
                        <div className='flex-shrink-1 flex-grow-1'>
                            <span className={styles.input} >{userProfile?.name || ""}</span>
                        </div>
                    </div>
                    <i onClick={() => setShowSidebar(false)} className="bi bi-arrow-left fs-4 me-3 text-white" role='button'></i>
                </div>
                <div className="p-3">
                    <div className="text-light py-2">
                        <div onClick={() => setIsCollaped(!isCollapes)} className={`${styles.collArrow} d-flex align-items-center text-light`} data-bs-toggle="collapse" href="#profileCollaps" role="button" aria-expanded="false" aria-controls="profileCollaps">
                            <div className={styles.icon}>
                                <i className="bi bi-person-lines-fill fs-6"></i>
                            </div>
                            <span className="ms-3">Profile</span>
                            <span className={isCollapes ? styles.arrowCollaps : styles.arrowNotCollaps}></span>
                        </div>
                        <div className="collapse" id="profileCollaps">
                            <div className="p-1 ps-3 pt-3">
                                <div className='d-flex align-items-center flex-wrap mb-1'>
                                    <div className={styles.icon}>
                                        <i className="bi bi bi-wallet fs-6"></i>
                                    </div>
                                    <label className="ms-3">address:</label>
                                    <span className='ms-1'>{userInfo.wallet?.addr?.substring(0, 10) + "..."}</span>
                                    <button className={styles.btnSmallWithIcon} onClick={() => { navigator.clipboard.writeText(userInfo.wallet?.addr) }}>
                                        <img className='' src='./img/copy.png' alt='' />
                                    </button>
                                </div>
                                <div className='d-flex align-items-center flex-wrap mb-1'>
                                    <div className={styles.icon}>
                                        <i className="bi bi-person-fill fs-6"></i>
                                    </div>
                                    <label className="ms-3">Name:</label>
                                    <input value={userProfile?.name || ""} onChange={(e) => setUserProfile(prev => ({ ...prev, "name": e.target.value }))} className={styles.input} type='text' placeholder='Your Name' />
                                    <button className={styles.btnSmallWithIcon} onClick={() => dispatch(initProfileAndSetName(userProfile.name))}>
                                        <img className='' src='./img/update.png' alt='' />
                                    </button>
                                </div>
                                <div className='d-flex align-items-center flex-wrap mb-1'>
                                    <div className={styles.icon}>
                                        <i className="bi bi-person-circle fs-6"></i>
                                    </div>
                                    <label className="ms-3">Avatar:</label>
                                    <input type='file' className={styles.customFileInput} onChange={(e) => setUserProfile(prev => ({ ...prev, "avatar": e.target.files }))} />
                                    <button className={styles.btnSmallWithIcon} onClick={() => handelSetAvatar()}>
                                        <img className='' src='./img/update.png' alt='' />
                                    </button>
                                </div>
                                <div className='d-flex align-items-center mb-1'>
                                    <div className={styles.icon}>
                                        <i className="bi bi-info fs-4 flex-wrap"></i>
                                    </div>
                                    <label className="ms-3">Info:</label>
                                    <input value={userProfile?.info || ""} onChange={(e) => setUserProfile(prev => ({ ...prev, "info": e.target.value }))} className={styles.input} type='text' placeholder='Your Info' />
                                    <button className={styles.btnSmallWithIcon} onClick={() => dispatch(initProfileAndSetInfo(userProfile.info))} >
                                        <img className='' src='./img/update.png' alt='' />
                                    </button>
                                </div>
                                <div className='d-flex align-items-center'>
                                    <div className={styles.icon}>
                                        <i className="bi bi-palette fs-6"></i>
                                    </div>
                                    <label className="ms-3">color:</label>
                                    <div className={styles.inputColorDiv}>
                                        <input type="color" value={userProfile?.color || ""} onChange={(e) => setUserProfile(prev => ({ ...prev, "color": e.target.value }))} placeholder='Your Info' />
                                    </div>
                                    <button className={styles.btnSmallWithIcon} onClick={() => dispatch(initProfileAndSetColor(userProfile.color))}>
                                        <img className='' src='./img/update.png' alt='' />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div onClick={fcl.logIn} className="d-flex align-items-center text-light py-3" role='button'>
                        <div className={styles.icon}>
                            <i className="bi bi-wallet-fill fs-6"></i>
                        </div>
                        <span className="ms-3">Connect to wallet</span>
                    </div>
                    <div className="d-flex align-items-center text-light py-3" role='button'> 
                        <div className={styles.icon}>
                            <i className="bi bi-box-arrow-left"></i>
                        </div>
                        <span onClick={() => handelLogOut()} className="ms-3">Disconnect</span>
                    </div>
                </div>
            </div>
            <div onClick={() => setShowSidebar(false)} className='100vh flex-grow-1 '></div>
        </div>
    )
}
export default Sidebar;