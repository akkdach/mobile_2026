import {Button, Icon} from '@ant-design/react-native';
import React, {FC, useEffect, useState} from 'react';
import {Dimensions, Linking, Platform, Text, View} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE, Region} from 'react-native-maps';
import Animated from 'react-native-reanimated';
import AppBar from '../../../components/AppBar';
import Loading from '../../../components/loading';
import { COLOR } from '../../../constants/Colors';
import {Fonts} from '../../../constants/fonts';
import {IWorkOrderMap} from '../../../models/WorkOrderMap';
import {fetchtWorkOrderMap} from '../../../services/workOrderMap';
import {default as styles, default as workOrderMapCss} from './WorkOrderMapCss';
import { ScreenWidth } from 'react-native-elements/dist/helpers';
import { SafeAreaView } from 'react-native-safe-area-context';

type InterfaceProps = {
  workOrderData: {
    orderId: string;
  };
};

const WorkOrderMapsPage: FC<InterfaceProps> = (props: InterfaceProps) => {
  const [screenInfo, setScreenInfo] = useState(Dimensions.get('screen'))
  const {orderId} = props?.workOrderData;
  const [mapData, setMapData] = useState<IWorkOrderMap>();
  const [region, setRegion] = useState<Region>({
    latitude: 13.736717,
    longitude: 100.523186,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [isLoading, setIsLoading] = useState(false);

  const loadDataAll = async () => {
    setIsLoading(true);
    try {
      const result = await fetchtWorkOrderMap(orderId);
      setMapData(result);
      setTimeout(() => {
        setRegion({
          latitude: result?.latitude ? result.latitude : 13.736717,
          longitude: result?.longitude ? result.longitude : 100.523186,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }, 500);
    } catch (error) {
      console.log('error ====>', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDataAll();
  }, []);

  const OpenGoogleMap = () => {
    const latitude = `${mapData?.latitude}`;
    const longitude = `${mapData?.longitude}`;
    const label = `${mapData?.address}`;

    const url = Platform.select({
      ios: `maps://app?saddr=100+${longitude}&daddr=100+${longitude}`,
      // android: `google.navigation:q=${latitude}+${longitude}`,
      // android: `http://maps.google.com/maps?daddr=${latitude},${longitude}`
      android: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    });
    Linking.openURL(`${url}`);
  };

  const Contents = () => {
    return (
      <>
        <MapView
          style={[workOrderMapCss.mapView,{height:350}]}
          provider={PROVIDER_GOOGLE}
          region={region}>
          <Marker
            coordinate={{
              latitude: region.latitude,
              longitude: region.longitude,
            }}
          />
        </MapView>
        <View style={[workOrderMapCss.container]}>
          <View style={[workOrderMapCss.mapLocation]}>
            <Text style={[workOrderMapCss.txtDetail]}>
              {mapData?.customerName}
            </Text>
            <Text style={[workOrderMapCss.txtDetail]}>{mapData?.address}</Text>
            <View style={{ flexDirection: 'row' }}>
                <View>
                  <Text style={workOrderMapCss.txtDetail}>
                    โทรศัพท์: {mapData?.phone}
                  </Text>
                </View>
                <View>
                  <Icon
                    color={COLOR.primary}
                    style={{ position: 'absolute', paddingLeft: 20 }}
                    onPress={() => {
                      Linking.openURL(`tel:${mapData?.phone}`);
                    }}
                    name="phone"
                    size={24}
                  />
                </View>
              </View>
          </View>
        </View>
        <View style={[workOrderMapCss.mapButton]}>
          <Button style={[styles.btn]} onPress={() => OpenGoogleMap()}>
            <Text
              style={{
                color: 'white',
                fontSize: 22,
                fontFamily: Fonts.Prompt_Medium,
              }}>
              นำทาง
            </Text>
          </Button>
        </View>
      </>
    );
  };

  return (
    <>
      {ScreenWidth >= 500 && <AppBar title="แผนที่ติดตั้งอุปกรณ์ฯ" rightTitle={`Order: ${props.workOrderData.orderId}`}></AppBar> }
      {ScreenWidth < 500 && <AppBar title={`แผนที่ติดตั้งอุปกรณ์ฯ ${props.workOrderData.orderId}`} ></AppBar> }
      <SafeAreaView>
        <Animated.ScrollView>
          {Contents()}
        </Animated.ScrollView>
      </SafeAreaView>
      <Loading loading={isLoading} />
    </>
  );
};

export default WorkOrderMapsPage;
