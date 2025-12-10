import { Button, Icon, Modal } from '@ant-design/react-native';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  FlatList
} from 'react-native';
import * as RNFS from 'react-native-fs';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as ImagePicker from 'react-native-image-picker';
import ImageResizer, { ResizeFormat } from '@bam.tech/react-native-image-resizer';
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
import { uploadImage, uploadImageNas } from '../../../services/upload';
import {
  fetchGetMasterWorkorderImageGet,
  fetchWorkOrderImageGet,
  fetchWorkOrderImageUpdate,
} from '../../../services/workOrderCamera';
import styles from './WorkOrderCameraCss';
import { BASE_URL, BASE_URL_NAS, NETWORK_MODE } from '../../../utils/Env'
import ImageCardWidget from './ImageCardWidget';

const defaultImage = require('../../../../assets/images/default.jpeg');

const screenHeight = Dimensions.get('window').height;

const WorkOrderCameraPage = (props: any) => {
  const params = props.route?.params;
  const navigation = useNavigation();
  const canvasRef = useRef(null);

  const { orderId, type, orderTypeDescription, IsConnectivity } =
    params?.workOrderData;
  console.log(params?.workOrderData)
  const [fileData, setFileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraValue, setCameraValue] = useState<IWorkOrderCamera>();
  const [isVisibleModalPreviewImage, setIsVisibleModalPreviewImage] =
    useState(false);
  const [imageTemplate, setImageTemplate] = useState<any[]>([]);

  useMemo(async () => {
    const result2: any = await fetchGetMasterWorkorderImageGet(orderId);
    if (result2) {
      setImageTemplate(result2.dataResult);
    }
  }, [])
  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const result: any = await fetchWorkOrderImageGet(orderId);
      if (result) {
        setFileData(result.dataResult);
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

  const _launchCamera = async (keyName: string) => {
    if (!keyName)
      return;

    let options: any = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.launchCamera(options, async response => {

      if (response.didCancel) return;

      const resized = await resizeImage(
        response.uri as string,
        response.width as number,
        response.height as number,
        'JPEG',
        72
      ) as {
        name: string;
        size: number;
        height: number;
        width: number;
        uri: string;
      };

      const newImage = {
        fileName: resized.name,
        fileSize: resized.size,
        height: resized.height,
        type: 'image/jpeg',
        uri: resized.uri,
        width: resized.width,
        base64: response.base64,
        key: keyName,
        formatType: 'file',
      }

      setFileData((prev: any) => {
        return { ...prev, [keyName]: newImage }
      })
    });
  };
  
  const _launchImageLibrary = async (keyName: string) => {

    if (!keyName)
      return;

    let options: any = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.launchImageLibrary(options, async response => {
      if (response.didCancel || !response.uri) return;

      const resized = await resizeImage(
        response.uri as string,
        response.width as number,
        response.height as number,
        'JPEG',
        50,
      ) as {
        name: string;
        size: number;
        height: number;
        width: number;
        uri: string;
      };

      const newImage = {
        fileName: resized.name,
        fileSize: resized.size,
        height: resized.height,
        type: 'image/jpeg',
        uri: resized.uri,
        width: resized.width,
        base64: response.base64,
        key: keyName,
        formatType: 'file',
      }


      setFileData((prev: any) => {
        return { ...prev, [keyName]: newImage }
      })
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
      // const sizeInMB = (resizedImageUri.size / (1024 * 1024)).toFixed(2); // แปลงเป็น MB
      // Alert.alert(sizeInMB);
      return resizedImageUri;
    } catch (error: any) {
      Alert.alert('แจ้งเตือน', error.message);
    }
  };

  const _onSubmit = async () => {
    let tempUploadUrl = {};
    setIsLoading(true);
    try {
      console.info(fileData)
      if (fileData) {
        for (const [index, keyName] of Object.keys(fileData).entries()) {
          if (fileData[keyName]?.formatType) {
            if (fileData[keyName].formatType === 'file') {
              const result: any = await uploadImage(
                fileData[keyName],
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
          }
          if (Object.keys(fileData).length - 1 === index) {
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



  const renderFileUriImage = (keyName: string = "") => {
    if (!keyName)
      return;

    const fileItem = fileData[keyName];
    const uri = fileItem;

    const validatedUri = fileItem?.uri ? fileItem.uri : uri;
    console.log(keyName, validatedUri);
    if (!validatedUri) {
      return <Image style={styles.image} source={defaultImage} />;
    }

    return (
      <TouchableOpacity
        onPress={() => {
          setCameraValue(uri);
          setIsVisibleModalPreviewImage(true);
        }}
      >
        <Lightbox activeProps={{ height: screenHeight, width: 'auto' }}>
          <Image style={{ height: 300 }} source={{ uri: validatedUri }} />
        </Lightbox>
      </TouchableOpacity>
    );
  };



  const BottomSubmit = () => {
    return (
      <View style={{ paddingVertical: 0, paddingHorizontal: 20, alignItems: 'center' }}>
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




  const renderImage = useCallback((key: string) => {
    if (!key) return <></>;

    return renderFileUriImage(key);
  }, [fileData]);

  const launchCamera = useCallback((key: string) => {
    _launchCamera(key);
  }, []);

  const launchLibrary = useCallback((key: string) => {
    _launchImageLibrary(key);
  }, []);

  return (
    <>
      <AppBar title="ถ่ายรูป" rightTitle={`Order: ${orderId}`}></AppBar>
      {fileData && <FlatList
        data={imageTemplate}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <ImageCardWidget
            title={item.title}
            type={item.key}
            renderImage={() => renderImage(item.key)}
            onLaunchCamera={() => launchCamera(item.key)}
            onLaunchLibrary={() => launchLibrary(item.key)}
          />
        )}
        contentContainerStyle={{ padding: 20 }}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={false} // ป้องกัน scroll jump บางกรณี
      />}
      <BottomSubmit />
      <Loading loading={isLoading} />
    </>
  );
};

export default WorkOrderCameraPage;