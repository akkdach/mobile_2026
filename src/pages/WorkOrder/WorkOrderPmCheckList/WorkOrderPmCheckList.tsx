import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, RadioButton, Title } from 'react-native-paper';
import TextInputComponent from '../../../components/TextInput';
import { COLOR } from '../../../constants/Colors';
import { Fonts } from '../../../constants/fonts';
import { getPmChecklistService } from '../../../services/work_order_check_list';

interface Props {
  qiSubmit: (allValues: any) => void,
  orderId?: any,
  errorValidate?: boolean,
  webStatus?: string
}

const WorkOrderPmCheckListPage = ({ qiSubmit, orderId, errorValidate, webStatus }: Props) => {
  const [allValues, setAllValues] = useState({
    electicalSystem: { measure: '', remark: '' },
    waterSystem: { measure: '', remark: '' },
    machine: { measure: '', remark: '' },
    gmpPestControl: { measure: '', remark: '' },
    waterQulity: { measure: '', remark: '' },
  });


  useEffect(() => {
    getPmChecklist()
  }, []);

  const [screenInfo, setScreenInfo] = useState(Dimensions.get('screen'))
  const [styles, setStyles] = useState<any>({});
  useEffect(() => {
    console.log(screenInfo)
    if (screenInfo.width < 500) {
      setStyles(stylesSm);
    } else {
      setStyles(stylesLg);
    }

  },[]);


  const getPmChecklist = async () => {
    try {
      let response = await getPmChecklistService(orderId)
      setAllValues(response)
    } catch (error) {
    }
  }

  const changeHandler = (
    name: string,
    args: { measure?: string; remark?: string },
  ) => {
    setAllValues({ ...allValues, [name]: args });
  };

  const changeHandlerInput = (
    name: string,
    args: { measure?: string; remark?: string },
  ) => {
    setAllValues({ ...allValues, [name]: args });
  };

  const ButtonSubmit = () => {
    return (
      <View style={[{
        paddingLeft: 40,
        paddingRight: 40,
        paddingBottom: 100,
        alignItems: 'center',
        alignSelf: 'center'
      }]}>
        <Button style={[styles.btn, { padding: 6, width: 350 }]} onPress={onSubmit}>
          <Text
            style={{
              color: 'white',
              fontSize: 20,
              fontFamily: Fonts.Prompt_Medium,
            }}>
            บันทึก
          </Text>
        </Button>
      </View>
    );
  };

  const onSubmit = () => {
    // workOrderPmCheckList(allValues)
    qiSubmit(allValues)
  };

  const RadioButtonGroup = (
    title: string,
    onValueChange: any,
    value: any,
    inputValue: any,
    onChangeText: any,
  ) => {
    return (
      <Card style={styles.marginTop}>
        <Card.Content>
          <Title style={styles.textTitle}>{title}{errorValidate && value === null ? <Text style={{ color: "red", fontSize: 18 }}>*</Text> : null}</Title>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <RadioButton.Group onValueChange={onValueChange} value={value}>
                <View style={{ flexDirection: 'row', marginTop: 12 }}>
                  <View style={{ flex: 2 }}>
                    <View style={{ flexDirection: 'row' }}>
                      <View>
                        <RadioButton value="true" />
                      </View>
                      <View>
                        <Text style={styles.textLabel}>ผ่าน</Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ flex: 2 }}>
                    <View style={{ flexDirection: 'row' }}>
                      <View>
                        <RadioButton value="false" />
                      </View>
                      <View>
                        <Text style={styles.textLabel}>ไม่ผ่าน</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </RadioButton.Group>
            </View>
            <View style={{ flex: 2 }}>
              <TextInputComponent
                placeholder="หมายเหตุ"
                style={{ height: 42, fontSize: 16, borderRadius: 10, paddingLeft: 20 }}
                value={inputValue}
                onChangeText={onChangeText}
              />
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const Contents = () => {
    return (
      <ScrollView>
        <View >
          {RadioButtonGroup(
            '1.ระบบไฟฟ้า',
            (newValue: any) =>
              changeHandler('electicalSystem', {
                measure: newValue,
                remark: allValues['electicalSystem'].remark,
              }),
            allValues['electicalSystem'].measure,
            allValues['electicalSystem'].remark,
            (text: any) =>
              changeHandlerInput('electicalSystem', {
                remark: text,
                measure: allValues['electicalSystem'].measure,
              }),
          )}

          {RadioButtonGroup(
            '2.ระบบน้ำ',
            (newValue: any) =>
              changeHandler('waterSystem', {
                measure: newValue,
                remark: allValues['waterSystem'].remark,
              }),
            allValues['waterSystem'].measure,
            allValues['waterSystem'].remark,
            (text: any) =>
              changeHandlerInput('waterSystem', {
                remark: text,
                measure: allValues['waterSystem'].measure,
              }),
          )}

          {RadioButtonGroup(
            '3.การทำงานของเครื่อง',
            (newValue: any) =>
              changeHandler('machine', {
                measure: newValue,
                remark: allValues['machine'].remark,
              }),
            allValues['machine'].measure,
            allValues['machine'].remark,
            (text: any) =>
              changeHandlerInput('machine', {
                remark: text,
                measure: allValues['machine'].measure,
              }),
          )}

          {RadioButtonGroup(
            '4.GMP & Pest Control',
            (newValue: any) =>
              changeHandler('gmpPestControl', {
                measure: newValue,
                remark: allValues['gmpPestControl'].remark,
              }),
            allValues['gmpPestControl'].measure,
            allValues['gmpPestControl'].remark,
            (text: any) =>
              changeHandlerInput('gmpPestControl', {
                remark: text,
                measure: allValues['gmpPestControl'].measure,
              }),
          )}

          {RadioButtonGroup(
            '5.คุณภาพของน้ำดื่ม',
            (newValue: any) =>
              changeHandler('waterQulity', {
                measure: newValue,
                remark: allValues['waterQulity'].remark,
              }),
            allValues['waterQulity'].measure,
            allValues['waterQulity'].remark,
            (text: any) =>
              changeHandlerInput('waterQulity', {
                remark: text,
                measure: allValues['waterQulity'].measure,
              }),
          )}
          {webStatus != "4" ? ButtonSubmit() : null}
        </View>
      </ScrollView>
    );
  };

  return (<View>{Contents()}</View>)
};

const stylesLg = StyleSheet.create({
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
  },
  textLabel: {
    marginTop: 6,
    fontFamily: Fonts.Prompt_Medium,
    fontSize: 16,
  },
});

const stylesSm = StyleSheet.create({
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
  },
  textLabel: {
    marginTop: 6,
    fontFamily: Fonts.Prompt_Medium,
    fontSize: 12,
  },
});
export default WorkOrderPmCheckListPage;
