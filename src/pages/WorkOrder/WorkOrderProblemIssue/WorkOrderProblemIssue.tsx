import React, {useEffect, useRef, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Avatar, Button, RadioButton} from 'react-native-paper';
import Animated from 'react-native-reanimated';
import {StackActions, useNavigation} from '@react-navigation/native';
import AppBar from '../../../components/AppBar';
import BackGroundImage from '../../../components/BackGroundImage';
import DropdownSelect, {ItemProps} from '../../../components/DropdownSelect';
import Loading from '../../../components/loading';
import TextInputComponent from '../../../components/TextInput';
import {COLOR} from '../../../constants/Colors';
import {Fonts} from '../../../constants/fonts';
import {
  ICatalog,
  IProblem,
  IWorkOrderProblem,
} from '../../../models/WorkOrderProblem';
import {
  createAllProblem,
  fetchAllProblem,
  fetchCatalogGroup,
  fetchCatalogGroup2,
} from '../../../services/workOrderProblem';

type Props = {
  workOrderData: {
    orderId: string;
    workCenter: string;
    type: string;
    webStatus: string;
  };
};

const WorkOrderProblemIssuePage = (props) => {
  const {workOrderData} = props.route?.params as Props;
  const navigation = useNavigation();
  const initProblem = {
    problemPicker: [],
    damagePicker: [],
    causePicker: [],
    activityPicker: [],
  };
  const initForm = {
    problem: '',
    problemDescription: '',
    damage: '',
    damageDescription: '',
    cause: '',
    causeDescription: '',
    activity: '',
    activityDescription: '',
  };
  const {control, getValues, reset} = useForm<any>();
  const [problems, setProblems] = useState([initProblem]);
  const [form, setForm] = useState([initForm]);
  const [equipment, setEquipment] = useState('');
  const [fetchCatalogError, setFetchCatalogError] = useState('');
  const [catalogLists, setCatalogLists] = useState<ICatalog[]>([]);
  const [objectType,setObjectType] = useState<any[]>(['TCO','TFCB','TICM','TIDP','TPX']);
  const [isLoading, setIsLoading] = useState(false);
  const isComponentMounted = useRef(true);

  const [screenInfo, setScreenInfo] = useState(Dimensions.get('screen'))
  const [styles, setStyles] = useState<any>({});
  useEffect(() => {
    console.log(screenInfo)
    if (screenInfo.width < 500) {
      setStyles(stylesSm);
    } else {
      setStyles(stylesLg);
    }

  },[screenInfo]);

  // var cataloglistProblem :ItemProps[];
  // var catalogList:ItemProps[];
  const getCatalogGroup = async () => {
    try {
      const response = await fetchCatalogGroup(workOrderData.orderId);
      const {
        data: {dataResult, isSuccess},
      } = response;
      if (response && isSuccess){
        setCatalogLists(dataResult || []);
        // cataloglistProblem = filterCatalogGroup('5',catalogLists);
      }
    } catch (error: any) {
      setFetchCatalogError(error.message);
    }
  };


  const getCatalogGroup2 = async (damage:string) => {
    try {
      const response = await fetchCatalogGroup2(workOrderData.orderId,damage);
      const {
        data: {dataResult, isSuccess},
      } = response;
      if (response && isSuccess){
        let tempcatalog = filterCatalogGroup('5',dataResult || []);
        console.log('tempcatalog',tempcatalog);
        if(tempcatalog.length >= 1){
          console.log('Catalog 5  fond');
          setCatalogLists(dataResult || []);
        }
        // cataloglistProblem = filterCatalogGroup('5',catalogLists);
      }
    } catch (error: any) {
      setFetchCatalogError(error.message);
    }
  };

  const getAllProblem = async () => {
    try {
      setIsLoading(true);
      const response = await fetchAllProblem(workOrderData.orderId);
      const {
        data: {dataResult, isSuccess, equipment},
      } = response;
      if (response && isSuccess) {
        const newEquipment = (
          equipment === null || equipment === 'null' || equipment === ''
            ? ''
            : equipment
        ) as string;
        setEquipment(newEquipment);

        const newProblems: any[] = [];
        const forms: any[] = [];

        dataResult.forEach((element: any, idx: number) => {
          newProblems.push({
            problemPicker: [],
            damagePicker: [],
            causePicker: [],
            activityPicker: [],
          });
          forms.push({
            problem: element.prpblemCode,
            problemDescription: '',
            damage: element.damageCode,
            damageDescription: element.damageText,
            cause: element.causeCode,
            causeDescription: element.causeText,
            activity: element.activityCode,
            activityDescription: element.activityText,
          });
          const damageDescription = `damageDescription-${idx}`;
          const causeDescription = `causeDescription-${idx}`;
          const activityDescription = `activityDescription-${idx}`;
          reset({
            [damageDescription]: element.damageText,
            [causeDescription]: element.causeText,
            [activityDescription]: element.activityText,
          });
        });
        if (dataResult.length > 0) {
          setForm(forms);
          setProblems(newProblems);
        }
      }
    } catch (error: any) {
      setFetchCatalogError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filterCatalogGroup = (
    group: string,
    result: ICatalog[],
  ): ItemProps[] => {
    const filterGroup = result.find(val => val.group.toLowerCase() === group);
    const mapResult = filterGroup?.items.map(val => {
      return {
        label: `${val.code}: ${val.shortText}`,
        value: val.code,
        parent:val.parent,
      };
    }, []);
    return mapResult as ItemProps[];
  };
  const filterCatalogGroup2 = (
    group: string,
    parent:string,
    result: ICatalog[],
  ): ItemProps[] => {
    const filterGroup = filterCatalogGroup(group,result);
    const filterItem  = filterGroup.filter(res=>res.parent==parent);

    return filterItem as ItemProps[];
  };

  useEffect(() => {
    if (isComponentMounted.current) {
      getCatalogGroup();
      getAllProblem();
    }
    return () => {
      isComponentMounted.current = false;
    };
  }, [isComponentMounted]);

  const createProblem = () => {
    setProblems([...problems, initProblem]);
    setForm([...form, initForm]);
  };

  const removeProblem = (index: number) => {
    if (problems.length > 1) {
      const removeFormIndex = form.filter(
        (_, formIndex) => formIndex !== index,
      );
      const removeProblemsIndex = problems.filter(
        (_, formIndex) => formIndex !== index,
      );
      setProblems(removeProblemsIndex);
      setForm(removeFormIndex);
    }
  };

  const onSubmit = async () => {
    const problem = (): IProblem[] => {
      const result: IProblem[] = [];
      let idx = 0;
      for (const f of form) {
        const formValue = getValues();
        const damageText = formValue[`damageDescription-${idx}`];
        const causeText = formValue[`causeDescription-${idx}`];
        const activityText = formValue[`activityDescription-${idx}`];
        idx += 1;
        const problemCodeGroup = catalogLists
          .find(val => val.group.toLowerCase() === 'p')
          ?.items.find(val => val.code === f.problem);
        const damageCodeGroup = catalogLists
          .find(val => val.group.toLowerCase() === 'c')
          ?.items.find(val => val.code === f.damage);
        const causeCodeGroup = catalogLists
          .find(val => val.group.toLowerCase() === '5')
          ?.items.find(val => val.code === f.cause);
        const activityCodeGroup = catalogLists
          .find(val => val.group.toLowerCase() === 'a')
          ?.items.find(val => val.code === f.activity);
        result.push({
          problemCode: problemCodeGroup?.code,
          problemCodeGroup: problemCodeGroup?.codeGroup,
          problemText: problemCodeGroup?.shortText,
          damageCode: damageCodeGroup?.code,
          damageCodeGroup: damageCodeGroup?.codeGroup,
          damageText,
          causeCode: causeCodeGroup?.code,
          causeCodeGroup: causeCodeGroup?.codeGroup,
          causeText,
          activityCode: activityCodeGroup?.code,
          activityCodeGroup: activityCodeGroup?.codeGroup,
          activityText,
          indexPositionProblem: idx,
        });
      }

      return result;
    };
    const payload: IWorkOrderProblem = {
      orderId: workOrderData.orderId,
      equipment: equipment === '' ? null : equipment,
      problemItems: problem(),
    };
    setIsLoading(true);
    try {
      const response = await createAllProblem(payload);
      if (response.data.isSuccess) {
        navigation.dispatch(StackActions.pop());
      } else {
        Alert.alert('แจ้งเตือน', response.data.message);
      }
    } catch (error: any) {
      Alert.alert('แจ้งเตือน', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (value: string, index: number, name: string) => {
    let newArr: any = [...form];
    newArr[index][name] = value;
    setForm(newArr);
    if(name=="damage"){
      getCatalogGroup2(value);
    }
  };

  var objType = ['TPX'];

  const WorkOrderProblemBuild = () => {
    return (
      <ScrollView>
        <View style={styles.wrapper}>
          <View style={[styles.scrollView]}>
            <Text style={styles.header}>เครื่องที่เสีย</Text>
          </View>
          {problems.map(
            (
              {problemPicker, damagePicker, causePicker, activityPicker}: any,
              index: number,
            ): any => (
              <View
                key={index}
                style={[styles.scrollView]}>
                <View
                  style={{
                    borderColor: '#d5d5d5',
                    borderBottomWidth: 2,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignContent: 'center',
                  }}>
                  <Text style={styles.header}>ปัญหาที่ {index + 1}</Text>
                  {workOrderData.webStatus !== '4' && (
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={() => removeProblem(index)}>
                      <View style={{padding: 10}}>
                        <Avatar.Icon
                          icon="close"
                          style={{backgroundColor: '#3bb4cd'}}
                          size={45}
                          color={'#fff'}
                        />
                      </View>
                    </TouchableOpacity>
                  )}
                </View>

                <View style={{padding: 0,width:'100%'}}>
                  <View style={[styles.dropView]}>
                    <Text
                      style={{...styles.text, marginBottom: 5}}>
                      ปัญหาที่พบ
                    </Text>
                    <View style={{width: '100%'}}>
                      <DropdownSelect
                        selects={form && form[index]?.problem}
                       dataItem={filterCatalogGroup('p', catalogLists)}
                      // dataItem={catalogList}
                       onValueChange={value =>
                          handleChange(value, index, 'problem')
                        }
                        textStyle={{color: COLOR.white,...styles.text}}
                        containerStyle={styles.containerStyle}
                        containerTextStyle={styles.containerTextStyle}
                        iconStyle={styles.iconStyle}
                        contentContainerStyle={{borderRadius: 25}}
                        isIcon={true}
                        maxLimit={50}
                        isShowLabel={true}
                      />
                    </View>
                  </View>

                  <View style={{marginBottom: 20}}>
                    <Text
                      style={{...styles.text, marginBottom: 5}}>
                      อาการเสีย
                    </Text>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View style={{width: '55%'}}>
                        <DropdownSelect
                          selects={form[index]?.damage}
                          dataItem={filterCatalogGroup('c', catalogLists)}
                          onValueChange={value =>
                            handleChange(value, index, 'damage')
                          }
                          textStyle={{color: COLOR.white,...styles.text}}
                          containerStyle={styles.containerStyle}
                          containerTextStyle={styles.containerTextStyle}
                          iconStyle={styles.iconStyle}
                          contentContainerStyle={{borderRadius: 25}}
                          isIcon={true}
                          maxLimit={23}
                          isShowLabel={true}
                        />
                      </View>
                      <View style={{width: '55%'}}>
                        <Controller
                          control={control}
                          render={({field: {onChange, onBlur, value}}) => {
                            return (
                              <TextInputComponent
                                placeholder="รายละเอียดอาการ"
                                style={styles.input}
                                value={value}
                                onChangeText={(val: string) => onChange(val)}
                                editable={
                                  workOrderData.webStatus !== '4' ? true : false
                                }
                              />
                            );
                          }}
                          name={`damageDescription-${index}`}
                          defaultValue=""
                        />
                      </View>
                    </View>
                  </View>

                  <View style={{marginBottom: 20}}>
                    <Text
                      style={{...styles.text,  marginBottom: 5}}>
                      สาเหตุที่เสีย
                    </Text>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View style={{width: '55%'}}>
                        <DropdownSelect
                          selects={form[index]?.cause}
                          dataItem={filterCatalogGroup('5',catalogLists)}
                          onValueChange={value =>
                            handleChange(value, index, 'cause')
                          }
                          textStyle={{color: COLOR.white,...styles.text}}
                          containerStyle={styles.containerStyle}
                          containerTextStyle={styles.containerTextStyle}
                          iconStyle={styles.iconStyle}
                          contentContainerStyle={{borderRadius: 25}}
                          isIcon={true}
                          maxLimit={23}
                          isShowLabel={true}
                        />
                      </View>
                      <View style={{width: '55%'}}>
                        <Controller
                          control={control}
                          render={({field: {onChange, onBlur, value}}) => {
                            return (
                              <TextInputComponent
                                placeholder="รายละเอียดอาการ"
                                style={styles.input}
                                value={value}
                                onChangeText={(val: string) => onChange(val)}
                                editable={
                                  workOrderData.webStatus !== '4' ? true : false
                                }
                              />
                            );
                          }}
                          name={`causeDescription-${index}`}
                          defaultValue=""
                        />
                      </View>
                    </View>
                  </View>

                  <View style={{...styles.bt20}}>
                    <Text
                      style={{...styles.text, marginBottom: 5}}>
                      วิธีแก้ไข
                    </Text>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View style={{width: '55%'}}>
                        <DropdownSelect
                          selects={form[index]?.activity}
                          dataItem={filterCatalogGroup('a', catalogLists)}
                          onValueChange={value =>
                            handleChange(value, index, 'activity')
                          }
                          textStyle={{color: COLOR.white,...styles.text}}
                          containerStyle={styles.containerStyle}
                          containerTextStyle={styles.containerTextStyle}
                          iconStyle={styles.iconStyle}
                          contentContainerStyle={{borderRadius: 25}}
                          isIcon={true}
                          maxLimit={23}
                          isShowLabel={true}
                        />
                      </View>
                      <View style={{width: '55%'}}>
                        <Controller
                          control={control}
                          render={({field: {onChange, onBlur, value}}) => {
                            return (
                              <TextInputComponent
                                placeholder="รายละเอียดอาการ"
                                style={styles.input}
                                value={value}
                                onChangeText={(val: string) => onChange(val)}
                                editable={
                                  workOrderData.webStatus !== '4' ? true : false
                                }
                              />
                            );
                          }}
                          name={`activityDescription-${index}`}
                          defaultValue=""
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ),
          )}
          {workOrderData.webStatus !== '4' && (
            <View
              style={[
                {
                  padding: 10,
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'row',
                },
              ]}>
              <Button style={styles.btn} onPress={createProblem}>
                <Text style={{color: 'white', ...styles.text}}>
                  เพิ่มปัญหาที่พบ
                </Text>
              </Button>
              <Button style={styles.btnSave} onPress={onSubmit}>
                <Text style={{color: 'white', ...styles.text}}>บันทึก</Text>
              </Button>
            </View>
          )}
        </View>
      </ScrollView>
    );
  };

  return (
    <>
      {screenInfo.width >= 500 &&<AppBar
        title="ปัญหาที่ช่างพบ"
        rightTitle={`Order: ${workOrderData.orderId}`}></AppBar> }
              {screenInfo.width < 500 &&<AppBar
        title={`ปัญหาที่ช่างพบ ${workOrderData.orderId}`}
        ></AppBar> }
      <BackGroundImage
        components={
          <Animated.ScrollView>{WorkOrderProblemBuild()}</Animated.ScrollView>
        }
      /> 
      <Loading loading={isLoading} />
    </>
  );
};

const stylesLg = StyleSheet.create({
  wrapper: {
    padding: 30,
  },
  header: {
    fontSize: 25,
    fontFamily: Fonts.Prompt_Medium,
    paddingTop: 15,
  },
  containerStyle: {
    borderRadius: 30,
    backgroundColor: 'rgba(0, 172, 200, 0.6)',
    height: 56,
    marginHorizontal: 20,
    paddingLeft: 40,
    fontFamily: Fonts.Prompt_Light,
    color: '#ffffff',
  },
  containerTextStyle: {
    paddingTop: 15,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  iconStyle: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 20,
    paddingTop: 20,
  },
  text: {
    fontSize: 20,
    fontFamily: Fonts.Prompt_Light,
  },
  textLabel: {
    marginTop: 6,
    fontFamily: Fonts.Prompt_Medium,
    fontSize: 16,
  },
  btn: {
    width: 300,
    height: 60,
    padding: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 22,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: COLOR.gray,
    borderRadius: 35,
    marginTop: 20,
    fontFamily: Fonts.Prompt_Medium,
  },
  btnSave: {
    width: 300,
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
    fontFamily: Fonts.Prompt_Medium,
  },
  pickerInput: {
    borderWidth: 2,
    borderColor: COLOR.secondary_primary_color,
    borderRadius: 20,
    marginBottom: 10,
    height: 62,
    fontSize: 18,
    color: '#000',
  },
  input: {
    height: 56,
    fontSize: 16,
    width: '100%',
    marginLeft: 0,
  },
  scrollView:{paddingLeft: 30, paddingRight: 30, paddingBottom: 10},
  dropView:{marginBottom: 20,width:'120%'},
  bt20:{
    marginBottom: 20
  }
});

const stylesSm = StyleSheet.create({
  bt20:{
    marginBottom: 5
  },
  dropView:{marginBottom: 5,width:'115%'},
  inputView:{marginLeft:-25},
  scrollView:{paddingLeft: 5, paddingRight: 5, paddingBottom: 10},
  wrapper: {
    padding: 10,
    width:'95%'
  },
  header: {
    fontSize: 14,
    fontFamily: Fonts.Prompt_Medium,
    paddingTop: 15,
  },
  containerStyle: {
    borderRadius: 30,
    backgroundColor: 'rgba(0, 172, 200, 0.6)',
    height: 48,
    marginHorizontal: 20,
    paddingLeft: 10,
    fontFamily: Fonts.Prompt_Light,
    color: '#ffffff',
    marginLeft:-10
  },
  containerTextStyle: {
    paddingTop: 15,
    alignItems: 'flex-start',
    justifyContent: 'center',
    fontSize:12
  },
  iconStyle: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 20,
    paddingTop: 20,
  },
  text: {
    fontSize: 14,
    fontFamily: Fonts.Prompt_Light,
  },
  textLabel: {
    marginTop: 6,
    fontFamily: Fonts.Prompt_Medium,
    fontSize: 14,
  },
  btn: {
    width: 160,
    height: 60,
    padding: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 22,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: COLOR.gray,
    borderRadius: 35,
    marginTop: 20,
    fontFamily: Fonts.Prompt_Medium,
  },
  btnSave: {
    width: 150,
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
    fontFamily: Fonts.Prompt_Medium,
  },
  pickerInput: {
    borderWidth: 2,
    borderColor: COLOR.secondary_primary_color,
    borderRadius: 20,
    marginBottom: 10,
    height: 62,
    fontSize: 18,
    color: '#000',
  },
  input: {
    height: 56,
    fontSize: 14,
    width: '100%',
    marginLeft: 0,
  },
});

export default WorkOrderProblemIssuePage;
