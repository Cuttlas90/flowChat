import { useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { getChat, selectService } from '../service/serviceSlice';

function HandelTransAction({ txId, userAddress, contactAddress, actionFunc, message, UUID, timestamp, status }) {
    const dispatch = useDispatch();
    const getChatAPI = useSelector(selectService).user.getChat.messageList;

    // useEffect(() => {
    //     if (getChatAPI[contactAddress]?.status === "idle") {
    //         dispatch(getChat({ userAddress: userAddress, contactAddress: contactAddress }));
    //     }
    // }, [contactAddress, dispatch, userAddress, getChatAPI])
    return (
        <div className="d-flex align-items-center">
            {status === "rejected"
                && <button title="Resend" onClick={() => actionFunc(message, "old", UUID, timestamp)} className="btn btn-link me-2 text-danger p-0 d-flex align-items-center text-hover ms-2" style={{ textDecoration: "none" }}>
                    <img src="./img/update.png" alt="" />
                </button>}
            {status === "loading" && <div className='text-success'>
                <div className="spinner-grow spinner-grow-sm mx-2 " role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                Sending messages...
            </div>}
        </div>
    )
}
export default HandelTransAction;