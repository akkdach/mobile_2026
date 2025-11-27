import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Animated } from 'react-native';
import { useNavigation, StackActions } from '@react-navigation/native';

const FadeInView = () => {
    const navigation = useNavigation();

    useEffect(() => {
        setTimeout(() => {
            // router.Actions.replace('login');
            navigation.dispatch(StackActions.replace('Login'));
        }, 3500);
    }, [navigation]);

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
