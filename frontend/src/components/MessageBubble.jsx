import React from 'react';
import ReactMarkdown from 'react-markdown';

const MessageBubble = ({ message }) => {
    return (
        <div className={`message ${message.sender}`}>
            <ReactMarkdown>{message.text}</ReactMarkdown>
        </div>
    );
};

export default MessageBubble;
