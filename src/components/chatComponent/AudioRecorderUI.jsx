// import React, { useEffect, useRef, useState } from "react";
// import WaveSurfer from "wavesurfer.js";
// import { Mic, Trash2, Play, Pause, Upload, Send } from "lucide-react";

// const AudioRecorder = ({ onSend }) => {
//     const audioChunk = useRef([]);
//     const mediaRecorderRef = useRef(null);
//     const [recordings, setRecording] = useState([]);
//     const [isRecording, setIsRecording] = useState(false);

//     const startRecording = async () => {
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         const recorder = new MediaRecorder(stream);

//         recorder.ondataavailable = (e) => {
//             if (e.data.size > 0) {
//                 audioChunk.current.push(e.data)
//             }
//         };

//         recorder.onstop = () => {
//             const audioBlob = new Blob(audioChunk.current, { type: "audio/webm" });
//             const audioUrl = URL.createObjectURL(audioBlob);
//             setRecording((prev) => [...prev, audioUrl]);
//         };

//         mediaRecorderRef.current = recorder;
//         recorder.start();
//         setIsRecording(true);
//         // setIsPaused(false);
//     };

//     const stopRecording = () => {
//         if (mediaRecorderRef.current && mediaRecorderRef.current?.state === "recording") {
//             mediaRecorderRef.current.stop();
//             setIsRecording(false);
//         }
//     };

//     const pauseOrResume = () => {
//         // if (!mediaRecorder.current) return;
//         // if (isPaused) {
//         //     mediaRecorder.current.resume();
//         //     setIsPaused(false);
//         // } else {
//         //     mediaRecorder.current.pause();
//         //     setIsPaused(true);
//         // }
//     };

//     const deleteAudio = () => {
//         // setAudioBlob(null);
//         // setChunks([]);
//         // setIsRecording(false);
//         // setIsPaused(false);
//         // setIsPlaying(false);
//         // if (waveSurfer) {
//         //     waveSurfer.destroy();
//         //     setWaveSurfer(null);
//         // }
//     };

//     const handleSend = () => {
//         // if (!audioBlob) return;
//         // const reader = new FileReader();
//         // reader.onloadend = () => {
//         //     const base64Audio = reader.result;
//         //     onSend?.(base64Audio);
//         //     deleteAudio();
//         // };
//         // reader.readAsDataURL(audioBlob);
//     };

//     const togglePlayPause = () => {
//         // if (!waveSurfer) return;
//         // waveSurfer.playPause();
//         // setIsPlaying(waveSurfer.isPlaying());
//     };

//     return (
//         <div className="flex items-center gap-2">
//             {/* If audio is recorded */}
//             {/* {audioBlob && (
//                 <>
//                     <button type="button" onClick={deleteAudio} className="text-red-500">
//                         <Trash2 size={20} />
//                     </button>

//                     <button type="button" onClick={togglePlayPause} className="text-blue-600">
//                         {isPlaying ? <Pause size={20} /> : <Play size={20} />}
//                     </button>

//                     <div ref={waveformRef} className="w-[120px] h-[30px]" />

//                     <button type="button" onClick={handleSend} className="text-purple-600">
//                         <Send size={20} />
//                     </button>
//                 </>
//             )} */}

//             {/* Mic (recording toggle) */}
//             <button
//                 type="button"
//                 onClick={() => (isRecording ? stopRecording() : startRecording())}
//                 className={`rounded-full p-2 ${isRecording ? "bg-red-500" : "bg-green-500"} text-white`}
//             >
//                 <Mic size={20} />
//             </button>

//             {recordings.length > 0 && (
//                 <div className="flex items-center gap-2">
//                     {recordings.map((recUrl, index) => (
//                         <>
//                             <audio key={index} controls
//                                 src={recUrl}
//                                 className="w-[150px] h-[30px]"
//                             />
//                             <a href={recUrl} download>download</a>
//                         </>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }

// export default AudioRecorder;

import React, { useRef, useState } from "react";
import { Mic, Trash2, Play, Pause, Send } from "lucide-react";

const AudioRecorder = ({ onSend }) => {
    const mediaRecorderRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const [audioChunks, setAudioChunks] = useState([]);
    const [mergedAudioBlob, setMergedAudioBlob] = useState(null);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks = [];

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = () => {
            const newBlob = new Blob(chunks, { type: "audio/webm" });

            setAudioChunks((prevChunks) => {
                const updatedChunks = [...prevChunks, newBlob];
                const merged = new Blob(updatedChunks, { type: "audio/webm" });
                setMergedAudioBlob(merged);
                return updatedChunks;
            });
        };

        mediaRecorderRef.current = recorder;
        recorder.start();
        setIsRecording(true);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current?.state === "recording") {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const deleteAudio = () => {
        setIsRecording(false);
        setAudioChunks([]);
        setMergedAudioBlob(null);
    };

    const handleSend = () => {
        if (!mergedAudioBlob) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Audio = reader.result;
            onSend?.(base64Audio);
            deleteAudio();
        };
        reader.readAsDataURL(mergedAudioBlob);
    };

    return (
        <div className="flex items-center gap-3 flex-wrap">
            <button
                type="button"
                onClick={() => (isRecording ? stopRecording() : startRecording())}
                className={`rounded-full p-2 ${isRecording ? "bg-red-500" : "bg-green-500"} text-white`}
            >
                <Mic size={20} />
            </button>

            {mergedAudioBlob && (
                <>
                    <audio controls src={URL.createObjectURL(mergedAudioBlob)} className="w-[150px] h-[30px]" />
                    <a href={URL.createObjectURL(mergedAudioBlob)} download="recording.webm" className="text-blue-600">
                        Download
                    </a>
                    <button onClick={deleteAudio} className="text-red-500"><Trash2 size={20} /></button>
                    <button onClick={handleSend} className="text-purple-600"><Send size={20} /></button>
                </>
            )}
        </div>
    );
};

export default AudioRecorder;
