import React, { useEffect, useState } from 'react'
import { db } from '../firebase-config'
import { collection, getDocs, query } from 'firebase/firestore'
import Chat from './Chat';
import { useNavigate } from 'react-router-dom';


import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import { Button } from '@mui/material';

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
        <>

            <div>
                <h2>Available Rooms</h2>

                <div>
                    {filteredRoom.map((room) => {
                        return   <Card key={room.id} sx={{ maxWidth: 345, maxHeight: 190,  margin:3}} >
                           
                            <CardMedia
                                component="img"
                                height="100"
                                image="https://mui.com/static/images/cards/live-from-space.jpg"
                                alt={room}
                            />
                             <CardHeader sx={{ maxHeight:3, }}                             
                                title={room.toUpperCase()}
                            />
                            <CardContent>
                                <Button size="small"
                                 variant="contained" onClick={() => redirectToChatRoom(room)} 
                             color="warning"
                                >Enter</Button>
                            </CardContent>
                        </Card>
                    })}
                </div>


            </div>
        </>
    )
}

export default Rooms
