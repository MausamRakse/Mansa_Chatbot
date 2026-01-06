import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import VoiceInput from './VoiceInput';
import { sendMessage, sendVoiceText } from '../services/api';

const ChatWindow = () => {
    // Steps: 0: Query, 1: Name, 2: Email, 3: Active Chat
    const [step, setStep] = useState(0);
    const [userDetails, setUserDetails] = useState({
        name: '',
        contact: '',
        email: '',
        query: ''
    });

    const [messages, setMessages] = useState([
        { text: "Hello! This is a Consultant from Mansa Infotech. How can I help you today?", sender: 'bot' }
    ]);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const processInput = async (text) => {
        const userMessage = { text, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        if (step < 3) {
            // Onboarding Flow
            let nextMessage = "";
            let nextStep = step + 1;
            let isValid = true;
            let shouldTriggerBackend = false;

            if (step === 0) {
                // Query -> Name
                setUserDetails(prev => ({ ...prev, query: text }));
                nextMessage = "I'd be happy to assist you with that. May I know your name please?";
            } else if (step === 1) {
                // Name -> Email
                setUserDetails(prev => ({ ...prev, name: text }));
                nextMessage = `Thanks ${text}. Could you please share your email address?`;
            } else if (step === 2) {
                // Email Verification -> Backend Request
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(text)) {
                    setUserDetails(prev => ({ ...prev, email: text }));
                    // Don't set nextMessage here immediately if we are going to call backend
                    // But we need to know what to do. 
                    // Let's set a loading state and trigger backend.
                    shouldTriggerBackend = true;
                } else {
                    nextMessage = "That doesn't look like a valid email. Please try again.";
                    isValid = false;
                    nextStep = step; // Stay on same step
                }
            }

            if (shouldTriggerBackend) {
                // Sending the Initial Query (collected in Step 0) with Context
                // We use the 'text' here as the email, so we need to grab the query from state (BUT state update might be async)
                // userDetails.query might not be updated yet if we set it in step 0? 
                // Wait, step 0 ran previously, so userDetails.query IS set.
                // usedDetails.email is NOT set yet in the state variable due to closure, so use 'text'.

                const contextPayload = `User Context:\n- Name: ${userDetails.name}\n- Email: ${text}\n- Contact: Not Provided\n\nUser Question: ${userDetails.query}`;

                try {
                    const data = await sendMessage(contextPayload);
                    const botMessage = { text: data.reply, sender: 'bot' };
                    setMessages(prev => [...prev, botMessage]);
                    setStep(3); // Move to active chat mode
                } catch (error) {
                    const errorMessage = { text: "Sorry, something went wrong.", sender: 'bot' };
                    setMessages(prev => [...prev, errorMessage]);
                } finally {
                    setIsLoading(false);
                }

            } else {
                setTimeout(() => {
                    setMessages(prev => [...prev, { text: nextMessage, sender: 'bot' }]);
                    if (isValid) {
                        setStep(nextStep);
                    }
                    setIsLoading(false);
                }, 600);
            }

        } else {
            // Normal Chat Flow (Step 3+)
            try {
                const data = await sendMessage(text);
                const botMessage = { text: data.reply, sender: 'bot' };
                setMessages(prev => [...prev, botMessage]);
            } catch (error) {
                const errorMessage = { text: "Sorry, something went wrong.", sender: 'bot' };
                setMessages(prev => [...prev, errorMessage]);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleSend = async () => {
        if (!inputText.trim()) return;
        const text = inputText;
        setInputText("");
        await processInput(text);
    };

    const handleVoiceResult = async (transcript) => {
        await processInput(transcript);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="chat-container">
            <div className="messages-area">
                {messages.map((msg, index) => (
                    <MessageBubble key={index} message={msg} />
                ))}
                {isLoading && <div className="message bot">Typing...</div>}
                <div ref={messagesEndRef} />
            </div>
            <div className="input-area">
                <VoiceInput onSpeechResult={handleVoiceResult} />
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your message..."
                />
                <button onClick={handleSend} disabled={isLoading}>
                    ➤
                </button>
            </div>
        </div>
    );
};

export default ChatWindow;
