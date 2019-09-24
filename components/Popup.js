import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import Dialog, { DialogContent, DialogFooter, DialogButton, ScaleAnimation } from 'react-native-popup-dialog';
import { iosColors } from '../util';

const Popup = props => {

  const renderContent = () => {
    switch (props.dialogType) {
      case 'submitNotification': {
        return (
          <View>
            <Icon
              name={props.submitWasSuccessful ? 'check-circle' : 'exclamation-circle'}
              type='font-awesome'
              color={props.submitWasSuccessful ? iosColors.green : iosColors.red}
              size={60}
            />
            <Text style={{paddingTop:13, fontSize: 18, color: iosColors.black, textAlign: 'center'}}>
              {props.submitWasSuccessful ? 'Tallentaminen onnistui' : 'Tallentaminen epäonnistui!'}
            </Text>
            {
              !props.submitWasSuccessful &&
              <Text style={{paddingTop:13, fontSize: 18, color: iosColors.black, textAlign: 'center'}}>
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
              name='exclamation-circle'
              type='font-awesome'
              color={iosColors.red}
              size={60}
            />
          </View>
        );
      }
    }
  }

  const renderFooter = () => {

    switch (props.dialogType) {
      case 'submitNotification': {
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
              onPress={props.handlePopupClose}
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
      <DialogContent style={{paddingTop: 10}}>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  
});

export default Popup;