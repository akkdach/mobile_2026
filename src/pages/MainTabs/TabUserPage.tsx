import React, { useEffect } from 'react';
import { StyleSheet, Image, Animated, Text } from 'react-native';

const logo = require('../../../assets/logo.png');
const TabUserPage = () => {
        useEffect(loading, []);
        return (
            <>
                <Animated.View style={styles.children}>
                    <Text style={{ margin: 50 }}>XXX</Text>
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
    children: {
        flex: 1, alignItems: 'center', backgroundColor: 'white',
    },
    logo: {
        width: 300,
        height: 50,
    },
});

export default TabUserPage;
