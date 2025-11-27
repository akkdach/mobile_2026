import { Button, Flex, Icon, Modal } from '@ant-design/react-native';
import React, { useEffect, useState } from "react";
import { Alert, Animated, Dimensions, Image, ScrollView, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { RadioButton } from "react-native-paper";
import Lightbox from 'react-native-lightbox';
import AppBar from "../../../../components/AppBar";
import Loading from "../../../../components/loading";
import { COLOR } from "../../../../constants/Colors";
import { Fonts } from "../../../../constants/fonts";
import { IWorkOrderCamera } from '../../../../models/WorkOrderCamera';
import { getCheckListVisitInspectorService, getImageCheckListService, getOperationVisitInspectorMaster, postCheckListVisitInspectorService, postImageCheckListService } from '../../../../services/work_order_check_list';
import {styleLg,styleSm} from './checkListVisitInspectorCss';
const screenHeight = Dimensions.get('window').height;
import * as ImagePicker from 'react-native-image-picker';
import ImageResizer, { ResizeFormat } from 'react-native-image-resizer';
import { removeImagesVisitInspector, uploadImageVisitInspect } from '../../../../services/upload';
import { getDefaultProps } from '@ant-design/react-native/lib/picker';
import InspectorWorkOrderCheckListPage from '../CheckList/InspectorWorkOrderCheckListPage';
import { BottomSheet, ListItem } from 'react-native-elements';
import { useNavigation, StackActions } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
const defaultImage = require('../../../../../assets/images/default.jpeg');
type InterfaceProps = {
  backReloadPage: boolean;
  orderId: string;
  type: string;
  workCenter: string;
  objType: string;
  orderTypeDescription: string;
  webStatus: string,
  workType: string
};

const CheckListVisitInspectorPage = (props: { workOrderData: InterfaceProps }) => {
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = React.useState(false);
  const [cameraIndexSelect, setCameraIndexSelect] = useState<any>();
  const [fileData, setFileData] = useState([] as any);
  const [fileDataMultiple, setFileDataMultiple] = useState([] as any);
  const [cameraValue, setCameraValue] = useState<IWorkOrderCamera>();
  const [cameraIndexSelectTitle, setCameraIndexSelectTitle] = useState<any>();
  const [checkListCamera, setCheckListCamera] = useState<any>("");
  const [isVisible, setIsVisible] = useState(false);
  const [visibleCamera, setVisibleCamera] = React.useState(false);

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
  },[screenInfo]);

  const list = [
    {
      title: 'ยกเลิก',
      icons: "",
      containerStyle: { alignItems: 'flex-end', justifyContent: 'flex-end' },
      onPress: () => setIsVisible(false),
    },
    { title: 'ถ่ายภาพ', icons: "camera", onPress: () => { setIsVisible(false), _launchCamera(checkListCamera) } },
    { title: 'เลือกรูปภาพ', icons: "file-image", onPress: () => { setIsVisible(false), _launchImageLibrary(checkListCamera) } },

  ];

  const [items, setItems] = useState<any>([
    { label: "ปฏิบัติงานในร้านค้าตามขั้นตอนมาตรฐานการทำงาน (WI)", value: "ปฏิบัติงานในร้านค้าตามขั้นตอนมาตรฐานการทำงาน (WI)" },
    { label: "การบำรุงรักษาและSanitation  สำหรับเครื่อง Post - Mix", value: "การบำรุงรักษาและSanitation  สำหรับเครื่อง Post - Mix" },
    { label: "การบำรุงรักษาและSanitation  สำหรับเครื่อง FCB", value: "การบำรุงรักษาและSanitation  สำหรับเครื่อง FCB" },
    { label: "การตรวจสอบคุณภาพเครื่องดื่ม Post - Mix", value: "การตรวจสอบคุณภาพเครื่องดื่ม Post - Mix" },
    { label: "การตรวจสอบคุณภาพเครื่องดื่ม FCB", value: "การตรวจสอบคุณภาพเครื่องดื่ม FCB" },
    { label: "การเก็บตัวอย่างน้ำเพื่อตรวจวิเคราะห์ทางเคมี", value: "การเก็บตัวอย่างน้ำเพื่อตรวจวิเคราะห์ทางเคมี" },
    { label: "การเก็บตัวอย่างเครื่องดื่มและน้ำเพื่อตรวจวิเคราะห์ทางจุลินทรีย์", value: "การเก็บตัวอย่างเครื่องดื่มและน้ำเพื่อตรวจวิเคราะห์ทางจุลินทรีย์" },
    { label: "การ Sanitize ระบบกรองพื้นฐาน", value: "การ Sanitize ระบบกรองพื้นฐาน" },
    { label: "การ Sanitize ระบบกรองพื้นฐาน Everpure", value: "การ Sanitize ระบบกรองพื้นฐาน Everpure" },
    { label: "การบำรุงรักษาและการ Sanitize สำหรับเครื่องทำน้ำแข็งและเครื่องจ่ายน้ำแข็ง", value: "การบำรุงรักษาและการ Sanitize สำหรับเครื่องทำน้ำแข็งและเครื่องจ่ายน้ำแข็ง" },
    { label: "การบำรุงรักษาเครื่องดื่ม Post - Mix แบบ QMP", value: "การบำรุงรักษาเครื่องดื่ม Post - Mix แบบ QMP" },
    { label: "การซ่อมบำรุงอุปกรณ์ Cold Drinks ของ Field Service", value: "การซ่อมบำรุงอุปกรณ์ Cold Drinks ของ Field Service" },

  ]);
  const [open, setOpen] = useState(false);
  const [valueOperation, setValueOperation] = useState("");
  const [checkList, setCheckList] = useState([
    { measure: "", label: "การเเต่งกายเเละความพร้อมของพนักงาน", order: 1, remark: "" },
    { measure: "", label: "การตรวจเช็คความพร้อมของรถก่อนออกปฏิบัติงาน", order: 2, remark: "" },
    { measure: "", label: "การวางแผนการเดินทาง และการโทรนัดหมาย", order: 3, remark: "" },
    { measure: "", label: "มารยาทการขับรถ", order: 4, remark: "" },
    { measure: "", label: "การเเนะนำตัวกับลูกค้าก่อนปฏิบัติงานของช่าง", order: 5, remark: "" },
    { measure: "", label: "", order: 6, remark: "" },
    { measure: "", label: "การอธิบายการใช้อุปกรณ์เเละบำรุงรักษาเบื้องต้น", order: 7, remark: "" },
    { measure: "", label: "การกล่าวลาหลังปฏิบัติงาน", order: 8, remark: "" },
    { measure: "", label: "การควบคุมอะไหล่", order: 9, remark: "" },
    { measure: "", label: "การดูแลเครื่องมือ", order: 10, remark: "" },
    { measure: "", label: "ความสะอาด ความเป็นระเบียบของรถยนต์ (5 ส.)", order: 11, remark: "" }
  ]);


  useEffect(() => {
    if (props.workOrderData.workType == "visitor") {
      getOperationVisitInspector()
      getCheckListVisitInspector()
      getImageCheckList()
    } else {
      setLoading(false)
    }

  }, []);

  const getImageCheckList = async () => {
    try {
      const responseImage = await getImageCheckListService(props.workOrderData.orderId, props.workOrderData.workType)
      if (responseImage) {
        if (responseImage?.images?.length > 0) {
          let fileImageData = [];
          let fileImageDataMultiple = {"6": []} as any;
          for (let index = 0; index < responseImage?.images.length; index++) {
            const images = responseImage?.images[index];
            if (images?.key === 6) {
              let formatImageDataMultiple = {
                "fileName": "",
                "fileSize": 0,
                "height": 0,
                "type": "",
                "uri": images?.url,
                "width": 0,
                "key": `${images?.key}`,
                "formatType": "url"
              }
              fileImageDataMultiple["6"].push(formatImageDataMultiple)
            } else {
              let formatImageData = {
                [images.key]: {
                  "fileName": "",
                  "fileSize": 0,
                  "height": 0,
                  "type": "",
                  "uri": images?.url,
                  "width": 0,
                  "key": `${images?.key}`,
                  "formatType": "url"
                }
              }
              fileImageData.push(formatImageData)
            }

          }
          if (fileImageData.length > 0) {
            setFileData(fileImageData)
          }
          if (Object.keys(fileImageDataMultiple).length != 0) {
            setFileDataMultiple(fileImageDataMultiple)
          }
        }
      }
    } catch (error) {
      console.log("[Error]===", error)
    }

  }

  const getOperationVisitInspector = async () => {
    try {
      const operationMaster = await getOperationVisitInspectorMaster()
      if (operationMaster) {
        setItems([...operationMaster])
      }
    } catch (error: any) {
      Alert.alert('แจ้งเตือน', `${error?.message}`, [
        {
          text: 'ปิด',
        },
      ]);
    }

  }

  const openModalsCamera = (id: any) => {
    setVisible(true)
    setCameraIndexSelect(id)
    if (Number(id) == 6) {
      setCameraIndexSelectTitle(valueOperation)
    } else {
      setCameraIndexSelectTitle(checkList[Number(id) - 1]?.label)
    }
  }

  const getCheckListVisitInspector = async () => {
    try {
      const dataResponse = await getCheckListVisitInspectorService(props.workOrderData.orderId, props.workOrderData.workType)

      if (dataResponse) {
        if (dataResponse?.checkList.length > 0) {
          setValueOperation(dataResponse?.checkList[5]?.label)
          dataResponse?.checkList.sort(function (a: any, b: any) {
            return a.order - b.order;
          });
          setCheckList(dataResponse?.checkList);
        }
      }
    } catch (error: any) {
      Alert.alert('แจ้งเตือน', `${error?.message}`, [
        {
          text: 'ปิด',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const postCheckListVisitInspector = async (data: any) => {
    setLoading(true);
    try {
      const dataResponse = await postCheckListVisitInspectorService(data)
      if (dataResponse?.isSuccess) {
        setLoading(false);
        Alert.alert('แจ้งเตือน', 'บันทึกข้อมูลสำเร็จ', [
          {
            text: 'ตกลง',
            onPress: async () => {
              // Actions.pop()
              navigation.dispatch(StackActions.pop());
            },
          },
        ]);
      }
    } catch (error: any) {
      Alert.alert('แจ้งเตือน', `${error?.message}`, [
        {
          text: 'ปิด',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const createVisitCheckList = () => {
    Alert.alert('แจ้งเตือน', 'ต้องการบันทึกข้อมูลใช่หรือไม่ ?', [
      {
        text: 'ยกเลิก',
        style: 'cancel',
      },
      {
        text: 'ตกลง',
        onPress: async () => {
          let imageOperation = {
            orderId: props.workOrderData.orderId,
            work_type: props.workOrderData.workType,
            images: []
          } as any;
          if (Object.keys(fileDataMultiple).length != 0) {
            for (let index = 0; index < fileDataMultiple["6"].length; index++) {
              const data = fileDataMultiple["6"][index];
              let dataResponse = {
                key: Number(data?.key),
                url: data?.uri
              }
              imageOperation.images.push(dataResponse)

            }
          }

          if (fileData.length > 0) {
            let dataResponse = {}
            for (const property in fileData[0]) {
              let fileImage = fileData[0][property]
              if (fileImage?.formatType != "url") {
                const result: any = await uploadImageVisitInspect(
                  fileImage,
                  props.workOrderData.orderId,
                  props.workOrderData.workType
                );
                dataResponse = {
                  key: Number(fileImage?.key),
                  url: result?.fileDisplay
                }
              } else {
                dataResponse = {
                  key: Number(fileImage?.key),
                  url: fileImage?.uri
                }
              }
              imageOperation.images.push(dataResponse)

            }

          }
          if (imageOperation.images.length > 0) {
            uploadImageOperation(imageOperation)
          }
          const dataObj = {
            ...checkList[5],
            ...{ label: valueOperation }
          };
          checkList.splice(5, 1, dataObj);
          setCheckList([...checkList]);

          let checkListItem = {
            orderId: props.workOrderData.orderId,
            work_type: props.workOrderData.workType,
            checkList: checkList
          }
          postCheckListVisitInspector(checkListItem)
        }
      }])
  }

  const uploadImageOperation = async (data: any) => {
    try {
      await postImageCheckListService(data)
    } catch (error) {
    }


  }

  const _launchCamera = async (keyName: any) => {
    if (Number(keyName) == 6) {
      _launchCameraMultipleImage(keyName)
    } else {
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
            } else {
              setFileData((result: any) => [...result, imageSet]);
            }
          }
        })();
      });
    }
  };

  const _launchImageLibrary = async (keyName: any) => {
    if (Number(keyName) == 6) {
      _launchImageLibraryMultipleImage(keyName)
    } else {
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
          }
        })();
      });
    }
  };

  const _launchCameraMultipleImage = async (keyName?: any) => {
    let options: any = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchCamera(options, response => {
      (async () => {
        if (!response.didCancel) {
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

          let imageSet: any = {};
          if (!fileDataMultiple[keyName]) {
            imageSet = {
              [keyName]: []
            };
          } else {
            imageSet = {
              [keyName]: [...fileDataMultiple[keyName]]
            };
          }
          imageSet[keyName].push({
            fileName: resizeImageSet.name,
            fileSize: resizeImageSet.size,
            height: resizeImageSet.height,
            type: 'image/jpeg',
            uri: resizeImageSet.uri,
            width: resizeImageSet.width,
            base64: response.base64,
            key: keyName,
            formatType: 'file',
          })
          fileDataMultiple[keyName] = imageSet[keyName]
          setFileDataMultiple({ ...fileDataMultiple });

        }
      })();
    });
  };


  const _launchImageLibraryMultipleImage = (keyName: any) => {
    let options: any = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, response => {
      (async () => {
        if (!response.didCancel) {
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

          let imageSet: any = {};
          if (!fileDataMultiple[keyName]) {
            imageSet = {
              [keyName]: []
            };
          } else {
            imageSet = {
              [keyName]: [...fileDataMultiple[keyName]]
            };
          }
          imageSet[keyName].push({
            fileName: resizeImageSet.name,
            fileSize: resizeImageSet.size,
            height: resizeImageSet.height,
            type: 'image/jpeg',
            uri: resizeImageSet.uri,
            width: resizeImageSet.width,
            base64: response.base64,
            key: keyName,
            formatType: 'file',
          })
          fileDataMultiple[keyName] = imageSet[keyName]
          setFileDataMultiple({ ...fileDataMultiple });

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

  const checkListItem = (title: string, value: string, order: any, index: any) => {
    return (
      <View style={{ flexDirection: 'column', marginTop: 6 }} key={index}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 0.1 }}>
            <Text style={{ fontSize: screenInfo.width > 500 ? 16 :12, fontFamily: Fonts.Prompt_Light }}>{order}.</Text>
          </View>
          {Number(order) == 6 ?
            <View style={{ flex: 1 }}>
              <DropDownPicker
                style={{
                  borderColor: COLOR.secondary_primary_color,
                  borderWidth: 2,
                  maxHeight: 70,
                  width: 320
                }}
                open={open}
                value={valueOperation}
                items={items}
                searchable={true}
                placeholder="Select"
                searchPlaceholder="Search..."
                placeholderStyle={{
                  fontFamily: Fonts.Prompt_Medium,
                  fontSize: screenInfo.width > 500 ? 16 :12,
                  color: COLOR.secondary_primary_color,
                }}
                textStyle={{
                  fontFamily: Fonts.Prompt_Medium,
                  color: COLOR.secondary_primary_color,
                }}
                listItemLabelStyle={{
                  fontFamily: Fonts.Prompt_Medium,
                  color: COLOR.white,
                }}
                setOpen={setOpen}
                setValue={setValueOperation}
                searchTextInputStyle={{
                  color: COLOR.white,
                  borderColor: COLOR.white,
                  borderWidth: 2,
                }}
                searchContainerStyle={{
                  borderBottomColor: COLOR.white,
                }}
                searchPlaceholderTextColor={COLOR.white}
                dropDownContainerStyle={{
                  backgroundColor: COLOR.secondary_primary_color,
                  borderBottomColor: COLOR.secondary_primary_color,
                  borderWidth: 2,
                  borderColor: COLOR.secondary_primary_color,
                }}
                setItems={setItems}
              />
            </View>

            : <View style={{ flex: 1 }}>
              <Text style={{ fontSize: screenInfo.width > 500 ? 16 : 12, fontFamily: Fonts.Prompt_Light }}>{title}</Text>
            </View>}

          <View style={{ flex: 1 }}>
            <RadioButton.Group onValueChange={newValue => {
              const dataObj = {
                ...checkList[index],
                ...{ measure: newValue }
              };
              checkList.splice(index, 1, dataObj);
              setCheckList([...checkList]);
            }} value={value}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: screenInfo.width > 500 ? 16 : 12, fontFamily: Fonts.Prompt_Light }}>ดีมาก</Text>
                  <RadioButton value="4" />
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: screenInfo.width > 500 ? 16 : 12, fontFamily: Fonts.Prompt_Light }}>ดี</Text>
                  <RadioButton value="3" />
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: screenInfo.width > 500 ? 16 : 12, fontFamily: Fonts.Prompt_Light }}>พอใช้</Text>
                  <RadioButton value="2" />
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: screenInfo.width > 500 ? 16 : 12, fontFamily: Fonts.Prompt_Light }}>ปรับปรุง</Text>
                  <RadioButton value="1" />
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Button style={{
                    width: '100%',
                    height: 40,
                    borderWidth: 1,
                    borderColor: 'white',
                    backgroundColor: COLOR.primary,
                    borderRadius: 30,
                    marginTop: 10,
                  }} onPress={() => {
                    if (Number(order) == 6) {
                      _onClickCameraModels()
                      setCheckListCamera(order)
                    } else {
                      openModalsCamera(order)
                    }
                  }
                  }>
                    <Icon name="camera" size={20} color={COLOR.white} />
                  </Button>
                </View>
              </View>
            </RadioButton.Group>
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 6 }}>
          <View>
            <Text style={{ fontSize: screenInfo.width > 500 ? 16 :12, fontFamily: Fonts.Prompt_Light, color: COLOR.primary, marginTop: 10 }}>Remark</Text>
          </View>
          <View style={{ flex: 0.1 }} ></View>
          <View style={{ flex: 3 }} >
            <TextInput
              style={[styles.input, { color: "black" }]}
              value={checkList[index].remark}
              onChangeText={textSearch => {
                const dataObj = {
                  ...checkList[index],
                  ...{ remark: textSearch }
                };
                checkList.splice(index, 1, dataObj);
                setCheckList([...checkList]);
              }}

            />
          </View>
        </View>
      </View>

    )
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


    return dataFile ? (
      <TouchableOpacity
        onPress={() => {
          setCameraValue(dataFile[keyName]['uri']);
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

  const ImageCardWidget = () => {
    return (
      <View style={{ flexDirection: 'column' }}>
        <View>
          <Text style={{
            color: COLOR.primary,
            fontSize: screenInfo.width > 500 ? 20 : 12,
            fontFamily: Fonts.Prompt_Medium,
          }}>{cameraIndexSelectTitle}</Text>
        </View>
        <View
          style={{
            paddingTop: 10,
          }}>
          {renderFileUriImage(`${cameraIndexSelect}`)}
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 2 }}>
            <Button style={styles.btn} onPress={() => _launchCamera(`${cameraIndexSelect}`)}>
              <Icon name="camera" size={40} color={COLOR.white} />
            </Button>
          </View>
          <View style={{ flex: 2 }}>
            <Button
              style={[styles.btn, { backgroundColor: COLOR.orange }]}
              onPress={() => _launchImageLibrary(`${cameraIndexSelect}`)}>
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
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 2, alignItems: 'center', marginTop: 40 }}>
            <Button style={[styles.btn, { width: 250 }]} onPress={() => {
              setVisible(false)
            }
            }>
              <Text style={{
                color: 'white',
                fontSize: 20,
                fontFamily: Fonts.Prompt_Medium,
              }}>ตกลง</Text>
            </Button>
          </View>
        </View>
      </View>
    );
  };


  const modalsCamera = () => {
    return (
      <Modal visible={visible}
        transparent
        key={'modalsCamera'}
        animationType={'none'}
        maskClosable
        style={{
          width: screenInfo.width > 500 ? 740 : '98%',
          height: '80%',
        }}>
        <View>
          <View style={{ alignItems: 'flex-end' }}>
            <TouchableHighlight
              underlayColor="#fff"
              onPress={() => {
                setVisible(false)
                setCameraIndexSelect(null)
              }}>
              <Icon name="close" size={30} />
            </TouchableHighlight>
          </View>
          <View>
            {ImageCardWidget()}
          </View>
        </View>
      </Modal>
    )
  }

  const renderWorkOrderList = () => {
    const items: any = [];
    for (let index = 0; index < checkList.length; index++) {
      const { label, measure, order } = checkList[index]
      items.push(checkListItem(label, measure, order, index))
    }

    return items
  }

  const BottomWidget = (
    title?: string,
    action?: any,
    colorBackground?: any,
  ) => {
    return (
      <View style={{ alignItems: 'center' }}>
        <Button
          style={{
            width: '100%',
            height: 60,
            backgroundColor: COLOR.secondary_primary_color,
            borderRadius: 35,
            marginTop: 20
          }}
          onPress={action}>
          <Text style={{ color: 'white', fontSize:screenInfo.width > 500 ? 20 : 14}}>{title}</Text>
        </Button>
      </View>
    );
  };

  const _onClickCameraModels = () => {
    setVisibleCamera(!visibleCamera)
  }

  const CameraModels = () => {
    return (
      <View>
        <View>
          <Modal
            transparent
            maskClosable
            style={{ width:screenInfo.width > 500 ? 690 : '98%', height:screenInfo.width > 500 ? 580 : '95%', borderRadius: 15 }}
            visible={visibleCamera}>
            <View>
              <View style={{ alignItems: 'flex-end' }}>
                <TouchableHighlight
                  underlayColor="#fff"
                  onPress={() => {
                    _onClickCameraModels(), setCheckListCamera('');
                  }}>
                  <Icon name="close" size={30} />
                </TouchableHighlight>
              </View>
              <View>
                <Text style={styles.text_title_camera}>
                  รูปถ่าย {valueOperation}   3 รูป 
                </Text>
              </View>
              <View style={{ flexDirection: 'row', padding:screenInfo.width > 500 ? 60:10, marginTop: 40 }}>
                {fileDataMultiple[checkListCamera] ?
                  fileDataMultiple[checkListCamera].map((val: any, inx: any) => {
                    return <View key={`image-${inx}`}>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Icon onPress={() => _removeImage(checkListCamera?.id, inx)} name="close" size={20}></Icon>
                      </View>
                      <Lightbox activeProps={{ height: screenHeight, width: 'auto' }}>
                        <Image
                          style={{ height: 150, width: 150, borderRadius: 20, marginLeft: inx == 0 ? 0 : 20, }}
                          source={{
                            uri: val?.uri
                          }}
                        />
                      </Lightbox>
                    </View>
                  })
                  : null}
                {!fileDataMultiple[checkListCamera] || fileDataMultiple[checkListCamera].length < 3 ? <TouchableHighlight onPress={() => {
                  setIsVisible(!isVisible)
                }} underlayColor="none">
                  <View style={{ marginTop: 20, marginLeft: 20, width: 150, height: 150, borderColor: COLOR.gray, borderRadius: 20, borderStyle: "dotted", borderWidth: 4 }}>
                    <View style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon
                        name={'plus'}
                        size={100}
                        color={COLOR.secondary_primary_color}
                      />
                    </View>

                  </View>
                </TouchableHighlight > : null}
              </View>
              <View
                style={[
                  {
                    paddingLeft: 40,
                    paddingRight: 40,
                    paddingBottom: 100,
                    alignItems: 'center',
                    alignSelf: 'center',
                  },
                ]}>
                <Button
                  style={[styles.btn, { padding: 6, width: 350 }]}
                  onPress={() => {
                    uploadImageMultipleImage(checkListCamera)
                    _onClickCameraModels()
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 20,
                      fontFamily: Fonts.Prompt_Medium,
                    }}>
                    ตกลง
                  </Text>
                </Button>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    );
  }

  const uploadImageMultipleImage = async (keyNameId: any) => {
    try {
      if (keyNameId) {
        setLoading(true)
        if (fileDataMultiple[keyNameId]) {
          let imageUrl: any = []
          for (const [index, keyName] of Object.keys(fileDataMultiple[keyNameId]).entries()) {
            if (fileDataMultiple[keyNameId][index].formatType === 'file') {
              const result: any = await uploadImageVisitInspect(
                fileDataMultiple[keyNameId][index],
                props.workOrderData.orderId,
                props.workOrderData.workType
              );


              let imageResponse = {
                "fileName": "",
                "fileSize": 0,
                "height": 0,
                "type": "",
                "uri": result?.fileDisplay,
                "width": 0,
                "key": `${keyNameId}`,
                "formatType": "url"
              }
              imageUrl.push({ ...fileDataMultiple[keyNameId][index], ...imageResponse })
            } else {
              imageUrl.push(fileDataMultiple[keyNameId][index])
            }
          }

          fileDataMultiple[keyNameId] = imageUrl
          setFileDataMultiple({ ...fileDataMultiple })
          _onClickCameraModels()
          setLoading(false)
        }
      } else {
        _onClickCameraModels()
      }
    } catch (error) {
    }
  }


  const _removeImage = async (keyName: any, index: any) => {
    let value = fileDataMultiple[keyName][index]
    fileDataMultiple[keyName] = fileDataMultiple[keyName].splice(fileDataMultiple[keyName].indexOf(value), 1)
    setFileData({ ...fileDataMultiple });
    if (value.formatType == "url") {
      await removeImagesVisitInspector(
        value.uri
      );
    }

  }

  return (
    <>
      {screenInfo.width > 500 ? 
      <AppBar
      title={`Operation ${props.workOrderData.workType != "visitor" ? "Inspector" : "Visit"}`}
      rightTitle={`Order: ${props.workOrderData.orderId}`}></AppBar>:
      <AppBar
        title={`Operation ${props.workOrderData.workType != "visitor" ? "Inspector" : "Visit"} ${props.workOrderData.orderId} `} ></AppBar>
      }


      {props.workOrderData.workType != "visitor" ?
        <View>
          <InspectorWorkOrderCheckListPage workOrderData={props.workOrderData} />
        </View>
        : <SafeAreaView style={{ flex: 1 }}>
          <ScrollView scrollEnabled={!open}>
            <View style={{ padding:screenInfo.width > 500 ? 40 :5 }}>
              {renderWorkOrderList()}
              <View style={{ padding: 30 }}>
                {props.workOrderData.webStatus != "4" ? BottomWidget('บันทึก', () => {
                  createVisitCheckList();
                }) : null}

              </View>
              {modalsCamera()}
              {CameraModels()}
            </View>
          </ScrollView>
          <BottomSheet
            isVisible={isVisible}
            containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
          >
            {list.map((l, i) => (
              i == 0 ?
                <ListItem key={i} containerStyle={l?.containerStyle}>
                  <View>
                    <Icon name={l.icons} />
                  </View>
                  <View>
                    <Text onPress={l.onPress} style={{ fontSize: 18 }}>{l.title}</Text>
                  </View>
                </ListItem> : <ListItem key={i} containerStyle={l?.containerStyle} onPress={l.onPress}>
                  <View>
                    <Icon name={l.icons} />
                  </View>
                  <View>
                    <Text style={{ fontSize: 18 }}>{l.title}</Text>
                  </View>
                </ListItem>
            ))}
          </BottomSheet>
        </SafeAreaView>
      }


      <Loading loading={loading} />
    </>
  );
}



export default CheckListVisitInspectorPage;

