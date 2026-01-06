import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import VoiceInput from './VoiceInput';
import { sendMessage, sendVoiceText } from '../services/api';

const ChatWindow = () => {
    // Steps: 0: Name, 1: Contact, 2: Email, 3: Query, 4: Active Chat
    const [step, setStep] = useState(0);
    const [userDetails, setUserDetails] = useState({
        name: '',
        contact: '',
        email: ''
    });

    const [messages, setMessages] = useState([
        { text: "Hello! May I know your name?", sender: 'bot' }
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
            // Collecting User Details
            let nextMessage = "";
            let nextStep = step + 1;
            let isValid = true;

            if (step === 0) {
                // Name -> Email
                setUserDetails(prev => ({ ...prev, name: text }));
                nextMessage = `Nice to meet you, ${text}. Could you please share your email address?`;
            } else if (step === 1) {
                // Email Verification -> Contact
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(text)) {
                    setUserDetails(prev => ({ ...prev, email: text }));
                    nextMessage = "Thanks. And your contact number?";
                } else {
                    nextMessage = "That doesn't look like a valid email. Please try again.";
                    isValid = false;
                    nextStep = step; // Stay on same step
                }
            } else if (step === 2) {
                // Contact -> Query
                setUserDetails(prev => ({ ...prev, contact: text }));
                nextMessage = "Great! How can I help you regarding Mansa Infotech today?";
            }

            setTimeout(() => {
                setMessages(prev => [...prev, { text: nextMessage, sender: 'bot' }]);
                if (isValid) {
                    setStep(nextStep);
                }
                setIsLoading(false);
            }, 600); // Small delay for natural feel

        } else if (step === 3) {
            // Sending the Initial Query with Context
            const contextPayload = `User Context:\n- Name: ${userDetails.name}\n- Email: ${userDetails.email}\n- Contact: ${userDetails.contact}\n\nUser Question: ${text}`;

            try {
                const data = await sendMessage(contextPayload);
                const botMessage = { text: data.reply, sender: 'bot' };
                setMessages(prev => [...prev, botMessage]);
                setStep(4); // Move to active chat mode
            } catch (error) {
                const errorMessage = { text: "Sorry, something went wrong.", sender: 'bot' };
                setMessages(prev => [...prev, errorMessage]);
            } finally {
                setIsLoading(false);
            }

        } else {
            // Normal Chat Flow
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
