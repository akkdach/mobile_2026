import React, {useEffect, useState} from 'react';
import {
  Animated,
  Image,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {Avatar} from 'react-native-paper';
import * as router from 'react-native-router-flux';
import AppBar from '../../components/AppBar';
import BackGroundImage from '../../components/BackGroundImage';
import styles from '../../components/StyleSheet';
import {ROUTE} from '../../constants/RoutePath';
import {IMenu} from '../../models/menu';
import learningCenterCss from './VisitsPageCss';
const logo = require('../../../assets/logo.png');

const VisitPage = () => {
  const [menus, menusSet] = useState<IMenu[]>([]);

  useEffect(() => {
    menusSet([
      {
        title: 'Visit',
        iconName: 'file',
        size: 70,
        route: ROUTE.MAIN,
      },
    ]);
  }, []);

  const cardWidget = (menu: IMenu) => {
    return (
      <TouchableHighlight
        underlayColor="#fff"
        onPress={() => {
          router.Actions.push(menu.route);
        }}
        style={learningCenterCss.flexListMenuItem}>
        <View style={styles.card}>
          <Text style={styles.textCard}>{menu.title}</Text>
          <Avatar.Icon
            size={menu.size}
            icon={menu.iconName}
            style={learningCenterCss.iconCard}
          />
        </View>
      </TouchableHighlight>
    );
  };

  return (
    <>
      <BackGroundImage
        components={
          <Animated.View>
            <View style={{width: '100%'}}>
              <AppBar title="Visits"></AppBar>
            </View>
            <ScrollView>
              <View style={learningCenterCss.cardLogoCompany}>
                <Image style={learningCenterCss.logoCompany} source={logo} />
              </View>
              <View style={learningCenterCss.container}>
                <View style={learningCenterCss.flexListMenu}>
                  {menus.map((menu: IMenu) => cardWidget(menu))}
                </View>
              </View>
            </ScrollView>
          </Animated.View>
        }></BackGroundImage>
    </>
  );
};

export default VisitPage;
