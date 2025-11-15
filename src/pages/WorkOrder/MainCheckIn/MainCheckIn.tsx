import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import AppBar from '../../../components/AppBar';
import BackGroundImage from '../../../components/BackGroundImage';
import Loading from '../../../components/loading';
import LocationMap from './LocationMap';
import * as router from 'react-native-router-flux';
import { ROUTE } from '../../../constants/RoutePath';
const screenWidth = Dimensions.get('window').width;


const menuItems = [
    { title: 'เช็คอินร้าน', icon: '🏪', onPress: (data:any) =>router.Actions.push(ROUTE.WORK_PROCEDURE, {orderId:data.orderId})},
    { title: 'เช็คอินเครื่อง', icon: '🧊', onPress: (data:any) =>router.Actions.push(ROUTE.CheckInEquipment,data) },
    { title: 'Check CCP', icon: '✅', onPress: (data:any) =>router.Actions.push(ROUTE.WORK_ORDER_CCP_CHECK,{workOrderData:{orderId:data.orderId}}) },
];
type InterfaceProps = {
    orderId:string
    type?: string
};

const Contents = (props:any) => {
    // console.log('propsssssssssssssssssssssssssss',props);
    return (<>
        <View style={styles.container}>
            {menuItems.map((item, index) => (
                <TouchableOpacity key={index} style={styles.menuItem} onPress={()=>item.onPress(props)}>
                    <Text style={styles.icon}>{item.icon}</Text>
                    <Text style={styles.label}>{item.title}</Text>
                </TouchableOpacity>
            ))}
        {/* <LocationMap /> */}
        </View>
       
    </>)
}
const MainCheckIn = (props: InterfaceProps) => {
                //   console.log('workOrderData',props.workOrderData);
    return (<>
        <AppBar title="เช็คอินร้าน"></AppBar>
        <BackGroundImage
            components={<Animated.ScrollView>{Contents(props)}</Animated.ScrollView>}
        />
        {/* <Loading loading={isLoading} /> */}
    </>);
};
export default MainCheckIn;
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 12,
        height:600
    },
    menuItem: {
        width: (screenWidth - 48) / 2, // 2 columns with spacing
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingVertical: 20,
        alignItems: 'center',
        marginBottom: 16,
        elevation: 2, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    icon: {
        fontSize: 32,
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        fontFamily: 'Prompt-Medium',
    },
});