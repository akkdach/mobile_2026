import { StyleSheet, Dimensions } from 'react-native';
import { COLOR } from '../../../../constants/Colors';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
export const styleLg = () => {
    return StyleSheet.create({
        ModalWidth:{ width: 690, height: 580, borderRadius: 15 },
        text1: {
            fontSize: 16,
        },
        text2: {
            fontSize: 18
        },
        textLabel: {
            fontSize: 16
        },
        flex12: {
            flex: 1.2
        }, input1: {
            height: 40,
            width: 400,
            paddingLeft: 20,
            fontSize: 14,
            borderRadius: 12,
        },
        cardContentView:{ paddingLeft: 20, paddingRight: 20 },
        ModalPadding:{ paddingLeft: 40, paddingRight: 40 },
        text_btn_date:{
            fontSize:16,
            color:COLOR.white,
            borderColor:COLOR.gray,
            marginLeft:30,
            marginTop:20,
        },btn_date:{
            borderColor:COLOR.gray
        }
    });
}

export const styleSm = () => {
    return StyleSheet.create({
        text_btn_date:{
            fontSize:14,
            marginLeft:20,
            marginTop:23,
            color:COLOR.white
        },
        dateWidth:{
            width:180,
            textAlign: 'center',
            fontWeight: 'bold',
            borderRadius: 12,
            backgroundColor: COLOR.white,
            marginLeft:20,
        },
        ModalPadding:{ paddingLeft: 3, paddingRight: 3 },
        ModalWidth:{ 
            width: 340, 
            height: 580, 
            borderRadius: 15,
            fontSize:14
        },
        text1: {
            fontSize: 13
        },
        text2: {
            fontSize: 13
        },
        textLabel: {
            fontSize: 13,
            alignContent: 'center',
            justifyContent: 'center',
        },
        flex12: {
            flex: 1.5,
            alignContent: 'center',
            justifyContent: 'center',
        }, input1: {
            height: 40,
            width: '100%',
            paddingLeft: 20,
            fontSize: 14,
            borderRadius: 12,
        },
        cardContentView:{ paddingLeft: 3, paddingRight: 3 }
    });
}
