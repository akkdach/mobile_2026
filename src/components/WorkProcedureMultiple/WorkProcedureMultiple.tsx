import { Button, Icon, Modal } from '@ant-design/react-native';
import Geolocation from '@react-native-community/geolocation';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import * as ImagePicker from 'react-native-image-picker';
import ImageResizer, { ResizeFormat } from '@bam.tech/react-native-image-resizer';
import Lightbox from 'react-native-lightbox';
import Animated from 'react-native-reanimated';
import { COLOR } from '../../constants/Colors';
import { Fonts } from '../../constants/fonts';
import { IGpsTracking } from '../../models/gps-tracking';
import { IWorkOrderCheckInProcedure } from '../../models/WorkOrderCheckInProcedure';
import { uploadImage } from '../../services/upload';
import {
  fetchWorkOrderCheckInProcedure,
  fetchWorkOrderCheckInProcedurePost,
} from '../../services/WorkOrderCheckInProcedure';
import { _getData, _removeData, _storeData } from '../../utils/AsyncStorage';
import AppBar from '../AppBar';
import BackGroundImage from '../BackGroundImage';
import Loading from '../loading';
import styles from './WorkProcedureMultipleCss';
import { ScreenWidth } from 'react-native-elements/dist/helpers';
import { useNavigation, StackActions } from '@react-navigation/native';

const defaultImage = require('../../../assets/images/default.jpeg');

type InterfaceProps = {
  orderId: any;
  multipleOrderManage: any;
};

type Inputs = {
  dateTimeCheckIn: string;
  journeyDistance: number;
  checkInImageUrl: string;
  workOrder: string;
};

const screenHeight = Dimensions.get('window').height;

