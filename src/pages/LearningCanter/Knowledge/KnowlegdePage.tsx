import { Icon } from '@ant-design/react-native';
import React, { FC, useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Modal,
  PermissionsAndroid,
  Platform,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import { Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Video from 'react-native-video';
import RNFetchBlob from 'rn-fetch-blob';
import AppBar from '../../../components/AppBar';
import DataNotFound from '../../../components/DataNotFound';
import Loading from '../../../components/loading';
import { COLOR } from '../../../constants/Colors';
import { Fonts } from '../../../constants/fonts';
import { ROUTE } from '../../../constants/RoutePath';
import { getKnowledgeService } from '../../../services/knowledge';
import { ScreenWidth } from 'react-native-elements/dist/helpers';
import { Input } from 'react-native-elements';
import { TextInput } from 'react-native-gesture-handler';
import { Controller, useForm } from 'react-hook-form';
import { onChange } from 'react-native-reanimated';
import { useNavigation, StackActions } from '@react-navigation/native';

type InterfaceProps = {};
type Inputs = {
  searchText: string;
};

const KnowledgePage: FC<InterfaceProps> = props => {
  const { control, getValues, setValue } = useForm<Inputs>();
  const [isVisibleModalPreviewImage, setIsVisibleModalPreviewImage] =
    useState(false);
  const [videoValue, setVideoValue] = useState('');
  const [dataList, setDataList] = useState<any>();
  const [dataListDefault, setDataListDefault] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    getKnowLedgeList();
  }, []);

  const getKnowLedgeList = async () => {
    setIsLoading(true);
    const response = (await getKnowledgeService()).dataResult;
    setIsLoading(false);
    setDataList(response);
    setDataListDefault(response);
  };

  const openFile = async (value: string) => {
    if (Platform.OS === 'ios') {
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Require',
            message: 'App needs access to your storage to dowload file',
            buttonPositive: '',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Storage Permission Granted.');
          dowloadFiles(value);
        } else {
          Alert.alert('Storage Permission Not Granted');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const dowloadFiles = (value: string) => {
    const date = new Date();
    const image_URL = value;
    let ext: any = getExtention(image_URL);
    ext = '.' + ext[0];

    const { config, fs } = RNFetchBlob;
    const PictureDir = fs.dirs.PictureDir;
    const options = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/file_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ext,
        description: 'File Download',
      },
    };
    config(options)
      .fetch('GET', value)
      .then(res => {
        console.log('res ---->', JSON.stringify(res, null, 2)),
          Alert.alert('File Dowload Successfully.');
      });
  };

  const getExtention = (filename: string) => {
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };

  const CardKnowLedge = (item: any, index: number) => {
    return (
      <TouchableOpacity
        onPress={() => {
          switch (item.type) {
            case 'media':
              // Actions.push(ROUTE.KNOW_LEDGE_PREVIEW_PAGE, {
              //   knowledgeInfo: { type: item.type, value: item.value, title: item.title },
              // });
              navigation.dispatch(StackActions.push(ROUTE.KNOW_LEDGE_PREVIEW_PAGE, {
                knowledgeInfo: { type: item.type, value: item.value, title: item.title },
              }));
              break;
            default:
              if (item.value && item.value.includes('.pdf')) {
                // Actions.push(ROUTE.KNOW_LEDGE_PREVIEW_PAGE, {
                //   knowledgeInfo: { type: item.type, value: item.value, title: item.title },
                // });
                navigation.dispatch(StackActions.push(ROUTE.KNOW_LEDGE_PREVIEW_PAGE, {
                  knowledgeInfo: { type: item.type, value: item.value, title: item.title },
                }));
              } else {
                openFile(item.value)
              }
              break;
          }
        }
        }>
        <View style={[{ marginTop: 10, marginLeft: 4, marginRight: 20 }]}>
          <Card style={{ backgroundColor: '#fafafa', height: ScreenWidth > 500 ? 100 : 100, padding: 5 }}>
            <Card.Content>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  height: '100%',
                }}>
                <View style={{ maxWidth: '90%' }}>
                  <Text
                    style={{
                      color: '#888888',
                      fontWeight: 'bold',
                      fontSize: ScreenWidth > 500 ? 24 : 16,
                      fontFamily: Fonts.Prompt_Medium,
                    }}>
                    {item.title}
                  </Text>
                </View>
                <View>
                  {item.type === 'media' ? (
                    <Icon
                      name={'play-circle'}
                      size={ScreenWidth > 500 ? 50 : 32}
                      color={COLOR.secondary_primary_color}
                    />
                  ) : (
                    <Icon
                      name={'file'}
                      size={ScreenWidth > 500 ? 50 : 32}
                      color={COLOR.secondary_primary_color}
                    />
                  )}
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>
      </TouchableOpacity>
    );
  };

  const previewImage = () => {
    return videoValue ? (
      <Modal
        transparent
        style={{ width: 800 }}
        visible={isVisibleModalPreviewImage}>
        <View style={{ position: 'absolute', top: 0, right: 20, zIndex: 2 }}>
          <TouchableHighlight
            underlayColor="#fff"
            onPress={() => setIsVisibleModalPreviewImage(false)}>
            <Icon name="close" size={30} />
          </TouchableHighlight>
        </View>
        <Video
          source={{ uri: videoValue }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="contain"
          fullscreen={true}
          controls={true}
          fullscreenAutorotate={true}
        />
      </Modal>
    ) : (
      <View></View>
    );
  };

  const LayoutKnowledgeList = () => {
    let listItem: any = [];

    if (dataList?.length > 0) {
      const data = dataList
        .map((list: any) => {
          return list.items.map((item: any) => {
            return {
              title: list.title,
              type: item.type,
              value: item.value,
            };
          });
        })
        .flat();

      data.map((item: any, index: number) => {
        listItem.push(CardKnowLedge(item, index));
        if (data.length - 1 === index) {
          listItem.push(<View style={{ height: 100 }}></View>);
        }
      });
    }

    return (
      <View
        style={{
          flex: 4,
        }}>
        <View style={{ flexDirection: 'column' }}>
          {dataList?.length > 0 ? (
            <FlatList
              data={listItem}
              initialNumToRender={10}
              renderItem={renderItem}
              keyExtractor={(item: any, index: number) =>
                `select-list-${index}`
              }
            />
          ) : (
            <DataNotFound />
          )}
        </View>
      </View>
    );
  };

  const renderItem = ({ item, index }: any) => {
    return item;
  };

  // const statusWorkOrderAmount = (type: string) => {
  //   const data = workOrderDataVanSubFilter.filter((v: any) => v.approveAction === type)
  //   return data.length > 0 ? data.length : 0
  // }

  // 91590106
  const handleSearchChange = (e: any) => {
    var newData:any = dataListDefault.filter((item:any )=>{
      // console.log(item);
      if(item.title.indexOf(e)>=0){
        return true;
      }else{
        return false;
      }
    });
    // console.info(newData);
    setDataList(newData);
  }

  return (
    <>
      <Animated.View>
        <View style={{ width: '100%' }}>
          <AppBar title={"แหล่งความรู้"}></AppBar>
        </View>
        <View style={{ padding: 5, marginTop: 10 }}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                style={{color:'#000'}}
                placeholderTextColor="gray"
                underlineColorAndroid="transparent"
                onBlur={onBlur}
                onChangeText={value => handleSearchChange(value)}
                placeholder="ค้นหา"
              />
            )}
            name="search"
            rules={{ required: true }}
            defaultValue=""
          />

        </View>
        <SafeAreaView style={{ height: '85%' }}>
          <View style={{ padding: 10, height: '100%' }}>
            {LayoutKnowledgeList()}
          </View>
        </SafeAreaView>
        {previewImage()}
      </Animated.View>
      <Loading loading={isLoading} />
    </>
  );
};

export default KnowledgePage;
