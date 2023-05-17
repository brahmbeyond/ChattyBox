import React, { useEffect, useState } from 'react'
import { db } from '../firebase-config'
import { collection, getDocs, query } from 'firebase/firestore'
import Chat from './Chat';
import { useNavigate } from 'react-router-dom';

const Rooms = () => {

    const [displayRooms, setDisplayRooms] = useState([]);
    const [roomName, setRoomName] = useState("");
    const history = useNavigate();

    const redirectToChatRoom = (room) => {
        setRoomName(room)

        history(`./Chat/${room}`)

    }



    const roomRef = collection(db, "messages")
    const queryRooms = query(roomRef);
    const getAll = async () => {
        const querySnapshot = await getDocs(queryRooms);
        let data = [];
        querySnapshot.forEach((doc) => {
            data.push({ ...doc.data(), id: doc.id });

        });
        setDisplayRooms(data);
    }

    useEffect(() => {
        getAll();
    }, [])

    let filteredRoom = [];
    filteredRoom = displayRooms.map((msg) => {
        return msg.roomName
    }).filter((item, index, arr) => {
        return arr.indexOf(item) === index
    })

    return (
        <div>
            <h2>Available Rooms</h2>

            <div className='room'>
                {filteredRoom.map((room) => {
                    return <div className='roomCard' key={room.id}>
                        <p className='roomCard-name' >{room}</p>
                        <p>
                            <button className='signIn-button' onClick={() => redirectToChatRoom(room)} >Enter</button>
                        </p>
                    </div>
                })}
            </div>

            {roomName && <Chat roomName={roomName} />}

        </div>
    )
}

export default Rooms
