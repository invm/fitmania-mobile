import React from 'react';
import { View, ViewStyle } from 'react-native';
import { colors } from './Theme';
const iconsPath = '../../assets/images/icons/';

interface IconsInterface {
  [key: string]: any;
}

const Icons: IconsInterface = {
  add: require(iconsPath + 'add.svg').default,
  basket: require(iconsPath + 'basket.svg').default,
  'arrow-back': require(iconsPath + 'arrow-back.svg').default,
  'arrow-forward': require(iconsPath + 'arrow-forward.svg').default,
  at: require(iconsPath + 'at.svg').default,
  bike: require(iconsPath + 'bike.svg').default,
  call: require(iconsPath + 'call.svg').default,
  'call-outline': require(iconsPath + 'call-outline.svg').default,
  'card-outline': require(iconsPath + 'card-outline.svg').default,
  'caret-down': require(iconsPath + 'caret-down.svg').default,
  'caret-up': require(iconsPath + 'caret-up.svg').default,
  chat: require(iconsPath + 'chat.svg').default,
  checkmark: require(iconsPath + 'checkmark.svg').default,
  'heart-outline': require(iconsPath + 'heart-outline.svg').default,
  'refresh-circle-outline': require(iconsPath + 'refresh-circle-outline.svg')
    .default,
  'chevron-up-outline': require(iconsPath + 'chevron-up-outline.svg').default,
  'chevron-back-outline': require(iconsPath + 'chevron-back-outline.svg')
    .default,
  'chevron-forward-outline': require(iconsPath + 'chevron-forward-outline.svg')
    .default,
  'chevron-down-outline': require(iconsPath + 'chevron-down-outline.svg')
    .default,
  clock: require(iconsPath + 'clock.svg').default,
  close: require(iconsPath + 'close.svg').default,
  'close-circle': require(iconsPath + 'close-circle.svg').default,
  'cog-outline': require(iconsPath + 'cog-outline.svg').default,
  'destination-marker': require(iconsPath + 'destination-marker.svg').default,
  ellipse: require(iconsPath + 'ellipse.svg').default,
  heart: require(iconsPath + 'heart.svg').default,
  locate: require(iconsPath + 'locate.svg').default,
  location: require(iconsPath + 'location.svg').default,
  'location-outline': require(iconsPath + 'location-outline.svg').default,
  logout: require(iconsPath + 'logout.svg').default,
  'menu-outline': require(iconsPath + 'menu-outline.svg').default,
  'restaurant-marker': require(iconsPath + 'restaurant-marker.svg').default,
  'send-outline': require(iconsPath + 'send-outline.svg').default,
  send: require(iconsPath + 'send.svg').default,
  'share-social-outline': require(iconsPath + 'share-social-outline.svg')
    .default,
  star: require(iconsPath + 'star.svg').default,
  'person-remove-outline': require(iconsPath + 'person-remove-outline.svg')
    .default,
  home: require(iconsPath + 'home.svg').default,
  user: require(iconsPath + 'user.svg').default,
  search: require(iconsPath + 'search.svg').default,
  trash: require(iconsPath + 'trash.svg').default,
  remove: require(iconsPath + 'remove.svg').default,
};

interface IconProps {
  name: string;
  color?: string;
  style?: ViewStyle;
  size?: number;
}

const Icon = ({ name, color, style, size }: IconProps) => {
  const AppIcon = Icons[name];

  return (
    <View {...{ style }}>
      <AppIcon
        fill={color || colors.black}
        width={size || 17}
        height={size || 17}
      />
    </View>
  );
};

export default Icon;
