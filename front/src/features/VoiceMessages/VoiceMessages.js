import { useEffect, useState } from 'react'
import styles from './VoiceMessages.module.css';
import Siriwave from 'react-siriwave';
import Recorder from "opus-recorder";
import encoderPath from 'opus-recorder/dist/encoderWorker.min.js';
import { DecoderOPUS } from '../functions/DecoerOPUS';
import { getOS } from "../functions/GetOs";
function VoiceMessages({ mode, setVoiceMessage, stopRef }) {
  const [minute, setMinute] = useState("00");
  const [recordStatus, setRecordStatus] = useState("recording");
  const [counter, setCounter] = useState(0);
  const [audioDuring, setAudioDuring] = useState(0);
  const [audioUrl, setAudioUrl] = useState(0);
  const [alarmRec, setAlarmRec] = useState({ status: "", alarmRec: "" });
  const [second, setSecond] = useState("00");
  const StartOPUS = () => {
    var recorder = null;
    if (!Recorder.isRecordingSupported()) {
      setAlarmRec({ status: "error", alarmRec: "Recording features are not supported in your browser." })
    } else {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioStream = navigator.mediaDevices.getUserMedia({ audio: true });
      const sourceNode = audioStream
        .then((stream) => {
          const context = new AudioContext();
          return context.createMediaStreamSource(stream);
        });
      // for analyzer wave animation

      var options = {
        monitorGain: 0,
        recordingGain: 1,
        numberOfChannels: 1,
        encoderSampleRate: 8000,
        encoderBitRate: 6000,
        encoderPath: encoderPath,
        sourceNode: sourceNode,
      };
      recorder = new Recorder(options);
      // const recorderPause = () => { recorder.pause(); };
      const recorderStop = () => {
        setRecordStatus("readyForPlay")
        recorder.stop();
        sourceNode.then(
          function (stream) { stream.mediaStream.getAudioTracks()[0].stop() },
          function (error) { console.log(error) }
        );
      };
      // const recorderResume = () => { 
      //   recorder.resume()
      //   console.log("resume func")
      // };
      const recorderStart = () => {
        setRecordStatus("recording");
        recorder.start().catch(function (err) {
          recorder.stop();
          setRecordStatus("");
          setMinute("00");
          setSecond("00");
          if (err.message === "Permission denied") {
            setAlarmRec({ status: "error", alarmRec: "You blocked perrmision for recording audio" })
            Notification.requestPermission();
          } else {
            setAlarmRec({ status: "error", alarmRec: err.alarmRec });
          }
        });
      };

      recorderStart();
      stopRef.current.addEventListener("click", recorderStop);
      recorder.onstart = function (e) {
        console.log('Recorder is started');
      };
      recorder.onstop = function (e) {
        console.log('Recorder is stopped');
      };
      recorder.onpause = function (e) {
        console.log('Recorder is paused');
      };
      recorder.onresume = function (e) {
        console.log('Recorder is resuming');
      };
      recorder.ondataavailable = function (typedArray) {
        var string = Buffer.from(typedArray).toString('base64');
        setVoiceMessage(string);
        var dataBlob = new Blob([typedArray], { type: 'audio/ogg' });
        //var fileName = new Date().toISOString() + ".opus";
        var url = URL.createObjectURL(dataBlob);
        var OS = getOS();
        if (OS === "MacOS" || OS === "iOS") {
          DecoderOPUS(new Uint8Array(typedArray)).then(
            (res) => {
              // props.setVoiceUrl(res);
              setAudioUrl(res);
            }
          );
        } else {
          // props.setVoiceUrl(url);
          setAudioUrl(url);
        }
      };
    };
  }
  // useEfect for setting timer
  useEffect(() => {
    let intervalId;

    if (recordStatus === "recording") {
      intervalId = setInterval(() => {
        const secondCounter = counter % 60;
        const minuteCounter = Math.floor(counter / 60);

        let computedSecond =
          String(secondCounter).length === 1
            ? `0${secondCounter}`
            : secondCounter;
        let computedMinute =
          String(minuteCounter).length === 1
            ? `0${minuteCounter}`
            : minuteCounter;

        setSecond(computedSecond);
        setMinute(computedMinute);

        setCounter((counter) => counter + 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [recordStatus, counter]);
  const stopTimer = () => {
    setCounter(0);
    setSecond("00");
    setMinute("00");
  }
  useEffect(() => {
    if (mode === "recording") {
      StartOPUS()
    }
  }, [mode])
  console.log(second)
  return (
    <>
      {mode === "recording"
        && <div className="d-flex align-items-center">
          {alarmRec.status === "error"
            ? <div className="text-danger">{alarmRec.alarmRec}</div>
            : <div className="text-success">
              <span>
                is recording
              </span>
              <span className="ms-2">
                {minute}:{second}
              </span>
            </div>
          }
        </div>
      }
      {mode === "playMode"
        &&
        <div className="d-flex align-items-center ">
          <audio
            className="d-none"
            id="recordedAudio"
            controls src={audioUrl}
            onPlay={() => setRecordStatus("playing")}
            onPause={() => setRecordStatus("readyForPlay")}
            onLoadedMetadata={(e) => setAudioDuring(e.target.duration)}
          />
          {recordStatus === "readyForPlay"
            &&
            <div className={styles.btnAudio} onClick={() => document.getElementById('recordedAudio').play()} >
              <i class="bi bi-play-circle fs-3 text-hover ms-2" role="button"></i>
            </div>
          }
          {recordStatus === "playing"
            &&
            <div className={styles.btnAudio} onClick={() => document.getElementById('recordedAudio').pause()} >
              <i class="bi bi-pause-circle fs-3 text-hover ms-2" role="button"></i>
            </div>
          }
          <span className={recordStatus === "playing"?"blink ms-2" :"ms-2"}>{audioDuring}</span>
        </div>
      }
    </>
  )
}
export default VoiceMessages