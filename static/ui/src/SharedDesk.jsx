import React, { useState, useEffect } from 'react';
import Room from './Room';
import annyang from './Annyang'
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:5000";


const SharedDesk = ({ roomName, token, handleLogout, username }) => {

    const [talk, setTalk] = useState(false);
    const [incomingCall, setIncomingCall] = useState(false);
    const [incomingCallRoom, setIncomingCallRoom] = useState("");
    const [incomingCaller, setIncomingCaller] = useState("");
    const [otherUsers, setOtherUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [socket, setSocket] = useState(socketIOClient(ENDPOINT))

    useEffect(() => {
        var otherUser = otherUsers[0] || "";
        var commands = {
            "Hey": () => {
                callAll();
            },
            'Yes': () => { callAll() },
            'Hangup': () => { setTalk(false) }
        };
        annyang.addCommands(commands)
        annyang.start()

        socket.emit('register', {
            data: { roomName, username }
        });


        socket.on("user-registered", data => {
            setAllUsers(data.users);
            var others = allUsers.filter(item => item !== username)
            setOtherUsers(others)
        });

        socket.on("calls", data => {
            setIncomingCall(true)
            setIncomingCallRoom(data.data.roomName)
            setIncomingCaller(data.data.caller)
        });
    }, []);



    const callAll = () => {
        setTalk(true)
        var otherUser = otherUsers[0] || "";
        socket.emit('call', {
            data: { roomName, otherUser, caller: username }
        });
    }


    return (

        <div>
            <h1> People on the Desk <em>{roomName}</em> :
            {allUsers.map((item, index) => (
                " " + item + ","
            ))}
            </h1>
            {incomingCall === true && incomingCaller != username ? <div style={{ backgroundColor: "red" }}>
                <h3>Incoming Call!</h3>
                <h4>Say "Yes" to pickup!</h4>
                <br />
                <br />
                <button onClick={() => setIncomingCall(false)}>Close</button>
            </div> : null}
            {otherUsers.length > 0 ? <p> Say "Hey ..." to talk to them.</p> : null}
            <button onClick={() => callAll()}>Talk</button>
            <button onClick={handleLogout} style={{ right: 20, position: "absolute" }}>Log out!</button>
            {talk ? <Room roomName={roomName} token={token} handleLogout={handleLogout} talk={talk} setTalk={setTalk} />
                : null}

        </div>
    );
};

export default SharedDesk;