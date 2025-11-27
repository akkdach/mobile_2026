import React from 'react';
import { StyleSheet, Text } from 'react-native';

const logo = require('../../../assets/logo.png');
const TabHomePage = () => {
    return (
        <>
            <Text style={{ margin: 50 }}>XXX</Text>
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

export default TabHomePage;
