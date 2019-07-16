import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, Button } from 'react-native';
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

  const renderKids = kids => {
    if (kids.length === 0) return null;

    return kids.map(kid => {
      return (
        <View key={kid.id} style={styles.kidView}>
          <Text>
            name: {kid.firstName}
          </Text>
          <Text>
            groupId: {kid.childGroup.id}
          </Text>
          <Text>
            groupName: {kid.childGroup.name}
          </Text>
        </View>
      );
    });
  }

  useEffect(() => {
    fetchKids();
  }, []);

  return (
    <View>
      <Button
        title="fetch kids"
        onPress={fetchKids}
      />
      <ScrollView>
        {renderKids(kids)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  kidView: {
    padding: 5
  }
});

export default KidListScreen;