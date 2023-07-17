import { useEffect, useRef, useState } from 'react'
import styles from './FileMessages.module.css'
import Compressor from 'compressorjs';
function FileMessages({ inputFile, setInputFile, setShowmodalFile, actionFunc, UUID, timestamp }) {
    const btnRef = useRef();
    const [isImage, setIsImage] = useState(true)
    const [base64InputFile, setBase64InputFile] = useState(true)
    const [isCommpres, setIsCommpres] = useState(true);
    const [copmressImage, setCopmressImage] = useState("");
    useEffect(() => {
        btnRef.current.click();
    }, [inputFile])
    const CompressImage = () => {
        var comsFileBase64;
        console.log(typeof(inputFile[0]))
        new Compressor(inputFile[0], {
            quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
            maxWidth: 200,
            maxHeight: 200,
            success: async (compressedResult) => {
                comsFileBase64 = await convertToBase64(compressedResult);
                setCopmressImage(comsFileBase64);
            },
        });
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
        if (inputFile[0]?.type.split("/")[0] === "image") {
            setIsImage(true);
            CompressImage();
        }else{
            setIsImage(false)
        }
        convertToBase64(inputFile[0])
            .then((res) => setBase64InputFile(res))
            .catch((error) => console.log(error));
    }, [inputFile, setIsImage,isImage,copmressImage,convertToBase64,base64InputFile,setBase64InputFile,CompressImage]);

    
    return (
        <>
            <button ref={btnRef} className='d-none' data-bs-toggle="modal" data-bs-target="#fileMessagesModal">test</button>
            <div className="modal fade in" id="fileMessagesModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className={`${styles.modalContent} modal-content`}>
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="fileMessagesModalLable">Sending file message</h1>
                            <button type="button" onClick={() => { setInputFile(""); setShowmodalFile(false) }} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className='d-flex'>
                                {isImage
                                    ? <div className={styles.showImage}>
                                        <img src={`${base64InputFile}`} alt='' />
                                    </div>
                                    : <div>
                                        <i className="bi bi-file-earmark-break " style={{ fontSize: "5em" }}></i>
                                    </div>}
                                <div className='ms-3'>
                                    <div className='d-flex align-items-center'>
                                        <span style={{ fontSize: "12px", color: "var(--bs-gray-400)", width: "60px" }}>Name:</span>
                                        <span className='text-light'>{inputFile.name}</span>
                                    </div>
                                    <div className='d-flex align-items-center'>
                                        <span style={{ fontSize: "12px", color: "var(--bs-gray-400)", width: "60px" }}>Format:</span>
                                        <span>{inputFile[0]?.type}</span>
                                    </div>
                                    <div className='d-flex align-items-center'>
                                        <span style={{ fontSize: "12px", color: "var(--bs-gray-400)", width: "60px" }}>Size:</span>
                                        <span>{inputFile[0]?.size}<small className='ms-1'>bytes</small></span>
                                    </div>
                                    {isImage
                                        &&
                                        <div className="form-check">
                                            <input onChange={(e) => setIsCommpres(e.target.checked)} checked={isCommpres ? true : false} className="form-check-input" type="checkbox" id="flexCheckIndeterminate" />
                                            <label className="form-check-label">
                                                Compress the photo
                                            </label>
                                        </div>
                                    }
                                    <div className=" d-flex align-items-center text-info" >
                                        <i className="bi bi-info-circle fs-5 me-2"></i>
                                        <div>
                                            Note: You must have enough space to save this file on Flow blockchain.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <div onClick={() => actionFunc({ message: (isCommpres&& isImage)?`${copmressImage}`:`${base64InputFile}`, type: "new", UUID: "", timestamp: "", MSGtype: (isImage&&isCommpres) ? "image" : "file" })} className='text-hover d-flex align-items-center' role='button'><span>Send</span><i className="bi bi-send mx-3 fs-3" role='button'></i></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default FileMessages