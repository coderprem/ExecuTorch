import { PermissionsAndroid, Platform } from 'react-native';
import {
  launchImageLibrary,
  type ImageLibraryOptions,
} from 'react-native-image-picker';

/** Downscales on native side before base64 / file read — keeps profile image API payloads small. */
const PROFILE_GALLERY_PICK_DEFAULTS: ImageLibraryOptions = {
  mediaType: 'photo',
  selectionLimit: 1,
  includeBase64: true,
  maxWidth: 512,
  maxHeight: 512,
  quality: 0.7,
};

export enum AppPermission {
  GALLERY = 'GALLERY',
  CAMERA = 'CAMERA',
  MICROPHONE = 'MICROPHONE',
}

export const requestPermission = async (
  permission: AppPermission
): Promise<boolean> => {
  if (Platform.OS !== 'android') return true;

  switch (permission) {
    case AppPermission.GALLERY: {
      const androidPermission =
        Platform.Version >= 33
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

      const granted = await PermissionsAndroid.request(androidPermission);

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }

    case AppPermission.CAMERA: {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }

    case AppPermission.MICROPHONE: {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }

    default:
      return false;
  }
};


export const pickImageFromGallery = async (
  overrides?: Partial<ImageLibraryOptions>,
) => {
  const result = await launchImageLibrary({
    ...PROFILE_GALLERY_PICK_DEFAULTS,
    ...overrides,
  });

  if (result.didCancel || result.errorCode) {
    return null;
  }

  return result.assets?.[0] || null;
};