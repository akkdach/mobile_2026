import React, { useEffect } from 'react';
import * as router from 'react-native-router-flux';
import { View, StyleSheet, Image, Animated } from 'react-native';

const FadeInView = () => {
    useEffect(loading, []);
    return (
        <>
            <Animated.View style={styles.container}>
                {/* <Image
                    style={styles.logo}
                    source={logo}
                /> */}
            </Animated.View>
        </>
    );
};

const loading = () => {
    setTimeout(() => {
        router.Actions.replace('login');
    }, 3500);
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

export default FadeInView;
