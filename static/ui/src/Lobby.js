import React from 'react';

const Lobby = ({
    username,
    handleUsernameChange,
    roomName,
    handleRoomNameChange,
    handleSubmit
}) => {
    return (
        <form onSubmit={handleSubmit}>
            <h2>Sit at a Desk </h2>
            <div>
                <label htmlFor="name">Your Name</label>
                <input
                    type="text"
                    id="field"
                    value={username}
                    onChange={handleUsernameChange}
                    required
                />
            </div>

            <div>
                <label htmlFor="room">Name of Desk</label>
                <input
                    type="text"
                    id="room"
                    value={roomName}
                    onChange={handleRoomNameChange}

                />
                Share this with your partner
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default Lobby;