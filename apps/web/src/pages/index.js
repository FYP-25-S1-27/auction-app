import React from 'react';
import { CssBaseline } from '@mui/material';
import Navbar from '../components/Navbar';
import CategoryBar from '../components/CategoryBar';
import Toppicks from '../components/Toppicks';
import EndingSoon from '../components/Endingsoon';
import PopularCategories from '../components/PopularCategories';
import YouMightAlsoLike from '../components/YouMightAlsoLike';
import Footer from '../components/Footer';

const HomePage = () => {
    return (
        <>
            <CssBaseline />
            <Navbar />
            <CategoryBar />
            <Toppicks />
            <EndingSoon />
            <PopularCategories />
            <YouMightAlsoLike />
            <Footer />
        </>
    );
};

export default HomePage;
