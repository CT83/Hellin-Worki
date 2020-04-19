import React, { useState, useCallback } from 'react';
import Lobby from './Lobby';
import Room from './Room';
import SharedDesk from './SharedDesk';
var Chance = require('chance');


const VideoChat = () => {
    var chance = new Chance();
    const [username, setUsername] = useState('');
    const [roomName, setRoomName] = useState(chance.word({ syllables: 2 }));
    const [token, setToken] = useState(null);

    const handleUsernameChange = useCallback(event => {
        setUsername(event.target.value);
    }, []);

    const handleRoomNameChange = useCallback(event => {
        setRoomName(event.target.value);
    }, []);

    const handleSubmit = useCallback(
        async event => {
            event.preventDefault();
            const data = await fetch('http://localhost:5000/token-room', {
                method: 'POST',
                body: JSON.stringify({
                    identity: username,
                    room: roomName
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json());
            setToken(data.token);
        },
        [roomName, username]
    );

    const handleLogout = useCallback(event => {
        setToken(null);
    }, []);

    let render;
    if (token) {
        render = (
            <SharedDesk roomName={roomName} token={token} handleLogout={handleLogout} username={username} />
        );
    } else {
        render = (
            <Lobby
                username={username}
                roomName={roomName}
                handleUsernameChange={handleUsernameChange}
                handleRoomNameChange={handleRoomNameChange}
                handleSubmit={handleSubmit}
            />
        );
    }
    return render;
};

export default VideoChat;