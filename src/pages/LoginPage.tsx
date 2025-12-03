import { ActivityIndicator, Button } from '@ant-design/react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Animated, Dimensions, Image, Keyboard, StyleSheet, Text, View, ImageBackground } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import VersionInfo from 'react-native-version-info';
import Loading from '../components/loading';
import { COLOR } from '../constants/Colors';
import { Fonts } from '../constants/fonts';
import LocalStorageKey from '../constants/LocalStorageKey';
import { myErrorHandler } from '../constants/myErrorHandler';
import { signIn, updateTokenNotify } from '../services/auth';
import { _getData, _storeData } from '../utils/AsyncStorage';
import { StackActions, useNavigation } from '@react-navigation/native';
import { ROUTE } from '../constants/RoutePath';
//const logo = require('../../assets/images/logo.png');
//const landing = require('../../assets/images/landing.png');
const landing = require('../../assets/images/wallpaper_mobile.png');

type Inputs = {
  username: string;
  password: string;
};

const LoginPage = () => {
  const [error, setError] = useState<any>('');
  const {
    control,
    handleSubmit,
  } = useForm<Inputs>();
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const onSubmit: SubmitHandler<Inputs> = async data => {
    Keyboard.dismiss();
    setIsLoading(true);
    try {
      await signIn(data);
      _getData({key: LocalStorageKey.firstLogin})
        .then(async status => {
          console.log('status', JSON.stringify(status, null, 2))
          const getTokenNotify = await _getData({
            key: LocalStorageKey.oneSignalUserId,
          });
          await updateTokenNotify({Token: JSON.parse(String(getTokenNotify)) as string});
          _storeData({key: LocalStorageKey.firstLogin, value: true}).catch(
            _ => {},
          );
          _storeData({key: LocalStorageKey.notifyStatus, value: true}).catch(
            _ => {},
          );
          // if (!status || status === 'false') {
          //   const getTokenNotify = await _getData({
          //     key: LocalStorageKey.oneSignalUserId,
          //   });
          //   await updateTokenNotify({Token: JSON.parse(String(getTokenNotify)) as string});
          //   _storeData({key: LocalStorageKey.firstLogin, value: true}).catch(
          //     _ => {},
          //   );
          //   _storeData({key: LocalStorageKey.notifyStatus, value: true}).catch(
          //     _ => {},
          //   );
          // }
        })
        .catch(console.log);
        navigation.dispatch(
          StackActions.replace(ROUTE.APP_MAIN)
        );
    } catch (error: any) {
      setError(myErrorHandler(error));
    } finally {
      setIsLoading(false);
    }
  };

  const fadeInAnim = useRef(new Animated.Value(0)).current;
  const ref = useRef(null) as any;
  const [secured, setSecured] = useState<boolean>(true);

  useEffect(() => {
    ref.current.setNativeProps({
      style: {
        fontFamily: 'Prompt-Light',
      },
    });
  }, [secured]);

  useEffect(() => {
    Animated.timing(fadeInAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeInAnim]);

  const [screenInfo,setScreenInfo] = useState(Dimensions.get('screen'))
  const [styles,setStyles]=useState<any>({});
  useEffect(()=>{
    console.log(screenInfo)
    if(screenInfo.width<400){
      setStyles(stylesSM);
    }else{
      setStyles(stylesLG);
    }

  },[screenInfo]);

  return (
    <>
      <Animated.View style={[styles.container, {opacity: fadeInAnim}]}>
        <View style={styles.container}>
          {/* <Image style={styles.backgroundImage} source={landing} /> */}
          <ImageBackground 
            source={landing} 
            style={styles.backgroundImage} 
            resizeMode='cover'
          >
            <View style={styles.loginForm}>
              <View style={styles.card}>
                {/* <Image style={styles.logo} source={logo} /> */}
                <View style={{flexDirection: 'column', justifyContent: 'center', marginTop:100  }}>
                  {/* <View style={[styles.title, {marginBottom:23}]}>
                    <Text style={styles.text_header}> เข้าสู่ระบบ</Text>
                  </View> */}
                  <View style={{flex: 1, marginTop: 60}}>
                    <View style={styles.inputWrapper}>
                      <Controller
                        control={control}
                        render={({field: {onChange, onBlur, value}}) => (
                          <TextInput
                            style={styles.input}
                            placeholderTextColor="white"
                            underlineColorAndroid="transparent"
                            value={value}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            placeholder="รหัสพนักงาน"
                          />
                        )}
                        name="username"
                        rules={{required: true}}
                        defaultValue=""
                      />
                    </View>
                  </View>
                  <View style={{flex: 1}}>
                    <View style={styles.inputWrapper}>
                      <Controller
                        control={control}
                        render={({field: {onChange, onBlur, value}}) => (
                          <TextInput
                            ref={_ref => {
                              ref.current = _ref;
                            }}
                            secureTextEntry={secured}
                            style={[styles.input, {fontFamily: 'Prompt-Medium'}]}
                            value={value}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            placeholder="รหัสผ่าน"
                            placeholderTextColor="white"
                            underlineColorAndroid="transparent"
                          />
                        )}
                        name="password"
                        rules={{required: true}}
                        defaultValue=""
                      />
                    </View>
                    <View style={{alignItems: 'center'}}>
                      <Text
                        style={[styles.textMd,{
                          color: COLOR.neonRed,
                          fontFamily: Fonts.Prompt_Medium,
                        }]}>
                        {error ?? error}
                      </Text>
                    </View>
                  </View>
                  <View style={{flex: 1, alignItems: 'center',marginBottom:0}}>
                    <Button
                      activeOpacity={0.9}
                      style={[styles.inputext]}
                      onPress={handleSubmit(onSubmit)}>
                      <Text
                        style={[styles.textMD,{
                          color: 'white',
                          fontFamily: Fonts.Prompt_Light,
                        }]}>
                        เข้าสู่ระบบ
                      </Text>
                    </Button>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{position: 'absolute', bottom: 1.5, left: '65%', margin: 14}}>
              <Text
                style={{
                  fontFamily: Fonts.Prompt_Light,
                  color: COLOR.gray,
                  fontSize: 15,
                }}>
                Version {VersionInfo.appVersion}.{VersionInfo.buildVersion}
              </Text>
              {/* <Text
                style={{
                  fontFamily: Fonts.Prompt_Light,
                  color: COLOR.gray,
                  fontSize: 18,
                }}>
                Provided By Microsoft Azure
              </Text> */}
            </View>
          </ImageBackground>
        </View>
      </Animated.View>
      <Loading loading={isLoading} />
    </>
  );
};



