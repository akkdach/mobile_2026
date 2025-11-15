import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import AppBar from '../../../components/AppBar';

const WorkStatusPage = () => {
  const Contents = () => {
    return (
      <ScrollView>
        <View>
          <Text>WorkStatusPage Work</Text>
        </View>
      </ScrollView>
    );
  };

  const renderWorkStatus = () => {
    return [<AppBar title="สถานะของงาน"></AppBar>, Contents()];
  };

  return <>{renderWorkStatus()}</>;
};

export default WorkStatusPage;
