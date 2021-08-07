import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GroupListItem from './components/GroupListItem';
import { RootState } from '../../redux';
import { getGroups, resetGroups } from '../../redux/actions/groups';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {
  colors,
  FocusAwareStatusBar,
  Header,
  PADDING,
  Text,
} from '../../components';
import SportFilters from '../Home/components/SportFilters';
import { HomeRoutes, StackNavigationProps } from '../../navigation';
import Collapsible from 'react-native-collapsible';
import { useTranslation } from 'react-i18next';
import SmallButton from '../../components/SmallButton';

const Groups = ({ navigation }: StackNavigationProps<HomeRoutes, 'Groups'>) => {
  const { t } = useTranslation();
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [filtersCollapsed, setFiltersCollapsed] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const {
    user: { user },
    groups: { groups, groupsExhausted, groupsLoading },
  } = useSelector((state: typeof RootState) => state);

  const handleSportPress = (sport: string) => {
    if (selectedSports.includes(sport)) {
      setSelectedSports(selectedSports.filter(item => item !== sport));
    } else {
      setSelectedSports([...selectedSports, sport]);
    }
  };

  useEffect(() => {
    (async () => {
      if (selectedSports.length) {
        await dispatch(resetGroups());
        await dispatch(getGroups(selectedSports));
      } else {
        await dispatch(resetGroups());
        await dispatch(getGroups([]));
      }
    })();
    // eslint-disable-next-line
  }, [selectedSports, dispatch]);

  const expandList = () => {
    if (!groupsExhausted && !groupsLoading) dispatch(getGroups(selectedSports));
  };

  const toggleFilters = () => {
    setFiltersCollapsed(s => !s);
  };

  useEffect(() => {
    let index = Math.ceil(Math.random() * 3);
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <Header
          rightIcons={[
            { icon: 'options-outline', action: () => toggleFilters() },
          ]}
          title={t(`common.hello${index}`) + user.name}
        />
      ),
    });
  }, []);

  return (
    <>
      <View style={styles.container}>
        <FocusAwareStatusBar
          barStyle="dark-content"
          backgroundColor={colors.white}
        />
        <>
          <View style={{ marginBottom: PADDING }}>
            <SmallButton
              title="Create group"
              onPress={() => navigation.navigate('CreateGroup')}
            />
          </View>
          <Collapsible collapsed={filtersCollapsed}>
            <View>
              <Text align="center">Filter groups by sport</Text>
            </View>
            <SportFilters
              {...{ sportsFilter: selectedSports, handleSportPress }}
            />
          </Collapsible>
          <FlatList
            data={groups}
            keyExtractor={({ _id }) => _id}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={async () => {
                  setRefreshing(true);
                  dispatch(resetGroups());
                  dispatch(getGroups([]));
                  setRefreshing(false);
                }}
                colors={[colors.primary]}
              />
            }
            renderItem={({ item: group }) => (
              <GroupListItem {...{ group, user }} />
            )}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            onEndReached={expandList}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              <View style={{ height: 100, paddingTop: PADDING }}>
                {groupsLoading && !refreshing && (
                  <ActivityIndicator size="large" color={colors.primary} />
                )}
              </View>
            }
          />
        </>
        {groupsExhausted && !groupsLoading && (
          <View style={{ paddingHorizontal: PADDING }}>
            <Text variant="regular16">{t('home.no_more_posts')}</Text>
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eee',
    flex: 1,
    padding: PADDING,
  },

  loader: {
    padding: PADDING,
    justifyContent: 'center',
  },
});

export default Groups;
