import React from 'react';
import { Dimensions, StyleSheet, View, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import Dialog, { DialogContent, DialogFooter, DialogButton, ScaleAnimation } from 'react-native-popup-dialog';
import { iosColors } from '../util';

const SCREEN_WIDTH = Dimensions.get('window').width;

const Popup = props => {

  const renderContent = () => {
    switch (props.dialogType) {
      case 'submitNotification': {
        const getText = () => {
          if (props.submitWasSuccessful) {
            switch (props.actionType) {
              case 'add': return 'Lisäys onnistui!';
              case 'modify': return 'Tallennus onnistui!';
            }
          } else {
            switch (props.actionType) {
              case 'add': return 'Lisäys epäonnistui!';
              case 'modify': return 'Tallennus epäonnistui!';
              case 'delete': return 'Poisto epäonnistui!';
            } 
          }
        }

        return (
          <View>
            <Icon
              name={props.submitWasSuccessful ? 'check-circle' : 'exclamation-circle'}
              type='font-awesome'
              color={props.submitWasSuccessful ? iosColors.green : iosColors.red}
              size={60}
            />
            <Text style={styles.dialogText}>
              {getText()}
            </Text>
            {
              !props.submitWasSuccessful &&
              <Text style={styles.dialogText}>
                Yritä uudelleen.
              </Text>
            }
          </View>
        )
      }

      case 'deleteConfirmation': {
        return (
          <View>
            <Icon
              name='exclamation-triangle'
              type='font-awesome'
              color={iosColors.yellow}
              size={60}
            />
            <Text style={styles.dialogText}>
              Poistetaanko {props.item.firstName || props.item.name}?
            </Text>
          </View>
        );
      }

      case 'errorDescription': {
        return (
          <View>
            <Icon
              name='exclamation-circle'
              type='font-awesome'
              color={iosColors.red}
              size={60}
            />
            <Text style={styles.dialogText}>
              Siirrä ryhmän muksut muihin ryhmiin ennen poistamista.
            </Text>
          </View>
        );
      }
    }
  }

  const renderFooter = () => {
    switch (props.dialogType) {
      case 'submitNotification':
      case 'errorDescription' : {
        return (
          <DialogFooter>
            <DialogButton
              text="OK"
              onPress={props.handlePopupClose}
              textStyle={{color: iosColors.darkBlue, fontSize: 18}}
            />
          </DialogFooter>
        );
      }

      case 'deleteConfirmation': {
        return (
          <DialogFooter>
            <DialogButton
              text="Peruuta"
              onPress={props.handlePopupClose}
              textStyle={{color: iosColors.darkBlue, fontSize: 18}}
            />
            <DialogButton
              text="Poista"
              onPress={props.handlePopupConfirm}
              textStyle={{color: iosColors.red, fontSize: 18}}
            />
          </DialogFooter>
        );
      }
    }
  }

  return (
    <Dialog
      visible={props.visible}
      onTouchOutside={props.handleTouchOutside}
      dialogAnimation={new ScaleAnimation({ initialValue: 0, useNativeDriver: true })}
      footer={renderFooter()}
    >
      <DialogContent style={styles.dialogContent}>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  dialogContent: {
    paddingTop: 10,
    minWidth: SCREEN_WIDTH*0.65,
  },
  dialogText: {
    paddingTop:13,
    fontSize: 18,
    color: iosColors.black,
    textAlign: 'center'
  }
});

export default Popup;