import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  Text,
} from 'react-native';

import {
  Container,
  Content,
  Button
} from 'native-base';

import {
  PRIMARY_FONT,
  PRIMARY_COLOR,
} from '../constants';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


export default class Home extends Component {
  static navigationOptions = { header: null }

  render() {
    return (
      <Container style={styles.container}>
        <Content>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/images/logo.png')} style={styles.logoImage}/>
            <View>
              <Text>
                Thank you for your feedback us!
              </Text>
              <Button
                block
                bordered
                style={{borderColor: PRIMARY_COLOR}}
                onPress={() => (this.props.navigation.navigate('Home'))}
              >
                <Text>
                  Back To Home Page
                </Text>
              </Button>
            </View>
          </View>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 30
  },
  logoContainer: {
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoImage: {
    width: 200,
    height: 100,
    alignSelf: 'center'
  },
})
