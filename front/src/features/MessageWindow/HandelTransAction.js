function HandelTransAction({ actionFunc, message, UUID, timestamp, status }) {

    const typeMseage = (str) => {
        try {
            JSON.parse(str);
        } catch (e) {
            return "text";
        }
        return JSON.parse(str).type;
    }
    return (
        <div className="d-flex align-items-center">
            {status === "rejected"
                && <button title="Resend" onClick={() => actionFunc({message:message, type:"old", UUID:UUID, timestamp:timestamp,MSGtype:typeMseage(message)})} className="btn btn-link me-2 text-danger p-0 d-flex align-items-center text-hover ms-2" style={{ textDecoration: "none" }}>
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