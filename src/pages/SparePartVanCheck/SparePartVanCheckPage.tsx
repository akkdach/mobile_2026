import { Icon, Modal } from '@ant-design/react-native';
import React, { FC, useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, Checkbox, Colors } from 'react-native-paper';
import { Actions } from 'react-native-router-flux';
import AppBar from '../../components/AppBar';
import BackGroundImage from '../../components/BackGroundImage';
import DropdownSelect from '../../components/DropdownSelect';
import { DropdownSelectMultipleItemProps } from '../../components/DropdownSelectMultiple';
import Loading from '../../components/loading';
import { COLOR } from '../../constants/Colors';
import { Fonts } from '../../constants/fonts';
import { ROUTE } from '../../constants/RoutePath';
import {
  fetchSparePartListTONumber,
  fetchSparePartReceiveTONumber,
  fetchSparePartTransferRequest,
} from '../../services/sparePart';
import { styleLg, styleSm } from '../InfomationCloseWork/InformationCloseWorkCss';

type InterfaceProps = {
  profile: any;
};

const SparePartVanCheckPage: FC<InterfaceProps> = (props: InterfaceProps) => {
  const [selectReceiveTransferFrom, setSelectReceiveTransferFrom] = useState<
    string | undefined
  >();
  const [receiveTransferFromList, setReceiveTransferFromList] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectTONumber, setSelectTONumber] = useState<string | undefined>();
  const [toNumberList, setToNumberList] = useState<
    { label: string; value: string }[]
  >([]);
  const [transferToList, setTransferToList] = useState<
    { label: string; value: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleTOModal, setVisibleTOModal] = useState(false);
  const [selectsItem, setValueSelectsItem] = useState<
    DropdownSelectMultipleItemProps[]
  >([]);

  const [screenInfo, setScreenInfo] = useState(Dimensions.get('screen'))
  const [styles, setStyles] = useState<any>({});
  useEffect(() => {
    console.log(screenInfo)
    if (screenInfo.width < 500) {
      setStyles(styleSm);
    } else {
      setStyles(styleLg);
    }

  }, [screenInfo]);

  const loadAll = async () => {
    try {
      setIsLoading(true);
      const sparePartTransferRequests = await fetchSparePartTransferRequest();
      const mapSparePartTransferRequest = sparePartTransferRequests.dataResult
        ? sparePartTransferRequests.dataResult.map(val => {
          return {
            label: val,
            value: val,
          };
        })
        : [];
      setReceiveTransferFromList(mapSparePartTransferRequest);
    } catch (error: any) {
      Alert.alert('แจ้งเตือน', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const loadTONumber = async (stge_loc: string) => {
    try {
      setIsLoading(true);
      const sparePartTransferRequestTos = await fetchSparePartReceiveTONumber(
        stge_loc,
      );
      if (sparePartTransferRequestTos.dataResult?.length === 0) {
        Alert.alert('แจ้งเตือน', 'ไม่พบข้อมูล TO');
        return;
      }
      const mapResult = sparePartTransferRequestTos.dataResult?.map(val => {
        return {
          label: val,
          value: val,
          checked: false,
        };
      });
      setValueSelectsItem(mapResult as DropdownSelectMultipleItemProps[]);
      setVisibleTOModal(true);
    } catch (error: any) {
      Alert.alert('แจ้งเตือน', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onClickCheckTO = async () => {
    try {
      setIsLoading(true);
      const checkSparePartTranferRequests = await fetchSparePartListTONumber(
        selectReceiveTransferFrom as string,
        ['TO21090021', 'TO21090022'],
        '',
      );
    } catch (error: any) {
      Alert.alert('แจ้งเตือน', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const Search = () => (
    <>
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
        }}>
        <View style={{ paddingLeft: 10, width: 150 ,alignItems: 'center',}}>
          <Text style={{ fontFamily: Fonts.Prompt_Medium, fontSize: 18 }}>
            รับโอนจาก
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          borderRadius: 50
        }}>
        <View style={{ flex: 3, paddingRight: 10,  }}>
          <DropdownSelect
            selects={selectReceiveTransferFrom}
            dataItem={receiveTransferFromList}
            onValueChange={value => {
              setSelectReceiveTransferFrom(value as string);
            }}
            placeholder={'-- เลือกขอโอนจาก --'}
            textStyle={{ color: COLOR.white }}
            containerStyle={[styles.containerStyle, { width: '100%', height: 50, marginTop: -2 }]}
            containerTextStyle={styles.containerTextStyle}
            iconStyle={styles.iconStyle}
            contentContainerStyle={{ borderRadius: 25 }}
            isIcon={true}
            maxLimit={50}
            showValueOnly={true}
            style={{borderRadius: 50}}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            mode="contained"
            onPress={() => {
              if (
                !selectReceiveTransferFrom ||
                selectReceiveTransferFrom.length === 0
              ) {
                Alert.alert('แจ้งเตือน', 'กรุณาระบุขอโอนจาก');
                return;
              }
              loadTONumber(selectReceiveTransferFrom);
            }}
            style={{
              borderRadius: 50,
              height: 52,
              backgroundColor: COLOR.secondary_primary_color,
            }}>
            <Text style={{ fontFamily: Fonts.Prompt_Light, fontSize: 20 }}>
              ค้นหา
            </Text>
          </Button>
        </View>
      </View>
    </>
  );

  const SearchTONumber = () => (
    <View
      style={{
        flexDirection: 'row',
        padding: 10,
        paddingTop: 5,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
      }}>
      <View style={{ paddingLeft: 10, width: 150 }}>
        <Text style={{ fontFamily: Fonts.Prompt_Medium, fontSize: 18 }}>
          TO Number
        </Text>
      </View>
      <View style={{ flex: 2, paddingRight: 10 }}>
        <DropdownSelect
          selects={selectTONumber}
          dataItem={toNumberList}
          onValueChange={value => {
            setSelectTONumber(value as string);
          }}
          placeholder={'-- เลือก TO Number --'}
          textStyle={{ color: COLOR.white }}
          containerStyle={styles.containerStyle}
          containerTextStyle={styles.containerTextStyle}
          iconStyle={styles.iconStyle}
          contentContainerStyle={{ borderRadius: 25 }}
          isIcon={true}
          maxLimit={50}
          showValueOnly={true}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Button
          mode="contained"
          onPress={() => {
            if (!selectTONumber || selectTONumber.length === 0) {
              Alert.alert('แจ้งเตือน', 'กรุณาระบุ TO Number');
              return;
            }
            setVisibleTOModal(true);
          }}
          style={{
            borderRadius: 50,
            height: 52,
            backgroundColor: COLOR.secondary_primary_color,
          }}>
          <Text style={{ fontFamily: Fonts.Prompt_Light, fontSize: 20 }}>
            ตรวจสอบ
          </Text>
        </Button>
      </View>
    </View>
  );

  const onValueChange = (data: DropdownSelectMultipleItemProps, index: any) => {
    selectsItem[index] = data;
    setValueSelectsItem([...selectsItem]);
  };

  const _onSubmitSearch = () => {
    setVisibleTOModal(false)
    const toNumbers = selectsItem.filter(val => val.checked).map(val => val.value)
    if (toNumbers.length > 0) {
      Actions.push(ROUTE.SPARE_PART_VAN_CHECK_LIST, {
        search: {
          selectReceiveTransferFrom: selectReceiveTransferFrom as string,
          toNumbers
        },
        profile: props.profile,
      });
      setValueSelectsItem([])
    }
  };
  const _onCnacelSearch = () => {
    setVisibleTOModal(false)
    const toNumbers = selectsItem.filter(val => val.checked).map(val => val.value)
    if (toNumbers.length > 0) {
      Actions.push(ROUTE.SPARE_PART_VAN_CHECK_LIST, {
        search: {
          selectReceiveTransferFrom: selectReceiveTransferFrom as string,
          toNumbers
        },
        profile: props.profile,
      });
      setValueSelectsItem([])
    }
  };

  const BottomWidget = (
    title?: string,
    action?: any,
    colorBackground?: any,
  ) => {
    return (
      <View style={{ alignItems: 'center' }}>
        <Button
          style={[
            styles.btn,
            colorBackground ? { backgroundColor: colorBackground } : { backgroundColor: COLOR.primary },
            { height: 52 },
          ]}
          onPress={action}>
          <Text style={{ color: 'white', fontSize: 18 }}>{title}</Text>
        </Button>
      </View>
    );
  };

  const BuildModalDrawer = () => {
    const renderItem = ({ item, index }: any) => {
      return item;
    };

    let listItem: any = [];
    if (selectsItem && selectsItem?.length > 0) {
      selectsItem?.forEach((val: DropdownSelectMultipleItemProps, index) => {
        listItem.push(
          <TouchableOpacity
            onPress={() => {
              onValueChange({ ...val, ...{ checked: !val.checked } }, index);
            }}
            key={`${val.label}-${val.value}-${index}`}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 8,
                padding: 10,
                backgroundColor: '#F9F9F9',
                borderRadius: 50,
              }}
              key={index}>
              <View style={{ flex: 0.2 }}>
                <Checkbox
                  key={`checkbox-${index}`}
                  status={selectsItem[index].checked ? 'checked' : 'unchecked'}
                />
              </View>
              <View style={{ flex: 2 }}>
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
                {selectsItem[index].checked && (
                  <Icon
                    name="check-circle"
                    size={30}
                    style={{
                      color: COLOR.primary,
                    }}
                    key={`${index}`}
                  />
                )}
              </View>
            </View>
          </TouchableOpacity>,
        );
      });
    }
    return (
      <Modal
        transparent
        key={'BuildModalDrawer'}
        animationType={'none'}
        maskClosable
        style={[styles.modalWidth]}
        visible={visibleTOModal}>
        <View>
          <View style={{ alignItems: 'flex-end' }}>
            <TouchableHighlight
              underlayColor="#fff"
              onPress={() => {
                setVisibleTOModal(false);
              }}>
              <Icon name="close" size={30} />
            </TouchableHighlight>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontFamily: Fonts.Prompt_Medium, fontSize: 18 }}>
              Transfer Order Number
            </Text>
          </View>
          <View style={{ padding: 5 }}>
            <FlatList
              data={listItem}
              initialNumToRender={6}
              renderItem={renderItem}
              keyExtractor={(item, index) => `select-list-${index}`}
            />
          </View>
          <View style={{ padding: 30, flexDirection: 'row', }}>
            <View style={{ flex: 1 }}>
              {BottomWidget('ตกลง', () => {
                _onSubmitSearch();
              })}
            </View>

          </View>
        </View>
      </Modal>
    );
  };

  const DrawHorizontalWidget = () => {
    return (
      <View
        style={{
          paddingLeft: 40,
          paddingRight: 40,
        }}>
        <View
          style={{
            borderBottomColor: '#00000029',
            borderBottomWidth: 1,
          }}
        />
      </View>
    );
  };

  return (
    <>
      <BackGroundImage
        components={
          <>
            <AppBar
              title="รับอะไหล่จาก Mobile Van"
              rightTitle={`${props.profile.wk_ctr}`}></AppBar>
            {Search()}
            {/* {{SearchTONumber}} */}
            {DrawHorizontalWidget()}
            {BuildModalDrawer()}
          </>
        }></BackGroundImage>
      <Loading loading={isLoading} />
    </>
  );
};

