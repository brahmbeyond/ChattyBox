import React, { useEffect, useState } from 'react'
import { db, auth } from '../firebase-config'
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom"
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Button, Fab, Grid, TextField } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
// import moduleName from '@'
import SendIcon from '@mui/icons-material/Send';
import { red } from '@mui/material/colors';

const Chat = () => {

    const { roomName } = useParams();
    const [text, setText] = useState("");
    const [displayMessages, setDisplayMessages] = useState([]);
    const [editRoomName, setEditRoomName] = useState("");
    const navigate = useNavigate();

    const messageRef = collection(db, "messages");

    useEffect(() => {
        const queryMessages = query(messageRef, where("roomName", "==", roomName), orderBy("createdAt"))

        const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
            let messages = [];
            snapshot.forEach((doc) => {
                messages.push({ ...doc.data(), id: doc.id });
            });
            setDisplayMessages(messages);
        });

        return () => unsuscribe();
    }, [roomName])

    const sendMessage = async (event) => {
        event.preventDefault();
        if (text === "") return;

        await addDoc(messageRef, {
            text,
            createdAt: serverTimestamp(),
            user: auth.currentUser.displayName,
            roomName: roomName,
            email: auth.currentUser.email,
            pic: auth.currentUser.photoURL,

        })

        setText("");
    }


    const deleteRoom = () => {
        if (confirm('Alert: Room will be permanentaly Deleted!!!!!!')) {
            const RoomREf = doc(db, "messages", roomName);
            displayMessages.map((msg) => {
                const messageRef = doc(db, "messages", msg.id);
                deleteDoc(messageRef);
                navigate('/') && location.reload();
            })

        }

    }
    // const deleteMessage = async (id) => {
    //     const messageRef = doc(db, "messages", id);
    //     await deleteDoc(messageRef);

    // }
// const updateRoomName=()=>{
//     const RoomREf = doc(db, "messages", roomName);
//     displayMessages.map((msg) => {
//         const messageRef = doc(db, "messages", msg.id);
//         updateDoc(messageRef,{roomName:editRoomName});
       
//     })
// }

    return (

        <>
            {/* <CssBaseline /> */}
            <Container maxWidth="md" >
                <Box sx={{ bgcolor: '#060b22'}} pt={2} >
                    <Grid container >

                        <Grid xs={6}>

                            <Button color="warning" variant="contained" onClick={deleteRoom} >Delete Room</Button>
                        </Grid>
                        <Grid xs={6}>

                            <Button color="warning" variant="contained" onClick={() => navigate('/')}>Home</Button>
                        </Grid>



                    </Grid>

                    <div style={{ margin: 30 }}>
                        <h2 >Room Name: {roomName}</h2>
                        {/* <input type="text" value={editRoomName} onChange={(e)=>setEditRoomName(e.target.value)}/>
                        <button onClick={updateRoomName}>hi</button> */}
                    </div>
                    <List >
                        {displayMessages.map((msg) => {
                            return <>

                                <ListItem alignItems="flex-start" key={msg.id}>
                                    <ListItemAvatar>
                                        <Avatar alt="Remy Sharp" src={msg.pic} />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={msg.user}
                                        secondary={
                                            <React.Fragment>
                                                <Typography
                                                    sx={{ display: 'inline' }}
                                                    component="span"
                                                    variant="body2"
                                                    color="white"
                                                >
                                                    {msg.text}
                                                </Typography>
                                                {/* {msg.text} */}
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>
                                
                                <Divider variant="inset" component="li" />
                            </>

                        })}
                    </List>

                    <Box
                        display="flex"
                        justifyContent="center"
                        mb={5}
                    >
                        <Paper
                            component="form"
                            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 1 / 2, textAlign: 'center' }}
                        >

                            <InputBase
                                sx={{ ml: 1, flex: 1 }}
                                placeholder="Message"
                                inputProps={{ 'aria-label': 'search google maps' }}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />

                        </Paper>
                        <Fab color="success" size="small" aria-label="add"
                            sx={{ ml: 1 }

                            }
                        >
                            <SendIcon onClick={sendMessage} />
                        </Fab>

                    </Box>

                </Box>
            </Container>

        </>
    )
}

export default Chat;
