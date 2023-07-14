import { useEffect, useRef, useState } from "react";
import * as fcl from "@onflow/fcl";
import { useDispatch, useSelector } from "react-redux";
import { getChat, selectService } from '../service/serviceSlice';

function HandelTransAction({ txId, userAddress, contactAddress, actionFunc, message, UUID, timestamp, status, setTransactionStatus }) {
    const [transActionResult, setTransActionResult] = useState();
    const calleSubscibe = useRef();
    const dispatch = useDispatch();
    const getChatAPI = useSelector(selectService).user.getChat.messageList;
    const caledGetChatAPI = useRef();

    useEffect(() => {
        if (calleSubscibe.current !== txId && txId) {
            fcl.tx(txId).subscribe(res => setTransActionResult(res))
            calleSubscibe.current = txId;
        }
    }, [txId, transActionResult, calleSubscibe]);

    useEffect(() => {
        if (transActionResult?.statusCode === 1) {
            setTransactionStatus(prev => ({ ...prev, [UUID]: transActionResult.statusCode }));
        }
    }, [transActionResult, setTransactionStatus, UUID])

    useEffect(() => {
        if (transActionResult?.statusCode === 0 && transActionResult?.status === 4 && getChatAPI[contactAddress]?.status !== "loading" && caledGetChatAPI.current !== txId) {
            dispatch(getChat({ userAddress: userAddress, contactAddress: contactAddress }));
            caledGetChatAPI.current = txId;
        }
    }, [transActionResult, contactAddress, dispatch, userAddress, getChatAPI, caledGetChatAPI, txId])
    // console.log(transActionResult)
    return (
        <div className="d-flex align-items-center">
            {(transActionResult?.statusCode === 1 || status === "rejected")
                && <button title="Resend" onClick={() => actionFunc(message, "old", UUID, timestamp)} className="btn btn-link me-2 text-danger p-0 d-flex align-items-center text-hover ms-2" style={{ textDecoration: "none" }}>
                    <img src="./img/update.png" alt="" />
                </button>}
            {/* {status === "idle" && <div className="progress flex-grow-1 flex-shrink-1 me-2" style={{ height: "0.3rem" }}>
                <div className={transActionResult?.statusCode === 1 ? "progress-bar progress-bar-striped bg-danger" : "progress-bar progress-bar-striped bg-success"} role="progressbar" aria-label="Success striped example" style={{ width: `${transActionResult?.status * 25}%` }} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
            </div>} */}
            {((status === "loading" || (status==="idle" && transActionResult?.status<4))&&transActionResult?.statusCode !== 1 ) && <div className='text-success'>
                <div className="spinner-grow spinner-grow-sm mx-2 " role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                Sending messages...
            </div>}
        </div>
    )
}
export default HandelTransAction;