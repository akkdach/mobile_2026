import {Button} from '@ant-design/react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {Card} from 'react-native-paper';
import Animated from 'react-native-reanimated';
import AppBar from '../../components/AppBar';
import BackGroundImage from '../../components/BackGroundImage';
import styleSheet from '../../components/StyleSheet';
import {getProfileService} from '../../services/profile_service';
import profileStyle from './ProfilePageCss';
import ProfileComponent from './ProfileComponent';
import ChangePasswordModal from './ChangePasswordModal';
const logo = require('../../../assets/logo.png');
const logo2 = require('../../../assets/worker.png');

const ProfilePage = (props: any) => {
  const [stateForm, setStateForm] = useState({
    username: '',
    fullname: '',
    email: '',
    role: '',
    mobile: '',
    password: '',
    workCenter: '',
    employeeId: '',
    profilePicture: '',
  });

  const [passwords, setSecured] = useState<boolean>(true);
  const [changepassword, setChangepassword] = useState<boolean>(true);
  const password = useRef(null) as any;
  const changepasswordUseRef = useRef(null) as any;
  useEffect(() => {
    getProfile();
    // password.current.setNativeProps({
    //   style: {
    //     fontFamily: 'Prompt-Light',
    //   },
    // });
  }, [passwords]);

  useEffect(() => {
    // changepasswordUseRef.current.setNativeProps({
    //   style: {
    //     fontFamily: 'Prompt-Light',
    //   },
    // });
  }, [changepassword]);

  const [screenInfo, setScreenInfo] = useState(Dimensions.get('screen'))
  const [styles, setStyles] = useState<any>({});
  useEffect(() => {
    console.log(screenInfo)
    if (screenInfo.width < 400) {
      setStyles(stylesSM);
    } else {
      setStyles(stylesLG);
    }

  },[]);

  const getProfile = async () => {
    try {
      const response = await getProfileService();
      setStateForm({
        username: response.dataResult.username,
        fullname: String(response.dataResult.fullname).trim(),
        email: response.dataResult.email,
        role: response.dataResult.role,
        mobile: response.dataResult.mobile,
        password: '',
        workCenter: response.dataResult.wk_ctr,
        employeeId: response.dataResult.employee_id,
        profilePicture: response.dataResult.image_url
          ? response.dataResult.image_url
          : '',
      });
    } catch (error) {
      Alert.alert('แจ้งเตือน', `${error}`, [
        {
          text: 'ตกลง',
        },
      ]);
    }
  };

  const setStateFormValue = (value: any, key: any) => {
    let username = key === 'username' ? value : stateForm.username;
    let fullname = key === 'fullname' ? value : stateForm.fullname;
    let email = key === 'email' ? value : stateForm.email;
    let role = key === 'role' ? value : stateForm.role;
    let mobile = key === 'mobile' ? value : stateForm.mobile;
    let workCenter = key === 'workCenter' ? value : stateForm.workCenter;
    let employeeId = key === 'employeeId' ? value : stateForm.employeeId;
    let password = key === 'password' ? value : stateForm.password;

    setStateForm({
      username: username,
      fullname: fullname,
      email: email,
      role: role,
      mobile: mobile,
      password: password,
      workCenter: workCenter,
      employeeId: employeeId,
      profilePicture: stateForm.profilePicture,
    });
  };

  const InputWidget = (
    placeholder: any,
    value: any,
    onChangeText: any,
    editable?: boolean,
    secureTextEntry?: any,
    useRef?: any,
  ) => {
    return (
      <View style={[{padding: 10}]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#FFFFFF"
          ref={useRef}
          secureTextEntry={secureTextEntry}
          style={styles.input}
          editable={editable}
        />
      </View>
    );
  };

  const stylesSM = StyleSheet.create({
    view:{padding: 0},
    input: {
      backgroundColor: 'rgba(0, 172, 200, 0.6)',
      marginHorizontal: 20,
      paddingLeft: 30,
      padding:10,
      borderRadius: 20,
      fontSize: 18,
      fontFamily: 'Prompt-Light',
      color: '#ffffff',
    },
  });

  const stylesLG = StyleSheet.create({
    view:{padding: 0},
    input: {
      backgroundColor: 'rgba(0, 172, 200, 0.6)',
      height: 66,
      marginHorizontal: 20,
      paddingLeft: 40,
      borderRadius: 25,
      fontSize: 20,
      fontFamily: 'Prompt-Light',
      color: '#ffffff',
    },
  });

  const onSubmit = () => {
    // Implement api service
    console.log('[stateForm]==>', stateForm);
  };

  const FormInput = () => {
    console.log('stateForm.profilePicture ===>', stateForm.profilePicture);
    return (
      <ScrollView>
        <View style={[styles.view]}>
          <View
            style={{
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'center',
              marginTop: 10,
              alignItems: 'center',
            }}>
            {stateForm.profilePicture !== '' && (
              <Image
                style={{
                  width: 160,
                  height: 160,
                  borderRadius: 100,
                  borderWidth: 6,
                  borderColor: '#00acc8',
                  marginBottom: 10,
                  alignSelf: 'center',
                  marginTop: 40,
                }}
                source={{uri: stateForm.profilePicture}}
              />
            )}
            {stateForm.profilePicture === '' && (
              <Image style={profileStyle.logo3} source={logo2} />
            )}
            <Text
              style={{
                fontSize: 22,
                fontFamily: 'Prompt-SemiBold',
              }}>
              Profile
            </Text>
          </View>
          <Card style={[{top: 10, borderRadius: 10}]}>
            <Card.Content>
              {InputWidget(
                'รหัสพนักงาน',
                stateForm.employeeId,
                (employeeId: any) =>
                  setStateFormValue(employeeId, 'employeeId'),
                false,
              )}
              {InputWidget(
                'ชื่อผู้ใช้',
                stateForm.username,
                (username: any) => setStateFormValue(username, 'username'),
                false,
              )}
              {InputWidget(
                'ชื่อ - นามสกุล',
                stateForm.fullname,
                (fullname: any) => setStateFormValue(fullname, 'fullname'),
              )}
              {InputWidget('เบอร์โทร', stateForm.mobile, (mobile: any) =>
                setStateFormValue(mobile, 'mobile'),
              )}
              {InputWidget('อีเมล', stateForm.email, (email: any) =>
                setStateFormValue(email, 'email'),
              )}
              {InputWidget(
                'ตำแหน่ง',
                stateForm.role,
                (role: any) => setStateFormValue(role, 'role'),
                false,
              )}
              {InputWidget(
                'workCenter',
                stateForm.workCenter,
                (workCenter: any) =>
                  setStateFormValue(workCenter, 'workCenter'),
                false,
              )}
              {/* {InputWidget(
                'รหัสผ่าน',
                stateForm.password,
                (password: any) =>
                  setStateFormValue(password, 'password'),
                false
              )} */}
              {/* <View style={[{ padding: 10 }]}>
                <Button style={profileStyle.btn} onPress={onSubmit}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 22,
                      fontFamily: 'Prompt-SemiBold',
                    }}>
                    ยืนยัน
                  </Text>
                </Button>
              </View> */}
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    );
  };

  return (
    <>
      
      {props.appBar === undefined || props.appBar ? (
        <AppBar title="User Profile"></AppBar>
      ) : null}
      <BackGroundImage
        components={
          <Animated.ScrollView><ProfileComponent /></Animated.ScrollView>
        }></BackGroundImage>
    </>
  );
};

export default ProfilePage;
