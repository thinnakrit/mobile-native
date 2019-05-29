import api from './api.service';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import i18n from './i18n.service';

/**
 * Minds Service
 */
class MindsService {
  settings;

  /**
   * Get settings
   */
  async getSettings() {
    let settings;
    if (!this.settings) {
      try {
        settings = await api.get('api/v1/minds/config');
        AsyncStorage.setItem('@MindsSettings', JSON.stringify(settings));
      } catch (err) {
        try {
          settings = JSON.parse(await AsyncStorage.getItem('@MindsSettings'));
        } catch {
          settings = null;
        }
      }

      if (settings) {
        this.settings = settings;
      } else {
        return await new Promise(resolve => {
          Alert.alert(
            i18n.t('error'),
            i18n.t('mindsSettings.error'),
            [
              { text: i18n.t('retry'), onPress: async () => resolve(await this.getSettings()) }
            ]
          );
        });
      }
    }

    return this.settings;
  }

  /**
   * clear
   */
  clear() {
    this.settings = undefined;
    AsyncStorage.removeItem('@MindsSettings');
  }
}

export default new MindsService();
