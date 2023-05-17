import React, { useState } from 'react'
import Chat from './Chat';
import Rooms from './Rooms';
import { useNavigate } from 'react-router-dom';



const EnterRoom = () => {

    // const isRoom = false;
    const [roomName, setRoomName] = useState("");
    const [isRoom, setIsRoom] = useState(false)
    // const [refreshRoom, setRefreshRoom] = useState(Math.random * 100);
    const history = useNavigate();
    const enterRoomFunction = () => {
        setIsRoom(true)
        refreshRoomFun()
        console.log("namd rrim")
    }


    if (isRoom) {
        // return <div><Chat roomName={roomName} /></div>
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

