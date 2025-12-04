import React, {useEffect, useState} from 'react';
import {Animated, Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import Orientation, {OrientationType} from 'react-native-orientation-locker';
import Pdf from 'react-native-pdf';
import Video from 'react-native-video';
import AppBar from '../../../components/AppBar';
import Loading from '../../../components/loading';
import {COLOR} from '../../../constants/Colors';
import {Fonts} from '../../../constants/fonts';

interface Params {
  knowledgeInfo: {type: string; value: string; title: string};
};

const KnowledgePreviewPage = props => {
  const params = props.route.params as Params;
  const [isLoading, setIsLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState(params.knowledgeInfo.value);
  const [videoWidth, setVideoWidth] = useState(Dimensions.get('window').width);
  const [videoHeight, setVideoHeight] = useState(
    Dimensions.get('window').height,
  );

  useEffect(() => {
    setFileUrl(params.knowledgeInfo.value);
  }, []);

  useEffect(() => {
    if (params.knowledgeInfo.type !== 'file') {
      Orientation.unlockAllOrientations();
      Orientation.addOrientationListener((orientation: OrientationType) => {
        if (
          orientation === 'LANDSCAPE-RIGHT' ||
          orientation === 'LANDSCAPE-LEFT'
        ) {
          setTimeout(() => {
            setVideoHeight(Dimensions.get('window').height);
            setVideoWidth(Dimensions.get('window').width);
          }, 200);
        } else {
          setTimeout(() => {
            setVideoHeight(Dimensions.get('window').height);
            setVideoWidth(Dimensions.get('window').width);
          }, 200);
        }
      });
      return () => {
        Orientation.lockToPortrait();
      };
    }
  }, []);

  return (
    <>
      <Animated.View>
        <View style={{width: '100%'}}>
          <AppBar
            title={`แหล่งความรู้ - ${params.knowledgeInfo.title}`}></AppBar>
          {params.knowledgeInfo.type === 'file' && (
            <ScrollView>
              <Pdf
                source={{uri: fileUrl}}
                onLoadProgress={() => {
                  setIsLoading(true);
                }}
                onLoadComplete={(numberOfPages, filePath) => {
                  setIsLoading(false);
                  console.log(`number of pages: ${numberOfPages}`);
                }}
                onPageChanged={(page, numberOfPages) => {
                  console.log(`current page: ${page}`);
                }}
                onError={error => {
                  console.log(error);
                  setIsLoading(false);
                }}
                onPressLink={uri => {
                  console.log(`Link presse: ${uri}`);
                }}
                style={styles.pdf}
              />
            </ScrollView>
          )}
          {params.knowledgeInfo.type !== 'file' && (
            <>
              <Video
                source={{
                  uri: fileUrl,
                  type: 'video/mp4',
                }}
                style={{
                  width: videoWidth,
                  height: videoHeight,
                }}
                resizeMode="contain"
                controls={true}
                onLoad={() => {
                  setIsLoading(false);
                }}
                onError={e => {
                  console.log('e ====>', e);
                  setIsLoading(false);
                }}
                onLoadStart={() => {
                  console.log('onLoadStart');
                  setIsLoading(true);
                  setTimeout(() => {
                    setIsLoading(false);
                  }, 20000);
                }}
              />
            </>
          )}
        </View>
      </Animated.View>
      <Loading loading={isLoading} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 80,
    paddingRight: 80,
  },
  titleStyle: {
    fontSize: 24,
    fontFamily: Fonts.Prompt_Medium,
  },
  subTitleStyle: {
    fontSize: 16,
    fontFamily: Fonts.Prompt_Light,
    color: COLOR.gray,
  },
  dateStyle: {
    fontSize: 14,
    fontFamily: Fonts.Prompt_Light,
    color: COLOR.gray,
  },
  textStyle: {
    fontSize: 16,
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: Dimensions.get('window').height,
  },
});

export default KnowledgePreviewPage;
