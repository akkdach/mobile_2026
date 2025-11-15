import { StyleSheet } from 'react-native';
import { COLOR } from '../../../constants/Colors';
import { Fonts } from '../../../constants/fonts';

export const styleLg = () => {
  return StyleSheet.create({
    textTitle: {
      color: COLOR.primary,
      fontSize: 20,
      fontFamily: Fonts.Prompt_Medium,
    },
    input: {
      padding: 10,
      paddingLeft: 20,
      paddingRight: 20,
      borderWidth: 2,
      fontSize: 18,
      borderColor: COLOR.secondary_primary_color,
      marginBottom: 10,
      borderRadius: 20,
    },
    labelInput: {
      paddingRight: 20,
      fontSize: 18,
      marginTop: 20,
      fontFamily: Fonts.Prompt_Medium
    },
    subLabelInput: {
      paddingLeft: 20,
      fontSize: 18,
      marginTop: 20,
      fontFamily: Fonts.Prompt_Medium
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
      backgroundColor: COLOR.primary,
      borderRadius: 35,
      marginTop: 20,
    },
    btn_submit: {
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
    image: {
      height: 300,
      width: '100%',
    },
    titleLabel: {
      color: COLOR.primary,
      fontSize: 20,
      fontFamily: Fonts.Prompt_Medium,
      paddingTop: 40,
    },
    container: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginVertical: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#444',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 12,
    flexWrap: 'wrap',
  },
  badgeGroup: {
    flex: 1,
    minWidth: 140,
  },
  badgeLabel: {
    fontSize: 16,
    marginBottom: 6,
    color: '#888', // สีเทาอ่อน
  },
  badge: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666', // สีเทากลาง
  },

  });

}

export const styleSm = () => {
  return StyleSheet.create({
    text12: {
      fontSize: 12
    },
    textTitle: {
      color: COLOR.primary,
      fontSize: 16,
      fontFamily: Fonts.Prompt_Medium,
    },
    input: {
      padding: 10,
      paddingLeft: 20,
      paddingRight: 20,
      borderWidth: 2,
      fontSize: 14,
      borderColor: COLOR.secondary_primary_color,
      marginBottom: 10,
      borderRadius: 20,
    },
    labelInput: {
      paddingRight: 20,
      fontSize: 14,
      marginTop: 20,
      fontFamily: Fonts.Prompt_Medium
    },
    subLabelInput: {
      paddingLeft: 20,
      fontSize: 14,
      marginTop: 20,
      fontFamily: Fonts.Prompt_Medium
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
      backgroundColor: COLOR.primary,
      borderRadius: 35,
      marginTop: 20,
    },
    btn_submit: {
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
    image: {
      height: 300,
      width: '100%',
    },
    titleLabel: {
      color: COLOR.primary,
      fontSize: 16,
      fontFamily: Fonts.Prompt_Medium,
      paddingTop: 40,
    },
    container: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginVertical: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#444',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 12,
    flexWrap: 'wrap',
  },
  badgeGroup: {
    flex: 1,
    minWidth: 140,
  },
  badgeLabel: {
    fontSize: 16,
    marginBottom: 6,
    color: '#888', // สีเทาอ่อน
  },
  badge: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666', // สีเทากลาง
  },


  });

}
