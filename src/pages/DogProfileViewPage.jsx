import React, { useState } from 'react';
import { Grid, Box, Avatar, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const DogProfileView = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [dogProfileData, setDogProfileData] = useState({
        name: '',
        breed: '',
        age: '',
        weight: '',
        sex: '',
        fixed: true,
        chip_number: '123456789012345',
        img_url: '', // Initial image URL
    });

    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(dogProfileData.img_url);

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleImageUpload = async () => {
        if (image) {
            const storageRef = ref(storage, `dog_images/${image.name}`);
            await uploadBytes(storageRef, image);
            const url = await getDownloadURL(storageRef);
            setImageUrl(url);
            return url;
        }
        return dogProfileData.img_url;
    };

    const handleSave = async () => {
        const img_url = await handleImageUpload();
        const updatedData = { ...dogProfileData, img_url };

        Example: await axios.post('/api/dogprofile/update', updatedData);

        setDogProfileData(updatedData);
        setIsEditing(false);
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Grid container alignItems="center" justifyContent="center" spacing={2} sx={{ pt: 5 }}>
                {/* Avatar and Upload Button */}
                <Grid item xs={12} container justifyContent="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', width: 'fit-content' }}>
                        <Avatar
                            alt="Dog's Image"
                            src={imageUrl || ""}
                            sx={{ width: 100, height: 100 }}
                        />
                        {isEditing && (
                            <Button
                                variant="contained"
                                component="label"
                                sx={{ ml: 2 }}
                            >
                                Upload Image
                                <input
                                    type="file"
                                    hidden
                                    onChange={handleImageChange}
                                />
                            </Button>
                        )}
                    </Box>
                </Grid>

                {/* Profile Information */}
                {Object.keys(dogProfileData).map((key) => (
                    key !== 'img_url' && (
                        <Grid item xs={12} key={key} style={{ margin: '0 auto', width: '80%' }}>
                            {!isEditing ? (
                                <Typography variant="body1">
                                    {`${key.charAt(0).toUpperCase() + key.slice(1)}: ${dogProfileData[key]}`}
                                </Typography>
                            ) : (
                                <TextField
                                    fullWidth
                                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                                    value={dogProfileData[key]}
                                    onChange={(e) => setDogProfileData({ ...dogProfileData, [key]: e.target.value })}
                                    variant="outlined"
                                />
                            )}
                        </Grid>
                    )
                ))}

                {/* Buttons */}
                <Grid item xs={12} style={{ margin: '0 auto', width: '80%' }}>
                    {!isEditing ? (
                        <Button variant="contained" onClick={handleEditToggle}>
                            Edit Profile
                        </Button>
                    ) : (
                        <>
                            <Button variant="contained" onClick={handleSave}>
                                Save Changes
                            </Button>
                            <Button variant="outlined" onClick={handleEditToggle} sx={{ ml: 2 }}>
                                Cancel
                            </Button>
                        </>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default DogProfileView;