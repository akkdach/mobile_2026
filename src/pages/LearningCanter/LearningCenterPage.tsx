import React, {useEffect, useState} from 'react';
import {
  Animated,
  Image,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {Appbar, Avatar} from 'react-native-paper';
import * as router from 'react-native-router-flux';
import AppBar from '../../components/AppBar';
import BackGroundImage from '../../components/BackGroundImage';
import styles from '../../components/StyleSheet';
import {ROUTE} from '../../constants/RoutePath';
import {IMenu} from '../../models/menu';
import learningCenterCss from './LearningCenterCss';

const logo = require('../../../assets/logo.png');

const LearningCenterPage: React.FC = () => {
  const [menus, menusSet] = useState<IMenu[]>([]);

  useEffect(() => {
    menusSet([
      {
        title: 'แหล่งความรู้',
        iconName: 'lightbulb-on',
        size: 70,
        route: ROUTE.KNOWLEDGE,
      },
      {
        title: 'ประเมิณ',
        iconName: 'file-check',
        size: 70,
        route: ROUTE.MAIN,
      },
      {
        title: 'โหวต',
        iconName: 'chart-line',
        size: 70,
        route: ROUTE.MAIN,
      },
    ]);
  }, []);

  const cardWidget = (menu: IMenu, idx: number) => {
    return (
      <TouchableHighlight
        underlayColor="#fff"
        onPress={() => {
          router.Actions.push(menu.route);
        }}
        style={learningCenterCss.flexListMenuItem}
        key={`${menu.title}-${idx}`}>
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
      <AppBar title={"แหล่งความรู้ "}></AppBar>
      <BackGroundImage
        components={
          <Animated.ScrollView>
            <ScrollView>
              <View style={learningCenterCss.cardLogoCompany}>
                <Image style={learningCenterCss.logoCompany} source={logo} />
              </View>
              <View style={learningCenterCss.container}>
                <View style={learningCenterCss.flexListMenu}>
                  {menus.map((menu: IMenu, idx: number) =>
                    cardWidget(menu, idx),
                  )}
                </View>
              </View>
            </ScrollView>
          </Animated.ScrollView>
        }></BackGroundImage>
    </>
  );
};

export default LearningCenterPage;
