import React from 'react';
import { Text } from 'react-native';
import { Icon } from 'react-native-elements';
import Dialog, { DialogContent, DialogFooter, DialogButton, ScaleAnimation } from 'react-native-popup-dialog';
import { iosColors } from '../util';

const Popup = props => {
  return (
    <Dialog
      visible={props.visible}
      onTouchOutside={props.handleTouchOutside}
      dialogAnimation={new ScaleAnimation({ initialValue: 0, useNativeDriver: true })}
      footer={
        <DialogFooter>
          <DialogButton
            text="OK"
            onPress={props.handlePopupClose}
            textStyle={{color: iosColors.darkBlue, fontSize: 18}}
          />
        </DialogFooter>
      }
    >
      <DialogContent style={{paddingTop: 10}}>
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
      </DialogContent>
    </Dialog>
  );
}

export default Popup;