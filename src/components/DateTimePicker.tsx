import ActionSheet from 'react-native-actions-sheet';
import React, { RefObject } from 'react';
import DatePicker from 'react-native-date-picker';
import { colors } from './Theme';
import { I18nManager, TouchableOpacity, View, StyleSheet } from 'react-native';
import Text from './Text';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import i18n from '../i18n';

// datepicker https://github.com/henninghall/react-native-date-picker
// action sheet https://www.npmjs.com/package/react-native-actions-sheet

interface DateTimePickerProps {
  setDate: (date: Date) => void;
  date: Date;
  label: string;
  actionSheetRef: RefObject<ActionSheet>; // refs are forwarded from parent component in case more than one action sheet is needed on a screen
}

const DateTimePicker = ({
  date,
  setDate,
  label,
  actionSheetRef,
}: DateTimePickerProps) => {
  return (
    <View
      style={{
        justifyContent: 'center',
      }}>
      <TouchableOpacity
        onPress={() => {
          actionSheetRef.current?.setModalVisible();
        }}>
        <Text variant="medium16" color={colors.primary}>
          {label}
        </Text>
      </TouchableOpacity>
      <ActionSheet
        containerStyle={{ backgroundColor: colors.white }}
        ref={actionSheetRef}>
        <View style={styles.pickerContainer}>
          <View style={styles.picker}>
            <DatePicker
              date={date}
              locale={i18n.language}
              is24hourSource="device"
              minuteInterval={10}
              onDateChange={setDate}
              fadeToColor={'none'}
              textColor={colors.black}
              minimumDate={new Date()}
              maximumDate={new Date(moment().add(365, 'days').format())}
            />
          </View>

          <View style={styles.iconContainer}>
            <TouchableOpacity
              onPress={() => actionSheetRef.current?.setModalVisible(false)}>
              <Icon
                name="checkmark-circle-outline"
                color={colors.white}
                size={50}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ActionSheet>
    </View>
  );
};

export default DateTimePicker;

const styles = StyleSheet.create({
  iconContainer: {
    width: '20%',
    alignItems: 'center',
  },
  picker: { width: '80%' },
  pickerContainer: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    width: '100%',
  },
});
