import { StyleSheet } from "react-native";
import { COLOR } from "../../../constants/Colors";
import { Fonts } from "../../../constants/fonts";

export default StyleSheet.create({
    headerListView: {
      height: 70,
      backgroundColor: 'rgb(246, 246, 246)',
      color: COLOR.secondary_primary_color,
      display: 'flex',
      justifyContent: 'center',
      padding: 15,
      borderBottomWidth: 1,
      borderColor: COLOR.gray,
    },
    headerListText: {
      fontSize: 20,
      color: COLOR.secondary_primary_color,
      fontFamily: Fonts.Prompt_Medium,
      fontWeight: 'bold',
    },
    marginTop: { marginTop: 5 },
    btn: {
      width: '100%',
      height: 62,
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
    textTitle: {
      color: COLOR.secondary_primary_color,
      fontFamily: Fonts.Prompt_Medium,
      fontSize: 16,
    },
    textLabel: {
      marginTop: 6,
      fontFamily: Fonts.Prompt_Medium,
      fontSize: 16,
    },
    btn_date: {
      width: 400,
      height: 42,
      textAlign: 'center',
      fontWeight: 'bold',
      borderWidth: 2,
      borderColor: COLOR.secondary_primary_color,
      marginTop: 20,
      borderRadius: 12,
      left: 20,
      fontFamily: Fonts.Prompt_Medium,
      backgroundColor: COLOR.white,
    },
    text_btn_date: {
      fontSize: 16,
      padding: 6,
      marginLeft: 10,
      color: COLOR.secondary_primary_color,
      fontFamily: Fonts.Prompt_Medium,
    },
  });