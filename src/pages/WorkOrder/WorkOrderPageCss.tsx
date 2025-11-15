import { StyleSheet } from "react-native";
import { COLOR } from "../../constants/Colors";
import { Fonts } from "../../constants/fonts";

export default StyleSheet.create({
  appBar: {
    backgroundColor: COLOR.primary,
  },
  btn: {
    width: '100%',
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
  titleCheck: {
    fontSize: 22,
    color: COLOR.primary,
    padding: 20,
    fontFamily: Fonts.Prompt_Medium
  },
  titleDetails: {
    fontSize: 18,
    fontFamily: Fonts.Prompt_Medium
  },
  textDetails: {
    fontSize: 16,
    fontFamily: Fonts.Prompt_Light
  }
});
