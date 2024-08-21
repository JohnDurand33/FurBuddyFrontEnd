import React from 'react';
import { Box, Typography, Grid, IconButton } from '@mui/material';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
    return (
        <Box
            sx={{
                backgroundColor: 'background.default',
                color: 'text.primary',
                padding: '20px 0',
                marginTop: 'auto',
            }}
        >
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={6} md={4} textAlign="center">
                    <Typography variant="h6">FurBuddy</Typography>
                    <Typography variant="body2">
                        © {new Date().getFullYear()} FurBuddy. All Rights Reserved.
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} textAlign="center">
                    <Typography variant="h6">Follow Us</Typography>
                    <Box>
                        <IconButton
                            aria-label="Facebook"
                            href="https://www.facebook.com"
                            target="_blank"
                            sx={{ color: 'white' }}
                        >
                            <FaFacebookF />
                        </IconButton>
                        <IconButton
                            aria-label="Twitter"
                            href="https://www.twitter.com"
                            target="_blank"
                            sx={{ color: 'white' }}
                        >
                            <FaTwitter />
                        </IconButton>
                        <IconButton
                            aria-label="Instagram"
                            href="https://www.instagram.com"
                            target="_blank"
                            sx={{ color: 'white' }}
                        >
                            <FaInstagram />
                        </IconButton>
                        <IconButton
                            aria-label="LinkedIn"
                            href="https://www.linkedin.com"
                            target="_blank"
                            sx={{ color: 'white' }}
                        >
                            <FaLinkedinIn />
                        </IconButton>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4} textAlign="center">
                    <Typography variant="h6">Contact Us</Typography>
                    <Typography variant="body2">1234 Dog Street, Dogtown, DOG 56789</Typography>
                    <Typography variant="body2">Email: info@furbuddy.com</Typography>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Footer;