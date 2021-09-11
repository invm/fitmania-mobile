import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, colors } from '../../../components';
import IGroup from '../../../interfaces/Group';
import Icon from 'react-native-vector-icons/Ionicons';
import { sports } from '../../Home/components/SportFilters';
import SmallButton from '../../../components/SmallButton';
import { useNavigation } from '@react-navigation/native';

interface GroupListItemProps {
  group: IGroup;
}

const GroupListItem = ({ group }: GroupListItemProps) => {
  const navigation = useNavigation();
  return (
    <View>
      <Card>
        <View>
          <View style={styles.row}>
            <View style={[styles.row, { maxWidth: '80%' }]}>
              <Icon
                name={sports[group.sport]}
                color={colors.primary}
                size={25}
              />
              <Text variant="semibold20">{group.title}</Text>
            </View>
            <View style={styles.row}>
              <Text variant="semibold20">{group.users?.length}</Text>
              <Icon name={'people-outline'} color={colors.primary} size={25} />
            </View>
          </View>
          {!!group.description && <Text>{group.description}</Text>}
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <SmallButton
            title="Learn more"
            style={{ flex: 1, flexGrow: 0 }}
            onPress={() => {
              navigation.navigate('GroupDetails', { groupId: group._id });
            }}
          />
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default GroupListItem;