const WorkProcedureMultiple = (props: InterfaceProps) => {
  const initialValue = new IWorkOrderCheckInProcedure({});
  const { orderId } = props;
  const [fileData, setFileData] = useState([] as any);
  const [isLoading, setIsLoading] = useState(false);
  const { control, handleSubmit, reset, setValue, getValues } = useForm<Inputs>({
    defaultValues: initialValue,
  });
  const [cameraValue, setCameraValue] = useState('');
  const [isVisibleModalPreviewImage, setIsVisibleModalPreviewImage] =
    useState(false);
  const [imgDefaultHeight, setImgDefaultHeight] = useState<number>(350);
  const navigation = useNavigation();

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      // GET CHECKIN PROCEDURE
      // GET IMAGE WORK ORDER TYPE urlCheckInImage_1
      const responseCheckIn: any = await fetchWorkOrderCheckInProcedure(
        orderId,
      );
      setValue('dateTimeCheckIn', responseCheckIn.dataResult?.dateTimeCheckIn);
      setValue(
        'journeyDistance',
        responseCheckIn.dataResult?.journeyDistance || 0,
      );

      let imageSet = {};
      const checkInImageUrl = responseCheckIn.dataResult.checkInImageUrl;
      if (checkInImageUrl) {
        imageSet = {
          ...imageSet,
          checkInImageUrl: {
            uri: checkInImageUrl,
            key: 'checkInImageUrl',
            formatType: 'url',
          },
        };
        setFileData([imageSet]);
      }

      if (responseCheckIn.dataResult?.journeyDistance === null) {
        Alert.alert('แจ้งเตือน', 'คุณยังไม่ได้กรอกเลขไมล์ถึงร้าน', [
          {
            text: 'ตกลง',
            onPress: async () => {
              navigation.dispatch(StackActions.pop());
            },
          },
        ]);
      }
    } catch (error) {
      console.log('error ====>', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const _launchCamera = async (keyName: any) => {
    ImagePicker.launchCamera({ mediaType: 'photo' }, response => {
      (async () => {
        if (!response.didCancel && response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          let imageFile = [] as any;
          if (fileData.length > 0) {
            fileData.filter((v: any) => {
              if (Object.keys(v)[0] !== keyName) {
                imageFile.push(v);
              }
            });
          }
          if (imageFile.length > 0) {
            setFileData(imageFile);
          } else {
            setFileData([]);
          }

          const resizeImageSet = (await resizeImage(
            asset.uri as string,
            asset.width as number,
            asset.height as number,
            'JPEG',
            80,
          )) as {
            name: string;
            size: number;
            height: number;
            width: number;
            uri: string;
          };

          // Resizing image set
          let imageSet = {
            [keyName]: {
              fileName: resizeImageSet.name,
              fileSize: resizeImageSet.size,
              height: resizeImageSet.height,
              type: 'image/jpeg',
              uri: resizeImageSet.uri,
              width: resizeImageSet.width,
              base64: asset.base64,
              key: keyName,
              formatType: 'file',
            },
          };

          if (fileData.length > 0) {
            const newArray = [...fileData];
            newArray[0][keyName] = imageSet[keyName];
            setFileData(newArray);
          } else {
            setFileData((result: any) => [...result, imageSet]);
          }
        }
      })();
    });
  };

  const _launchImageLibrary = async (keyName: any) => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, response => {
      (async () => {
        if (!response.didCancel && response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          let imageFile = [] as any;
          if (fileData.length > 0) {
            fileData.filter((v: any) => {
              if (Object.keys(v)[0] !== keyName) {
                imageFile.push(v);
              }
            });
          }
          if (imageFile.length > 0) {
            setFileData(imageFile);
          } else {
            setFileData([]);
          }

          const resizeImageSet = (await resizeImage(
            asset.uri as string,
            asset.width as number,
            asset.height as number,
            'JPEG',
            80,
          )) as {
            name: string;
            size: number;
            height: number;
            width: number;
            uri: string;
          };

          // Resizing image set
          let imageSet = {
            [keyName]: {
              fileName: resizeImageSet.name,
              fileSize: resizeImageSet.size,
              height: resizeImageSet.height,
              type: 'image/jpeg',
              uri: resizeImageSet.uri,
              width: resizeImageSet.width,
              base64: asset.base64,
              key: keyName,
              formatType: 'file',
            },
          };

          if (fileData.length > 0) {
            const newArray = [...fileData];
            newArray[0][keyName] = imageSet[keyName];
            setFileData(newArray);
          } else {
            setFileData((result: any) => [...result, imageSet]);
          }
        }
      })();
    });
  };

  const resizeImage = async (
    imageUri: string,
    newWidth: number,
    newHeight: number,
    compressFormat: ResizeFormat,
    quality: number,
  ) => {
    try {
      const resizedImageUri = await ImageResizer.createResizedImage(
        imageUri,
        newWidth,
        newHeight,
        compressFormat,
        quality,
      );
      // resizeImageUri is the URI of the new image that can now be displayed, uploaded...
      return resizedImageUri;
    } catch (error: any) {
      // Oops, something went wrong. Check that the filename is correct and
      // inspect err to get more details.
      Alert.alert('แจ้งเตือน', error.message);
    }
  };

  const _onSubmit = async () => {
    Alert.alert('แจ้งเตือน', 'คุณต้องการบันทึกข้อมูล ?', [
      {
        text: 'ยกเลิก',
        style: 'cancel',
      },
      {
        text: 'ตกลง',
        onPress: async () => {
          await postWorkOrderCheckInProcedurePost();
        },
      },
    ]);
  };

  const postWorkOrderCheckInProcedurePost = async () => {
    setIsLoading(true);
    Geolocation.getCurrentPosition(
      async gpsTrackingInfo => {
        try {
          if (fileData.length > 0) {
            const result: any = await uploadImage(
              fileData[0].checkInImageUrl,
              orderId,
            );
            if (result) {
              setValue('checkInImageUrl', result.fileDisplay);
            } else {
              setValue('checkInImageUrl', fileData[0].checkInImageUrl.uri);
            }
            setValue('workOrder', orderId);
            if (getValues() !== undefined) {
              try {
                let latitude = 0;
                let longitude = 0;
                if (
                  gpsTrackingInfo &&
                  gpsTrackingInfo.coords &&
                  gpsTrackingInfo.coords.latitude &&
                  gpsTrackingInfo.coords.longitude
                ) {
                  latitude = gpsTrackingInfo.coords.latitude;
                  longitude = gpsTrackingInfo.coords.longitude;
                } else {
                  const tempLatLng = (await _getData({ key: 'gpsTracking' })) as {
                    lat: number;
                    lng: number;
                  };

                  if (tempLatLng && tempLatLng.lat && tempLatLng.lng) {
                    latitude = tempLatLng.lat;
                    longitude = tempLatLng.lng;
                  } else {
                    throw new Error('ไม่พบพิกัดปัจจุบัน');
                  }
                }
                let multipleOrderManage = props.multipleOrderManage;
                if (multipleOrderManage.length > 0) {
                  multipleOrderManage.map(async (val: any, index: any) => {
                    const response = await fetchWorkOrderCheckInProcedurePost({
                      ...{ ...getValues(), ...{ workOrder: val.orderId } },
                      checkInLatitude: latitude,
                      checkInLongitude: longitude,
                    });
                    if (multipleOrderManage.length === index + 1) {
                      if (response.isSuccess) {
                        setIsLoading(false);
                        _removeData({ key: 'startTimeTemp' +  val.orderId });
                        Alert.alert('แจ้งเตือน', 'บันทึกข้อมูลสำเร็จ', [
                          {
                            text: 'ตกลง',
                            onPress: async () => {
                              navigation.dispatch(StackActions.pop());
                            },
                          },
                        ]);
                      }
                    }
                  });
                }
              } catch (err: any) {
                setIsLoading(false);
                Alert.alert('แจ้งเตือน', err.message, [{ text: 'ตกลง' }]);
              }
            }
          } else {
            Alert.alert('แจ้งเตือน', 'กรุณาเพิ่มรูปถ่ายร้านค้า', [
              { text: 'ตกลง' },
            ]);
          }
        } catch (error: any) {
          setIsLoading(false);
          Alert.alert('แจ้งเตือน', error.message);
        }
      },
      err => {
        setIsLoading(false);
        Alert.alert('แจ้งเตือน', 'ไม่พบ Location กรุณาลองใหม่อีกครั้ง');
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  const DrawHorizontalWidget = () => {
    return (
      <View
        style={{
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 10,
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

  const Title = () => {
    return (
      <View>
        <Text style={styles.textTitle}>ระยะทาง</Text>
      </View>
    );
  };

  const InputWidget = (
    label: any,
    subLabel: any,
    name: 'dateTimeCheckIn' | 'journeyDistance',
    initialValue: string | number,
  ) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingTop: 8,
        }}>
        <View
          style={{
            flex: 2,
            alignItems: 'flex-end',
          }}>
          <Text style={styles.labelInput}>{label}</Text>
        </View>
        <View
          style={{
            flex: 4,
          }}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => {
              return (
                <TextInput
                  style={[
                    {
                      height: 52,
                      color: COLOR.white,
                      backgroundColor: COLOR.primary,
                    },
                    styles.input,
                  ]}
                  value={String(value)}
                  onChangeText={(val: string | number) => onChange(val)}
                  onBlur={onBlur}
                  editable={false}
                />
              );
            }}
            name={name}
            defaultValue={initialValue}
          />
        </View>
        <View
          style={{
            flex: ScreenWidth > 500 ? 1 : 1.7,
            alignItems: 'flex-start',
          }}>
          <Text style={styles.subLabelInput}>{subLabel}</Text>
        </View>
      </View>
    );
  };

  const DistanceWidget = () => {
    return (
      <View>
        <View>{Title()}</View>
        {InputWidget(
          'เวลาในการเช็คอิน',
          'น.',
          'dateTimeCheckIn',
          String(initialValue.dateTimeCheckIn),
        )}
        {InputWidget(
          'ระยะทางในการเดินทาง',
          'กิโลเมตร',
          'journeyDistance',
          initialValue.journeyDistance,
        )}
      </View>
    );
  };

  const renderFileUriImage = (keyName: any) => {
    let dataFile: any;
    if (fileData.length > 0) {
      let file = fileData.filter((v: any) => {
        if (v[keyName] && v[keyName]['key'] === keyName) {
          return v[keyName];
        }
      });
      if (file && file.length > 0) {
        if (file[0][keyName]) {
          dataFile = file[0];
        }
      }
    }

    return dataFile ? (
      <TouchableOpacity
        onPress={() => {
          setCameraValue(dataFile[keyName]['uri']);
          setIsVisibleModalPreviewImage(true);
        }}>
        <Lightbox activeProps={{ height: screenHeight, width: 'auto' }}>
          <Image
            style={{ height: 300 }}
            source={{
              uri: dataFile[keyName]['uri'],
            }}
          />
        </Lightbox>
      </TouchableOpacity>
    ) : (
      <Image style={styles.image} source={defaultImage} />
    );
  };

  const previewImage = () => {
    return cameraValue ? (
      <Modal
        transparent
        style={{ width: 800 }}
        visible={isVisibleModalPreviewImage}>
        <View>
          <View style={{ alignItems: 'flex-end', paddingBottom: 5 }}>
            <TouchableHighlight
              underlayColor="#fff"
              onPress={() => setIsVisibleModalPreviewImage(false)}>
              <Icon name="close" size={30} />
            </TouchableHighlight>
          </View>
          <Lightbox activeProps={{ height: screenHeight, width: 'auto' }}>
            <Image
              style={{ height: 300 }}
              source={{
                uri: cameraValue as string,
              }}
            />
          </Lightbox>
        </View>
      </Modal>
    ) : (
      <View></View>
    );
  };

  const ImageCardWidget = (title?: string, type?: string) => {
    return (
      <View style={{ flexDirection: 'column' }}>
        <View>
          <Text style={styles.titleLabel}>{title}</Text>
        </View>
        <View
          style={{
            paddingTop: ScreenWidth > 500 ? 10 : 2,
          }}>
          {renderFileUriImage(type)}
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 2 }}>
            <Button style={styles.btn} onPress={() => _launchCamera(type)}>
              <Icon name="camera" size={ScreenWidth > 500 ? 40 : 30} color={COLOR.white} />
            </Button>
          </View>
          <View style={{ flex: 2 }}>
            <Button
              style={[styles.btn, { backgroundColor: COLOR.orange }]}
              onPress={() => _launchImageLibrary(type)}>
              <Text
                style={{
                  color: 'white',
                  fontSize: ScreenWidth > 500 ? 22 : 16,
                  fontFamily: Fonts.Prompt_Medium,
                }}>
                เลือกรูป
              </Text>
            </Button>
          </View>
        </View>
      </View>
    );
  };

  const BottomSubmit = () => {
    return (
      <View style={{ paddingTop: ScreenWidth > 500 ? 20 : 3, alignItems: 'center' }}>
        <Button style={styles.btn_submit} onPress={_onSubmit}>
          <Text
            style={{
              color: 'white',
              fontSize: ScreenWidth > 500 ? 22 : 16,
              fontFamily: Fonts.Prompt_Medium,
            }}>
            ยืนยัน
          </Text>
        </Button>
      </View>
    );
  };

  const Contents = () => {
    return (
      <ScrollView>
        <View style={{ padding: 40 }}>
          {DistanceWidget()}
          {DrawHorizontalWidget()}
          {ImageCardWidget('รูปถ่ายหน้าร้าน _Check In', 'checkInImageUrl')}
          {BottomSubmit()}
          {previewImage()}
        </View>
      </ScrollView>
    );
  };

  return (
    <>
      <AppBar title="เช็คอินร้าน"></AppBar>
      <BackGroundImage
        components={<Animated.ScrollView>{Contents()}</Animated.ScrollView>}
      />
      <Loading loading={isLoading} />
    </>
  );
};

export default WorkProcedureMultiple;
