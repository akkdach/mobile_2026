import { Button, Icon, Modal } from '@ant-design/react-native';
import React, { useEffect, useRef, useState } from 'react';
  import Marker from 'react-native-image-marker';
import moment from 'moment';
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import * as RNFS from 'react-native-fs';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as ImagePicker from 'react-native-image-picker';
import ImageResizer, { ResizeFormat } from 'react-native-image-resizer';
import Lightbox from 'react-native-lightbox';
import Animated from 'react-native-reanimated';
import { StackActions, useNavigation } from '@react-navigation/native';

import AppBar from '../../../components/AppBar';
import BackGroundImage from '../../../components/BackGroundImage';
import DataNotFound from '../../../components/DataNotFound';
import Loading from '../../../components/loading';
import { ORDER_TYPE_DESCRIPTION } from '../../../constants/Camara';
import { COLOR } from '../../../constants/Colors';
import { Fonts } from '../../../constants/fonts';
import { IWorkOrderCamera } from '../../../models/WorkOrderCamera';
import { uploadImage } from '../../../services/upload';
import {
  fetchWorkOrderImageGet,
  fetchWorkOrderImageUpdate,
} from '../../../services/workOrderCamera';
import styles from './WorkOrderCameraCss';
import { NETWORK_MODE } from '../../../utils/Env'
const defaultImage = require('../../../../assets/images/default.jpeg');

const screenHeight = Dimensions.get('window').height;

