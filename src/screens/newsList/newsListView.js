import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  View,
} from 'react-native';
import {commonStyles} from '../../utils/commonStyles';
import NewsItem from '../../components/card/newsItem';
import Loading from '../../components/loading/loading';

const NewsListView = ({
  news,
  pinnedNews,
  onPinClick,
  removePinnedNews,
  isRefreshing,
  fetchMoreItems,
  deleteNews,
  newsItemRefs,
}) => {
  if (news?.length) {
    return (
      <SafeAreaView style={[commonStyles.container]}>
        <View style={[commonStyles.container]}>
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={() => fetchMoreItems(true)}
              />
            }
            stickyHeaderIndices={pinnedNews ? [0] : [0]}
            ListHeaderComponent={() => {
              if (pinnedNews) {
                return (
                  <NewsItem
                    news={pinnedNews}
                    onLeftActionClick={removePinnedNews}
                    isPinned={true}
                    onRightActionClick={deleteNews}
                    newsItemRefs={newsItemRefs}
                  />
                );
              } else {
                return null;
              }
            }}
            keyExtractor={item => item.url}
            ItemSeparatorComponent={() => (
              <View style={[commonStyles.separator]} onPinClick={onPinClick} />
            )}
            data={news}
            renderItem={({item, index}) => {
              return (
                <NewsItem
                  news={item}
                  onLeftActionClick={onPinClick}
                  onRightActionClick={deleteNews}
                  newsItemRefs={newsItemRefs}
                />
              );
            }}
          />
        </View>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={[commonStyles.flex1]}>
        <Loading />
      </SafeAreaView>
    );
  }
};

export default NewsListView;