const stylesLg = StyleSheet.create({
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
  appBar: {
    backgroundColor: COLOR.primary,
  },
  appBarContent: {
    fontWeight: 'bold',
  },
  card: {
    width: 120,
    height: 120,
    borderRadius: 20,
    borderColor: '#00acc8',
    backgroundColor: '#00acc8',
    justifyContent: 'center',
  },
  textCard: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
    fontFamily: Fonts.Prompt_Medium,
  },
  iconCard: {
    marginLeft: 35,
    marginTop: 10,
    color: 'white',
  },
  cardEmpty: {
    width: 120,
    height: 120,
    borderRadius: 20,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  btn: {
    width: '100%',
    height: 70,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 22,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: COLOR.secondary_primary_color,
    borderRadius: 35,
    marginTop: 20,
  },
});

const stylesSm = StyleSheet.create({
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
  appBar: {
    backgroundColor: COLOR.primary,
  },
  appBarContent: {
    fontWeight: 'bold',
  },
  card: {
    width: 120,
    height: 120,
    borderRadius: 20,
    borderColor: '#00acc8',
    backgroundColor: '#00acc8',
    justifyContent: 'center',
  },
  textCard: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
    fontFamily: Fonts.Prompt_Medium,
  },
  iconCard: {
    marginLeft: 35,
    marginTop: 10,
    color: 'white',
  },
  cardEmpty: {
    width: 120,
    height: 120,
    borderRadius: 20,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  btn: {
    width: '100%',
    height: 70,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 22,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: COLOR.secondary_primary_color,
    borderRadius: 35,
    marginTop: 20,
  },
});
export default SparePartVanCheckPage;
