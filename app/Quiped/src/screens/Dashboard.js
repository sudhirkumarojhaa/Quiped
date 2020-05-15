/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCode,
} from '@react-native-community/google-signin';
import firebase from 'firebase';
import {styles, color} from '../design/style';
import Loader from '../components/Loader';
import {config} from '../assets/config';

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const Dashboard = (navigation) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const {route} = navigation
  console.log(navigation.route.params.userDetails.user.photo)
  console.log(navigation.navigation)
  useEffect(() => {
    readUserData();
  }, []);

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error) {
      console.error(error);
    }
  };


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
      <Image source={navigation.route.params.userDetails.user.photo} styles={{height:200,width:200}}/>
      <Button onPress={() => signOut() } title="Log Out"/>
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
