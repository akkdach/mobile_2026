import { StyleSheet } from "react-native";
import { COLOR } from "../../../constants/Colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    marginTop: 50,
  },
  row: {
    flexDirection: 'row',
    marginTop: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  value: {
    backgroundColor: 'green',
    color: 'black',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  button: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
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
})