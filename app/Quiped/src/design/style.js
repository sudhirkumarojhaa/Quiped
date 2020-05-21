import {StyleSheet} from 'react-native';

export const color = {
  brand: '#17a2b8',
  gray: '#e3e3e3',
  white: '#fff',
  success: '#82E871',
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  between: {
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: color.gray,
    padding: 10,
  },
  text: {
    fontSize: 20,
    padding: 10,
    color: color.brand,
    textTransform: 'capitalize',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10,
    textAlign: 'center',
    color: color.brand,
  },
  switch: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 10,
  },
  stretch: {
    width: 50,
    height: 50,
    borderRadius:50,
  },
  login: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 25,
  },
  small:{
    fontSize: 18,
    padding: 10,
    color: color.brand,
    textTransform: 'capitalize',
  }
});
