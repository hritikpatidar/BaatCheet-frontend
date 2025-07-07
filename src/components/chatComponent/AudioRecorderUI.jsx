import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Mic, Trash2, Play, Pause, Upload, Send } from "lucide-react";

const AudioRecorderUI = ({ onSend }) => {
    const mediaRecorder = useRef(null);
    const waveformRef = useRef(null);
    const audioUrlRef = useRef(null);
    const [chunks, setChunks] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [waveSurfer, setWaveSurfer] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        mediaRecorder.current = recorder;

        recorder.ondataavailable = (e) => setChunks((prev) => [...prev, e.data]);

        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: "audio/webm" });
            setAudioBlob(blob);
            const url = URL.createObjectURL(blob);
            audioUrlRef.current = url;
        };

        recorder.start();
        setChunks([]);
        setIsRecording(true);
        setIsPaused(false);
    };

    const stopRecording = () => {
        if (mediaRecorder.current?.state !== "inactive") {
            mediaRecorder.current.stop();
            setIsRecording(false);
        }
    };

    const pauseOrResume = () => {
        if (!mediaRecorder.current) return;
        if (isPaused) {
            mediaRecorder.current.resume();
            setIsPaused(false);
        } else {
            mediaRecorder.current.pause();
            setIsPaused(true);
        }
    };

    const deleteAudio = () => {
        setAudioBlob(null);
        setChunks([]);
        setIsRecording(false);
        setIsPaused(false);
        setIsPlaying(false);
        if (waveSurfer) {
            waveSurfer.destroy();
            setWaveSurfer(null);
        }
    };

    const handleSend = () => {
        if (!audioBlob) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Audio = reader.result;
            onSend?.(base64Audio);
            deleteAudio();
        };
        reader.readAsDataURL(audioBlob);
    };

    const togglePlayPause = () => {
        if (!waveSurfer) return;
        waveSurfer.playPause();
        setIsPlaying(waveSurfer.isPlaying());
    };

    useEffect(() => {
        if (!audioBlob || !waveformRef.current) return;

        const url = URL.createObjectURL(audioBlob);
        const ws = WaveSurfer.create({
            container: waveformRef.current,
            waveColor: "#999",
            progressColor: "#2563eb",
            height: 30,
            responsive: true,
            normalize: true,
        });

        ws.load(url);

        ws.on("ready", () => {
            setWaveSurfer(ws);
        });

        ws.on("finish", () => {
            setIsPlaying(false);
        });

        return () => {
            ws.destroy();
        };
    }, [audioBlob]);

    return (
        <div className="flex items-center gap-2">
            {/* If audio is recorded */}
            {audioBlob && (
                <>
                    {/* Delete */}
                    <button type="button" onClick={deleteAudio} className="text-red-500">
                        <Trash2 size={20} />
                    </button>

                    {/* Play/Pause */}
                    <button type="button" onClick={togglePlayPause} className="text-blue-600">
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>

                    {/* Waveform */}
                    <div ref={waveformRef} className="w-[120px] h-[30px]" />

                    {/* Send */}
                    <button type="button" onClick={handleSend} className="text-purple-600">
                        <Send size={20} />
                    </button>
                </>
            )}

            {/* Mic (recording toggle) */}
            <button
                type="button"
                onClick={() => (isRecording ? stopRecording() : startRecording())}
                className={`rounded-full p-2 ${isRecording ? "bg-red-500" : "bg-green-500"} text-white`}
            >
                <Mic size={20} />
            </button>
        </div>
    );
};

export default AudioRecorderUI;
