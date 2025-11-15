import {StyleSheet} from 'react-native';
import { COLOR } from '../../constants/Colors';
import { Fonts } from '../../constants/fonts';

export default StyleSheet.create({
    container: {
        padding: 10,
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
        fontWeight: 'bold', 
        fontSize: 16
    },
    header: {
        backgroundColor : COLOR.primary,
        padding: 20,
        borderBottomColor: '#F9F9F9',
        borderBottomWidth: 1,
    },
    collapsibleTitle: {
        fontSize: 22,
        fontFamily: Fonts.Prompt_Medium,
        color: COLOR.white,
    },
});
