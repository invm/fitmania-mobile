import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, PADDING, Text } from '../../../components';
import { IObject } from '../../../interfaces/Common';

interface PostsFiltersProps {
  sportsFilter: string[];
  handleSportPress: (sport: string) => void;
}

export const sports: IObject = {
  Running: 'walk-outline',
  Biking: 'bicycle-outline',
  Hiking: 'walk-outline',
  Soccer: 'football-outline',
  Basketball: 'basketball-outline',
  Rugby: 'american-football-outline',
  Tennis: 'tennisball-outline',
};

const PostsFilters = ({
  sportsFilter,
  handleSportPress,
}: PostsFiltersProps) => {
  return (
    <View style={styles.container}>
      {Object.keys(sports).map(sport => (
        <TouchableOpacity
          onPress={() => handleSportPress(sport)}
          style={styles.checkbox}>
          <View style={styles.iconContainer}>
            <Icon
              name={sports[sport]}
              size={30}
              color={
                sportsFilter.includes(sport) ? colors.primary : colors.darkGrey
              }
            />
          </View>
          <View>
            <Text
              variant="semibold16"
              color={
                sportsFilter.includes(sport) ? colors.primary : colors.darkGrey
              }>
              {sport}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default PostsFilters;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  iconContainer: { paddingHorizontal: PADDING / 3 },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: PADDING / 3,
  },
});
