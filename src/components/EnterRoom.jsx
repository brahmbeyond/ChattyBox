import React, { useState } from 'react'
import Rooms from './Rooms';
import { useNavigate } from 'react-router-dom';

const EnterRoom = () => {
    const [roomName, setRoomName] = useState("");
    const [isRoom, setIsRoom] = useState(false)
    const history = useNavigate();
    const enterRoomFunction = () => {
        setIsRoom(true)
        refreshRoomFun()
    }


    if (isRoom) {
        history(`./Chat/${roomName}`)
        setIsRoom(false)
    }

    return (
        <div className='container'>
            <div className='room-container'>
                <Rooms />
            </div>
            <div className='enter-room--container'>
                <label htmlFor="EnterRoom" className='enter-room--container--label'>   Enter Room / Create Room
                </label>
                <input type="text"
                    name="room"
                    className="enter-room--container--input"
                    value={roomName}
                    placeholder='type room name'
                    onChange={(e) => setRoomName(e.target.value)}
                />
                <button onClick={enterRoomFunction} className='signIn-button'>Enter</button>

            </div>
        </div>

    )
}

export default EnterRoom;

