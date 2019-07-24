import React, { Component } from 'react';
import { GiftedChat } from 'react-native-gifted-chat'
import Firebase from './Firebase';
import Counter from './util/Counter';
import { Text } from 'react-native';

//To ignore the yellow box warning which pops up on the screen
import { YellowBox } from 'react-native';
import _ from 'lodash';

YellowBox.ignoreWarnings(['Setting a timer', 
'Warning: componentWillMount is deprecated',
'Warning: componentWillReceiveProps is deprecated',
'Module RCTImageLoader requires',]);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

class Title extends React.Component {
  render() {
    return (
      <Text style ={{color:'white',fontWeight:'bold',fontSize:20}}>{conv_name}</Text>
    );
  }
}

export default class Chat extends Component {

  constructor(props) {
    super(props);
    this.state = {
      messages: [],                   //comes with giftedChat package
      userid: 'mPt8LR6r25W8kXBTLUDDLBcxmOx1'
    }
    conv_name = this.props.navigation.getParam('conv_name', 'no-name');
  }
  //for header
  static navigationOptions = {
    headerTitle: <Title />,
    // title: conv_name,
    headerStyle: {
      backgroundColor: '#00bfff',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };

  componentDidMount() {
    //Firebase.init();
    
    conv_id = this.props.navigation.getParam('conv_id', 'no-id');
    
    obj = {};
    ref =  Firebase.database.ref('Inboxes/inb_messages/' + conv_id);
    listener = ref.on('value',
      (data) => {
        this.setState({
          messages: []
        });
        let val = data.val();    //data.val() is an array of objects
        var keys = Object.keys(val);
        keys.forEach((key) => {

          //In gifted chat, it seems if _id field in user is 1, then it displays it as own message(Blue). For all others, it displays 
          //as gray
          if (this.state.userid == val[key].user) {
            id = 1
          }
          else {
            id = val[key].user
          }
          let obj = {
            _id: key,
            text: val[key].text,
            createdAt: new Date(val[key].time_sent),
            user: {
              _id: id,
              name: '',
              avatar: '',
            }
          }
          this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, obj),
          }))
        })
      }, (err) => {
        console.log("error", err);
      });
  }



  async onSend(messages = []) {
    let count = await Counter(conv_id);
    let date = Date.now();
    
    //updating inb_messages
    ref.child(count).set({
      text: messages[0].text,
      user: 'mPt8LR6r25W8kXBTLUDDLBcxmOx1',
      time_sent: date
    })
      .catch(() => console.log("Error in sending data"));

    //updating inbox
    Firebase.database.ref('Inboxes/inbox/' + conv_id).update({
      last_message: messages[0].text,
      time_of_LM: date,
      num_messages: count + 1
    })

  }

  componentWillUnmount() {
    ref.off();
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        user={{
          _id: 1,
         // avatar: "https://placeimg.com/140/140/any",
        }}
      />
    )
  }
}