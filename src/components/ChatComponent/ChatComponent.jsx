import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function ChatComponent({ userType }) {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');

    useEffect(() => {
        socket.on('message', (msg) => {
            setMessages(prevMessages => [...prevMessages, { content: msg.content, type: msg.userType }]);
        });
    }, []);

    const sendMessage = () => {
        if (userType === 'admin') {
            socket.emit('admin message', { content: messageInput, type: userType });
        } else {
            socket.emit('message', { content: messageInput, type: userType });
        }
        setMessageInput('');
    };

    return (
        <div>
            <h2>{userType === 'admin' ? 'Admin Chat' : 'Client Chat'}</h2>
            <ul>
                {messages.map((message, index) => (
                    <li key={index} className={message.type === 'admin' ? 'admin-message' : 'client-message'}>{message.content} - {message.type}</li>
                ))}
            </ul>
            <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

export default ChatComponent;
