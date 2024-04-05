import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import {commonStyles} from '../../utils/commonStyles';
import {title} from '../../utils/colors';

const SplashView = () => {
  return (
    <SafeAreaView style={[commonStyles.flex1]}>
      <View
        style={[
          commonStyles.flex1,
          commonStyles.alignItemsCenter,
          commonStyles.justifyContentCenter,
          commonStyles.container,
        ]}>
        <Text style={{fontSize: 48, fontWeight: '700', color: title}}>
          Smart
        </Text>
        <Text style={{fontSize: 64, fontWeight: '700', color: title}}>
          News
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SplashView;
