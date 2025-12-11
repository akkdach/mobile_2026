import { Icon } from '@ant-design/react-native';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import AppBar from '../../components/AppBar';
import BackGroundImage from '../../components/BackGroundImage';
import Loading from '../../components/loading';
import styleSheet from '../../components/StyleSheet';
import TextInputComponent from '../../components/TextInput';
import { COLOR } from '../../constants/Colors';
import { Fonts } from '../../constants/fonts';
import {
  CheckWorkInWorkOut,
  CheckWorkInWorkOutInterface,
} from '../../models/checkWorkInWorkOut';
import {
  checkWorkInWorkOut,
  workInWorkOutStamp,
} from '../../services/work_in_work_out';
import { convertDateToThaiMonthDayThai } from '../../utils/Date';

type Inputs = {
  workIn: string;
  workOut: string;
};

function StartWorkPage() {
  const [workInError, setWorkInError] = useState('');
  const [workOutError, setWorkOutError] = useState('');
  const [workIn, setWorkIn] = useState('');
  const [dataInfo, setDataInfo] = useState<CheckWorkInWorkOut>();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm<Inputs>();

  useEffect(() => {
    checkOutOfWork();
  }, []);

  const [screenInfo, setScreenInfo] = useState(Dimensions.get('screen'))
  const [styles, setStyles] = useState<any>({});
  useEffect(() => {
    console.log(screenInfo)
    if (screenInfo.width < 400) {
      setStyles(styleSm);
    } else {
      setStyles(styleLg);
    }

  },[]);

  const checkOutOfWork = async () => {
    setIsLoading(true);
    try {
      const result = await checkWorkInWorkOut();
      setDataInfo(result);
      setValue('workIn', Number(result.workIn.startMile) > 0 ? result.workIn.startMile.padStart(6, "0") : '');
      setValue('workOut', Number(result.workOut.endMile) > 0 ? result.workOut.endMile.padStart(6, "0") : '');
      setWorkIn(result.workIn.startMile);
    } catch (error) {
      console.log('error ====>', error);
    } finally {
      setIsLoading(false);
    }
  };

  const stampMile = async (type: String) => {
    let data: CheckWorkInWorkOutInterface;
    if (type == 'start') {
      data = {
        mileAge: Number(getValues('workIn')),
        orderId: '',
        workCenter: '',
      };
    } else {
      data = {
        mileAge: Number(getValues('workOut')),
        orderId: '',
        workCenter: '',
      };
    }
    const result = await workInWorkOutStamp(data);
    if (result.isSuccess) {
      Alert.alert('แจ้งเตือน', 'บันทึกการลงเวลา ออกปฏิบัติงานสำเร็จ?', [
        {
          text: 'ตกลง',
          onPress: async () => {
            checkOutOfWork();
          },
        },
      ]);
    } else {
      Alert.alert('แจ้งเตือน', 'บันทึกการลงเวลา ออกปฏิบัติงานไม่สำเร็จ?', [
        {
          text: 'ตกลง',
          onPress: async () => { },
        },
      ]);
    }
  };

  const onSubmit = (key: any) => {
    if (key === 'start') {
      if (getValues('workIn') === '' && getValues('workIn').length < 6 || Number(getValues('workIn')) === 0) {
        setWorkInError('กรุณากรอกข้อมูลให้ครบถ้วน เลขไมล์ 6 หลัก และมากกว่า 000000');
        return;
      } else {
        setWorkInError('');
      }
    } else {
      if (getValues('workOut') === '' && getValues('workOut').length < 6 || Number(getValues('workOut')) === 0) {
        setWorkOutError('กรุณากรอกข้อมูลให้ครบถ้วน เลขไมล์ 6 หลัก และมากกว่า 000000');
        return;
      } else {
        setWorkOutError('');
      }
    }
    Alert.alert('แจ้งเตือน', 'คุณต้องการบันทึกข้อมูล ?', [
      {
        text: 'ยกเลิก',
        style: 'cancel',
      },
      {
        text: 'ตกลง',
        onPress: async () => {
          if (key == 'start') {
            stampMile('start');
          } else {
            stampMile('end');
          }
        },
      },
    ]);
  };

  const startWorkBuild = () => {
    const date = moment()

    return (
      <ScrollView>
        <View style={[styles.scrollView]}>
          <Card style={styleSheet.card_custom}>
            <Card.Content>
              <View
                style={{
                  padding: 10,
                  borderColor: '#ccc',
                  borderBottomWidth: 2,
                  display: 'flex',
                  flexDirection: 'row',
                  alignContent: 'center',
                }}>
                <Icon
                  name="calendar"
                  style={[styles.scrollViewIcon]}></Icon>
                <Text style={[styles.scrollViewText]}>
                  {convertDateToThaiMonthDayThai(date, 2)}
                </Text>
                <View style={{ flex: 2 }}>
                  <Text
                    style={[styles.scrollViewText]}>
                    เวลาเริ่ม:{' '}
                    {dataInfo?.workIn.startTime
                      ? dataInfo?.workIn.startTime
                      : '00:00'}
                  </Text>
                </View>
              </View>

              <View style={{ padding: 10 }}>
                <Text style={styles.textLabel}>เลขไมล์เริ่มต้น</Text>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInputComponent
                      editable={workIn != '' ? false : true}
                      placeholder="(6 หลัก)"
                      value={value}
                      maxLength={6}
                      onChangeText={(value: string) => onChange(value)}
                      keyboardType="number-pad"
                    />
                  )}
                  name="workIn"
                  defaultValue=""
                />
                {workInError != '' ? (
                  <Text
                    style={{
                      alignItems: 'center',
                      alignContent: 'center',
                      alignSelf: 'center',
                      fontFamily: Fonts.Prompt_Medium,
                      color: COLOR.neonRed,
                    }}>
                    {workInError}
                  </Text>
                ) : null}
              </View>

              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <Button
                  mode="contained"
                  disabled={workIn != '' ? true : false}
                  style={{ ...styles.btn, ...styles.btnSave }}
                  onPress={() => {
                    onSubmit('start');
                  }}>
                  <Text style={styles.text_btn}>บันทึก</Text>
                </Button>
              </View>
            </Card.Content>
          </Card>
        </View>
        {workIn != '' ? (
          <View style={[styles.scrollView]}>
            <Card style={styleSheet.card_custom}>
              <Card.Content>
                <View
                  style={{
                    padding: 10,
                    borderColor: '#ccc',
                    borderBottomWidth: 2,
                    display: 'flex',
                    flexDirection: 'row',
                    alignContent: 'center',
                  }}>
                  <Icon
                    name="calendar"
                    style={[styles.scrollViewIcon]}></Icon>
                  <Text style={[styles.scrollViewText]}>
                    {convertDateToThaiMonthDayThai(date, 2)}
                  </Text>
                  <View style={{ flex: 2 }}>
                    <Text
                      style={[styles.scrollViewText]}>
                      เวลาสิ้นสุด:{' '}
                      {dataInfo?.workOut.endTime
                        ? dataInfo?.workOut.endTime
                        : '00:00'}
                    </Text>
                  </View>
                </View>

                <View style={{ padding: 10 }}>
                  <Text style={styles.textLabel}>เลขไมล์สิ้นสุด</Text>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInputComponent
                        editable={
                          dataInfo?.workOut.endMile != '' ? false : true
                        }
                        placeholder="(6 หลัก)"
                        value={value}
                        maxLength={6}
                        onChangeText={(value: string) => onChange(value)}
                        keyboardType="number-pad"
                      />
                    )}
                    name="workOut"
                    defaultValue=""
                  />
                  {workOutError != '' ? (
                    <Text
                      style={{
                        alignItems: 'center',
                        alignContent: 'center',
                        alignSelf: 'center',
                        fontFamily: Fonts.Prompt_Medium,
                        color: COLOR.neonRed,
                      }}>
                      {workOutError}
                    </Text>
                  ) : null}
                </View>

                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}>
                  <Button
                    disabled={dataInfo?.workOut.endMile != '' ? true : false}
                    mode="contained"
                    style={{ ...styles.btn, ...styles.btnSave }}
                    onPress={() => {
                      onSubmit('end');
                    }}>
                    <Text style={styles.text_btn}>บันทึก</Text>
                  </Button>
                </View>
              </Card.Content>
            </Card>
          </View>
        ) : null}
      </ScrollView>
    );
  };

  return (
    <>
      {
        <BackGroundImage
          components={
            <Animated.View>
              <AppBar title="ออกปฏิบัติงาน"></AppBar>
              {startWorkBuild()}
            </Animated.View>
          }></BackGroundImage>
      }
      <Loading loading={isLoading} />
    </>
  );
}

