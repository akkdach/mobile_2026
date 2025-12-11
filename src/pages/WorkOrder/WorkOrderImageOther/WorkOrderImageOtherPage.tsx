import { Button } from '@ant-design/react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ImageBackground, Text, useWindowDimensions, View } from 'react-native';
import { StackActions, useNavigation } from '@react-navigation/native';
import AppBar from '../../../components/AppBar';
import ImagesOther from '../../../components/ImagesOther/ImagesOther';
import Loading from '../../../components/loading';
import { COLOR } from '../../../constants/Colors';
import { Fonts } from '../../../constants/fonts';
import { ImageOtherContext } from '../../../context/imageContext';
import { ImageOtherContextType } from '../../../models/image-other';
import { getImageOtherService, postImageOtherService } from '../../../services/imageOther';
import styles from './WorkOrderImageOtherPageCss';

type InterfaceProps = {
  workOrderData: {
    orderId: string,
    type: string,
    objType: string,
  }
};

const WorkOrderImagesOtherPage = (props) => {
  const params = props.route?.params as InterfaceProps;
  const navigation = useNavigation();
  const {
    allValues,
    fileDataAfter,
    fileDataBefore,
    formDataAfter,
    formDataBefore,
    updateFileDataBefore,
    updateFileDataAfter
  } = React.useContext(ImageOtherContext) as ImageOtherContextType;
  const layout = useWindowDimensions();
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    _getImageOther()
    return () => {
      updateFileDataBefore([]),
        updateFileDataAfter([])
    };
  }, []);




  const _onSaveData = async (payload: any[]) => {
    try {
      const result = await postImageOtherService(payload);
      if (result.isSuccess) {
        setLoading(false)
        Alert.alert('แจ้งเตือน', 'บันทึกรูปภาพสำเร็จ', [
          {
            text: 'ปิด',
            onPress: async () => {
              navigation.dispatch(StackActions.pop())
              updateFileDataBefore([])
              updateFileDataAfter([])
            },
          },
        ]);
      } else {
        setLoading(false)
        Alert.alert('แจ้งเตือน', 'บันทึกรูปภาพไม่สำเร็จ', [
          {
            text: 'ปิด',
          },
        ]);
      }
    } catch (error: any) {
      setLoading(false)
      Alert.alert('แจ้งเตือน', error.message, [
        {
          text: 'ปิด',
          onPress: async () => navigation.dispatch(StackActions.pop()),
        },
      ]);
    }
  }

  const _submitImage = () => {
    let imageBeforeFromData: any = []
    let imageAfterFromData: any = []
    setLoading(true)
    if (fileDataBefore.length > 0) {
      fileDataBefore.map(val => {
        if (val['formatType'] == 'file') {
          let fromData = setImageFormData(val)
          imageBeforeFromData.push(fromData)
        }
      })
    }
    if (fileDataAfter.length > 0) {
      fileDataAfter.map(val => {
        if (val['formatType'] == 'file') {
          let fromData = setImageFormData(val)
          imageAfterFromData.push(fromData)
        }
      })
    }

    let data: any = {
      "orderId": params.workOrderData.orderId,
      "objType": params.workOrderData.objType,
      "type": params.workOrderData.type,
      "imageBefore": imageBeforeFromData,
      "imageAfter": imageAfterFromData
    }
    _onSaveData(data)
  };

  const _setFormatImageOther = (uri: any) => {
    let image: any = {
      fileName: "",
      fileSize: "",
      height: "",
      type: 'image/jpeg',
      uri: uri,
      width: "",
      base64: "",
      formatType: 'url',
    };

    return image
  }

  const _getImageOther = async () => {
    try {
      const result = await getImageOtherService(params.workOrderData.orderId, params.workOrderData.type, params.workOrderData.objType);
      if (result.isSuccess) {
        // {
        //   "orderId": params.workOrderData.orderId,
        //   "objType": params.workOrderData.objType,
        //   "type": params.workOrderData.type,
        //   "imageBefore": imageBeforeFromData,
        //   "imageAfter": imageAfterFromData
        // }
        if (result.dataResult) {
          let data = result.dataResult
          // let imageBefore: any = [
          //   "https://static.vecteezy.com/packs/media/components/global/search-explore-nav/img/vectors/term-bg-1-666de2d941529c25aa511dc18d727160.jpg",
          //   "https://h5p.org/sites/default/files/h5p/content/1209180/images/file-6113d5f8845dc.jpeg"]
          // let imageAfter: any = ["https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg"]
          updateFileDataBefore([])
          updateFileDataAfter([])
          let imageBefore: any = data['imageBefore']
          let imageAfter: any = data['imageAfter']
          if (imageBefore.length > 0) {
            imageBefore.map((url: any) => {
              fileDataBefore.push(_setFormatImageOther(url))
            })
            updateFileDataBefore([...fileDataBefore])
          }

          if (imageAfter.length > 0) {
            imageAfter.map((url: any) => {
              fileDataAfter.push(_setFormatImageOther(url))
            })
            updateFileDataAfter([...fileDataAfter])
          }
        }
      }
    } catch (error: any) {
      setLoading(false)
      Alert.alert('แจ้งเตือน', error.message, [
        {
          text: 'ปิด',
          // onPress: async () => Actions.pop(),
        },
      ]);
    }
  }

  const setImageFormData = (file: any) => {
    const formdata = new FormData();
    formdata.append('file', {
      name: file.fileName,
      type: file.type,
      uri: file.uri,
    });
    return formdata;
  };

  return (
    <>
      <View>
        <AppBar title="ภาพภ่ายเพิ่มเติม"></AppBar>
        <ImageBackground
          key={'ImageBackground'}
          style={{
            width: '100%',
            height: '100%',
          }}
          source={require('../../../../assets/images/bg.png')}>
          <ImagesOther />
          <View
            style={{
              position: 'absolute',
              zIndex: 1,
              width: '100%',
              marginTop: layout.height / 1.2,
              padding: 20,
              alignItems: 'center',
            }}>
            <Button style={styles.btn_submit} onPress={_submitImage}>
              <Text
                style={{
                  color: COLOR.white,
                  fontSize: 22,
                  fontFamily: Fonts.Prompt_Medium,
                }}>
                บันทึกภาพถ่าย
              </Text>
            </Button>
          </View>
        </ImageBackground>
        <Loading loading={loading} />
      </View>
    </>
  );
};

export default WorkOrderImagesOtherPage;
