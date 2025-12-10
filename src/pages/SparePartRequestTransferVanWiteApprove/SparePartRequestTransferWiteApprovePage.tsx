import { Flex, Icon } from '@ant-design/react-native';
import React, { FC, useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, DataTable, Dialog, Portal } from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AppBar from '../../components/AppBar';
import BackGroundImage from '../../components/BackGroundImage';
import DropdownSelect from '../../components/DropdownSelect';
import Loading from '../../components/loading';
import { COLOR } from '../../constants/Colors';
import { Fonts } from '../../constants/fonts';
import { ROUTE } from '../../constants/RoutePath';
import { ISparePartRequest, ISparePartRequestHD, ISparePartRequestItem } from '../../models/WorkOrderSparePart';
import {
  fetchSparePartRequestApprove,
  fetchSparePartRequestCancel,
  fetchSparePartRequestHd,
  fetchSparePartRequestHdVan,
  fetchSparePartRequestItem,
  fetchSparePartTransferRequest,
  postSparePartReservationRequest,
} from '../../services/sparePart';
import { styleSm, styleLg } from './SparePartRequestTransferWiteApproveCss';
import Moment from 'moment';
import { fonts } from 'react-native-elements/dist/config';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import TransferRequestTable from './TransferRequestTable';
import TransferRequestCardList from './TransferRequestCardList';

type InterfaceProps = {
  profile: any;
  componentStorageSelected?: [];
};

const screenHeight = Dimensions.get('window').height;

const SparePartRequestTransferWiteApprove = (
  props
) => {
  const params = props.route?.params as InterfaceProps;
  // const [visibleDialog, setVisible] = useState(false);
  const [SparePartRequestHD, setSparePartRequestHD] = useState<ISparePartRequestHD[]>([],);
  // const [SparePartRequestHDDetail, setSparePartRequestHDDetail] = useState<ISparePartRequestHD>();
  // const [SparePartRequestItem, setSparePartRequestItem] = useState<ISparePartRequestItem[]>([],);
  const [isLoading, setIsLoading] = useState(false);
  // const [modalImageVisible, setModalImageVisible] = useState(false);
  // const [activeImageUriPreview, setActiveImageUriPreview] = useState('');

  const [screenInfo, setScreenInfo] = useState(Dimensions.get('screen'))
  const [styles, setStyles] = useState<any>({});
  useEffect(() => {
    // console.log(screenInfo)
    if (screenInfo.width < 500) {
      setStyles(styleSm);
    } else {
      setStyles(styleLg);
    }

  }, [screenInfo]);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const result = await fetchSparePartRequestHdVan();
      if (result.dataResult) {
        setSparePartRequestHD(result.dataResult)
       console.log(result.dataResult);
      }
    } catch (error: any) {
      Alert.alert('แจ้งเตือน', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);







  return (
    <>
      <BackGroundImage
        components={
          <>
            <AppBar
              title="รายการรออนุมัติโอนอะไหล่"
              rightTitle={`${params.profile.wk_ctr}`}
              replacePath={ROUTE.SPARE_PART}></AppBar>
            {SparePartRequestHD && <TransferRequestCardList hd={SparePartRequestHD} reload={loadAllData} wk_ctr={params.profile.wk_ctr} />}
          </>
        }></BackGroundImage>
      <Loading loading={isLoading} />
    </>
  );
};

export default SparePartRequestTransferWiteApprove;
