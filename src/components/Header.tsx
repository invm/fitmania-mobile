import React from 'react';
import {
  I18nManager,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import Text from './Text';
import Card from './Card';
import Input from './Input';
import { CONTENT_WIDTH, PADDING, colors, width } from './Theme';
import { setQuery, searchBusinesses } from '../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { CLEAR_SEARCH, SET_INPUT } from '../redux/types/search';
import { RootState } from '../redux';
export const assets = [require('../../assets/images/logo.png')];
import Icon from './Icon';

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
  subtitle?: string;
  searchBar?: boolean;
}

export const HEADER_HEIGHT = 60;
const LOGO_WIDTH = 72;

const Header = ({
  title,
  canGoBack,
  action,
  icon,
  noShadow,
  logo,
  color,
  subtitle,
  searchBar,
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
        dispatch(searchBusinesses(text, 0));
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
            height: subtitle ? HEADER_HEIGHT + 20 + top : HEADER_HEIGHT + top,
            backgroundColor,
            paddingTop: top || 0,
          },
          noShadow ? {} : styles.shadow,
        ]}>
        {!searchBar ? (
          <>
            <View
              style={{
                height: subtitle
                  ? HEADER_HEIGHT + 20 + top
                  : HEADER_HEIGHT + top,
                justifyContent: 'center',
              }}>
              <View
                style={[
                  styles.innerContainer,
                  {
                    // paddingTop: top ? top / 1.8 : 0,
                  },
                ]}>
                <View style={styles.textContainer}>
                  <View style={styles.innerTextContainer}>
                    {canGoBack && (
                      <TouchableOpacity
                        style={styles.backIconContainer}
                        onPress={() => {
                          action ? action() : navigation.goBack();
                        }}>
                        <Icon
                          name={
                            icon ||
                            `arrow-${I18nManager.isRTL ? 'forward' : 'back'}`
                          }
                          color={
                            color === 'primary' ? colors.white : colors.dark
                          }
                        />
                      </TouchableOpacity>
                    )}

                    <View>
                      <Text
                        variant="headerTitle"
                        color={
                          color === 'primary' ? colors.white : colors.dark
                        }>
                        {title}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      width: CONTENT_WIDTH,
                      flexDirection: 'row-reverse',
                      justifyContent: 'space-between',
                    }}>
                    {!!logo && (
                      <View>
                        <Image style={styles.img} source={assets[0]} />
                      </View>
                    )}
                  </View>
                </View>
              </View>
              {!!subtitle && (
                <View style={styles.subtitleContainer}>
                  <View style={{ width: 40 }} />
                  <Text>{subtitle}</Text>
                </View>
              )}
            </View>
          </>
        ) : (
          <View
            style={[
              styles.searchHeaderContainer,
              {
                // height: HEADER_HEIGHT + top,
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
                  size={20}
                  style={{ marginStart: 10, height: 20 }}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backIconContainer: {
    paddingEnd: 15,
    paddingTop: 5,
  },
  innerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subtitleContainer: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
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
    height: 45,
    width: '100%',
  },
  queryInput: {
    height: 45,
    lineHeight: 24,
    fontSize: 18,
    borderBottomWidth: 0,
    paddingVertical: 0,
  },
  img: {
    width: LOGO_WIDTH,
    height: 27,
    aspectRatio: LOGO_WIDTH / 27,
  },
  innerContainer: {
    width: CONTENT_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {
    width: width,
    paddingHorizontal: PADDING,
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
