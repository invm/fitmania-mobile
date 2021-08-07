import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import Text from './Text';
import Card from './Card';
import Input from './Input';
import { PADDING, colors, width } from './Theme';
import { setQuery, search } from '../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { CLEAR_SEARCH, SET_INPUT } from '../redux/types/search';
import { RootState } from '../redux';
export const assets = [require('../../assets/images/logo.png')];
import Icon from 'react-native-vector-icons/Ionicons';

let searchTimeout: any;

interface HeaderProps {
  icon?: string;
  action?: () => void;
  title?: string;
  logo?: boolean;
  canGoBack?: boolean;
  noShadow?: boolean;
  props?: any | any[];
  color?: 'white' | 'primary' | 'transparent';
  searchBar?: boolean;
  rightIcons?: {
    icon: string;
    action: () => void;
  }[];
}

export const HEADER_HEIGHT = 60;
const LOGO_WIDTH = 72;

const Header = ({
  title,
  canGoBack,
  action,
  icon,
  noShadow,
  color,
  searchBar,
  rightIcons,
}: HeaderProps) => {
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    search: { query },
  } = useSelector((state: typeof RootState) => state);

  const handleSearchQuery = (text: string) => {
    clearTimeout(searchTimeout);
    if (text.length) {
      dispatch(setQuery(text));
      dispatch({ type: SET_INPUT, payload: true });
      searchTimeout = setTimeout(() => {
        dispatch(search(text, 0));
      }, 500);
    } else handleClearQuery();
  };

  const handleClearQuery = () => {
    clearTimeout(searchTimeout);
    dispatch(setQuery(''));
    dispatch({ type: CLEAR_SEARCH, payload: [] });
  };

  let backgroundColor;

  switch (color) {
    case 'primary':
      backgroundColor = colors.primary;
      break;
    case 'transparent':
      backgroundColor = 'transparent';
      break;
    default:
      backgroundColor = colors.white;
      break;
  }

  return (
    <>
      <View
        style={[
          styles.container,
          {
            height: HEADER_HEIGHT + top,
            backgroundColor,
            paddingTop: top || 0,
          },
          noShadow ? {} : styles.shadow,
        ]}>
        {!searchBar ? (
          <>
            <View
              style={{
                height: HEADER_HEIGHT + top,
                justifyContent: 'center',
              }}>
              <View style={[styles.innerContainer]}>
                <View style={[styles.textContainer]}>
                  <View style={styles.innerTextContainer}>
                    {canGoBack && (
                      <TouchableOpacity
                        style={styles.backIconContainer}
                        onPress={() => {
                          action ? action() : navigation.goBack();
                        }}>
                        <Icon
                          name={icon || `arrow-back`}
                          size={25}
                          color={
                            color === 'primary' ? colors.white : colors.dark
                          }
                        />
                      </TouchableOpacity>
                    )}

                    <View>
                      <Text
                        variant="semibold22"
                        color={
                          color === 'primary' ? colors.white : colors.dark
                        }>
                        {title}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    {rightIcons?.map(icon => (
                      <TouchableOpacity
                        key={icon.icon}
                        style={styles.iconContainer}
                        onPress={icon.action}>
                        <Icon
                          name={icon.icon}
                          size={25}
                          style={{ marginStart: 10 }}
                          color={colors.black}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </>
        ) : (
          <View
            style={[
              styles.searchHeaderContainer,
              {
                height: HEADER_HEIGHT + top,
              },
            ]}>
            <Card style={styles.inputCard}>
              <Input
                placeholder={t('common.search')}
                onChangeText={handleSearchQuery}
                value={query}
                style={styles.queryInput}
              />
              <TouchableOpacity onPress={handleClearQuery}>
                <Icon
                  name={'close-circle'}
                  size={25}
                  style={{ marginStart: 10, height: 25 }}
                  color={colors.lightGrey}
                />
              </TouchableOpacity>
            </Card>
          </View>
        )}
      </View>
    </>
  );
};

export default Header;

const styles = StyleSheet.create({
  searchHeaderContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  textContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backIconContainer: {
    paddingEnd: 15,
  },
  iconContainer: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  start: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },

  inputCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  queryInput: {
    height: 45,
    lineHeight: 24,
    fontSize: 18,
    paddingVertical: 0,
    flex: 1,
  },
  img: {
    width: LOGO_WIDTH,
    height: 27,
    aspectRatio: LOGO_WIDTH / 27,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: PADDING,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {
    width: width,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  shadow: {
    shadowColor: colors.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 15,
  },
});
