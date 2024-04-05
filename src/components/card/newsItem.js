import React, {useEffect} from 'react';
import {
  Animated,
  Image,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  UIManager,
  View,
} from 'react-native';
import {commonStyles} from '../../utils/commonStyles';
import {
  actionBackground,
  actionTint,
  description,
  screenBackground,
  title,
} from '../../utils/colors';
import SwipeableItem, {
  OpenDirection,
  useSwipeableItemParams,
} from 'react-native-swipeable-item';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const NewsItem = ({
  news,
  onLeftActionClick,
  isPinned = false,
  onRightActionClick,
  newsItemRefs,
}) => {
  return (
    <SwipeableItem
      renderUnderlayLeft={() => (
        <RightActionItem onRightActionClick={onRightActionClick} />
      )}
      renderUnderlayRight={() => (
        <LeftActionItem
          onLeftActionClick={onLeftActionClick}
          isPinned={isPinned}
        />
      )}
      ref={ref => {
        if (ref && !newsItemRefs.current.get(news.id)) {
          newsItemRefs.current.set(news.id, ref);
        }
      }}
      onChange={({openDirection}) => {
        if (openDirection !== OpenDirection.NONE) {
          // Close all other open items
          [...newsItemRefs.current.entries()].forEach(([key, ref]) => {
            if (key !== news.id && ref) {
              ref.close();
            }
          });
        }
      }}
      snapPointsLeft={[100]}
      item={news}
      swipeEnabled={true}
      activationThreshold={20}
      snapPointsRight={[100]}>
      <View
        style={[
          commonStyles.row,
          commonStyles.paddingHorizontal16,
          commonStyles.paddingVertical8,
          styles.card,
        ]}>
        <Image source={{uri: news.urlToImage}} style={[styles.image]} />
        <View style={[commonStyles.flex1, commonStyles.marginStart16]}>
          <Text style={[styles.title]} numberOfLines={2}>
            {news.title}
          </Text>
          <Text style={[styles.description]} numberOfLines={2}>
            {news.description}
          </Text>
        </View>
      </View>
    </SwipeableItem>
  );
};

const RightActionItem = ({onRightActionClick}) => {
  const {item, close} = useSwipeableItemParams();
  return (
    <Animated.View style={[commonStyles.row, styles.underLayLeft]}>
      <TouchableWithoutFeedback
        onPress={() => {
          close();
          onRightActionClick(item);
        }}>
        <Image
          style={[styles.actionImage]}
          source={require('../../../assets/images/delete.png')}
        />
      </TouchableWithoutFeedback>
    </Animated.View>
  );
};

function LeftActionItem({onLeftActionClick, isPinned}) {
  const {item, close} = useSwipeableItemParams();
  return (
    <Animated.View style={[commonStyles.row, styles.underLayRight]}>
      <TouchableWithoutFeedback
        onPress={() => {
          close();
          onLeftActionClick(item);
        }}>
        <Image
          style={[styles.actionImage]}
          source={
            isPinned
              ? require('../../../assets/images/unpin.png')
              : require('../../../assets/images/pin.png')
          }
        />
      </TouchableWithoutFeedback>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 64,
    width: 64,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: title,
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    color: description,
  },
  underLayLeft: {
    backgroundColor: actionBackground,
    justifyContent: 'center',
    alignSelf: 'flex-end',
    alignItems: 'center',
    height: '100%',
    flex: 1,
    minWidth: 100,
  },
  underLayRight: {
    backgroundColor: actionBackground,
    justifyContent: 'center',
    alignSelf: 'flex-start',
    alignItems: 'center',
    height: '100%',
    flex: 1,
    minWidth: 100,
  },
  card: {
    backgroundColor: screenBackground,
  },
  actionImage: {
    width: 24,
    height: 24,
    tintColor: actionTint,
  },
});

export default NewsItem;
