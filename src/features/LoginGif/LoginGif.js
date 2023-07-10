import styles from './LoginGif.module.css';
import * as fcl from "@onflow/fcl";

function LoginGif({ section }) {

    return (
        <div className='d-flex flex-wrap align-items-center justify-content-center pt-5 mt-5'>
            <div className={styles.flowGif}>
                <img src='./img/gif.gif' alt='' />
            </div>
            <div className='pe-5'>
                <div className={styles.flowLogoLogin}>
                    <img src='./img/Flow.com_wordmark_BlackText.svg' alt='' />
                </div>
                <div className='mt-3'>
                    {section === "connectWallet"
                        ? <button onClick={fcl.logIn} className='btn btn-outline-success d-block ms-auto d-flex align-items-center' style={{ marginRight: "-10px" }}>
                            <i className="bi bi-box-arrow-in-right fs-5 me-2"></i>
                            <span>
                                Login with Flow
                            </span>
                        </button>
                        : <button disabled className='btn btn-outline-success d-block ms-auto d-flex align-items-center border-0 p-0 fs-6' style={{ marginRight: "-10px" }}>
                            <span>
                                {section === "selectChat" ? "Select chat to start messaging" : section === "creatNewChat" && "Create new contact"}
                            </span>
                        </button>
                    }
                </div>
            </div>
        </div>
    )
}
export default LoginGif