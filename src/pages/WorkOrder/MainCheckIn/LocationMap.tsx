import React, { useEffect, useState } from 'react';
import { View, StyleSheet, PermissionsAndroid, Platform, Text } from 'react-native';
import MapView, { Callout, Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation, { GeolocationResponse } from '@react-native-community/geolocation';

interface Location {
    latitude: number;
    longitude: number;
}

const LocationMap: React.FC = () => {
    const [location, setLocation] = useState<Location | null>({
        latitude: 0,
        longitude: 0
    });
        //     latitude: 13.8032548,
        // longitude: 100.7008357
    const requestLocationPermission = async (): Promise<boolean> => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'ขออนุญาตใช้ตำแหน่ง',
                    message: 'แอปต้องการตำแหน่งของคุณเพื่อแสดงบนแผนที่',
                    buttonPositive: 'ตกลง',
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
    };

    const getCurrentLocation = (): Promise<{ latitude: number; longitude: number }> => {
        return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(
                (position: GeolocationResponse) => {
                    const { latitude, longitude } = position.coords;
                    resolve({ latitude, longitude });
                },
                error => {
                    console.log('❌ Location error:', error);
                    reject(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 10000,
                    // forceRequestLocation: true,
                    // showLocationDialog: true,
                }
            );
        });
    };

    useEffect(() => {
        requestLocationPermission();
        getCurrentLocation()
    }, []);

    return (
        <View style={styles.container}>
            {location && (
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    region={{
                        latitude: location?.latitude,
                        longitude: location?.longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                    }}
                    showsUserLocation
                    showsMyLocationButton={false}
                >
                    <Marker coordinate={location} />
                    <Circle
                        center={location}
                        radius={0}
                        strokeColor="rgba(0,122,255,0.3)"
                        fillColor="rgba(0,122,255,0.1)"
                    />
                </MapView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
        margin: 16,
        elevation: 4,
        backgroundColor: '#fff',
    },
    map: {
        width: '100%',
        height: '95%',
    },
});

export default LocationMap;