const WorkOrderCameraPage = (props: any) => {
  const navigation = useNavigation();
  const canvasRef = useRef(null);

  const { orderId, type, orderTypeDescription, IsConnectivity } =
    props?.workOrderData;
  console.log(props?.workOrderData)
  const [fileData, setFileData] = useState([] as any);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraValue, setCameraValue] = useState<IWorkOrderCamera>();
  const [isVisibleModalPreviewImage, setIsVisibleModalPreviewImage] =
    useState(false);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const result: any = await fetchWorkOrderImageGet(orderId);
      if (result) {
        let imageSet = {};
        Object.keys(result.dataResult).forEach(
          (item: string, index: number) => {
            console.log('camera item', result.dataResult);
            if (item !== 'orderId' && result.dataResult[item]) {
              imageSet = {
                ...imageSet,
                [item]: {
                  uri: result.dataResult[item],
                  key: item,
                  formatType: 'url',
                },
              };
            }
          },
        );
        setFileData([imageSet]);
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


    let options: any = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchCamera(options, response => {
      (async () => {
        if (!response.didCancel) {
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
            response.uri as string,
            response.width as number,
            response.height as number,
            'JPEG',
            72,
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
              base64: response.base64,
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
          // await _onSubmit2();
        }
      })();
    });
  };

  const _launchImageLibrary = (keyName: any) => {
    let options: any = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, response => {
      (async () => {
        if (!response.didCancel) {
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
            response.uri as string,
            response.width as number,
            response.height as number,
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
              base64: response.base64,
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
          // await _onSubmit2();
        }
      })();
    });
  };

  const copyImageToFileSystem = (keyName: string, response: any) => {
    const AppFolder = 'BevPro';
    const DirectoryPath = `${RNFS.ExternalStorageDirectoryPath}/Pictures/${AppFolder}`;
    const imagePath = `${DirectoryPath}/${keyName + '-' + response.fileName
      }`.replace(/:/g, '-');
    RNFS.mkdir(DirectoryPath);
    console.log('[imagePath]', imagePath);
    if (Platform.OS === 'android') {
      console.log('res uri====>', response.uri as string);
      RNFS.copyFile(response.uri as string, imagePath)
        .then(res => {
          console.log('res ====>', res);
        })
        .catch(err => {
          console.log('ERROR: image file write failed!!!');
          console.log(err.message, err.code);
        });
    }
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
      return resizedImageUri;
    } catch (error: any) {
      Alert.alert('แจ้งเตือน', error.message);
    }
  };

  const _onSubmit = async () => {
    let tempUploadUrl = {};
    setIsLoading(true);
    try {
      if (fileData.length > 0) {
        for (const [index, keyName] of Object.keys(fileData[0]).entries()) {
          if (fileData[0][keyName].formatType === 'file') {
            const result: any = await uploadImage(
              fileData[0][keyName],
              orderId,
            );
            if (result.status === 2) {
              tempUploadUrl = {
                ...tempUploadUrl,
                ...{ [keyName]: result.fileDisplay },
              };
            } else {
              throw new Error(`Error image list: ${index}, ${result.error}`);
            }
          }

          if (Object.keys(fileData[0]).length - 1 === index) {
            const response = await fetchWorkOrderImageUpdate({
              orderId,
              ...tempUploadUrl,
            });
            if (response.isSuccess) {
              
              Alert.alert('บันทึกรูปสำเร็จ', 'ระบบทำการบันทึกรูปเรียบร้อย', [
                { text: 'ปิด', onPress: () => navigation.dispatch(StackActions.pop()) },
              ]);
            } else {
              throw new Error(response.message);
            }
          }
        }
      } else {
        Alert.alert('แจ้งเตือน', 'Data Not Found');
      }
    } catch (error: any) {
      Alert.alert('แจ้งเตือน', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const _onSubmit2 = async () => {
    let tempUploadUrl = {};
    setIsLoading(true);
    try {
      if (fileData.length > 0) {
        for (const [index, keyName] of Object.keys(fileData[0]).entries()) {
          if (fileData[0][keyName].formatType === 'file') {
            const result: any = await uploadImage(
              fileData[0][keyName],
              orderId,
            );
            if (result.status === 2) {
              tempUploadUrl = {
                ...tempUploadUrl,
                ...{ [keyName]: result.fileDisplay },
              };
            } else {
              throw new Error(`Error image list: ${index}, ${result.error}`);
            }
          }

          if (Object.keys(fileData[0]).length - 1 === index) {
            const response = await fetchWorkOrderImageUpdate({
              orderId,
              ...tempUploadUrl,
            });
            if (response.isSuccess) {
              // Alert.alert('บันทึกรูปสำเร็จ', 'ระบบทำการบันทึกรูปเรียบร้อย', [
              //   { text: 'ปิด', onPress: () => Actions.pop() },
              // ]);
            } else {
              throw new Error(response.message);
            }
          }
        }
      } else {
        Alert.alert('แจ้งเตือน', 'Data Not Found');
      }
    } catch (error: any) {
      Alert.alert('แจ้งเตือน', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const checkHasFile = (keyName: any) => {
    if (fileData.length > 0) {
      let file = fileData.filter((v: any) => {

        if (v[keyName] && v[keyName]['key'] === keyName) {
          return v[keyName];
        }
      });

      if (file && file.length > 0) {
        if (file[0][keyName]) {
          return true;
        } else {
          return false;
        }
      }
    }
  }

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

    const validateURI = (uri: string) => {
      let img_uri = uri;
      console.info('validate URI uri', uri)
      if (NETWORK_MODE == 'WIFI') {
        img_uri = img_uri.replace("http://operation.bevproasia.com", "http://10.50.9.41");
      }
      return img_uri;
    }

    return dataFile ? (
      <TouchableOpacity
        onPress={() => {
          setCameraValue(dataFile[keyName]['uri']);
          setIsVisibleModalPreviewImage(true);
        }}>

        {<Lightbox activeProps={{ height: screenHeight, width: 'auto' }}>
          {<Image
            style={{ height: 300 }}
            source={{
              uri: validateURI(dataFile[keyName]['uri']),
            }}
          />}
        </Lightbox>}
      </TouchableOpacity> 
   ): (
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
    const isHasfile = checkHasFile(type)
    return (
      <View style={{ flexDirection: 'column' }}>
        <View>
          <Text style={styles.titleLabel}>{title}</Text>
        </View>
        <View
          style={{
            paddingTop: 10,
          }}>
          {renderFileUriImage(type)}
        </View>
        {props.workOrderData.webStatus !== '4' && (
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 2 }}>
              <Button style={styles.btn} onPress={() => _launchCamera(type)}>
                <Icon name="camera" size={40} color={COLOR.white} />
              </Button>
            </View>
            <View style={{ flex: 2 }}>
              <Button
                style={[styles.btn, { backgroundColor: COLOR.orange }]}
                onPress={() => _launchImageLibrary(type)}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 20,
                    fontFamily: Fonts.Prompt_Medium,
                  }}>
                  เลือกรูป
                </Text>
              </Button>
            </View>
          </View>
        )}
      </View>
    );
  };

  const BottomSubmit = () => {
    return (
      <View style={{ paddingTop: 20, alignItems: 'center' }}>
        <Button style={styles.btn_submit} onPress={_onSubmit}>
          <Text
            style={{
              color: 'white',
              fontSize: 22,
              fontFamily: Fonts.Prompt_Medium,
            }}>
            บันทึกรูปถ่าย
          </Text>
        </Button>
      </View>
    );
  };

  const renderImageCard = () => {
    console.log('[IsConnectivity orderTypeDescription]', orderTypeDescription, IsConnectivity)
    if (IsConnectivity) {
      switch (orderTypeDescription) {
        case ORDER_TYPE_DESCRIPTION.INSTALL_CONNECTIVITY:
        case ORDER_TYPE_DESCRIPTION.CM_CONNECTIVITY:
          return (
            <View>
              {ImageCardWidget('รูปถ่ายหมายเลขอุปกรณ์', 'urlCheckInImage_2')}
              {ImageCardWidget('รูปถ่ายก่อนปฏิบัติงาน', 'urlCloseImage_2')}
              {ImageCardWidget('รูปถ่ายหลังปฏิบัติงาน', 'urlCloseImage_3')}
              {ImageCardWidget('รูปถ่ายอุปกรณ์ CQR', 'urlImage_001')}
              {ImageCardWidget('รูปแคปภาพหน้าจอ CQR Mapping', 'urlImage_002')}
              {ImageCardWidget('รูปแคปภาพหน้าจอ CQR Parameters', 'urlImage_003')}
              {ImageCardWidget(
                'รูปถ่ายที่แนะนำให้ลูกค้าปรับปรุงแก้ไข',
                'urlCloseImage_8',
              )}
              {ImageCardWidget('รูปถ่ายอื่น ๆ', 'urlCloseImage_4')}
            </View>
          );
        case ORDER_TYPE_DESCRIPTION.REFURBISH_CONNECTIVITY:
          return (
            <View>
              {ImageCardWidget('รูปแคปภาพหน้าจอ CQR Parameters', 'urlImage_003')}
              {ImageCardWidget(
                'รูปถ่ายหมายเลขอุปกรณ์คู่หมายเลข CDE Code จุดที่ 1',
                'urlImage_005',
              )}
              {ImageCardWidget(
                'รูปถ่ายหมายเลข CDE Code จุดที่ 2',
                'urlImage_006',
              )}
              {ImageCardWidget('รูปถ่ายก่อนปฏิบัติงาน', 'urlCloseImage_2')}
              {ImageCardWidget('รูปถ่ายหลังปฏิบัติงาน', 'urlCloseImage_3')}


              {/* New */}
              {ImageCardWidget('รูปกระแสไฟฟ้า', 'image_electric_current')}
              {ImageCardWidget('รูปเทอโมมิเตอร์', 'image_thermometer')}
              {ImageCardWidget('รูปสภาพภายนอก', 'image_equipment_external')}
              {ImageCardWidget('รูปด้านหลัง', 'image_equipment_behind')}
              {/* End New */}


              {ImageCardWidget('รูปถ่ายอื่น ๆ', 'urlCloseImage_4')}

            </View>
          );
        case ORDER_TYPE_DESCRIPTION.SET_UP_CONNECTIVITY:
          return (
            <View>
              {ImageCardWidget(
                '	รูปอุณหภูมิของ Data logger(Thermometer) คู่กับหมายเลข Equipment และCDE code',
                'urlImage_005',
              )}



              {/* New */}
              {ImageCardWidget('รูปการวัดกระแสการทำงานของระบบความเย็น (Compressor)', 'image_electric_current')}
              {ImageCardWidget('รูปการปลับตั้ง Thermostat', 'image_settup_thermostat')}
              {ImageCardWidget('รูปถ่ายทางกายภาพ ที่เกี่ยวกับ Cosmetic ด้านหลังตู้ ', 'image_equipment_behind')}
              {ImageCardWidget('รูปถ่ายทางกายภาพ ที่เกี่ยวกับ Cosmetic ด้านในตู้', 'image_equipment_external')}
              {/* End New */}

              {ImageCardWidget('รูปถ่าย CQR Parameter ตู้ Connectivity', 'urlImage_003',)}
              {ImageCardWidget('รูปถ่ายเลข IMEI Device คู่กับเลข Card SIM', 'urlImage_007',)}
              {ImageCardWidget('รูปถ่ายหมายเลข CDE Code จุดที่ 2', 'urlImage_006',)}
              {ImageCardWidget('รูปถ่ายอุณหภูมหน้าจอ', 'image_thermometer',)}
              {ImageCardWidget('รูปCheck list การตรวจสอบคุณภาพที่ลงบันทึกค่าการตรวจสอบ', 'image_check_list',)}
              {ImageCardWidget('รูปหน้าจอแสดงอุณหภูมิของตัวตู้', 'image_thermometer_start',)}

              {ImageCardWidget('รูปถ่ายอื่น ๆ', 'urlCloseImage_4')}


            </View>
          );
        case ORDER_TYPE_DESCRIPTION.REMOVE_CONNECTIVITY:
          return (
            <View>
              {ImageCardWidget('รูปถ่ายหมายเลขอุปกรณ์', 'urlCheckInImage_2')}
              {ImageCardWidget('รูปถ่ายก่อนปฏิบัติงาน', 'urlCloseImage_2')}
              {ImageCardWidget('รูปถ่ายหลังปฏิบัติงาน', 'urlCloseImage_3')}
              {ImageCardWidget('รูปถ่ายอุปกรณ์ CQR', 'urlImage_001')}
              {ImageCardWidget(
                'รูปแคปภาพหน้าจอ Authorized Movement',
                'urlImage_008',
              )}
              {ImageCardWidget(
                'รูปแคปภาพหน้าจอ Authorized EQ History',
                'urlImage_009',
              )}
              {ImageCardWidget(
                'รูปถ่ายที่แนะนำให้ลูกค้าปรับปรุงแก้ไข',
                'urlCloseImage_8',
              )}
              {ImageCardWidget('รูปถ่ายอื่น ๆ', 'urlCloseImage_4')}
            </View>
          );
        default:
          return (
            <View>
              <DataNotFound />
            </View>
          );
      }
    } else {
      switch (orderTypeDescription) {
        case ORDER_TYPE_DESCRIPTION.SURVEY:
        case ORDER_TYPE_DESCRIPTION.INSTALL:
          return (
            <View>
              {ImageCardWidget('รูปถ่ายความสะอาดภายในตู้', 'image_equipment_inside')}
              {ImageCardWidget('รูปถ่ายด้านหลังตู้', 'image_equipment_behind')}
              {ImageCardWidget('รูปถ่ายสติ๊กเกอร์ข้างซ้าย (หันหน้าเข้าตู้)', 'image_sticker_left')}
              {ImageCardWidget('รูปถ่ายสติ๊กเกอร์ข้างขวา (หันหน้าเข้าตู้)', 'image_sticker_right')}
              {ImageCardWidget('รูปถ่ายล้อตู้เย็น', 'image_wheel')}
              {ImageCardWidget('รูปถ่ายหมายเลขอุปกรณ์', 'urlCheckInImage_2')}
              {ImageCardWidget('รูปถ่ายจุดติดตั้งก่อนปฏิบัติงาน', 'image_install_location')}
              {ImageCardWidget('รูปถ่ายที่ติดตั้งอุปกรณ์', 'image_befor_install_location')}
              {ImageCardWidget('รูปถ่ายหน้าจออุณหภูมิเริ่มเสียบปลั๊ก', 'image_thermometer_start')}
             
              {ImageCardWidget('รูปถ่ายหลังปฏิบัติงาน', 'urlCloseImage_3')}
              {ImageCardWidget('รูปถ่ายหมายเลขอุปกรณ์  CQR', 'urlImage_001')}
              {ImageCardWidget('รูปแคปภาพหน้าจอ CQR Mapping', 'urlImage_002')}
              {ImageCardWidget('รูปแคปภาพหน้าจอ Parameter', 'urlImage_004')}
              {ImageCardWidget('รูปถ่ายอธิบายการทำงานการใช้เครื่องให้ลูกค้า', 'image_explain_customer')}
              {ImageCardWidget('รูปถ่ายที่แนะนำให้ลูกค้าปรับปรุงแก้ไข', 'urlCloseImage_8')}
              {ImageCardWidget('รูปถ่ายหน้าจออุณหภูมิหลังจากเสียบปลั๊ก 10 นาที', 'image_thermometer_after_start')}
              {ImageCardWidget('รูปถ่าย  Check List', '	image_check_list')}
             

              {ImageCardWidget('รูปถ่ายอื่น ๆ', 'urlCloseImage_4')}
            </View>
          );
        case ORDER_TYPE_DESCRIPTION.REMOVE:
        case ORDER_TYPE_DESCRIPTION.CM:
        case ORDER_TYPE_DESCRIPTION.CM_REPLACE:
        case ORDER_TYPE_DESCRIPTION.PM:
        case ORDER_TYPE_DESCRIPTION.PM_REPLACE:
          return (
            <View>
              {ImageCardWidget('รูปถ่ายหมายเลขอุปกรณ์', 'urlCheckInImage_2')}
              {ImageCardWidget('รูปถ่ายก่อนปฏิบัติงาน', 'urlCloseImage_2')}
              {ImageCardWidget('รูปถ่ายหลังปฏิบัติงาน', 'urlCloseImage_3')}
              {ImageCardWidget(
                'รูปถ่ายที่แนะนำให้ลูกค้าปรับปรุงแก้ไข',
                'urlCloseImage_8',
              )}
              {ImageCardWidget('รูปถ่ายอุปกรณ์ CQR', 'urlImage_001')}
              {ImageCardWidget('รูปแคปภาพหน้าจอ CQR Mapping', 'urlImage_002')}
              {ImageCardWidget('รูปแคปภาพหน้าจอ CQR Parameters', 'urlImage_003')}
              {ImageCardWidget('รูปถ่ายอื่น ๆ', 'urlCloseImage_4')}
            </View>
          );
        case ORDER_TYPE_DESCRIPTION.REFURBISH:
          return (
            <View>
              {ImageCardWidget(
                '	รูปอุณหภูมิของ Data logger(Thermometer) คู่กับหมายเลข Equipment และCDE code กำลังเสียบปลั๊ก',
                'urlImage_005',
              )}

              {/* New */}
              {ImageCardWidget('รูปการวัดกระแสการทำงานของระบบความเย็น (Compressor)', 'image_electric_current')}
              {ImageCardWidget('รูปการวัดความเร็วรอบมอเตอร์ Condensor', 'image_speed_condensor')}
              {ImageCardWidget('รูปการวัดแสงสว่างหลอดไฟภายในตู้', 'image_light_sensor_reading')}
              {ImageCardWidget('รูปการวัดความเร็วรอบมอเตอร์ EVAP', 'image_speed_condensor_evap')}
              {ImageCardWidget('รูปความเร็วลมมอเตอร์ Condensor', 'image_condenser_fan_speed')}
              {ImageCardWidget('รูปความเร็วลมดูดมอเตอร์ EVAP', 'image_pull_condensor_evap')}
              {ImageCardWidget('รูปการตรวจสอบการรั่วด้วยเครื่องวัดสารทำความเย็นรั่ว', 'image_sensor_reading_leak')}
              {ImageCardWidget('รูปการตรวจสอบวัดระดับเสียงของตู้เย็น ไม่เกิน 70dB สภาพ', 'image_sensor_noise_level')}
              {ImageCardWidget('รูปการปลับตั้ง Thermostat', 'image_settup_thermostat')}

              {ImageCardWidget('รูปถ่ายทางกายภาพ ที่เกี่ยวกับ Cosmetic ด้านหลังตู้ ', 'image_equipment_behind')}
              {ImageCardWidget('รูปถ่ายทางกายภาพ ที่เกี่ยวกับ Cosmetic ด้านในตู้', 'image_equipment_external')}
              {/* End New */}

              {ImageCardWidget('รูปถ่าย CQR Parameter ตู้ Connectivity', 'urlImage_003',)}
           
              {ImageCardWidget('รูปใบงานการซ่อมอุปกรณ์', 'image_repaire_doc',)}
              {ImageCardWidget('รูปCheck list การตรวจสอบคุณภาพที่ลงบันทึกค่าการตรวจสอบ', 'image_check_list',)}
              {ImageCardWidget('รูปหน้าจอแสดงอุณหภูมิของตัวตู้ คู่กับ Data logger (Themometer) ก่อนถอดปลั๊ก', 'image_thermometer_start',)}

              {ImageCardWidget('รูปถ่ายอื่น ๆ', 'urlCloseImage_4')}
            </View>
          )
        case ORDER_TYPE_DESCRIPTION.SET_UP:
          return (
            <View>
              {ImageCardWidget(
                '	รูปอุณหภูมิของ Data logger(Thermometer) คู่กับหมายเลข Equipment และCDE code กำลังเสียบปลั๊ก',
                'urlImage_005',
              )}

          


              {/* New */}
              {ImageCardWidget('รูปการวัดกระแสการทำงานของระบบความเย็น (Compressor)', 'image_electric_current')}
              {ImageCardWidget('รูปการปรับตั้ง Thermostat', 'image_settup_thermostat')}
              {ImageCardWidget('รูปถ่ายทางกายภาพ ที่เกี่ยวกับ Cosmetic ด้านหลังตู้ ', 'image_equipment_behind')}
              {ImageCardWidget('รูปถ่ายทางกายภาพ ที่เกี่ยวกับ Cosmetic ด้านในตู้', 'image_equipment_external')}
              {/* End New */}

              {ImageCardWidget('รูปถ่าย CQR Parameter ตู้ Connectivity', 'urlImage_003',)}
              {ImageCardWidget('รูปถ่ายเลข IMEI Device คู่กับเลข Card SIM', 'urlImage_007',)}
              {ImageCardWidget('รูปถ่ายหมายเลข CDE Code จุดที่ 2', 'urlImage_006',)}
              {ImageCardWidget('รูปถ่ายอุณหภูมหน้าจอ', 'image_thermometer',)}
              {ImageCardWidget('รูปใบงานการซ่อมอุปกรณ์', 'image_repaire_doc',)}
              {ImageCardWidget('รูปCheck list การตรวจสอบคุณภาพที่ลงบันทึกค่าการตรวจสอบ', 'image_check_list',)}
              {ImageCardWidget('รูปหน้าจอแสดงอุณหภูมิของตัวตู้ คู่กับ Data Logger (themometer) ก่อนถอดปลั๊ก', 'image_thermometer_start',)}

              {ImageCardWidget('รูปถ่ายอื่น ๆ', 'urlCloseImage_4')}

            </View>
          );
        case ORDER_TYPE_DESCRIPTION.SET_UP_ON_SITE:
        case ORDER_TYPE_DESCRIPTION.REFURBISH_ON_SITE:
          return (
            <View>
              {ImageCardWidget('รูปถ่ายหมายเลขอุปกรณ์', 'urlCheckInImage_2')}
              {ImageCardWidget('รูปถ่ายก่อนปฏิบัติงาน', 'urlCloseImage_2')}
              {ImageCardWidget('รูปถ่ายหลังปฏิบัติงาน', 'urlCloseImage_3')}

              {/* New */}
              {ImageCardWidget('รูปกระแสไฟฟ้า', 'image_electric_current')}
              {ImageCardWidget('รูปเทอโมมิเตอร์', 'image_thermometer')}
              {ImageCardWidget('รูปสภาพภายนอก', 'image_equipment_external')}
              {ImageCardWidget('รูปด้านหลัง', 'image_equipment_behind')}
              {/* End New */}

              {ImageCardWidget('รูปถ่ายอื่น ๆ', 'urlCloseImage_4')}
            </View>
          );
        default:
          return (
            <View>
              <DataNotFound />
            </View>
          );
      }
    }
  };



const addTimestampToImage = async (uri: string): Promise<string> => {
  const timestamp = moment().format('DD/MM/YYYY HH:mm');

  const markedImagePath = await Marker.markText({
    src: uri,
    text: timestamp,
    X: 20,
    Y: 40,
    color: '#FFFFFF',
    fontName: 'Arial-BoldMT',
    fontSize: 40,
    scale: 1,
    quality: 100,
    position: 'bottomRight',
    textBackgroundStyle: {
      type: 'stretchX',
      paddingX: 10,
      paddingY: 6,
      color: '#000000AA',
    },
  });

  return markedImagePath; // ✅ path ของรูปใหม่ที่มี timestamp
};

  const Contents = () => {
    return (
      <ScrollView>
        <View style={{ padding: 20 }}>

        </View>
        <View style={{ padding: 40 }}>
          {renderImageCard()}
          {/* {ImageCardWidget('รูปถ่ายหมายเลขอุปกรณ์', 'urlCheckInImage_2')}
          {ImageCardWidget('รูปถ่ายก่อนปฏิบัติงาน', 'urlCloseImage_2')}
          {ImageCardWidget('รูปถ่ายหลังปฏิบัติงาน', 'urlCloseImage_3')}
          {ImageCardWidget('รูปถ่ายอุปกรณ์ CQR', 'urlImage_001')}
          {ImageCardWidget('รูปแคปภาพหน้าจอ CQR Mapping', 'urlImage_002')}
          {ImageCardWidget('รูปแคปภาพหน้าจอ CQR Parameters', 'urlImage_003')}
          {ImageCardWidget('รูปแคปภาพหน้าจอ Sim Pairing', 'urlImage_004')}
          {ImageCardWidget('รูปถ่ายหมายเลขอุปกรณ์คู่หมายเลข CDE Code จุดที่ 1', 'urlImage_005')}
          {ImageCardWidget('รูปถ่ายหมายเลข CDE Code จุดที่ 2', 'urlImage_006')}
          {ImageCardWidget('รูปถ่ายหมายเลข IMEI Device คู่รูปถ่าย Card SIM', 'urlImage_007')}
          {ImageCardWidget('รูปถ่ายอื่น ๆ', 'urlCloseImage_4')}
          {ImageCardWidget('รูปแคปภาพหน้าจอ Authorized Movement', 'urlImage_008')}
          {ImageCardWidget('รูปแคปภาพหน้าจอ Authorized EQ History', 'urlImage_009')}
          {ImageCardWidget('รูปถ่ายที่แนะนำให้ลูกค้าปรับปรุงแก้ไข', 'urlCloseImage_8')} */}

          {/* {ImageCardWidget('รูปถ่ายหน้าร้าน', 'frontShopImageURL')}
          {ImageCardWidget('ลานเซ็นต์ลูกค้า', 'customerSignatureImageURL')}
          {ImageCardWidget('ลานเซ็นต์ช่าง', 'workerSignatureImageURL')}
          {ImageCardWidget('รูปถ่ายเอกสารใบแจ้งเปลี่ยนอุปกรณ์', 'changeEquipmentDocImageURL')}
          {ImageCardWidget('รูปถ่ายเอกสารใบรายงาน', 'reportDocImageURL')}
          {ImageCardWidget('รูปถ่ายที่ติดตั้งอุปกรณ์ฯ', 'setupEquipmentImageURL')}
          {ImageCardWidget('รูปถ่ายเอกสารบิลขาย', 'billImageURL')} */}
          {props.workOrderData.webStatus !== '4' && BottomSubmit()}
          {/* {previewImage()} */}
        </View>
      </ScrollView>
    );
  };

  return (
    <>
      <AppBar title="ถ่ายรูปกกก" rightTitle={`Order: ${orderId}`}></AppBar>
      <BackGroundImage
        components={<Animated.ScrollView>{Contents()}</Animated.ScrollView>}
      />
      <Loading loading={isLoading} />
    </>
  );
};

export default WorkOrderCameraPage;
