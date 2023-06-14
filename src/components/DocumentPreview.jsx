import React from 'react';
import { Card, CardContent, CardActions } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import Divider from '@mui/material/Divider';


const DocumentPreview = ({ fileUrl, isCurrentUser, fileName }) => {
    const fileExtension = getFileExtension(fileUrl);


    return (
        <Card sx={{ bgcolor: "#e7fff3f5", textAlign: isCurrentUser ? 'right' : 'left', maxWidth: { xs: 180, lg: "300" }, marginLeft: isCurrentUser ? 'auto' : '', }}>
            <CardContent>
                <Typography variant="body2" color="" sx={{ textAlign: isCurrentUser ? 'right' : 'left', marginLeft: isCurrentUser ? 'auto' : '', }}>
                    <strong>{fileName} </strong>
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ textAlign: isCurrentUser ? 'right' : 'left', marginLeft: isCurrentUser ? 'auto' : '', }}>
                    <strong> File Format :</strong>  {fileExtension} File
                </Typography>
            </CardContent>
            <Divider sx={{ m: 0.5, bgcolor: 'burlywood' }} orientation="horizontal" />
            <CardActions>
                <Button sx={{ margin: 'auto' }} size="small" href={fileUrl} target="_blank" rel="noopener noreferrer" color="success" variant="contained" >
                    Download
                </Button>
            </CardActions>
        </Card>

    );
};

const getFileExtension = (fileUrl) => {
    const regex = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/g;
    const matches = fileUrl.match(regex);
    if (matches && matches.length > 0) {
        const extension = matches[0].replace(".", "").toLowerCase();
        return extension;
    }
    return "";
};

export default DocumentPreview;
