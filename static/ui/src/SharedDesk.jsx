import React, { useState, useEffect } from 'react';
import Room from './Room';
import annyang from './Annyang'
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:5000";


const SharedDesk = ({ roomName, token, handleLogout, username }) => {

    const [talk, setTalk] = useState(false);
    const [otherUsers, setOtherUsers] = useState([]);
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

        socket.on("user-registered", data => {
            console.log(data.users)
            setOtherUsers(data.users);
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
            <h1> Others on the Desk <em>{roomName}</em> :
            {otherUsers.map((item, index) => (
                username != item ? " " + item : null
            ))}
            </h1>
            {otherUsers.length > 1 ? <p> Say "Hey ..." to talk to them.</p> : null}
            <button onClick={() => setTalk(!talk)}>Talk</button>
            <button onClick={handleLogout} style={{right:20,position:"absolute"}}>Log out!</button>
            {talk ? <Room roomName={roomName} token={token} handleLogout={handleLogout} talk={talk} setTalk={setTalk} />
                : null}
        </div>
    );
};

export default SharedDesk;