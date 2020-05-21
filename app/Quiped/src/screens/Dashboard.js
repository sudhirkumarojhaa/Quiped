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
import moment from 'moment'
import {styles, color} from '../design/style';
import Loader from '../components/Loader';
import {config} from '../assets/config';

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const Dashboard = (navigation) => {
  const [data, setData] = useState([]);
  const [occupiedUser, setOccupiedUser] = useState([]);
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
    let flag = data.some((items) => items.occupant === navigation.route.params.userDetails.user.name);
    const arr = data.map((items) => {
      if (!flag && items.id === id && items.occupant === "") {
        items.status = !items.status;
        items.occupant = navigation.route.params.userDetails.user.name;
        items.enabled = true;
        items.timestamp = moment().unix()
        const occupy = {
          RoomId: items.id,
          User: navigation.route.params.userDetails.user.name,
        };
        firebase.database().ref("Occupy").push(occupy);
      } else if (flag && items.id === id && items.occupant === navigation.route.params.userDetails.user.name) {
         items.status = !items.status;
         items.occupant = "";
         items.timestamp = null
         for (const property in occupiedUser){
          if(occupiedUser[property].User === navigation.route.params.userDetails.user.name){
            firebase.database().ref().child("Occupy/"+property).remove()
          }
        }
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
      firebase
      .database()
      .ref("Occupy/")
      .on("value", function (snapshot) {
        setOccupiedUser(snapshot.val());
        setLoading(false)
    });
    
  };

  const remainingTime = (timestamp) => {
    const a = moment(moment(moment.unix(timestamp).toLocaleString()).add(60,'m').toLocaleString())
    const b = moment.unix(moment().unix()).toLocaleString()
    return a.diff(b,'minutes')
  }

  const renderItem = roomData => (
    <View style={[styles.row, styles.between]}>
      <View style={[styles.row, styles.center]}>
        <Text style={styles.text}>{roomData.item.name}</Text>
      </View>
      <View style={{flex:0,flexDirection:"row",alignItems:'center',}}> 
      {
       roomData.item.status ? 
        <Text style={styles.text}>{`${remainingTime(roomData.item.timestamp)}  mins left`}</Text>
      :
        null
     }
     {
      roomData.item.occupant !== "" ? 
        <View style={[styles.row, styles.center]}>
          <Text style={styles.text}>{roomData.item.occupant}</Text>
        </View> 
      : 
        null
     } 

     

     {roomData.item.status ?
        <TouchableOpacity
          style={[
            styles.switch,
            {borderColor: roomData.item.status ? color.success : color.gray},    
            
          ]}
          onPress={() => sendData(roomData.item.id)}
        />
      :
      occupyUser.indexOf(navigation.route.params.userDetails.user.name) === -1 && roomData.item.enabled  ?
        <TouchableOpacity
          style={[
            styles.switch,
            {borderColor: roomData.item.status ? color.success : color.gray},    
            
          ]}
          onPress={() => sendData(roomData.item.id)}
        />
      :
          null
      }
      </View>
    </View>
  );
  const occupy = occupiedUser ? Array.from(Object.values(occupiedUser)) : ["Dummy User"]
  const occupyUser = occupy.map((item) => {
    return item.User
  })
  console.log(occupyUser)
  return (
    <SafeAreaView style={styles.container}>
      <Loader loading={loading} text="Updating status." />
      <Text style={styles.title}>Occupancy Status</Text>
      <View style={{flex:1,alignItems:'center'}}>
        <Image source={{uri:navigation.route.params.userDetails.user.photo}} style={styles.stretch}/>
      </View>
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
