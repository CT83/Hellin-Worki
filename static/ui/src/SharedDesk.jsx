import React, { useState, useEffect } from 'react';
import Room from './Room';
import annyang from './Annyang'



const SharedDesk = ({ roomName, token, handleLogout, handleDisconnect }) => {

    const [talk, setTalk] = useState(false);

    useEffect(() => {
        var commands = {
            'Hey Rohit': () => {
                setTalk(true)
            },
            'Yes': () => { setTalk(true) },
            'Hangup': () => { setTalk(false) }
        };
        annyang.addCommands(commands)
        annyang.start()


        return () => {
            annyang.abort()
        }
    });


    return (

        <div>
            <h1> You are sitting at the desk <em>{roomName}</em> with ...</h1>
            <p> Say "Hi ..." to talk to them.</p>
            <button onClick={() => setTalk(!talk)}>Talk</button>
            {talk ? <Room roomName={roomName} token={token} handleLogout={handleLogout} />
                : null}
        </div>
    );
};

export default SharedDesk;