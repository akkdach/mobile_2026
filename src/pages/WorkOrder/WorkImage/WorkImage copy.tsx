import { Button, Icon, Modal } from '@ant-design/react-native';
import React, { useEffect, useState } from 'react';
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
import { Item } from 'react-native-paper/lib/typescript/components/List/List';
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
import { IWorkOrderImage, IWorkOrderImageSTD, IWorkOrderImageStdList } from '../../../models/WorkOrderImage';
import { uploadImage, uploadImageNew } from '../../../services/upload';
import {
  fetchWorkOrderImageGet,
  fetchWorkOrderImageUpdate,
} from '../../../services/workOrderCamera';
import { fetWorkorderStandardImage, fetWorkorderStandardImageGet } from '../../../services/workOrderImage';
import styles from './WorkImageCss';
import { BASE_URL, IMG_URL } from '../../../utils/Env';
const defaultImage = require('../../../../assets/images/default.jpeg');

const screenHeight = Dimensions.get('window').height;

const WorkImagePage = (props: any) => {
  const navigation = useNavigation();
  const { orderId, type, orderTypeDescription, IsConnectivity } =
    props?.workOrderData;

  const [fileData, setFileData] = useState([] as any);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraValue, setCameraValue] = useState<IWorkOrderCamera>();
  const [WorkOrderImageStdList, SetWorkOrderImageStdList] = useState<IWorkOrderImageStdList>();
  const [workImageValue, setWorkImageValue] = useState<IWorkOrderImageSTD[]>();
  const [WorkOrderImageList, setWorkOrderImage] = useState<IWorkOrderImage[]>();
  const [isVisibleModalPreviewImage, setIsVisibleModalPreviewImage] =
    useState(false);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const result1: any = await fetWorkorderStandardImage(orderId);
      if (result1) {
        setWorkImageValue(result1.dataResult)
      }

      const result: any = await fetWorkorderStandardImageGet(orderId);
      // console.log('result',result);
      if (result.dataResult) {
        // Alert.alert('เตือน','โหลดข้อมูลสำเร็จ');
        await setWorkOrderImage(result.dataResult);
        console.log('WorkOrderImageList', WorkOrderImageList);
      } else {
        // Alert.alert('เตือน','ไม่พบข้อมูล');
        setWorkOrderImage([]);
      }
      // console.log('WorkOrderImageList',WorkOrderImageList);
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
    var imaStdId = keyName;
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
            setIsLoading(true);
            const upLoadReesult: any = await uploadImageNew(
              fileData[0][keyName],
              orderId,
              imaStdId
            );
            console.log('upload new result', upLoadReesult);
            if (upLoadReesult.status == 200) {
              loadAllData();
              // Alert.alert('บันทึกรูปสำเร็จ', 'ระบบทำการบันทึกรูปเรียบร้อย');
            } else {
              Alert.alert("เกิดข้อผิดพลาด", 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์')
              throw new Error(upLoadReesult.error);
            }
            setIsLoading(false);
          } else {
            setFileData((result: any) => [...result, imageSet]);
          }
        }
      })();
    });
  };

  const _launchImageLibrary = (keyName: any) => {
    var imaStdId = keyName;
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
            setIsLoading(true);
            const newArray = [...fileData];
            newArray[0][keyName] = imageSet[keyName];
            setFileData(newArray);
            const upLoadReesult: any = await uploadImageNew(
              fileData[0][keyName],
              orderId,
              imaStdId
            );
            console.log('upload new result', upLoadReesult);
            if (upLoadReesult.status == 200) {
              loadAllData();
              Alert.alert('บันทึกรูปสำเร็จ', 'ระบบทำการบันทึกรูปเรียบร้อย');
            } else {
              Alert.alert("เกิดข้อผิดพลาด", 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์')
              throw new Error(upLoadReesult.error);
            }
            setIsLoading(false);
          } else {
            setFileData((result: any) => [...result, imageSet]);
          }

          // console.log('filedata',fileData);
        }
      })();
    });
  };

  // const copyImageToFileSystem = (keyName: string, response: any) => {
  //   const AppFolder = 'BevPro';
  //   const DirectoryPath = `${RNFS.ExternalStorageDirectoryPath}/Pictures/${AppFolder}`;
  //   const imagePath = `${DirectoryPath}/${keyName + '-' + response.fileName
  //     }`.replace(/:/g, '-');
  //   RNFS.mkdir(DirectoryPath);
  //   console.log('[imagePath]', imagePath);
  //   if (Platform.OS === 'android') {
  //     console.log('res uri====>', response.uri as string);
  //     RNFS.copyFile(response.uri as string, imagePath)
  //       .then(res => {
  //         console.log('res ====>', res);
  //       })
  //       .catch(err => {
  //         console.log('ERROR: image file write failed!!!');
  //         console.log(err.message, err.code);
  //       });
  //   }
  // };

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
    // setIsLoading(true);

    
    Alert.alert('แจ้งเตือน', 'บันทึกข้อมูลสำเร็จ', [
      { text: 'ตกลง', onPress: async () => navigation.dispatch(StackActions.pop()) },
    ]);
    return;
    try {
      if (fileData.length > 0) {
        for (const [index, keyName] of Object.keys(fileData[0]).entries()) {
          if (fileData[0][keyName].formatType === 'file') {
            const result: any = await uploadImageNew(
              fileData[0][keyName],
              orderId,
              2
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

  const renderFileUriImage = (keyName: any, seq: number = 0) => {
    let dataFile: any;
    if (fileData.length > 0) {
      // Alert.alert('a','aaa')
      let file = fileData.filter((v: any) => {
        if (v[keyName] && v[keyName]['key'] === keyName) {
          console.log('display image', v[keyName])
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
      <Image style={styles.image}
        source={defaultImage}
      />
    );
  };

  const renderImageItem = (item: any) => {
    let imgenpoint = IMG_URL + 'DisplayImage/WorkOrderImage/show/' + orderId.substring(4, 12);

    return (
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'column' }}>

            <View style={{ paddingBottom: 10 }}>
              <TouchableHighlight
                underlayColor="#fff"
                onPress={() => setIsVisibleModalPreviewImage(false)}>
                <Icon name="search" size={30} />
              </TouchableHighlight>
              <Lightbox activeProps={{ height: screenHeight, width: 'auto' }}>
                {<Image
                  style={{ height: 300, paddingBottom: 5 }}
                  source={{
                    uri: imgenpoint + '%5C' + item.imgName
                  }}
                >
                </Image>}
              </Lightbox>
            </View>
          </View>
        </View>
      </View>
    )

  }

  const renderFileUriImageByFileName = (seq: number) => {
    let imgenpoint = IMG_URL + 'DisplayImage/WorkOrderImage/show/' + orderId.substring(4, 12);

    let itemImg = WorkOrderImageList?.filter(item => item.seq == seq);
    return itemImg ? (
      <View style={{ flexDirection: 'column' }}>
        {itemImg?.map((item, index) => (
          renderImageItem(item)
        ))}
      </View>
    ) : (
      <Image style={styles.image} source={defaultImage} ></Image>
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

  const ImageCardWidget = (title?: string, type?: string, seq: number = 0) => {
    return (
      <View style={{ flexDirection: 'column' }}>
        <View>
          <Text style={styles.titleLabel}>{title}</Text>
        </View>
        <View style={{ flexDirection: 'column' }}>
         {renderFileUriImageByFileName(seq)} 
        </View>
        <View
          style={{
            paddingTop: 10,
          }}>
          {/* {renderFileUriImage(type,seq)} */}
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

    switch (orderTypeDescription) {
      case ORDER_TYPE_DESCRIPTION.CM_CONNECTIVITY:
        return (
          <View>
            {ImageCardWidget('รูปถ่ายหมายเลขอุปกรณ์', 'urlCheckInImage_2')}
            {ImageCardWidget('รูปถ่ายหมายเลขอุปกรณ์', 'urlCheckInImage_2')}
          </View>
        );
      default:
        return (
          <View>
            <DataNotFound />
          </View>
        );
    }
  };

  const renderImageCard2 = () => {
    // console.log('[IsConnectivity orderTypeDescription]', orderTypeDescription, IsConnectivity)
    return (
      <View>
        {workImageValue?.map((item, index) => (
          <View key={index}>

            {ImageCardWidget(item.title, item.id.toString(), item.seq)}
          </View>
        ))}
      </View>
    );
    // switch (orderTypeDescription) {
    //   case ORDER_TYPE_DESCRIPTION.CM_CONNECTIVITY:
    //     return (
    //     workImageValue?.map((item,index)=>{
    //         console.log(item);
    //       <View key={index}>
    //           <Text>{item.title}</Text>

    //       </View>
    //       })
    //     );
    //   default:
    //     return (
    //       <View>
    //         <DataNotFound />
    //       </View>
    //     );
    //     }
  };
  const Contents = () => {
    return (
      <ScrollView>
        <View style={{ padding: 40 }}>
          {renderImageCard2()}
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
          {/* {props.workOrderData.webStatus !== '4' && BottomSubmit()} */}
          {/* {previewImage()} */}
          <View>{BottomSubmit()}</View>
        </View>
      </ScrollView>
    );
  };

  return (
    <>
      <AppBar title="ถ่ายรูปขั้นตอนการทำงาน" rightTitle={`Order: ${orderId}`}></AppBar>
      <BackGroundImage
        components={<Animated.ScrollView>{Contents()}</Animated.ScrollView>}
      />
      
      <Loading loading={isLoading} />
    </>
  );
};

export default WorkImagePage;
