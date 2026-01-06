import React, { useState, useEffect } from 'react';
import { FaMicrophone, FaStop } from 'react-icons/fa'; // Assuming react-icons is installed or use text

const VoiceInput = ({ onSpeechResult }) => {
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognitionInstance = new SpeechRecognition();
            recognitionInstance.continuous = false;
            recognitionInstance.interimResults = true; // Use interim results to show progress if needed, or false to simplify
            recognitionInstance.lang = 'en-US';

            let silenceTimer = null;

            recognitionInstance.onresult = (event) => {
                // Collect the transcript
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }

                // Only act on final results or implement a debounce if you want to support continuous
                // For this specific bug: The user is seeing partial updates being sent as separate messages?
                // Actually, the issue described "Can... Can you... Can you provide..." sounds like `interimResults` 
                // causing state updates or the component logic sending too eagerly.

                // Fix: Use ONLY final results for submission.
                if (finalTranscript) {
                    onSpeechResult(finalTranscript);
                    setIsListening(false);
                }
            };

            recognitionInstance.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };

            recognitionInstance.onend = () => {
                setIsListening(false);
            };

            setRecognition(recognitionInstance);
        } else {
            console.warn("Web Speech API not supported in this browser.");
        }
    }, [onSpeechResult]);

    const toggleListening = () => {
        if (!recognition) return;

        if (isListening) {
            recognition.stop();
            setIsListening(false);
        } else {
            recognition.start();
            setIsListening(true);
        }
    };

    if (!recognition) return null;

    return (
        <button
            className={`voice-button ${isListening ? 'listening' : ''}`}
            onClick={toggleListening}
            title={isListening ? "Stop Listening" : "Start Voice Input"}
            type="button"
        >
            {isListening ? "🔴" : "🎤"}
        </button>
    );
};

export default VoiceInput;
