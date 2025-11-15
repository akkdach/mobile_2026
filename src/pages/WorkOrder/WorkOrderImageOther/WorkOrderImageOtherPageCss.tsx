import { StyleSheet } from "react-native";
import { COLOR } from "../../../constants/Colors";

export default StyleSheet.create({
    btn_submit: {
        width: 350,
        height: 60,
        padding: 10,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 22,
        borderWidth: 1,
        borderColor: 'white',
        backgroundColor: COLOR.secondary_primary_color,
        borderRadius: 35,
        marginTop: 20,
    },
});
