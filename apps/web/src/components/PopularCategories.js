import React from 'react';
import { Box, Grid, Typography, Button, Container, Paper } from '@mui/material';

const categories = [
    { name: 'Cars', color: '#8B0000' },
    { name: 'Alcohol', color: '#8B5A2B' },
    { name: 'Sports', color: '#DAA520' },
    { name: 'Gadgets', color: '#008000' },
    { name: 'Jewellery', color: '#006B6B' },
    { name: 'Furniture', color: '#1E3A5F' },
    { name: 'Watches', color: '#4B0082' },
    { name: 'Art', color: '#8B008B' },
];

const PopularCategories = () => {
    return (
        <Box sx={{ py: 5 }}>
            <Container>
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
                    Popular Categories
                    <Button sx={{ float: "right", textTransform: "none" }}>View all</Button>
                </Typography>
                <Grid container spacing={2}>
                    {categories.map((category, index) => (
                        <Grid item xs={6} sm={4} md={3} key={index}>
                            <Paper
                                sx={{
                                    height: 80,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    bgcolor: category.color,
                                    color: "white",
                                    fontWeight: "bold",
                                }}
                            >
                                {category.name}
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default PopularCategories;