const styleSm = StyleSheet.create({
  scrollViewText:{
    fontSize: 14,
    fontFamily: Fonts.Prompt_Medium,
    alignItems: 'flex-end',
    alignContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  scrollViewIcon:{ fontSize: 20, color: '#000', marginRight: 5 },
  scrollView:{
   padding: 5
  },textLabel: {
    fontSize: 14,
    fontFamily: Fonts.Prompt_Medium,
    paddingLeft: 5,
  },
  text_btn: {
    fontSize: 14,
    fontFamily: Fonts.Prompt_Medium,
  },
  btn: {
    width: 162,
    height: 62,
    padding: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 22,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 35,
    marginTop: 20,
    fontFamily: Fonts.Prompt_Medium,
  },
  btnSave: {
    backgroundColor: COLOR.secondary_primary_color,
  },
  btnCancel: {
    backgroundColor: COLOR.gray,
  },
  input: {
    height: 62,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderWidth: 2,
    fontSize: 14,
    borderColor: COLOR.secondary_primary_color,
    marginBottom: 10,
    borderRadius: 20,
  },
});


const styleLg = StyleSheet.create({
  scrollViewText:{
    fontSize: 20,
    fontFamily: Fonts.Prompt_Medium,
    alignItems: 'flex-end',
    alignContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  scrollView:{
    padding: 40,
   },
  scrollViewIcon:{ fontSize: 30, color: '#000', marginRight: 5 },
  textLabel: {
    fontSize: 20,
    fontFamily: Fonts.Prompt_Medium,
    paddingLeft: 30,
  },
  text_btn: {
    fontSize: 18,
    fontFamily: Fonts.Prompt_Medium,
  },
  btn: {
    width: 162,
    height: 62,
    padding: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 22,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 35,
    marginTop: 20,
    fontFamily: Fonts.Prompt_Medium,
  },
  btnSave: {
    backgroundColor: COLOR.secondary_primary_color,
  },
  btnCancel: {
    backgroundColor: COLOR.gray,
  },
  input: {
    height: 62,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderWidth: 2,
    fontSize: 18,
    borderColor: COLOR.secondary_primary_color,
    marginBottom: 10,
    borderRadius: 20,
  },
});

export default StartWorkPage;
