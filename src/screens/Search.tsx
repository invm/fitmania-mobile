import React from 'react';
import {
  View,
  FlatList,
  I18nManager,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { HomeRoutes, StackNavigationProps } from '../navigation';
import {
  BORDER_RADIUS,
  colors,
  height,
  PADDING,
  width,
} from '../components/Theme';
import { Text, Card, FocusAwareStatusBar } from '../components';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux';
import { search } from '../redux/actions';
import { API_URL } from '../../env';

const IMAGE_WIDTH = 90;
const IMAGE_HEIGHT = 90;

const Search = ({}: StackNavigationProps<HomeRoutes, 'Search'>) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { loading, results, inputDirty, searchExhausted, query, page } =
    useSelector((state: typeof RootState) => state.search);

  const expandList = async () => {
    if (!searchExhausted && query.length) {
      dispatch(search(query, page));
    }
  };

  const renderItem = ({
    item,
  }: {
    item: {
      name: string;
      tagline: string;
      _id: string;
      image: string;
      primaryImage: {
        blurHash: string;
        path: string;
      };
    };
  }) => {
    const {
      _id,
      name,
      tagline,
      primaryImage: { path },
    } = item;
    return (
      <TouchableOpacity
        onPress={() => {
          // return navigation.navigate('Business', {
          //   _id,
          //   blurHash,
          // });
        }}>
        <View style={{ paddingHorizontal: PADDING }}>
          <Card style={styles.card}>
            <View style={styles.container}>
              <Image
                style={[
                  {
                    width: IMAGE_WIDTH,
                    height: IMAGE_HEIGHT,
                    aspectRatio: width / height,
                    resizeMode: 'cover',
                  },
                ]}
                source={{ uri: API_URL + path }}
              />
            </View>

            <View style={styles.name}>
              <Text variant="bold16" lines={1}>
                {name}
              </Text>
              <Text variant="semibold16" lines={1}>
                {tagline}
              </Text>
            </View>
          </Card>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>
      <FocusAwareStatusBar
        backgroundColor={colors.white}
        barStyle="dark-content"
      />
      <>
        <FlatList
          data={results}
          contentContainerStyle={{ flex: 1, paddingTop: 10 }}
          renderItem={renderItem}
          ListEmptyComponent={() => {
            if (inputDirty && !loading)
              return (
                <>
                  <View style={styles.emptyList}>
                    <Text variant="semibold16">
                      {t('common.no_results_found')}
                    </Text>
                  </View>
                </>
              );
            return null;
          }}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => {
                if (query.length) dispatch(search(query, 0));
              }}
              colors={['red']}
            />
          }
          keyExtractor={item => item._id}
          scrollEnabled
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.6}
          onEndReached={expandList}
        />
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tags: {
    marginHorizontal: PADDING,
    paddingVertical: PADDING,
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    marginVertical: 5,
    paddingVertical: 5,
  },
  emptyList: {
    paddingHorizontal: PADDING,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    height: IMAGE_HEIGHT,
    padding: 0,
    marginVertical: 10,
  },
  container: {
    overflow: 'hidden',
    borderTopLeftRadius: BORDER_RADIUS.small,
    borderBottomLeftRadius: BORDER_RADIUS.small,
  },
  name: {
    flex: 1,
    paddingHorizontal: 10,
    alignItems: 'flex-start',
  },
  tagline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  subtext: {
    paddingVertical: 10,
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
  },
});

export default Search;
