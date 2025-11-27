import React, { useEffect } from 'react';
import { StyleSheet, Image, Animated } from 'react-native';

const logo = require('../../assets/logo.png');
const WaitingPage
    = () => {
        useEffect(loading, []);
        return (
            <>
                <Animated.View style={styles.container}>
                    <Image
                        style={styles.logo}
                        source={logo}
                    />
                </Animated.View>
            </>
        );
    };

const loading = () => {
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '90%'
    },
    logo: {
        width: 300,
        height: 50,
    },
});

export default WaitingPage;
