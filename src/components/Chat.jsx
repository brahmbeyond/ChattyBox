import React, { useEffect, useState, useRef } from 'react'
import { db, auth } from '../firebase-config'
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Button, Fab, Grid } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import SendIcon from '@mui/icons-material/Send';


const Chat = () => {
    const [text, setText] = useState("");
    // const [roomPassword, setRoomPassword] = useState("");
    const [displayMessages, setDisplayMessages] = useState([]);
    // const [editRoomName, setEditRoomName] = useState("");
    const listRef = useRef(null);
    //room poassword extract with useloaction , that was sent with use navigate hook
    const loacation = useLocation();
    const roomPassword = loacation.state.password;

    const { roomName } = useParams();

    const navigate = useNavigate();

    const messageRef = collection(db, "messages");

    useEffect(() => {
        // Scroll to the last list item when displayMessages change
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [displayMessages]);

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

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage(event);
        }
    };
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
            roomPassword,
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

            {/* <img src={auth.currentUser.photoURL} alt="f" /> */}
            <Container maxWidth="md" >
                <Box sx={{ bgcolor: '#060b22', }} pt={2} pb={1}  >
                    <Grid container >

                        <Grid xs={4}>

                            <Button color="warning" variant="contained" onClick={deleteRoom} >Delete</Button>
                        </Grid>
                        <Grid xs={4} display="flex" justifyContent="space-evenly" alignItems="center">

                            <Avatar alt="Remy Sharp" src={auth.currentUser.photoURL} sx={{ margin: 'auto' ,border:'3px solid orangered'}} /> 


                            <span style={{fontWeight:'bold',color:'orangered'}}> {auth.currentUser.displayName}</span>
                        </Grid>
                        <Grid xs={4}>

                            <Button color="warning" variant="contained" onClick={() => navigate('/')}>Home</Button>
                        </Grid>



                    </Grid>

                    <div style={{ margin: 30 }}>
                        <h2 >Room Name : {roomName.toUpperCase()}</h2>
                        {/* <input type="text" value={editRoomName} onChange={(e)=>setEditRoomName(e.target.value)}/>
                        <button onClick={updateRoomName}>hi</button> */}
                    </div>
                    <List ref={listRef} sx={{ height: '65vh', overflow: 'auto', bgcolor: '#181a24', }}>
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
                        my={3}
                    >
                        <Paper
                            component="form"
                            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '50vw', textAlign: 'center' }}
                        >

                            <InputBase
                                sx={{ ml: 1, flex: 1 }}
                                placeholder="Message"
                                inputProps={{ 'aria-label': 'search google maps' }}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />

                        </Paper>
                        <Fab color="warning" size="small" aria-label="add"
                            sx={{ ml: 1 }

                            }
                            onClick={sendMessage}
                        >
                            <SendIcon />
                        </Fab>

                    </Box>

                </Box>
            </Container>

        </>
    )
}

export default Chat;
