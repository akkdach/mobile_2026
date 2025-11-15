import { StyleSheet } from 'react-native';
import { COLOR } from '../../../constants/Colors';
import { Fonts } from '../../../constants/fonts';

export default StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row'
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
    },
    textStyle: {
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
    box: {
        padding: 10
    },
    line_bottom: {
        borderColor: '#ddd', 
        borderBottomWidth: 1,
    }
});
