import React, { createRef } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { BORDER_RADIUS, colors, PADDING } from './Theme';
import ActionSheet from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Touchable from './Touchable';
import Text from './Text';
import { useTranslation } from 'react-i18next';
import { openImagePickerAsync } from '../utils/utils';
import Icon from 'react-native-vector-icons/Ionicons';
import BlurredImage from './BlurredImage';
export const ref = createRef<ActionSheet>();

interface ImageUploadProps {
  img: { uri: string | null | undefined; type?: string; name?: string };
  setImg: ({
    uri,
    type,
    name,
  }: {
    uri: string;
    type: string;
    name: string;
  }) => void;
}

const ImageUpload = ({ img: { uri }, setImg }: ImageUploadProps) => {
  const { bottom } = useSafeAreaInsets();
  const { t } = useTranslation();

  const open = () => ref.current?.setModalVisible(true);
  const close = () => ref.current?.hide();

  const handleImageUpdate = async (res: {
    uri: string;
    type: string;
    name: string;
  }) => {
    setImg(res);
    close();
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          {!!uri && <BlurredImage uri={uri} width={150} height={150} />}
        </View>

        <TouchableOpacity style={styles.addButton} onPress={open}>
          <Icon name="add-outline" size={15} color={colors.white} />
        </TouchableOpacity>
      </View>
      <ActionSheet
        containerStyle={{
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          paddingBottom: bottom,
        }}
        bounceOnOpen
        ref={ref}>
        <View style={styles.buttons}>
          <View style={styles.buttonContainer}>
            <Touchable
              style={styles.actionButton}
              onPress={async () => {
                let res = await openImagePickerAsync('OPEN_CAMERA');
                res && handleImageUpdate(res);
              }}>
              <Icon name="camera" color={colors.primary} size={30} />
              <Text variant="semibold16" color={colors.primary}>
                {t('components.image_upload.camera')}
              </Text>
            </Touchable>
          </View>
          <View style={styles.buttonContainer}>
            <Touchable
              style={styles.actionButton}
              onPress={async () => {
                let res = await openImagePickerAsync('OPEN_GALLERY');
                res && handleImageUpdate(res);
              }}>
              <Icon name="folder" color={colors.primary} size={30} />
              <Text variant="semibold16" color={colors.primary}>
                {t('components.image_upload.gallery')}
              </Text>
            </Touchable>
          </View>
        </View>
      </ActionSheet>
    </>
  );
};

export default ImageUpload;

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imageContainer: {
    width: 150,
    height: 150,
    backgroundColor: '#fafafa',
    overflow: 'hidden',
    borderRadius: 75,
  },
  actionButton: {
    padding: PADDING,
    borderRadius: BORDER_RADIUS.small,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.white,
    overflow: 'hidden',
    alignItems: 'center',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  buttons: {
    paddingVertical: PADDING,
    marginVertical: PADDING,
    flexDirection: 'row',
  },
  addButton: {
    height: 40,
    width: 40,
    backgroundColor: colors.primary,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 5,
    right: 5,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
