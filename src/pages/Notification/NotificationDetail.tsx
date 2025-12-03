import React from 'react';
import {Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';
import Pdf from 'react-native-pdf';
import AppBar from '../../components/AppBar';
import BackGroundImage from '../../components/BackGroundImage';
import {COLOR} from '../../constants/Colors';
import {Fonts} from '../../constants/fonts';

const NotificationDetail = (props: any) => {
  const { notification } = props.route.params;
  
  const Contents = () => {
    return (
      // <ScrollView>
      <View
        style={
          {
            // borderWidth: 1,
            // margin: 40,
            // paddingTop: 80,
            // paddingBottom: 80,
          }
        }>
        {/* <View style={{...styles.container}}>
            <View style={{flex: 0.5}}>
              <Avatar.Icon
                {...props}
                icon="bullhorn"
                color="#FFA500"
                style={{backgroundColor: '#F5F5F5'}}
              />
            </View>

            <View style={{flex: 2}}>
              <Text style={styles.titleStyle}>{props.notification.title}</Text>
              <Text style={styles.subTitleStyle}>{'ประกาศ'}</Text>
            </View>

            <View style={{flex: 1}}>
              <Text style={styles.dateStyle}>{'08/07/2564 / 09:50'}</Text>
            </View>
          </View> */}

        {notification.type === 'file' ? (
          renderPDF(notification.value)
        ) : (
          <ScrollView
            style={{
              // marginTop: 10,
              height: Dimensions.get('window').height,
            }}>
            <View style={{...styles.container}}>
              <Text style={styles.textStyle}>{notification.value}</Text>
            </View>
          </ScrollView>
        )}
      </View>
      // </ScrollView>
    );
  };

  const renderNotificationDetail = () => {
    return [<AppBar title={notification.title}></AppBar>, Contents()];
  };

  const renderPDF = (value: string) => {
    return (
      <ScrollView
        style={{
          // marginTop: 30,
          height: Dimensions.get('window').height,
        }}>
        <View style={{flex: 1}}>
          <Pdf
            source={{uri: value}}
            trustAllCerts={false}
            onLoadComplete={(numberOfPages, filePath) => {
              console.log(`number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page, numberOfPages) => {
              console.log(`current page: ${page}`);
            }}
            onError={error => {
              console.log(error);
            }}
            onPressLink={uri => {
              console.log(`Link presse: ${uri}`);
            }}
            style={styles.pdf}
          />
        </View>
      </ScrollView>
    );
  };

  return (
    <>
      <BackGroundImage
        components={renderNotificationDetail()}></BackGroundImage>
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

export default NotificationDetail;
