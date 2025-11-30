import { Button, Icon } from '@ant-design/react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  ScrollView,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import { List } from 'react-native-paper';
import AppBar from '../../../components/AppBar';
import BackGroundImage from '../../../components/BackGroundImage';
import { COLOR } from '../../../constants/Colors';
import { Fonts } from '../../../constants/fonts';
import { ROUTE } from '../../../constants/RoutePath';
import { checkWorkInWorkOut } from '../../../services/work_in_work_out';
import { generateKey } from '../../../utils/Random';
import InspectorCustomerInformation from './InspectorCustomerInformation';
import InspectorShopCheckIn from './InspectorShopCheckIn';
import {styleSm,styleLg} from './InspectorWorkItenPageCss';
import { useNavigation, StackActions } from '@react-navigation/native';

interface CardWorkItemTypes {
  title: string;
  icon?: any;
  type?: any;
  route?: any;
  isCheckIn?: boolean;
}

type InterfaceProps = {
  backReloadPage: boolean;
  orderId: string;
  type: string;
  objType: string;
  workCenter: string;
  orderTypeDescription: string;
  billNo: string;
  webStatus: string;
  IsConnectivity: string;
  errorMessage: string;
  workDetail: any
};

type InspectorWorkItemProps = { workDetail: any };

const InspectorWorkItemPage: React.FC<InspectorWorkItemProps> = ({
  workDetail,
}) => {

  // const workOrder = getWorkOrder('000041178498');
  const [checkInModal, setStateCheckInModal] = useState(false);
  const [workOrderDetail, setWorkOrderDetail] = useState<any>(JSON.parse(workDetail));
  const [visibleModal, setStateVisibleModal] = useState(false);
  const [workIn, setWorkIn] = useState(false);
  const [nextPage, setNextPage] = useState(false);


  const [screenInfo, setScreenInfo] = useState(Dimensions.get('screen'))
  const [styles, setStyles] = useState<any>({});
  const navigation = useNavigation();

  useEffect(() => {
    console.log(screenInfo)
    if (screenInfo.width < 500) {
      setStyles(styleSm);
    } else {
      setStyles(styleLg);
    }

  }, [screenInfo]);
  
  useEffect(() => {
    checkCheckIn();
  }, []);

  useEffect(() => {
    console.log(screenInfo)
    if (screenInfo.width < 400) {
      setStyles(styleSm);
    } else {
      setStyles(styleLg);
    }
  
  },[]);

  useEffect(() => {
    return () => setNextPage(false);
  }, [nextPage]);

  const _onClickModalCheckIn = () => {
    setStateCheckInModal(!checkInModal);
  };

  const _onClickModalCustomerInformation = () => {
    setStateVisibleModal(!visibleModal);
  };

  const checkCheckIn = async () => {
    try {
      const resultCheckWorkInWorkOut = await checkWorkInWorkOut();
      if (Number(resultCheckWorkInWorkOut.workIn.startMile) > 0) {
        setWorkIn(true);
      } else {
        setWorkIn(false);
      }
    } catch (error) { }
  };


  const CardWorkOrder = (key: any, args?: CardWorkItemTypes) => {
    return (
      // <View
      //   style={[{marginTop: 10, marginLeft: 20, marginRight: 20}]}
      //   key={key}>
      //   <TouchableHighlight
      //     underlayColor="#fff"
      //     key={key}
      //     onPress={() => {
      //       if (args?.isCheckIn) {
      //         notCheckInAlert();
      //         return;
      //       } else {
      //         if (args?.route === '') {
      //           _onClickModalCustomerInformation();
      //         } else {
      //           let data: any;
      //           // if (args?.route === ROUTE.WORK_PROCESS) {
      //           //   data = {
      //           //     workDetail: JSON.stringify(workOrderDetail),
      //           //   };
      //           // } else {
      //             console.log(JSON.stringify(workDetail, null, 2))
      //             data = {
      //               workOrderData: JSON.parse(workDetail),
      //             };
      //           // }
      //           router.Actions.push(args?.route, data);
      //         }
      //       }
      //     }}>
      //     <List.Item
      //       key={key}
      //       style={{
      //         backgroundColor: '#FFFFFF',
      //         shadowColor: '#000',
      //         shadowOffset: {width: 1, height: 1},
      //         shadowOpacity: 0.2,
      //         shadowRadius: 4,
      //         elevation: 8,
      //         borderRadius: 10,
      //       }}
      //       title={
      //         <Text style={{fontFamily: Fonts.Prompt_Medium, fontSize: 18}}>
      //           {args?.title}
      //         </Text>
      //       }
      //       left={props => <Icon name={args?.icon} size={40} />}
      //     />
      //   </TouchableHighlight>
      // </View>

      <View
        style={styles.cardMenu}
        key={`${generateKey('card-work-' + key)}`}>
        <TouchableHighlight
          underlayColor="#fff"
          key={`${generateKey('touchable-highlight')}`}
          onPress={async () => {
            if (args?.isCheckIn && !workIn) {
              // notCheckInAlert();
              Alert.alert(
                'แจ้งเตือน',
                'กรุณาเช็คอินออกไปปฏิบัตงาน ก่อนเริ่มปฏิบัติงาน ?',
                [
                  {
                    text: 'ตกลง',
                    onPress: async () =>
                      navigation.dispatch(StackActions.replace(ROUTE.START_WORK)),
                  },
                ],
              );
              return;
            } else {
              if (args?.route === '') {
                _onClickModalCustomerInformation();
              } else {
                if (!nextPage) {
                  setNextPage(true);
                  let data: any;
                  data = {
                    workOrderData: JSON.parse(workDetail),
                  };
                  navigation.dispatch(StackActions.push(args?.route, data));
                }
              }
            }
          }}>
          <List.Item
            key={`${generateKey('list-item')}`}
            style={{
              backgroundColor: '#FFFFFF',
              shadowColor: '#000',
              shadowOffset: { width: 1, height: 1 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 8,
              borderRadius: 10,
              
            }}
            title={
              <Text style={{ fontFamily: Fonts.Prompt_Medium, fontSize: 18 }}>
                {args?.title}
              </Text>
            }
            left={props => <Icon name={args?.icon} size={40} />}
          />
        </TouchableHighlight>
      </View>
    );
  };

  const renderWorkOrderList = () => {
    const listOrder: any = [];
    const workOrderData = JSON.parse(workDetail)
    const workType = workOrderData.workType.replace(/(^|\s)\S/g, function (t: any) { return t.toUpperCase() })
    const orderData: CardWorkItemTypes[] = [
      {
        title: 'ข้อมูลลูกค้า',
        icon: 'user',
        route: '',
        isCheckIn: false,
      },
      {
        title: 'รายละเอียดของงาน',
        icon: 'bars',
        isCheckIn: false,
        route: ROUTE.WORK_ORDER_DETAILS,
      },
      {
        title: 'ประวัติการซ่อม',
        icon: 'history',
        isCheckIn: false,
        route: ROUTE.WORK_ORDER_HISTORY,
      },
      {
        title: 'แผนที่ติดตั้งอุปกรณ์ฯ',
        icon: 'environment',
        isCheckIn: false,
        route: ROUTE.WORK_ORDER_MAP,
      },
      {
        title: 'ขั้นตอนการทำงาน',
        isCheckIn: true,
        icon: 'history',
        route: ROUTE.INSPECTOR_WORK_ORDER_DETAILS,
      },
      {
        title: `Operation ${workType}`,
        icon: 'experiment',
        isCheckIn: true,
        route: ROUTE.INSPECTOR_WORK_ORDER_CHECK_LIST,
      },
      // {
      //   title: 'Quality Index',
      //   isCheckIn: true,
      //   icon: 'experiment',
      //   route: ROUTE.INSPECTOR_WORK_ORDER_QUALITY_INDEX
      // },
      {
        title: 'สรุปปิดงาน',
        isCheckIn: true,
        icon: 'check-square',
        route: workType === 'Visitor' ? ROUTE.INSPECTOR_WORK_ORDER_SIGNATURE : ROUTE.INSPECTOR_SATISFACTION_ASSESSMENT_FORM
      }
    ];

    orderData.forEach((order, index) => {
      listOrder.push(CardWorkOrder(index, order));
    });

    return listOrder;
  };

  const BottomWidget = (
    title?: string,
    action?: any,
    colorBackground?: any,
  ) => {
    const styleBtn = [];
    if (colorBackground) {
      styleBtn.push(styles.btn);
      styleBtn.push({ backgroundColor: colorBackground });
    } else {
      styleBtn.push(styles.btnCloseJob);
    }
    return (
      <View style={{ alignItems: 'center',  }}>
        <Button style={styleBtn} onPress={action}>
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

  const ButtonGroupEvent = () => {
    let workDetails = JSON.parse(workDetail)
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 40,
          paddingLeft: '5%',
          paddingRight: '5%',
          marginBottom: '8',
        }}>
        <View style={{ flex: 1, marginRight: 5 }}>
          {BottomWidget(
            'เลขไมล์ถึงร้าน',
            () => _onClickModalCheckIn(),
            COLOR.secondary_primary_color,
          )}
        </View>
        <View style={{ flex: 1, marginRight: 5 }}>
          {BottomWidget(
            'เช็คอิน',
            () => navigation.dispatch(StackActions.push(ROUTE.WORK_PROCEDURE, { workOrderData: { orderId: workDetails.orderId }, workType: workDetails.workType })),
            COLOR.secondary_primary_color,
          )}
        </View>
      </View>
    );
  };

  return (
    <>
      {screenInfo.width >500 ? <AppBar
        title={`Work Lists `}
        rightTitle={`Order :  ${workOrderDetail.orderId}`} onBackReload={true}></AppBar>:
        <AppBar
        title={`Work Lists ${workOrderDetail.orderId}`}
         onBackReload={true}></AppBar>}

      <BackGroundImage
        components={
          <Animated.ScrollView>
            <ScrollView>
              {renderWorkOrderList()}
              {ButtonGroupEvent()}
            </ScrollView>
            <InspectorCustomerInformation orderId={workOrderDetail.orderId} visibleModal={visibleModal} setStateVisibleModal={setStateVisibleModal} />
            <InspectorShopCheckIn workOrderDetail={workOrderDetail} checkInModal={checkInModal} onClickModalCheckIn={_onClickModalCheckIn}></InspectorShopCheckIn>
          </Animated.ScrollView>
        }></BackGroundImage>
    </>
  );
};

export default InspectorWorkItemPage;
