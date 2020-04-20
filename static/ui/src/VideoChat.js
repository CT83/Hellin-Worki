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
            <div>
                <Lobby
                    username={username}
                    roomName={roomName}
                    handleUsernameChange={handleUsernameChange}
                    handleRoomNameChange={handleRoomNameChange}
                    handleSubmit={handleSubmit}
                />

                <div className="container">
                    <hr></hr><br></br>
                    <h3>Welcome to 🐣 Hellin' Worki </h3>
                    <p>Hellin Worki is a video conferencing platform which seamlessly dials your coworkers when you call out their name, a "Yes" and you are connected.</p>
                    <br />
                    <h4>Problem</h4>
                    <p>Telling your coworkers to be constantly connected on 4 hour long video calls is obtrusive, awkward and plain weird. You could stay connected
                        and disable your video ...</p>
                    <a href="https://dev.to/rohansawant/hellin-worki-now-joe-s-just-a-shout-away-twiliohackathon-2mh">Read the Blog</a>
                    <br />
                    <br />
                    <h4>Working</h4>
                    <ol>
                        <li>You and your coworker Joe join a Room.</li>
                        <li>Both enter their usernames</li>
                        <li>The microphone listens and waits for you to say "Hey Joe!"</li>
                        <li>When you do, Joe is notified and he can say, "Yes!" to pickup the call.</li>
                    </ol>
                    <br></br>
                That's it!

                </div>

            </div>
        );
    }
    return render;
};

export default VideoChat;