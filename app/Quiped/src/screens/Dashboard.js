/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import firebase from 'firebase';
import {styles, color} from '../design/style';
import Loader from '../components/Loader';
import {config} from '../assets/config';

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    readUserData();
  }, []);

  const handleRefresh = () => {
    setRefresh(true);
    firebase
      .database()
      .ref('Rooms/')
      .on('value', function(snapshot) {
        setData(snapshot.val().data);
        setRefresh(false);
      });
  };

  const sendData = id => {
    const arr = data.map(items => {
      if (items.id === id) {
        items.status = !items.status;
      }
      return items;
    });
    setData(arr);
    firebase
      .database()
      .ref('Rooms/')
      .set({
        data,
      })
      .then(dataValue => {
        //success callback
        console.log('data ', dataValue);
      })
      .catch(error => {
        //error callback
        console.log('error ', error);
      });
  };

  const readUserData = () => {
    setLoading(true);
    firebase
      .database()
      .ref('Rooms/')
      .on('value', function(snapshot) {
        setData(snapshot.val().data);
        setLoading(false);
      });
  };

  const renderItem = roomData => (
    <View style={[styles.row, styles.between]}>
      <View style={[styles.row, styles.center]}>
        <Text style={styles.text}>{roomData.item.name}</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.switch,
          {borderColor: roomData.item.status ? color.success : color.gray},
        ]}
        onPress={() => sendData(roomData.item.id)}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Loader loading={loading} text="Updating status." />
      <Text style={styles.title}>Occupancy Status</Text>
      <FlatList
        keyExtractor={item => item.id.toString()}
        data={data}
        renderItem={item => renderItem(item)}
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={() => handleRefresh()}
          />
        }
      />
    </SafeAreaView>
  );
};

export default Dashboard;
