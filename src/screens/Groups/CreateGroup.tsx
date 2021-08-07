import React, { useState } from 'react';
import { HomeRoutes, StackNavigationProps } from '../../navigation';
import { createGroup, resetGroups } from '../../redux/actions/groups';
import { showMessage } from '../../utils/utils';
import { useDispatch } from 'react-redux';
import { ActivityIndicator, View } from 'react-native';
import { Button, colors, Input, Text } from '../../components';
import DropDownPicker, { ValueType } from 'react-native-dropdown-picker';
import { useTranslation } from 'react-i18next';

const CreateGroup = ({
  navigation,
}: StackNavigationProps<HomeRoutes, 'CreateGroup'>) => {
  const [state, setState] = useState({
    title: '',
    sport: '',
  });
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [sportOpen, setSportOpen] = useState(false);
  const [sport, setSport] = useState<ValueType | ValueType[] | null>('Running');
  const [sportItems, setSportItems] = useState([
    { label: 'Running', value: 'Running' },
    { label: 'Biking', value: 'Biking' },
    { label: 'Soccer', value: 'Soccer' },
    { label: 'Basketball', value: 'Basketball' },
    { label: 'Rugby', value: 'Rugby' },
    { label: 'Hiking', value: 'Hiking' },
    { label: 'Tennis', value: 'Tennis' },
  ]);

  const handleCreateGroup = async () => {
    if (state.title.length > 0 && sport) {
      setLoading(true);
      await createGroup(state);
      setLoading(false);
      dispatch(resetGroups());
      navigation.navigate('Groups');
    } else {
      // TODO: move texts into i18n
      showMessage('error', 'Please select a sport and give the group a title');
    }
  };

  // TODO: move text into i18n

  return (
    <View>
      <View style={{ paddingTop: 20 }}>
        <View>
          <View>
            {loading && <ActivityIndicator size="large" />}
            <Input
              value={state.title}
              onChangeText={e => setState(s => ({ ...s, title: e }))}
            />
            <View>
              <Text variant="semibold16" color={colors.darkGrey}>
                {t('create_event.sport')}
              </Text>
              <DropDownPicker
                open={sportOpen}
                value={sport}
                items={sportItems}
                setOpen={setSportOpen}
                setValue={setSport}
                setItems={setSportItems}
                modalProps={{
                  animationType: 'slide',
                }}
                showArrowIcon
                listMode="MODAL"
              />
            </View>
          </View>
        </View>
        <Button disabled={loading} onPress={handleCreateGroup}>
          <Text>Create Group</Text>
        </Button>
      </View>
    </View>
  );
};

export default CreateGroup;
