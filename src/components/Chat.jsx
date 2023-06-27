import React, { useEffect, useState, useRef } from 'react'
import { db, auth, storage } from '../firebase-config'
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where, deleteDoc, doc } from 'firebase/firestore'
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Button, Fab } from '@mui/material';
// import Grid from '@mui/material/Unstable_Grid2';
import Grid from '@mui/material/Grid';
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
import AttachFileIcon from '@mui/icons-material/AttachFile';

// import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DocumentPreview from './DocumentPreview';


const Chat = () => {
    const [text, setText] = useState("");
    const [displayMessages, setDisplayMessages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);


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

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };



    const sendMessage = async (event) => {
        event.preventDefault();

        if (selectedImage) {
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
                file: "",
                fileName: "",
                createdAt: serverTimestamp(),
                user: auth.currentUser.displayName,
                roomName: roomName,
                email: auth.currentUser.email,
                pic: auth.currentUser.photoURL,
                roomPassword,
            });

            // Clear the selected image
            setSelectedImage(null);
        } else if (selectedFile) {
            console.log("hgggggggi")
            // Create a storage reference with a unique name for the file
            const storageRef = ref(storage, `Files/${selectedFile.name}`);

            // Upload the file to Firebase Storage
            await uploadBytes(storageRef, selectedFile);

            // Get the download URL of the uploaded file
            const downloadURL = await getDownloadURL(storageRef);

            // Add a new message containing the file URL to the Firestore collection
            await addDoc(messageRef, {
                text: '',
                image: "",
                file: downloadURL,
                fileName: selectedFile.name,
                createdAt: serverTimestamp(),
                user: auth.currentUser.displayName,
                roomName: roomName,
                email: auth.currentUser.email,
                pic: auth.currentUser.photoURL,
                roomPassword,
            });

            // Clear the selected file
            setSelectedFile(null);

        } else {
            if (text === "") {
                return;
            } else {
                await addDoc(messageRef, {
                    text,
                    image: "",
                    file: "",
                    fileName: "",
                    createdAt: serverTimestamp(),
                    user: auth.currentUser.displayName,
                    roomName: roomName,
                    email: auth.currentUser.email,
                    pic: auth.currentUser.photoURL,
                    roomPassword,
                })
                setText("");
            }
        }

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





    return (

        <>

            {/* <img src={auth.currentUser.photoURL} alt="f" /> */}
            <Container maxWidth="md" sx={{ px: { xs: '0', } }} >
                <Box sx={{ bgcolor: '#060b22b8' }} pt={2} pb={1}  >
                    <Grid container >

                        <Grid xs={4}>

                            <Button color="info" variant="contained" onClick={deleteRoom} >Delete</Button>
                        </Grid>
                        <Grid xs={4} display="flex" justifyContent="space-evenly" alignItems="center">

                            <Avatar alt="Remy Sharp" src={auth.currentUser.photoURL} sx={{ margin: 'auto', border: '3px solid skyblue' }} />


                            <span style={{ fontWeight: 'bold', color: 'skyblue' }}> {auth.currentUser.displayName}</span>
                        </Grid>
                        <Grid xs={4}>

                            <Button color="info" variant="contained" onClick={() => navigate('/')}>Home</Button>
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

                                    style={{ flexDirection: isCurrentUser ? "row-reverse" : "row", gap: '15px', padding: '10px' }}
                                >
                                    <ListItemAvatar>
                                        <Avatar alt="Remy Sharp" src={msg.pic} sx={{ margin: 'auto', border: isCurrentUser ? '3px solid skyblue' : '3px solid #24decd' }} />
                                    </ListItemAvatar>
                                    <ListItemText
                                        sx={{ color: isCurrentUser ? "skyblue" : "#24decd", textAlign: isCurrentUser ? 'right' : 'left', fontWeight: 'bold' }}
                                        primary={msg.user}

                                        secondary={
                                            <React.Fragment>
                                                <Typography
                                                    sx={{ display: 'inline', wordWrap: 'break-word' }}
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
                                        style={{ flexDirection: isCurrentUser ? "row-reverse" : "row", gap: '15px', padding: '10px' }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar alt="Remy Sharp" src={msg.pic} sx={{ margin: 'auto', border: isCurrentUser ? '3px solid skyblue' : '3px solid #24decd' }} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            sx={{ color: isCurrentUser ? "skyblue" : "", textAlign: isCurrentUser ? 'right' : 'left' }}
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

                                {msg.file && (
                                    <ListItem alignItems="flex-start" key={msg.createdAt}
                                        style={{ flexDirection: isCurrentUser ? "row-reverse" : "row", gap: '15px', padding: '10px' }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar alt="Remy Sharp" src={msg.pic} sx={{ margin: 'auto', border: isCurrentUser ? '3px solid skyblue' : '3px solid #24decd' }} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            sx={{ color: isCurrentUser ? "skyblue" : "", textAlign: isCurrentUser ? 'right' : 'left' }}
                                            primary={msg.user}
                                            secondary={

                                                <DocumentPreview fileUrl={msg.file} fileName={msg.fileName} isCurrentUser={isCurrentUser} />


                                            }
                                        />
                                    </ListItem>
                                )}


                                <Divider variant="middle" component="li"
                                    sx={{ bgcolor: 'rgb(22 22 37 / 41%)' }} />
                            </>

                        })}
                    </List>

                    <Box
                        display="flex"
                        justifyContent="center"
                        my={3}
                        mx={1}
                    >
                        <Paper
                            id="messageBox"
                            component="form"
                            sx={{ p: '1.5px 4px', mx: '5px', mr: { lg: '10px' }, display: 'flex', alignItems: 'center', width: { xs: '84vw' }, textAlign: 'center' }}
                        >

                            <InputBase
                                sx={{ ml: 1, flex: 1 }}
                                placeholder="Message"
                                inputProps={{ 'aria-label': 'search google maps' }}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />


                            <label htmlFor="upload-image">
                                <input
                                    accept="image/*"
                                    style={{ display: 'none', }}
                                    id="upload-image"
                                    type="file"
                                    onChange={handleImageSelect}
                                />
                                <Fab component="span" size="small" color="primary" aria-label="upload image">
                                    <ImageIcon />
                                </Fab>
                            </label>

                            <Divider sx={{ height: '90%', m: 0.3, bgcolor: 'gray' }} orientation="vertical" />

                            <label htmlFor="upload-file">
                                <input
                                    style={{ display: 'none' }}
                                    id="upload-file"
                                    type="file"
                                    onChange={handleFileSelect}
                                />
                                <Fab component="span" size="small" color="primary" aria-label="upload file">
                                    <AttachFileIcon />
                                </Fab>
                            </label>

                        </Paper>

                        {/* input for image */}
                        {/* <label htmlFor='uploadimg' >
                            <ImageIcon sx={{ fontSize: '40px', borderRadius: '50px', color: 'lightskyblue' }} />
                        </label>
                        <input type="file" onChange={handleImageSelect} accept="image/*" id='uploadimg' hidden /> */}




                        {/* <label htmlFor='uploadFile' >
                            <AttachFileIcon sx={{ fontSize: '40px', borderRadius: '50px', color: 'lightskyblue' }} />
                        </label>
                        <input type="file" id="uploadFile" onChange={handleFileSelect} accept=".pdf,.doc,.docx" hidden /> */}




                        {/* <Divider sx={{ height: 0, p: 0.2}} orientation="vertical" /> */}

                        <Fab color="info" size="small" aria-label="add"

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