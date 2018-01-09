import React, { Component } from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Image,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Text,
  TextInput,
  Alert,
  Platform,
  Keyboard
} from 'react-native';

import {
  Container,
  Content,
  Button
} from 'native-base';

import { SegmentedControls } from 'react-native-radio-buttons'

import { Col, Row, Grid } from 'react-native-easy-grid';

import {
  PRIMARY_FONT,
  PRIMARY_COLOR,
  BASE_URL,
  CATEGORIES
} from '../constants';

import Icon from 'react-native-vector-icons/FontAwesome';
import StarRating from 'react-native-star-rating';
import SplashScreen from 'react-native-splash-screen';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const topSize = Platform.select({
  ios: height/3,
  android: height/4 + 30,
});

export default class Home extends Component {

  static navigationOptions = { header: null }

  constructor(props) {
    super(props);
    this.state = {
      userType: '',
      starCount: 0,
      category: CATEGORIES[0],
      comments: '',
      isSubmitting: false,
    };
  }

  componentWillMount () {
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
  }

  componentWillUnmount () {
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidHide () {
    if(Platform.OS == 'ios'){
      this.scrollDown();
    }
  }

  componentDidMount() {
    setTimeout(()=>{
      SplashScreen.hide();
    }, 1000)
  }

  onStarRatingPress(rating) {
    this.setState({starCount: rating});
  }

  setUserTypeSelection(userType){
    this.setState({userType: userType})
  }

  setSelectedCategory(category){
    this.setState({ category: category })
  }

  setComments(comments){
    this.setState({ comments: comments })
  }

  changeColorIcon(userTypeSelected){
    const { userType } = this.state;
    if(userType == userTypeSelected){
      return PRIMARY_COLOR
    }else{
      return null
    }
  }

  isValidated(){
    const { userType, category, starCount } = this.state;
    if (userType == '') {
      Alert.alert(
        'Please select who you are.'
      )
      return false
    }

    if (starCount == 0) {
      Alert.alert(
        'Please select on the star button to rate our service.'
      )
      return false
    }

    if (category == '') {
      Alert.alert(
        'Please select which category you want to feedback.'
      )
      return false
    }
    return true;
  }

  handleSubmitted(){
    this.setState({isSubmitting: true}, ()=>{
      if (this.isValidated()) {
        const url = BASE_URL + '/feedbacks';
        const { userType, category, starCount, comments } = this.state;
        const feedback = {
          user_type: userType,
          category: category,
          rating: starCount,
          comments: comments
        };
        fetch(url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(feedback: feedback)
        })
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
            const { navigation } = this.props;
            navigation.navigate('ThankYou');
          } else {

            Alert.alert('Error')
          }
        })
        .catch((error) => {
          Alert.alert('Error')

          console.error(error);
        })
        .done(()=>{
            this.setState({isSubmitting: false})
        });
      }else{
        this.setState({isSubmitting: false})
      }
    })

  }

  scrollDown(){
    const { formView, scrollView } = this.refs;
    scrollView._root.scrollToPosition(0, this.state.formOffset);
  }

  handleFormLayout(event){
    const { height, width, x, y } = event.nativeEvent.layout
    this.setState({formHeight: height, formOffset: y})
  }

  render() {
    return (
      <Container style={styles.container}>
        <Content ref='scrollView'
          enableResetScrollToCoords={false}
        >

          <ImageBackground
              source={require('../assets/images/background.jpg')}
              style={styles.imagebackground}>
              <View style={styles.overlay}/>
              <View>
                <Text style={styles.title}>Mäd</Text>
                <Text style={styles.subtitle}>(Awesome) Service</Text>
              </View>
              <View style={styles.buttonScrollWrapper}>
                <Button
                  block
                  onPress={()=>this.scrollDown()}
                  style={styles.buttonScroll}
                >
                  <Image source={require('../assets/images/scroll-down.gif')} style={{width: 50, height: 50}}/>
                  <Text style={styles.buttonScrollText}>Click this to Scroll</Text>
                </Button>
              </View>
          </ImageBackground>
          { this.state.isSubmitting ? (
            <View style={{height: this.state.formHeight, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <ActivityIndicator size="large" color={PRIMARY_COLOR} />
              <Text>Loading ...</Text>
            </View>
            ) : (
              <View ref='formView' onLayout={this.handleFormLayout.bind(this)}>
                <View style={styles.logoContainer}>
                  <Image source={require('../assets/images/logo.png')} style={styles.logoImage}/>
                  <View>
                    <Text>
                      Tell us about your experience with our service
                    </Text>
                  </View>
                </View>
                <View style={styles.formContainer}>
                  <Text style={styles.formTitle}>Feedback Form</Text>
                  <Grid>
                    <Row>
                      <Col>
                        <TouchableOpacity onPress={()=>this.setUserTypeSelection('Client')}>
                          <View style={ styles.iconWrapper }>
                            <Icon name='user-circle' size={65} color={this.changeColorIcon('Client')} style={styles.iconSmall}/>
                            <Text style={[styles.iconTitle, {color: this.changeColorIcon('Client')}]}>I am a Client</Text>
                          </View>
                        </TouchableOpacity>
                      </Col>
                      <Col>
                        <TouchableOpacity onPress={()=>this.setUserTypeSelection('Employee')}>
                          <View style={ styles.iconWrapper }>
                            <Icon name='user-circle' size={65} color={this.changeColorIcon('Employee')} style={styles.iconSmall}/>
                            <Text style={[styles.iconTitle, {color: this.changeColorIcon('Employee')}]}>I am an Employee</Text>
                          </View>
                        </TouchableOpacity>
                      </Col>
                    </Row>
                  </Grid>
                  <View style={styles.itemWrapper}>
                    <Text style={styles.labelItem}>How do you rate our service?</Text>
                    <StarRating
                      disabled={false}
                      maxStars={5}
                      rating={this.state.starCount}
                      selectedStar={(rating) => this.onStarRatingPress(rating)}
                      starColor={PRIMARY_COLOR}
                    />
                  </View>
                  <View style={styles.itemWrapper}>
                    <Text style={styles.labelItem}>Choose Category</Text>
                    <SegmentedControls
                      tint={PRIMARY_COLOR}
                      selectedTint= {'white'}
                      backTint= {'white'}
                      options={ CATEGORIES }
                      allowFontScaling={ false }
                      onSelection={ this.setSelectedCategory.bind(this) }
                      selectedOption={ this.state.category }
                      optionStyle={{fontFamily: PRIMARY_FONT, fontSize: 11}}
                      optionContainerStyle={{flex: 1, justifyContent: 'space-around'}}
                    />
                  </View>

                  <View style={styles.itemWrapper}>
                    <TextInput
                      multiline={ true }
                      ref='comments'
                      placeholder='Any Other Suggestions?'
                      value={ this.state.comments }
                      style={ styles.commentsInput }
                      numberOfLines={4}
                      underlineColorAndroid='transparent'
                      onChangeText={ this.setComments.bind(this) }
                    />
                  </View>

                  <View style={styles.buttonWrapper}>
                    <Button
                      block
                      style={styles.button}
                      onPress={ this.handleSubmitted.bind(this) }
                    >
                      <Text style={styles.buttonText}>Submit</Text>
                    </Button>
                  </View>
                </View>
              </View>
            )
          }

        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#000',
    opacity: 0.5
  },
  imagebackground: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#bdbdbd',
    borderBottomWidth: 1,
  },
  logoImage: {
    width: 100,
    height: 50,
    alignSelf: 'center'
  },
  title: {
    fontFamily: PRIMARY_FONT,
    fontWeight: 'bold',
    fontSize: 60,
    color: '#fff',
    textAlign: 'center',
    paddingTop: 0,
    backgroundColor: 'transparent'
  },
  subtitle: {
    fontFamily: PRIMARY_FONT,
    fontWeight: 'bold',
    fontSize: 30,
    color: '#fff',
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  buttonScroll: {
    backgroundColor: 'transparent',
    alignSelf: 'flex-end',
    top: topSize
  },
  buttonScrollText: {
    padding: 10,
    color: '#fff',
    fontSize: 20,
    fontFamily: PRIMARY_FONT,
    textAlign: 'center'
  },
  formContainer: {
    paddingLeft: 10,
    paddingTop: 25,
    paddingRight: 20,
    paddingBottom: 10
  },
  formTitle: {
    textAlign: 'center',
    paddingBottom: 20,
    fontFamily: PRIMARY_FONT,
    fontWeight: 'bold',
    fontSize: 24,
  },
  iconWrapper: {
    width: width/2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconSmall: {
    position: 'relative',
  },
  iconTitle: {
    color: '#111',
    fontSize: 14,
    fontFamily: PRIMARY_FONT
  },
  itemWrapper: {
    paddingLeft: 20,
    paddingTop: 30,
    paddingRight: 20,
    paddingBottom: 10
  },
  labelItem: {
    color: '#111',
    fontSize: 16,
    fontFamily: PRIMARY_FONT,
    textAlign: 'center',
    paddingBottom: 10
  },
  buttonWrapper: {
    paddingLeft: 20,
    paddingTop: 30,
    paddingRight: 20,
    paddingBottom: 5
  },
  button: {
    backgroundColor: PRIMARY_COLOR
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: PRIMARY_FONT,
    textAlign: 'center'
  },
  commentsInput: {
    fontFamily: PRIMARY_FONT,
    height: 80,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    paddingLeft: 5,
    borderColor: PRIMARY_COLOR
  },
});
