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
            'Yes': () => { setTalk(true) },
            'Hangup': () => { hangUp() }
        };
        annyang.addCommands(commands)
        annyang.start()

        socket.emit('register', {
            data: { roomName, username }
        });


        socket.on("user-registered", data => {
            setAllUsers(data.users);
            var others = data.users.filter(item => item != username)
            setOtherUsers(others)
        });

        socket.on("calls", data => {
            if (data.data.caller != username && data.data.roomName != roomName) {
                setIncomingCall(true)
                setIncomingCallRoom(data.data.roomName)
                setIncomingCaller(data.data.caller)
            }
        });
    }, []);



    const callAll = () => {
        setTalk(true)
        var otherUser = otherUsers[0] || "";
        socket.emit('call', {
            data: { roomName, otherUser, caller: username }
        });
    }

    const hangUp = () => {
        setTalk(false)
        setIncomingCall(false)
    }

    return (

        <div class="container-fluid">
            <div class="container" style={{ backgroundColor: "#DCD5CD", paddingBottom: "5px" }}>

                {otherUsers.length == 0 ?
                    <div>
                        <h3>This desk is empty right now!</h3><br />
                        <p>Ask your partner to join the desk <em>{roomName}</em>.</p>
                    </div>
                    : null}

                {!talk && otherUsers.length > 0 ?
                    <div>
                        <h3> You are on desk <em>{roomName}</em> with :
                {otherUsers.map((item, index) => (
                            " " + item + ","
                        ))}
                        </h3>
                        <br />
                        <p> Say <em>"Hey!"</em> aloud to talk to them or press the button below. 👇🏽</p>
                        <button onClick={() => callAll()}>Hey!</button>
                    </div>
                    : null}
            </div>

            {incomingCall === true && !talk ?
                <div style={{ backgroundColor: "red" }}>
                    <h3>Incoming Call!</h3>
                    <h4>Say "Yes" to pickup!</h4>
                    <br />
                    <br />
                    <a onClick={() => setIncomingCall(false)}>Close</a>
                </div> : null}


            <a onClick={handleLogout} style={{ right: 20, top: 10, position: "absolute" }}>Log out</a>
            {talk ? <Room roomName={roomName} token={token} handleLogout={handleLogout} talk={talk} setTalk={setTalk} />
                : null}

        </div>
    );
};

export default SharedDesk;