import React, { useState } from 'react'
import Rooms from './Rooms';
import { db } from '../firebase-config'
import { collection, getDocs, query, where } from 'firebase/firestore'
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Button, TextField } from '@mui/material';
import EnterRoomModal from './EnterRoomModal';
import Fireflies from '../CssBg/Fireflies';


const EnterRoom = () => {
    const [roomName, setRoomName] = useState("");
    const [roomPassword, setRoomPassword] = useState("");
    //modal states
    const [open, setOpen] = useState(false);
    const [create, setCreate] = useState(false);

    const handleClose = () => setOpen(false);

    const collectionRef = collection(db, "messages");


    //  when enter , check for the if room empty or not (by query data using condition for roomname) then check if array is empty or not then procede
    const checkRoom = () => {
        const q = query(collectionRef, where("roomName", "==", roomName));
        const getRoom = async () => {
            const querySnapshot = await getDocs(q);
            let data = [];
            querySnapshot.forEach((doc) => {
                data.push({ ...doc.data(), id: doc.id });

            });

            if (data.length === 0) { //create new room
                setCreate(true);

            }
            else {  // enter already present
                setRoomPassword(data[0].roomPassword)
                setOpen(true);
            }
        }

        getRoom();

    }


    return (
        <>
        {/* <Fireflies/> */}
            {/* modal for verify password */}
            {open && <EnterRoomModal roomName={roomName} heading={"Enter Room "} password={roomPassword} open={open} setOpen={setOpen} buttonName={"Verify Password"} />}

            {/* modal for create room and password */}
            {create && <EnterRoomModal roomName={roomName} heading={"Create Room "} password=" " open={create} setOpen={setCreate} buttonName={"Set Password"} />}


            <Grid container spacing={2} >
                <Grid xs={12} sm={4} >
                    <Rooms />
                </Grid>

                <Grid xs={12} sm={8} display="flex" justifyContent="center" alignItems="center" sx={{
                height:'100vh',

            }} >
                    <Card sx={{ display: 'flex', maxWidth: 361 , bgcolor: 'rgb(5 14 30 / 59%)',}}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flex: '1 0 auto' }}>
                                <TextField
                                    label="Enter Room / Create Room"
                                    variant="standard"
                                    color="warning"
                                    focused
                                    value={roomName}
                                    onChange={(e) => setRoomName(e.target.value)}
                                />
                                <Button color="info" onClick={checkRoom} variant="contained" sx={{ marginTop: 3 }}>Enter</Button>

                            </CardContent>
                        </Box>
                        <CardMedia
                            component="img"
                            sx={{ width: 151 }}
                            image="/public/images/girl.jpg"
                        />
                    </Card>
                </Grid>
            </Grid>

        </>

    )
}

export default EnterRoom;

