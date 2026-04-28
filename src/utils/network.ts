import NetInfo from '@react-native-community/netinfo';
import { log } from '../utils/logger';

let isConnected = true;

export const initNetworkListener = () => {
  NetInfo.addEventListener((state) => {

    const nowConnected =
      state.isConnected === true &&
      state.isInternetReachable !== false;

    isConnected = nowConnected;
  });
};

export const getNetworkType = async () => {
  try {
    const networkState = await NetInfo.fetch();

    if (!networkState.isConnected) {
      return 'NONE';
    }

    switch (networkState.type) {
      case 'wifi':
        return 'Wifi';

      case 'cellular':
        const gen = networkState.details.cellularGeneration;
        switch (gen) {
          case '2g':
            return 'Mobile Data EDGE 2G';
          case '3g':
            return 'Mobile Data 3G';
          case '4g':
            return 'Mobile Data 4G';
          case '5g':
            return 'Mobile Data 5G';
          default:
            return 'Mobile Data';
        }

      default:
        return 'noNetwork';
    }
  } catch (error) {
    log('Error getting network type:', error);
    return 'noNetwork';
  }
};

export const isInternetAvailable = () => isConnected;