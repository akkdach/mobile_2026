import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    PermissionsAndroid,
    Platform,
    Alert,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const inIttargetLocation = {
    latitude: 13.800000,
    longitude: 100.600000,
    radius: 100,
};

const LocationCheckMap = ({ 
    validateInside,
    distanceCheck,
    latitude,
    longitude
 }: any) => {
    const [targetLocation, setTargetLocation] = useState<{ latitude: number; longitude: number; radius: number }>({
        latitude: latitude || inIttargetLocation.latitude,
        longitude: longitude || inIttargetLocation.longitude,
        radius: distanceCheck || inIttargetLocation.radius,
    });
    const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [isInside, setIsInside] = useState<boolean | null>(null);
    const mapRef = useRef<MapView>(null);

    useEffect(() => {
        const requestLocation = async () => {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    Alert.alert('❌ ปฏิเสธสิทธิ์', 'ไม่สามารถเข้าถึงตำแหน่งได้');
                    return;
                }
            }

            Geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCurrentLocation({ latitude, longitude });

                    const distance = haversineDistance(
                        latitude,
                        longitude,
                        targetLocation.latitude,
                        targetLocation.longitude,
                    );

                    setIsInside(distance <= targetLocation.radius);
                    validateInside(distance <= targetLocation.radius);
                },
                (error) => {
                    console.error('ตำแหน่งล้มเหลว:', error);
                    Alert.alert('ไม่สามารถระบุตำแหน่ง', 'กรุณาเปิด GPS หรือลองใหม่อีกครั้ง');
                },
                { enableHighAccuracy: true, timeout: 35000, maximumAge: 10000 },
            );
        };

        requestLocation();
    }, []);

    const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const toRad = (value: number) => (value * Math.PI) / 180;
        const R = 6371000;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const goToTarget = () => {
        mapRef.current?.animateToRegion({
            latitude: targetLocation.latitude,
            longitude: targetLocation.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
        }, 1000);
    };

    const goToCurrent = () => {
        if (!currentLocation) return;
        mapRef.current?.animateToRegion({
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
        }, 1000);
    };

    return (
        <View style={{ flex: 1 }}>
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: targetLocation.latitude,
                    longitude: targetLocation.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                }}
            >
                <Circle
                    center={targetLocation}
                    radius={targetLocation.radius}
                    strokeColor="rgba(30,144,255,0.8)"
                    fillColor="rgba(30,144,255,0.3)"
                />
                <Marker coordinate={targetLocation} title="จุดร้านค้า" pinColor="blue" />
                {currentLocation && (
                    <Marker coordinate={currentLocation} title="ตำแหน่งของคุณ" pinColor="red" />
                )}
            </MapView>

            <View style={styles.statusBox}>
                <Text style={styles.statusText}>
                    {isInside === null
                        ? 'กำลังตรวจสอบตำแหน่ง...'
                        : isInside
                            ? '✅ คุณอยู่ในพื้นที่ร้านค้า '+(distanceCheck ?? 100)+' เมตร'
                            : '❌ คุณอยู่นอกพื้นที่ร้านค้า'+(distanceCheck ?? 100)+' เมตร'}
                </Text>

                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.button} onPress={goToTarget}>
                        <Text style={styles.buttonText}>ไปยังพื้นที่ร้านค้า</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={goToCurrent}>
                        <Text style={styles.buttonText}>ไปยังตำแหน่งปัจจุบัน</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
    statusBox: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: '#FFF',
        padding: 12,
        borderRadius: 10,
        elevation: 4,
    },
    statusText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#333',
        marginBottom: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    button: {
        backgroundColor: '#2196F3',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 14,
    },
});

export default LocationCheckMap;