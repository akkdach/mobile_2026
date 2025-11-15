import { Button, WhiteSpace } from '@ant-design/react-native';
import React, { useEffect } from 'react';
import { StyleSheet, Image, Animated, Text } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import * as router from 'react-native-router-flux';
import { ROUTE } from '../constants/RoutePath';

const logo2 = require('../../assets/worker.png');

const DrawerMenu = () => {
    useEffect(loading, []);
    return (
        <>
            <Animated.View style={styles.children}>
                <Image
                    style={styles.logo2}
                    source={logo2}
                />
                <Text style={{ fontWeight: 'bold', marginTop: 10, fontSize: 24 }}>
                    Ekapol Lim
                </Text>
                <TouchableHighlight underlayColor="#fff" onPress={() => { router.Actions.push(ROUTE.PROFILE); }}>
                    <Text style={{ fontWeight: 'bold', marginTop: 10, fontSize: 24,  color: '#33C3FF', textDecorationLine: 'underline' }}>
                        Profile
                    </Text>
                </TouchableHighlight>
                <WhiteSpace style={{ marginTop: 30 }} />
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
    button: {
        width: '100%',
        borderRadius: 0
    },
    logo: {
        width: 300,
        height: 50,
    },
    logo2: {
        width: 120,
        height: 120,
        marginTop: 20,
    },
});

export default DrawerMenu;
