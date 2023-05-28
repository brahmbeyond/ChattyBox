import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import { Button, TextField } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';

const style = {
    color: 'black',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


const EnterRoomModal = ({ roomName, password, open, setOpen, heading, buttonName }) => {
    const [roomPassword, setRoomPassword] = useState("");
    const [checkButton, setCheckButton] = useState("");
    const [err, setErr] = useState(false)
    const handleClose = () => setOpen(false);
    const navigate = useNavigate();


    const buttonClicked = () => {
        if (roomPassword !== "") {

            setCheckButton(buttonName);
            if (checkButton == "Verify Password") {
                if (password === roomPassword) {
                    const state = {
                        password: roomPassword,
                    }
                    navigate(`./Chat/${roomName}`, { state })
                } else {
                    setErr(true);
                }
            }
            else {
                const state = {
                    password: roomPassword,
                }
                navigate(`./Chat/${roomName}`, { state })
            }


        }
    }


    return (
        <>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <Typography id="transition-modal-title" variant="h6" sx={{ fontSize: 'bold' }}>
                            <strong>{heading} - {roomName.toUpperCase()}</strong>
                        </Typography>
                        <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                            ....Enter passward....
                        </Typography>
                        <Grid display="flex"
                            flexDirection="column"
                            gap={3}>
                            <TextField
                                // label="Create a strong passward........"
                                variant="standard"
                                color="warning"
                                focused
                                value={roomPassword} onChange={(e) => setRoomPassword(e.target.value)}
                            />

                            <Button variant="contained" onClick={buttonClicked}>{buttonName}</Button>
                        </Grid>
                        {err && <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                            ....Wrong passward....
                        </Typography>}
                    </Box>
                </Fade>
            </Modal>
        </>
    )
}

export default EnterRoomModal
