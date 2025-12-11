import { Button, Icon, Modal } from '@ant-design/react-native';
import React, { useEffect, useState } from 'react';
import { ROUTE } from '../../constants/RoutePath';
import {
  Animated,
  ScrollView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import moment from 'moment-timezone';
import AppBar from '../../components/AppBar';
import BackGroundImage from '../../components/BackGroundImage';
import { COLOR } from '../../constants/Colors';
import { Fonts } from '../../constants/fonts';
import localStyle from './WorkProcessPageCss';
import { DropdownSelectMultipleItemProps } from '../../components/DropdownSelectMultiple';
import { Checkbox } from 'react-native-paper';
import { ScreenWidth } from 'react-native-elements/dist/helpers';

type WorkProcessProps = { workDetail: string };

const WorkProcessPage = (props) => {
  const params = props.route?.params as WorkProcessProps;
  const [visibleModal, setStateVisibleModal] = useState(false);
  const [lastDateActive, setLastDateActive] = useState<moment.Moment>(
    moment().locale('th').add(543, 'year'),
  );
  const [endDateActive, setEndDateActive] = useState<moment.Moment>();
  const [workOrderDetail, setWorkOrderDetail] = useState<any>(
    JSON.parse(params.workDetail),
  );
  const [selectsEmployee, setValueSelectsEmployee] = useState<
    DropdownSelectMultipleItemProps[]
  >([
    { label: '9150081: นรินทร์ ใจกล้า', value: '9150081', checked: true },
    { label: '9150082: จีรวัฒน์ เขียวสวัสดิ์', value: '9150082', checked: true },
    { label: '9150083: บุญพิทักษ์ ผ่องฉาย', value: '9150083', checked: false },
    { label: '9150084: แสงเพรช อาภาธร', value: '9150084', checked: false },
  ]);
  const [times, setTime] = useState<any>("00:00")
  const dimensions = useWindowDimensions();
  
  useEffect(() => {
    console.log('workOrderDetail =====>', workOrderDetail);
  }, [workOrderDetail]);


  useEffect(() => {
    const interval = setInterval(() => {
      const timesCurrent = moment().locale('th').add(543, 'year').format('HH:mm');
      setTime(`${timesCurrent}`)
    }, 1000);
    return () => {
      clearInterval(interval)
    }
  }, []);


  const onCheckOut = (type: String) => {
    console.log('endDateActive ====>', endDateActive);
    // const timesCurrent = moment().locale('th').add(543, 'year').format('HH:mm');
    // if (type == 'checkIn') {
    //   setTimeCheckIn(`${timesCurrent}`)
    //   setColorCheckIn("#2ECC71")
    //   _onClickModalCheckInCheckOut()
    // } else {
    //   setTimeCheckOut(`${timesCurrent}`)
    //   _onClickModalCheckInCheckOut()
    // }
  };

  const onClickModalSubmit = () => { };

  const ButtonWidget = (
    title?: string,
    action?: any,
    colorBackground?: any,
  ) => {
    const styles = [colorBackground && { backgroundColor: colorBackground }];
    if (!colorBackground) {
      styles.push(localStyle.btn);
    } else {
      styles.push(localStyle.btnPrimary);
    }
    return (
      <View style={{ alignItems: 'center' }}>
        <Button style={styles} onPress={action}>
          <Text
            style={{
              color: 'white',
              fontSize: 22,
              fontFamily: Fonts.Prompt_Medium,
            }}>
            {title}
          </Text>
        </Button>
      </View>
    );
  };

  const ButtonSummitEvent = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 40,
          paddingLeft: '10%',
          paddingRight: '10%',
        }}>
        <View style={{ flex: 1 }}>
          {ButtonWidget('ยืนยัน', () => onClickModalSubmit(), COLOR.primary)}
        </View>
      </View>
    );
  };

  const content = () => (
    <ScrollView>
      <View
        style={[
          { paddingLeft: 10, paddingRight: 10, marginTop: '10%', width: '100%' },
        ]}>
        <View style={{ flexDirection: 'column' }}>
          <View style={{ alignItems: 'center' }}>
            <View
              style={{
                alignItems: 'center',
                width: 'auto',
              }}>
              <View style={{ alignItems: 'center', width: 160, borderBottomColor: COLOR.secondary_primary_color, borderBottomWidth: 2, }}>
                <Text style={{ fontSize: 48, fontFamily: Fonts.Prompt_Medium, color: COLOR.secondary_primary_color }}>{times}</Text>
              </View>
              <Text
                style={{
                  marginTop: 12,
                  fontSize: 26,
                  fontFamily: Fonts.Prompt_Medium,
                  color: COLOR.secondary_primary_color,
                }}>
                เวลาปฏิบัติงานในร้านค้า
              </Text>
            </View>
            <View>
              <Text
                style={{
                  marginTop: 10,
                  fontSize: 26,
                  fontFamily: Fonts.Prompt_Light,
                  color: COLOR.gray,
                }}>
                {lastDateActive.format('DD/MM/YYYY')}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: 40,
        }}>
        <View>
          <Text
            style={{
              fontFamily: Fonts.Prompt_Light,
              fontSize: 24,
              color: COLOR.gray,
              alignItems: 'center',
              alignContent: 'center',
              alignSelf: 'center',
            }}>
            เวลาเริ่ม 10:00 นาฬิกา
          </Text>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'flex-start',
              marginTop: 20,
            }}>
            {selectsEmployee.map(
              (emp: DropdownSelectMultipleItemProps, idx: number) =>
                emp.checked && (
                  <Text
                    style={{
                      fontFamily: Fonts.Prompt_Medium,
                      fontSize: 18,
                      marginBottom: 10,
                    }}
                    key={`${emp.value}-${idx}`}>
                    {`${emp.label}`}
                  </Text>
                ),
            )}
          </View>
          <Button style={{ borderColor: COLOR.primary, marginTop: 20 }}>
            <Text
              style={{ fontFamily: Fonts.Prompt_Medium }}
              onPress={() => setStateVisibleModal(true)}>
              + เพิ่มพนักงานปฏิบัติงาน
            </Text>
          </Button>
        </View>
        <View>
          <Text
            style={{
              fontFamily: Fonts.Prompt_Light,
              fontSize: 24,
              color: COLOR.gray,
            }}>
            เวลาเสร็จ {endDateActive ? endDateActive.format('HH:mm') : 'HH:MM '}
            นาฬิกา
          </Text>
          <View>{ButtonWidget('End', () => onCheckOut('checkOut'))}</View>
        </View>
      </View>
    </ScrollView>
  );

  const BuildModalDrawer = () => {
    const onSubmitSearch = () => {
      setStateVisibleModal(false);
    };

    const onValueChange = (
      data: DropdownSelectMultipleItemProps,
      index: any,
    ) => {
      selectsEmployee[index] = data;
      setValueSelectsEmployee([...selectsEmployee]);
    };

    return (
      <Modal
        transparent
        maskClosable
        style={{ borderRadius: 15, width: dimensions.width - 50 }}
        visible={visibleModal}>
        <View>
          <View style={{ alignItems: 'flex-end' }}>
            <TouchableHighlight
              underlayColor="#fff"
              onPress={() => setStateVisibleModal(false)}>
              <Icon name="close" size={30} />
            </TouchableHighlight>
          </View>
          <View
            style={{
              paddingLeft: 40,
              paddingRight: 40,
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: Fonts.Prompt_Medium,
                fontSize: 20,
                color: COLOR.secondary_primary_color,
              }}>
              ช่างปฏิบัติงาน
            </Text>
          </View>
          <View style={{ padding: 40 }}>
            {selectsEmployee.map(
              (val: DropdownSelectMultipleItemProps, index) => (
                <TouchableOpacity
                  onPress={() => {
                    onValueChange({ ...val, ...{ checked: !val.checked } }, index);
                  }}
                  key={`${val.value}-${index}`}>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 8,
                      padding: 10,
                      backgroundColor: '#F9F9F9',
                      borderRadius: 50,
                    }}
                    key={index}>
                    <View style={{ flex:ScreenWidth > 500 ?  0.2 : 0.4 }}>
                      <Checkbox
                        key={`checkbox-${index}`}
                        status={
                          selectsEmployee[index].checked
                            ? 'checked'
                            : 'unchecked'
                        }
                      />
                    </View>
                    <View style={{ flex: ScreenWidth > 500 ? 2 : 2 }}>
                      <Text
                        style={{
                          fontFamily: Fonts.Prompt_Light,
                          marginTop: 8,
                          fontSize: 16,
                        }}>
                        {val?.label}
                      </Text>
                    </View>
                    <View>
                      {selectsEmployee[index].checked && (
                        <Icon
                          name="check-circle"
                          size={30}
                          style={{
                            color: COLOR.primary,
                          }}
                        />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ),
            )}
          </View>
          <View style={{ padding: 30 }}>
            {ButtonWidget(
              'ตกลง',
              () => {
                onSubmitSearch();
              },
              COLOR.primary,
            )}
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <>
      <AppBar
        title="รายละเอียดการทำงาน"
        rightTitle={`Order: ${workOrderDetail.orderCode}`} 
        // onBackReload={true} ////2023
        replacePath={ROUTE.WORKLIST}
        ></AppBar>
      <BackGroundImage
        components={
          <Animated.ScrollView>
            {content()}
            {ButtonSummitEvent()}
            {BuildModalDrawer()}
          </Animated.ScrollView>
        }></BackGroundImage>
    </>
  );
};

export default WorkProcessPage;
