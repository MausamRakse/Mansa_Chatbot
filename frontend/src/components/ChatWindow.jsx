import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import VoiceInput from './VoiceInput';
import { sendMessage, sendVoiceText } from '../services/api';

const ChatWindow = () => {
    const [messages, setMessages] = useState([
        { text: "Hello! How can I help you with Mansa Infotech today?", sender: 'bot' }
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

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userMessage = { text: inputText, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInputText("");
        setIsLoading(true);

        try {
            const data = await sendMessage(userMessage.text);
            const botMessage = { text: data.reply, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            const errorMessage = { text: "Sorry, something went wrong.", sender: 'bot' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVoiceResult = async (transcript) => {
        const userMessage = { text: transcript, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const data = await sendVoiceText(transcript);
            const botMessage = { text: data.reply, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            const errorMessage = { text: "Sorry, I couldn't process that.", sender: 'bot' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
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
