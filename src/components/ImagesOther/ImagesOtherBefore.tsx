import { Icon } from '@ant-design/react-native';
import moment from 'moment-timezone';
import React from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Text, View
} from 'react-native';
import ActionButton from 'react-native-action-button';
import * as ImagePicker from 'react-native-image-picker';
import ImageResizer, { ResizeFormat } from 'react-native-image-resizer';
import Lightbox from 'react-native-lightbox';
import { FlatGrid } from 'react-native-super-grid';
import { COLOR } from '../../constants/Colors';
import { ImageOtherContext } from '../../context/imageContext';
import { ImageOtherContextType } from '../../models/image-other';
import { removeImagesOther } from '../../services/imageOther';
import style from './ImagesOtherCss';

const ImagesOtherBefore = () => {
  const {
    allValues,
    fileDataBefore,
    formDataBefore,
    updateFileDataBefore,
    updateFormDataBefore,
  } = React.useContext(ImageOtherContext) as ImageOtherContextType;
  const screenHeight = Dimensions.get('window').height;


  const setImageFormData = (file: any) => {
    const formdata = new FormData();
    formdata.append('file', {
      name: file.fileName,
      type: file.type,
      uri: file.uri,
    });
    return formdata;
  };

  const _launchCamera = async () => {
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
          let images: any = {
            fileName: resizeImageSet.name,
            fileSize: resizeImageSet.size,
            height: resizeImageSet.height,
            type: 'image/jpeg',
            uri: resizeImageSet.uri,
            width: resizeImageSet.width,
            base64: response.base64,
            formatType: 'file',
          };
          fileDataBefore.push(images);
          // let formDateSet = setImageFormData(images);
          // formDataBefore.push(formDateSet);
          // updateFormDataBefore([...formDataBefore]);
          updateFileDataBefore([...fileDataBefore]);
          console.log('[formData]', formDataBefore);
        }
      })();
    });
  };

  const _launchImageLibrary = () => {
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

          let images: any = {
            fileName: resizeImageSet.name,
            fileSize: resizeImageSet.size,
            height: resizeImageSet.height,
            type: 'image/jpeg',
            uri: resizeImageSet.uri,
            width: resizeImageSet.width,
            base64: response.base64,
            formatType: 'file',
          };
          fileDataBefore.push(images);
          // let formDateSet = setImageFormData(images);
          // formDataBefore.push(formDateSet);
          // updateFormDataBefore([...formDataBefore]);
          updateFileDataBefore([...fileDataBefore]);
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
      return resizedImageUri;
    } catch (error: any) {
      Alert.alert('แจ้งเตือน', error.message);
    }
  };
  const _removeImage = async (index: any) => {
    let value = fileDataBefore[index]
    fileDataBefore.splice(index, 1);
    formDataBefore.splice(index, 1);
    // updateFormDataBefore([...formDataBefore]);
    updateFileDataBefore([...fileDataBefore]);
    try {
      if (value.formatType == "url") {
        await removeImagesOther(
          value.uri
        );
      }

    } catch (error: any) {
      Alert.alert('แจ้งเตือน', error.message, [
        {
          text: 'ปิด',
        },
      ]);
    }

  };
  return (
    <>
      <View >
        <View style={{ height: screenHeight / 1.2 }}>
          <FlatGrid
            key={'list-menu'}
            itemDimension={140}
            data={fileDataBefore}
            style={style.gridView}
            keyExtractor={(item, index) =>
              `${Math.floor(Math.random() * 10001)}`
            }
            listKey={moment().valueOf().toString()}
            fixed
            spacing={10}
            renderItem={({ index, item }) =>
              <View key={`image-${index}`}>
                <View
                  style={{
                    alignItems: 'flex-end',
                  }}>
                  <Icon
                    style={{
                      width: 25,
                      height: 25,
                      borderRadius: 25 / 2,
                      backgroundColor: 'red',

                      zIndex: 1
                    }}
                    onPress={() => _removeImage(index)}
                    name="close"
                    size={25}></Icon>
                </View>
                <Lightbox activeProps={{ height: screenHeight, width: 'auto' }}>
                  <Image
                    style={{
                      height: 150,
                      width: 150,
                      borderRadius: 20,
                    }}
                    source={{
                      uri: item?.uri,
                    }}
                  />
                </Lightbox>
              </View>
            }
          />
        </View>
        <ActionButton style={{ zIndex: 1 }} buttonColor={COLOR.neonRed} size={80} renderIcon={
          (active) => active ? <Icon name="close" color={COLOR.white} size={30}></Icon> : <Icon name="camera" color={COLOR.white} size={30}></Icon>}>
          <ActionButton.Item buttonColor='#3498db' title="แกลเลอรี่" onPress={() => _launchImageLibrary()}>
            <Icon name="file-image" size={26} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor={COLOR.primary} title="ถ่ายภาพ" onPress={() => _launchCamera()}>
            <Icon name='camera' size={26} />
          </ActionButton.Item>
        </ActionButton>
      </View>
    </>
  );
};

export default ImagesOtherBefore;
