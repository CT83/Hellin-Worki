import React, { useState, useEffect } from 'react';
import Room from './Room';
import annyang from './Annyang'
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:5000";


const SharedDesk = ({ roomName, token, handleLogout, username }) => {

    const [talk, setTalk] = useState(false);
    const [response, setResponse] = useState("");
    const [socket, setSocket] = useState(socketIOClient(ENDPOINT))

    useEffect(() => {
        var commands = {
            'Hey Rohit': () => {
                if (!talk) {
                    socket.emit(
                        'call',
                        {
                            data: { roomName, username }
                        }, () => {
                        }
                    );
                    setTalk(true)
                }
            },
            'Yes': () => { setTalk(true) },
            'Hangup': () => { setTalk(false) }
        };
        annyang.addCommands(commands)
        annyang.start()

        socket.on("api", data => {
            setResponse(data);
        });
        socket.emit(
            'register',
            {
                data: { roomName, username }
            }, () => {
            }
        );

        return () => {
            annyang.abort()
            socket.disconnect()
        }
    });


    return (

        <div>
            <h1> You are sitting at the desk <em>{roomName}</em> with ...</h1>
            <p> Say "Hi ..." to talk to them.</p>
            <button onClick={() => setTalk(!talk)}>Talk</button>
            {talk ? <Room roomName={roomName} token={token} handleLogout={handleLogout} />
                : null}
            <p>
                It's {response.data}
            </p>
        </div>
    );
};

export default SharedDesk;