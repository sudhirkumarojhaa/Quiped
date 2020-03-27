import React from 'react';
import {View, Modal, ActivityIndicator, StyleSheet, Text} from 'react-native';
import {color} from '../design/style';

const Loader = props => {
  const {loading, text} = props;
  return (
    <Modal
      transparent
      animationType="none"
      visible={loading}
      onRequestClose={() => {}}>
      <View style={styles.modalBackground}>
        <ActivityIndicator
          animating={loading}
          color={color.success}
          size="large"
        />
        <Text style={styles.text}>{text}</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 14,
    paddingTop: 25,
    fontWeight: 'bold',
    color: color.success,
  },
});

export default Loader;
