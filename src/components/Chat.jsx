import React, { useEffect, useState, useRef } from 'react'
import { db, auth, storage } from '../firebase-config'
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where, deleteDoc, doc } from 'firebase/firestore'
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
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import '../App.css'
import ImageIcon from '@mui/icons-material/Image';

const Chat = () => {
    const [text, setText] = useState("");
    const [displayMessages, setDisplayMessages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

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

    const handleImageSelect = async (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);


    };




    const sendMessage = async (event) => {
        event.preventDefault();

        if (!selectedImage) {
            if (text === "") {
                return;
            } else {
                await addDoc(messageRef, {
                    text,
                    image: "",
                    createdAt: serverTimestamp(),
                    user: auth.currentUser.displayName,
                    roomName: roomName,
                    email: auth.currentUser.email,
                    pic: auth.currentUser.photoURL,
                    roomPassword,
                })
                setText("");
            }

        } else {
console.log("hi")
            // Create a storage reference with a unique name for the image file
            const storageRef = ref(storage, `Images/${selectedImage.name}`);

            // Upload the image file to Firebase Storage
            await uploadBytes(storageRef, selectedImage);

            // Get the download URL of the uploaded image
            const downloadURL = await getDownloadURL(storageRef);

            // Add a new message containing the image URL to the Firestore collection
            await addDoc(messageRef, {
                text: '',
                image: downloadURL,
                createdAt: serverTimestamp(),
                user: auth.currentUser.displayName,
                roomName: roomName,
                email: auth.currentUser.email,
                pic: auth.currentUser.photoURL,
                roomPassword,
            });

            // Clear the selected image
            setSelectedImage(null);
        }





        // if (text === "") return;

        // await addDoc(messageRef, {
        //     text,
        //     createdAt: serverTimestamp(),
        //     user: auth.currentUser.displayName,
        //     roomName: roomName,
        //     email: auth.currentUser.email,
        //     pic: auth.currentUser.photoURL,
        //     roomPassword,
        // })

        // setText("");
    }



    // const handleImageUpload = async () => {
    //     if (!selectedImage) return;

    //     // Create a storage reference with a unique name for the image file
    //     const storageRef = ref(storage, `Images/${selectedImage.name}`);

    //     // Upload the image file to Firebase Storage
    //     await uploadBytes(storageRef, selectedImage);

    //     // Get the download URL of the uploaded image
    //     const downloadURL = await getDownloadURL(storageRef);

    //     // Add a new message containing the image URL to the Firestore collection
    //     await addDoc(messageRef, {
    //         text: '',
    //         image: downloadURL,
    //         createdAt: serverTimestamp(),
    //         user: auth.currentUser.displayName,
    //         roomName: roomName,
    //         email: auth.currentUser.email,
    //         pic: auth.currentUser.photoURL,
    //         roomPassword,
    //     });

    //     // Clear the selected image
    //     setSelectedImage(null);
    // };


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





    return (

        <>

            {/* <img src={auth.currentUser.photoURL} alt="f" /> */}
            <Container maxWidth="md" >
                <Box sx={{ bgcolor: '#060b22b8', }} pt={2} pb={1}  >
                    <Grid container >

                        <Grid xs={4}>

                            <Button  color="info" variant="contained" onClick={deleteRoom} >Delete</Button>
                        </Grid>
                        <Grid xs={4} display="flex" justifyContent="space-evenly" alignItems="center">

                            <Avatar alt="Remy Sharp" src={auth.currentUser.photoURL} sx={{ margin: 'auto', border: '3px solid skyblue' }} />


                            <span style={{ fontWeight: 'bold', color: 'skyblue' }}> {auth.currentUser.displayName}</span>
                        </Grid>
                        <Grid xs={4}>

                            <Button  color="info" variant="contained" onClick={() => navigate('/')}>Home</Button>
                        </Grid>



                    </Grid>

                    <div style={{ margin: 30 }}>
                        <h2 >Room Name : {roomName.toUpperCase()}</h2>

                    </div>
                    <List ref={listRef} sx={{ height: '65vh', overflow: 'auto', bgcolor: '#05091ce8', }}>
                        {displayMessages.map((msg) => {
                            const isCurrentUser = auth.currentUser.email === msg.email;
                            return <>
                                {msg.text && <ListItem alignItems="flex-start" key={msg.id}
                        
                            style={{ flexDirection: isCurrentUser ? "row-reverse" : "row",gap:'15px',padding:'10px' }}
                                >
                                    <ListItemAvatar>
                                        <Avatar alt="Remy Sharp" src={msg.pic} sx={{ margin: 'auto', border:isCurrentUser ? '3px solid skyblue':'3px solid #24decd' }}/>
                                    </ListItemAvatar>
                                    <ListItemText
                                          sx={{ color: isCurrentUser ? "skyblue" : "#24decd",textAlign: isCurrentUser ? 'right' : 'left' ,fontWeight:'bold' }}
                                        primary={msg.user}
                                        secondary={
                                            <React.Fragment>
                                                <Typography
                                                    sx={{ display: 'inline',wordWrap:'break-word' }}
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
                                </ListItem>}

                                {msg.image && (
                                    <ListItem alignItems="flex-start" key={msg.createdAt}
                                    style={{ flexDirection: isCurrentUser ? "row-reverse" : "row",gap:'15px',padding:'0px' }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar alt="Remy Sharp" src={msg.pic} sx={{ margin: 'auto', border:isCurrentUser ? '3px solid skyblue':'3px solid #24decd' }}/>
                                        </ListItemAvatar>
                                        <ListItemText
                                            sx={{ color: isCurrentUser ? "skyblue" : "",textAlign: isCurrentUser ? 'right' : 'left'  }}
                                            primary={msg.user}
                                            secondary={
                                                <React.Fragment>
                                                    {/* Render the image */}
                                                    <img src={msg.image} alt="Image" width='200px' />

                                                </React.Fragment>

                                            }
                                        />
                                    </ListItem>
                                )}

                                <Divider variant="middle" component="li"
                                sx={{ bgcolor:'rgb(22 22 37 / 41%)' }} />
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

                        {/* input for image */}
                        <label htmlFor='uploadimg' > 
                        {/* <Fab  color="info" size="small" aria-label="add"
                            sx={{ ml: 1 }
                            }
                            onClick={sendMessage}
                        > */}
                              
                          <ImageIcon sx={{fontSize:'40px',borderRadius:'50px',color:'lightskyblue'}}/>
                        {/* </Fab> */}
</label>
<input type="file" onChange={handleImageSelect} accept="image/*" id='uploadimg'   hidden/>
                      

                        <Divider sx={{ height: 25, m: 1,bgcolor:'white' }} orientation="vertical" />

                        <Fab  color="info" size="small" aria-label="add"
                            sx={{ ml: 0 }
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