//@ts-nocheck
import React, { PureComponent } from 'react';

import { Text, View } from 'react-native';

import i18n from '../../../common/services/i18n.service';

/**
 * Remind Notification Component
 */
export default class RemindView extends PureComponent {
  /**
   * Navigate to activity
   */
  navToActivity = () => {
    this.props.navigation.push('Activity', {
      entity: this.props.entity.entityObj,
      hydrate: true,
    });
  };

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    const body = this.getBody(entity);

    return <View style={styles.bodyContents}>{body}</View>;
  }

  /**
   * Get body based in entity.entityObj.type
   * @param {object} entity
   */
  getBody(entity) {
    const styles = this.props.styles;
    const entityTitle = entity.entityObj.title;
    let title;

    switch (entity.entityObj.type) {
      case 'activity':
        title = entityTitle ? entityTitle : i18n.t('notification.yourActivity');
        return (
          <Text onPress={this.navToActivity} style={styles.link}>
            {i18n.t('notification.remind', {
              name: entity.fromObj.name,
              title,
            })}
          </Text>
        );

      case 'object':
        title = entityTitle
          ? entityTitle
          : i18n.t('your') +
            ' ' +
            i18n.t('subtype.' + entity.entityObj.subtype);
        return (
          <Text onPress={this.navToActivity} style={styles.link}>
            {i18n.t('notification.remind', {
              name: entity.fromObj.name,
              title,
            })}
          </Text>
        );

      default:
        return <Text>... oops.</Text>;
    }
  }
}
