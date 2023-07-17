import { useState } from "react"
import { useEffect } from "react"
import { getOS } from "../functions/GetOs";
import { DecoderOPUS } from "../functions/DecoerOPUS";
import styles from './MessageWindow.module.css';

function HandelMessage({ MSG }) {
    const [jsonMessage, setJsonMessage] = useState({});
    const [blobUrl, setBlobUrl] = useState();
    const [blobUrlFile, setBlobUrlFile] = useState();
    const [audioContorols, setAudioContorols] = useState({});


    const handelSetAudioContorols = (e) => {
        setAudioContorols({ during: e.target.duration, play: "" })
    }
    const handelPlay = (act) => {
        setAudioContorols({ ...audioContorols, play: act })
    }


    useEffect(() => {
        if (MSG && !jsonMessage.type) {
            const isJson = (str) => {
                try {
                    JSON.parse(str);
                } catch (e) {
                    return false;
                }
                return true;
            }
            if (isJson(MSG)) {
                setJsonMessage(JSON.parse(MSG))
            } else {
                setJsonMessage({
                    type: "text",
                    message: MSG
                })
            }
        }
    }, [MSG, jsonMessage]);

    useEffect(() => {
        const handelgetAudio = async (VMessage) => {
            var arr = Buffer.from(VMessage, 'base64');
            var OS = getOS();
            var url =
                (OS === "MacOS" || OS === "iOS")
                    ?
                    await DecoderOPUS(new Uint8Array(arr)).then(
                        (res) => {
                            return (res)
                        }
                    )
                    :
                    URL.createObjectURL(new Blob([arr], { type: 'audio/ogg' }))
            return url;
        }
        if (!blobUrl && jsonMessage?.type === "voice") {

            handelgetAudio(jsonMessage.message)
                .then((res) => setBlobUrl(res))
        }
    }, [jsonMessage, blobUrl])

    useEffect(() => {
        const handelFile = async (JsonFile) => {
            var fileType = JsonFile.message.substring("data:".length, JsonFile.message.indexOf(";base64"));
            var arr = Buffer.from(JsonFile.message, 'base64');
            var url = URL.createObjectURL(new Blob([arr], { type:fileType }))
            console.log(url)
            return url;
        }
        if (!blobUrlFile && jsonMessage?.type === "file") {

            handelFile(jsonMessage)
                .then((res) => setBlobUrlFile   (res))
        }
    }, [jsonMessage, blobUrlFile])


    return (
        <>
            {(jsonMessage.type === "text") && <div>{jsonMessage.message}</div>}
            {(jsonMessage.type === "voice")
                &&
                <div>
                    <audio controls
                        src={blobUrl} className=''
                        onLoadedMetadata={(e) => handelSetAudioContorols(e)}
                        onPlay={() => handelPlay("play")}
                        onPause={() => handelPlay("pause")}
                    />
                </div>}
            {(jsonMessage.type === "image") 
            && 
            <div className="w-100 d-flex justify-content-start" style={{height:"200px"}}>
                <img style={{width:"80%",height:"100%",border:"none", objectFit: "contain",borderRadius:"8px"}} src={jsonMessage.message} alt="" />
            </div>
            }
            {(jsonMessage.type === "file")
                &&
                <div>
                   <a href={blobUrlFile} download="FlowChat">
                   <i className="bi bi-file-earmark-binary " style={{fontSize:"80px"}}></i>
                   download this file
                   </a>
                </div>
            }
        </>
    )

}
export default HandelMessage