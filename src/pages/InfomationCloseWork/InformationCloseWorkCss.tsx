import { StyleSheet } from 'react-native';
import { COLOR } from '../../constants/Colors';
import { Fonts } from '../../constants/fonts';

export const styleLg = () => {
    return StyleSheet.create({
        container: {
            // padding: 10,
            paddingTop: 15,
            display: 'flex',
            flexDirection: 'row'
        },
        column: {
            display: 'flex',
            flexDirection: 'column'
        },
        textStyle: {
            paddingLeft: 10,
            // fontWeight: 'bold', 
            fontSize: 16
        },
        textStyleTitle: {
            paddingLeft: 10,
            fontWeight: 'bold',
            fontSize: 16
        },
        header: {
            backgroundColor: COLOR.primary,
            padding: 10,
            borderBottomColor: '#F9F9F9',
            borderBottomWidth: 1,
        },
        collapsibleTitle: {
            fontSize: 22,
            fontFamily: Fonts.Prompt_Medium,
            color: COLOR.white,
        },
        containerStyle: {
            backgroundColor: 'rgba(0, 172, 200, 0.6)',
            width: 200,
            height: 42,
            borderRadius: 10,
            paddingTop: 4,
            marginTop: 10,
            alignItems: 'flex-start',
            paddingLeft: 20,
        },
        modalWidth: {
            width: 550,
            height: '95%',
            borderTopRightRadius: 30,
            borderBottomRightRadius: 30,
            borderBottomLeftRadius: 30,
            borderTopLeftRadius: 30,
        }
    });
}


export const styleSm = () => {
    return StyleSheet.create({
        modalWidth: {
            width: 370,
            height: '95%',
            borderTopRightRadius: 30,
            borderBottomRightRadius: 30,
            borderBottomLeftRadius: 30,
            borderTopLeftRadius: 30,
        },
        containerStyle: {
            backgroundColor: 'rgba(0, 172, 200, 0.6)',
            width: 200,
            height: 42,
            borderRadius: 10,
            paddingTop: 4,
            marginTop: 10,
            alignItems: 'flex-start',
            paddingLeft: 20,
        },
        container: {
            // padding: 10,
            paddingTop: 5,
            display: 'flex',
            flexDirection: 'row'
        },
        column: {
            display: 'flex',
            flexDirection: 'column',
            flex: 2
        },
        textStyle: {
            paddingLeft: 10,
            // fontWeight: 'bold', 
            fontSize: 12
        },
        textStyleTitle: {
            paddingLeft: 10,
            fontWeight: 'bold',
            fontSize: 12,
        },
        header: {
            backgroundColor: COLOR.primary,
            padding: 10,
            borderBottomColor: '#F9F9F9',
            borderBottomWidth: 1,
        },
        collapsibleTitle: {
            fontSize: 12,
            fontFamily: Fonts.Prompt_Medium,
            color: COLOR.white,
        },
    });
} 
