import React, { useState } from 'react'
import Rooms from './Rooms';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Unstable_Grid2';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import InputBase from '@mui/material/InputBase';
import Typography from '@mui/material/Typography';
import { Button, TextField } from '@mui/material';




const EnterRoom = () => {
    const [roomName, setRoomName] = useState("");
    const navigate = useNavigate();

    const enterRoom = () => {
        navigate(`./Chat/${roomName}`)
    }

    return (
        <>
            <Grid container spacing={2} >
                <Grid xs={12} sm={4} >
                    <Rooms />
                </Grid>

                <Grid xs={12} sm={8} display="flex" justifyContent="center" alignItems="center">

                    <Card sx={{ display: 'flex', maxWidth: 361 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flex: '1 0 auto' }}>
                                {/* <Typography component="div" variant="h5">
                                Enter Room / Create Room
                                </Typography> */}


                                <TextField
                                    label="Enter Room / Create Room"
                                    variant="standard"
                                    color="warning"
                                    focused

                                    value={roomName}
                                    //   placeholder='type room name'
                                    onChange={(e) => setRoomName(e.target.value)}



                                />
                                <Button color="warning" onClick={enterRoom} variant="contained" sx={{ marginTop: 3 }}>Enter</Button>

                            </CardContent>
                        </Box>
                        <CardMedia
                            component="img"
                            sx={{ width: 151 }}
                            image="https://mui.com/static/images/cards/live-from-space.jpg"
                        />
                    </Card>




                    {/* <label htmlFor="EnterRoom" >   Enter Room / Create Room
                    </label>
                    <input type="text"
                        name="room"

                        value={roomName}
                        placeholder='type room name'
                        onChange={(e) => setRoomName(e.target.value)}
                    />
                    <button onClick={enterRoom} >Enter</button> */}

                </Grid>


            </Grid>

            {/* <div >
                <div >
                  
                </div>
                <div >
                
                </div>
            </div> */}
        </>

    )
}

export default EnterRoom;