const stylesLG = StyleSheet.create({
  text_header:{
    color: 'white',
    fontSize:46,
    fontFamily: 'Prompt-SemiBold',
    paddingTop:55
  },
  title:{flex: 1, alignItems: 'center', paddingTop: 60},
  text_login: {
    fontSize: 46,
    // color: "rgba(0, 172, 200, 1)",
    fontFamily: 'Prompt-SemiBold',
  },
  container: {
    flex: 1,
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    width: '100%',
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
  },
  loginForm: {
    position: 'absolute',
    top: '20%',
    bottom: 0,
    left: 70,
    right: 70,
    maxHeight: 550,
  },
  spinnerTextStyle: {
    color: 'white',
  },
  input: {
    backgroundColor: '#00bddc',
    width: 650,
    height: 66,
    marginHorizontal: 20,
    paddingLeft: 30,
    borderRadius: 10,
    fontSize: 20,
    fontFamily: 'Prompt-Light',
    color: '#ffffff',
  },
  inputWrapper: {
    flex: 1,
    alignItems:'center'
  },
  inlineImg: {
    position: 'absolute',
    zIndex: 99,
    width: 22,
    height: 22,
    left: 35,
    top: 9,
  },
  inputext: {
    width: 340,
    height: 66,
    padding: 10,
    fontFamily: 'Prompt-Bold',
    borderWidth: 1,
    borderColor: '#00778b',
    backgroundColor: '#00778b',
    borderRadius: 35,
    marginTop: 20,
    alignItems:'center'
  },
  logo: {
    width: 450,
    height: 75,
  },
  logo2: {
    width: 160,
    height: 160,
    marginBottom: 30,
  },
});

const stylesSM = StyleSheet.create({
  text_header:{
    color: 'white',
    fontSize:32,
    fontFamily: 'Prompt-SemiBold',
    paddingTop:55
  },
  title:{flex: 1, alignItems: 'center', paddingTop: 40},
  text_login: {
    fontSize: 32,
    // color: "rgba(0, 172, 200, 1)",
    fontFamily: 'Prompt-SemiBold',
  },
  container: {
    flex: 1,
    flexDirection:'column'
  },
  card: {
    width:'100%',
    justifyContent: 'center',
    alignItems: 'center',

  },
  backgroundImage: {
    // width: '100%',
    // flex: 1,
    // resizeMode: 'cover', // or 'stretch'
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  loginForm: {
    position: 'absolute',
    top: '10%',
    bottom: 0,
    maxHeight: 400,
    width:'100%',
  },
  spinnerTextStyle: {
    color: 'white',
  },
  input: {
    backgroundColor: '#00bddc',
    width: '100%',
    height: 'auto',
    margin: 5,
    padding: 10,
    borderRadius: 10,
    fontSize: 16,
    fontFamily: 'Prompt-Light',
    color: '#ffffff',
    textAlign:'center',
    
  },
  inputWrapper: {
    flex: 1,
    width:300,
    height:100,
    alignItems:'center',
  },
  inlineImg: {
    position: 'absolute',
    zIndex: 99,
    width: 22,
    height: 22,
    left: 35,
    top: 9,
  },
  inputext: {
    width: '100%',
    height: 'auto',
    padding: 15,
    fontFamily: 'Prompt-Bold',
    borderWidth: 1,
    borderColor: '#00778b',
    backgroundColor: '#00778b',
    borderRadius: 35,
    marginTop: 10,
    alignItems:'center',
  },
  logo: {
    width: '95%',
    height: 60,
  },
  logo2: {
    width: 160,
    height: 160,
    marginBottom: 30,
  },
  textMd:{
    fontSize:16
  },
});

export default LoginPage;
