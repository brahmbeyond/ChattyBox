import React, { useEffect, useState } from 'react'
import { db } from '../firebase-config'
import { collection, getDocs, query, where } from 'firebase/firestore'
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import { Button } from '@mui/material';
import EnterRoomModal from './EnterRoomModal';



const Rooms = () => {
    const [roomName, setRoomName] = useState("");
    const [displayRooms, setDisplayRooms] = useState([]);
    const [roomPassword, setRoomPassword] = useState("");
    const [open, setOpen] = useState(false);
    const collectionRef = collection(db, "messages");

    const redirectToChatRoom = (room) => {
        const q = query(collectionRef, where("roomName", "==", room));

        const getRoom = async () => {
            const querySnapshot = await getDocs(q);
            let data = [];
            querySnapshot.forEach((doc) => {
                data.push({ ...doc.data(), id: doc.id });
            });
            setRoomPassword(data[0].roomPassword)
            setRoomName(room);
            setOpen(true);
        }
        getRoom();
    }

    const queryRooms = query(collectionRef);
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

            {open && <EnterRoomModal roomName={roomName} heading={"Enter Room "} password={roomPassword} open={open} setOpen={setOpen} buttonName={"Verify Password"} />}




            <div>
                <h2>Available Rooms</h2>

                <div>
                    {filteredRoom.map((room) => {
                        return <Card key={room.id} sx={{ maxWidth: 345, maxHeight: 190, margin: 3, bgcolor: 'rgb(5 14 30 / 59%)',color:'white' }} >
                            <CardMedia
                                component="img"
                                height="100"
                                alt={room}
                                image="/images/boysChatRoom.jpg"
                            />
                            <CardHeader sx={{ maxHeight: 3, }}
                                title={room.toUpperCase()}
                            />
                            <CardContent>
                                <Button size="small"
                                    variant="contained" onClick={() => redirectToChatRoom(room)}
                                    color="info"
                                   
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
