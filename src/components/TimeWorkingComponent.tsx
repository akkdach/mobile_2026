import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import {Dimensions, StyleSheet, Systrace, Text, View} from 'react-native';
import {COLOR} from '../constants/Colors';
import {Fonts} from '../constants/fonts';

type InterfaceStorageStartTime = {
  startTime?: any;
  standTime?: any;
  startDate?: any;
  endTime?: any;
  endDateTime?: any;
};

type InterfaceProps = {
  startDate?: any;
  endDate?: any;
  standardTime?: any;
  orderId?: any;
  dataUpdate?: any;
  currentPage?: boolean;
  workTimeLeft?: any;
  startTime?: any;
  endTime?: any;
  hideStandTime?: boolean;
  onValueChange?: (value: any) => void;
};



const TimeWorkingComponent = (props: InterfaceProps) => {

  const [screenInfo, setScreenInfo] = useState(Dimensions.get('screen'))
  const [styles, setStyles] = useState<any>({});
  useEffect(() => {
    // console.log(screenInfo)
    if (screenInfo.width < 400) {
      setStyles(stylesSm);
    } else {
      setStyles(stylesLg);
    }
  
  },[]);

  const stylesSm = StyleSheet.create({
    text1:{
      fontSize: 14,
    }
  })
  
  const stylesLg = StyleSheet.create({
    text1:{
      fontSize: 24,
    }
  })

  const convertDateTimeDeff = (startDate: any, endDate: any,standardTime:number=0) => {
      
    if (startDate && endDate) {
      let startTime = moment(startDate).tz('Asia/Bangkok');
      const endTime = moment(endDate).tz('Asia/Bangkok');
      const timeDiff = endTime.diff(startTime.tz('Asia/Bangkok'));
      return moment.utc(timeDiff).format('HH:mm:ss');
    }else{
      let startTime = moment(startDate).tz('Asia/Bangkok');
      const endTime = moment(startTime).tz('Asia/Bangkok');
      endTime.add(standardTime,'minutes').tz('Asia/Bangkok');
      let currTime = moment().tz('Asia/Bangkok');
      console.log('endTime',endTime.tz('Asia/Bangkok'));
      const timeDiff =  endTime.diff(currTime);
      return moment.utc(timeDiff).format('HH:mm:ss');
    }
    return '00:00:00';
  };

  const TimeWorking = () => {
    return (
      <View style={{paddingLeft: 60, paddingRight: 40, marginTop: screenInfo.width <=500 ? 10 : 60 }}>
        <View style={{flexDirection: 'row'}}>
          {!props.hideStandTime && (
            <>
              <View style={{flex: 2}}>
                <Text
                  style={[styles.text1,{
                    fontFamily: Fonts.Prompt_Light,
                    color: COLOR.gray,
                    alignItems: 'flex-start',
                    alignContent: 'flex-start',
                    alignSelf: 'flex-start',
                  }]}>
                  Stand Time: {props?.standardTime ?? 0} นาที
                </Text>
              </View>
              <View style={{flex: 2}}>
                <Text
                  style={[styles.text1,{
                    fontFamily: Fonts.Prompt_Light,
                    color: COLOR.gray,
                    alignItems: 'flex-end',
                    alignContent: 'flex-end',
                    alignSelf: 'flex-end',
                  }]}>
                  {props?.endDate ? 'เวลาที่ใช้ไป: ' : 'เหลือเวลาปฏิบัติงาน: '}
                  {props.workTimeLeft
                    ? props.workTimeLeft
                    : convertDateTimeDeff(props.startDate, props.endDate,props.standardTime)}
                </Text>
              </View>
            </>
          )}
        </View>
        <View style={{flexDirection: 'row', marginTop: 20}}>
          <View style={{flex: 2}}>
            <View style={{flexDirection: 'column'}}>
              <View>
                <Text
                  style={[styles.text1,{
                    fontFamily: Fonts.Prompt_Light,
                    color: COLOR.gray,
                    alignItems: 'flex-start',
                    alignContent: 'flex-start',
                    alignSelf: 'flex-start',
                  }]}>
                  เวลาเริ่ม{' '}
                  {props.startTime != null
                    ? moment(props.startTime)
                        .tz('Asia/Bangkok')
                        .add(543, 'year')
                        .format('HH:mm')
                    : '00:00'}{' '}
                  นาฬิกา
                </Text>
              </View>
              <View
                style={{
                  alignItems: 'flex-start',
                  alignContent: 'flex-start',
                  alignSelf: 'flex-start',
                }}></View>
            </View>
          </View>
          <View style={{flex: 2}}>
            <View style={{flexDirection: 'column'}}>
              <View>
                <Text
                  style={[styles.text1,{
                    fontFamily: Fonts.Prompt_Light,
                    color: COLOR.gray,
                    alignItems: 'flex-end',
                    alignContent: 'flex-end',
                    alignSelf: 'flex-end',
                  }]}>
                  เวลาเสร็จ{' '}
                  {props.endTime != null
                    ? moment(props.endTime)
                        .tz('Asia/Bangkok')
                        .add(543, 'year')
                        .format('HH:mm')
                    : '00:00'}{' '}
                  นาฬิกา
                </Text>
              </View>
              <View
                style={{
                  alignItems: 'flex-end',
                  alignContent: 'flex-end',
                  alignSelf: 'flex-end',
                }}></View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return <>{TimeWorking()}</>;
};

export default TimeWorkingComponent;
