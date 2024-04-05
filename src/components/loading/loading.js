import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {commonStyles} from '../../utils/commonStyles';
import {title} from '../../utils/colors';

const Loading = () => {
  return (
    <View
      style={[
        commonStyles.flex1,
        commonStyles.justifyContentCenter,
        commonStyles.alignItemsCenter,
      ]}>
      <ActivityIndicator size={'large'} color={title} />
    </View>
  );
};

export default Loading;
