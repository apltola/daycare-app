import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import axios from 'axios';
import { apiRoot } from '../util';

const KidListScreen = () => {
  const [kids, setKids] = useState([]);

  const fetchKids = async () => {
    try {
      const res = await axios.get(`${apiRoot}/child/all`);
      const kids = res.data;
      console.log(kids);
      setKids(kids);
    } catch(err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchKids();
  }, []);

  return (
    <View>
      <Text>KID LIST SCREEN</Text>
      <Text>KID LIST SCREEN</Text>
      <Text>KID LIST SCREEN</Text>
      <Text>KID LIST SCREEN</Text>
      <Button
        title="fetch"
        onPress={fetchKids}
      />
    </View>
  );
}

const styles = StyleSheet.create({

});

export default KidListScreen;