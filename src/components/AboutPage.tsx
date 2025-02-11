import { Box, Typography, Grid } from "@mui/material";
import { motion } from "framer-motion";

import image1 from '../assets/images/download (5).jfif';
import image2 from '../assets/images/download (4).jfif';
import image3 from '../assets/images/images (1).jfif';
import image4 from '../assets/images/images.jfif';
import image5 from '../assets/images/download (2).jfif';

const sections = [
    {
        text: "Welcome to 'Give and Receive' – the platform that connects volunteers with organizations in Israel. Our website aims to encourage and strengthen the value of volunteering through meaningful connections between people and organizations. We believe that giving to others is the true way to receive a sense of fulfillment and purpose.",
        image: image1,
    },
    {
        text: "Through a smart and unique system, the website allows everyone to find the most suitable volunteer opportunity. You can filter by area of interest, geographic location, and even choose whether to volunteer alone, with family, or as part of a work team.",
        image: image2,
    },
    {
        text: "On the website, you will find a wide range of volunteer opportunities – from assisting the elderly to working with children, organizing charity events, and personal mentorship. We collaborate with hundreds of organizations across the country to ensure that you always find the right place for you.",
        image: image3,
    },
    {
        text: "The website is open to everyone – private volunteers, families, friend groups, business organizations, and even students in educational projects. The goal is simple: to connect people who want to give with those who need help.",
        image: image4,
    },
    {
        text: "At 'Give and Receive', we believe that giving is the key to a better society. Every small act of kindness can create a significant impact. Join us on a journey where everyone can become the change they wish to see in the world.",
        image: image5,
    },
    {
        text: "Welcome to 'Give and Receive' – the platform that connects volunteers with organizations in Israel. Our website aims to encourage and strengthen the value of volunteering through meaningful connections between people and organizations. We believe that giving to others is the true way to receive a sense of fulfillment and purpose.",
        image: image1,
    },
    {
        text: "Through a smart and unique system, the website allows everyone to find the most suitable volunteer opportunity. You can filter by area of interest, geographic location, and even choose whether to volunteer alone, with family, or as part of a work team.",
        image: image2,
    },
    {
        text: "On the website, you will find a wide range of volunteer opportunities – from assisting the elderly to working with children, organizing charity events, and personal mentorship. We collaborate with hundreds of organizations across the country to ensure that you always find the right place for you.",
        image: image3,
    },
    {
        text: "The website is open to everyone – private volunteers, families, friend groups, business organizations, and even students in educational projects. The goal is simple: to connect people who want to give with those who need help.",
        image: image4,
    },
    {
        text: "At 'Give and Receive', we believe that giving is the key to a better society. Every small act of kindness can create a significant impact. Join us on a journey where everyone can become the change they wish to see in the world.",
        image: image5,
    },
];

const AboutPage = () => {
    return (
        <>
            <Box
                sx={{
                    height: '100vh',
                    textAlign: 'center',
                    paddingBottom: 6,
                }}
            >
                {sections.map((section, index) => (
                    <Grid
                        key={index}
                        container
                        spacing={1}  
                        sx={{
                            alignItems: "center",
                            flexDirection: index % 2 === 0 ? "row" : "row-reverse",
                            py: 2,  
                            px: 30, 
                        }}
                        component={motion.div}
                        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Grid item xs={12} md={6}>
                            <Typography
                                variant="h6"
                                component="p"
                                sx={{
                                    px: 5,
                                    fontFamily: 'Comic Sans MS, Arial, sans-serif',
                                    lineHeight: 1.4,
                                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                                }}
                            >
                                {section.text}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box
                                component="img"
                                src={section.image}
                                alt="About Section"
                                sx={{ width: "90%", borderRadius: 2 }}
                            />
                        </Grid>

                    </Grid>
                ))}
            </Box>
        </>
    );
};

export default AboutPage;
