import React, {useEffect} from 'react';
import {Text, useWindowDimensions} from 'react-native';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import {COLOR} from '../../constants/Colors';
import ImagesOtherAfter from './ImagesOtherAfter';
import ImagesOtherBefore from './ImagesOtherBefore';

const ImagesOther = () => {
  const layout = useWindowDimensions();
  const [allValues, setAllValues] = React.useState([] as any);
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: 'ก่อนซ่อม'},
    {key: 'second', title: 'หลังซ่อม'},
  ]);

  const renderScene = SceneMap({
    first: () => <ImagesOtherBefore />,
    second: () => <ImagesOtherAfter />,
  });

  return (
    <>
      <TabView
        renderTabBar={props => (
          <TabBar
            renderLabel={({route, focused, color}) => (
              <Text
                style={{color: COLOR.white, fontWeight: '600', fontSize: 18}}>
                {route.title}
              </Text>
            )}
            {...props}
            style={{backgroundColor: COLOR.primary}}></TabBar>
        )}
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
      />
    </>
  );
};

export default ImagesOther;
