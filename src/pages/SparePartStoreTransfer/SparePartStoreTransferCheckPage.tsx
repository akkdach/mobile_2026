import { Button, Icon } from '@ant-design/react-native';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Animated, Dimensions, ScrollView, Text, View } from 'react-native';
import { BarCodeReadEvent } from 'react-native-qrcode-scanner';
import AppBar from '../../components/AppBar';
import BackGroundImage from '../../components/BackGroundImage';
import Loading from '../../components/loading';
import Scanner from '../../components/Scanner';
import styles from '../../components/StyleSheet';
import TextInputComponent from '../../components/TextInput';
import { Fonts } from '../../constants/fonts';
import LocalStorageKey from '../../constants/LocalStorageKey';
import { ROUTE } from '../../constants/RoutePath';
import { LoginResponseInterface } from '../../models/login';
import { postSparePartTransferStore } from '../../services/sparePart';
import { _getData } from '../../utils/AsyncStorage';
import { useNavigation, StackActions } from '@react-navigation/native'

type Inputs = {
  vanTo: string;
};

const SparePartStoreTransferCheckPage: React.FC = () => {
  const { control, setValue, getValues } = useForm<Inputs>();
  const [profile, setProfile] = useState<LoginResponseInterface>();
  const [scan, setScan] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [screenInfo, setScreenInfo] = useState(Dimensions.get('screen'))
  const navigation = useNavigation();

  // const [styles, setStyles] = useState<any>({});
  useEffect(() => {
    console.log(screenInfo)
    // if (screenInfo.width < 500) {
    //   setStyles();
    // } else {
    //   setStyles(styleLg);
    // }

  }, [screenInfo]);

  const getProfile = async () => {
    try {
      const userProfile = await _getData({
        key: LocalStorageKey.userInfo as string,
      });
      const parseProfile = JSON.parse(String(userProfile));
      setProfile(parseProfile);
    } catch (error) { }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const onValueScanner = (e: BarCodeReadEvent) => {
    setValue('vanTo', e.data);
    setScan(false);
  };

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const vanTo = getValues('vanTo');
      const result = await postSparePartTransferStore('get', vanTo);
      if (
        result.dataResult?.sparepartList 
        // result.dataResult?.sparepartList.length > 0
      ) {
        // Actions.push(ROUTE.SPARE_PART_STORE_TRANSFER, { profile, vanTo });
        navigation.dispatch(
          StackActions.replace(ROUTE.SPARE_PART_STORE_TRANSFER, { profile: profile, vanTo: vanTo })
        );
      } else {
        Alert.alert('แจ้งเตือน', result.message);
      }
    } catch (error: any) {
      Alert.alert('แจ้งเตือน', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <BackGroundImage
        components={
          <Animated.View>
            <View style={{ width: '100%' }}>
              <AppBar title="รับอะไหล่สโต"></AppBar>
            </View>
            {scan && (
              <Scanner
                title="TO Van No."
                onValue={e => onValueScanner(e)}
                onClose={() => setScan(false)}
              />
            )}
            {!scan && (
              <ScrollView >
                {screenInfo.width > 500 ?
                  <View style={[{ flexDirection: 'column', marginTop: 40 }]}>
                    <View style={[{ flexDirection: 'row' }]}>
                      <View
                        style={{
                          flex: 1,
                          alignSelf: 'center',
                          alignItems: 'flex-end',
                        }}>
                        <Text
                          style={{ fontSize: 24, fontFamily: Fonts.Prompt_Medium }}>
                          Van No.
                        </Text>
                      </View>
                      <View style={{ flex: 3 }}>
                        <TextInputComponent
                          value={profile?.wk_ctr}
                          editable={false}
                          style={[styles.inputOutline]}
                        />
                      </View>
                      <View style={{ flex: 1 }}></View>
                    </View>
                    <View style={[{ flexDirection: 'row' }]}>
                      <View
                        style={{
                          flex: 1,
                          alignSelf: 'center',
                          alignItems: 'flex-end',
                        }}>
                        <Text
                          style={{ fontSize: 24, fontFamily: Fonts.Prompt_Medium }}>
                          TO Number
                        </Text>
                      </View>
                      <View style={{ flex: 3 }}>
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <TextInputComponent
                              value={value}
                              style={[styles.input]}
                              onBlur={onBlur}
                              onChangeText={(value: any) => onChange(value)}
                            />
                          )}
                          name="vanTo"
                          defaultValue=""
                        />
                      </View>
                      <View
                        style={{
                          flex: 1,
                          marginTop: 2,
                          alignContent: 'center',
                          alignSelf: 'center',
                        }}>
                        <Icon
                          name="qrcode"
                          color="black"
                          size={60}
                          onPress={() => setScan(true)}
                        />
                      </View>
                    </View>
                  </View>
                  :
                  <View style={[{ flexDirection: 'column', marginTop: 110 }]}>
                    <View style={[{ flexDirection: 'row' }]}>
                      <View style={{width:'100%', alignItems: 'center' }}>
                        <Text
                          style={{fontSize: 24, fontFamily: Fonts.Prompt_Medium }}>
                          Van No.
                        </Text>
                        <TextInputComponent
                          value={profile?.wk_ctr}
                          editable={false}
                          style={[styles.inputOutline,{width:200}]}
                        />
                      </View>
                      <View style={{ flex: 1 }}></View>
                    </View>
                    <View style={[{ flexDirection: 'row' }]}>
                      <View style={{ width:'100%',alignItems:'center'}}>
                        <Text
                          style={{ fontSize: 24, fontFamily: Fonts.Prompt_Medium }}>
                          TO Number
                        </Text>
                      </View>
                      </View>
                      <View style={[{ flexDirection: 'row' }]}>
                      <View style={{ width:'100%',alignItems:'center' }}>
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <TextInputComponent
                              value={value}
                              style={[styles.input,{width:200}]}
                              onBlur={onBlur}
                              onChangeText={(value: any) => onChange(value)}
                            />
                          )}
                          name="vanTo"
                          defaultValue=""
                        />
                      </View>
                    </View>
                    <View style={[{flexDirection:'row'}]}>
                    <View
                        style={{
                          alignItems:'center',
                          flex: 3,
                          marginTop: 2,
                          alignContent: 'center',
                          alignSelf: 'center',
                        }}>
                        <Icon
                          name="qrcode"
                          color="black"
                          size={60}
                          onPress={() => setScan(true)}
                        />
                      </View>
                    </View>
                  </View>
                }

                <View
                  style={[
                    {
                      flexDirection: 'row',
                      justifyContent: 'center',
                      marginTop: 20,
                    },
                  ]}>
                  <View>
                    <Button style={styles.btnLg} onPress={onSubmit}>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 22,
                          fontFamily: Fonts.Prompt_Medium,
                        }}>
                        Check
                      </Text>
                    </Button>
                  </View>
                </View>
              </ScrollView>
            )}
          </Animated.View>
        }
      />
      <Loading loading={isLoading} />
    </>
  );
};

export default SparePartStoreTransferCheckPage;
