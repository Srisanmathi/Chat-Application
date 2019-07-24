import React, { Component } from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import NewMessage from './components/NewMessage';
import Inbox from './components/Inbox';
import Chat from './components/Chat';
import Firebase from './components/Firebase';

//Using 'react-navigation'for routing
//createStackNavigator returns a react component
const RootStack = createStackNavigator(

  //route configuration object
  {
    
    NewMessage:NewMessage,
    Inbox: Inbox,
    Chat: Chat
    
  },
  {
    initialRouteName: "Inbox"
  }

);

const AppContainer = createAppContainer(RootStack);

export default class App extends Component {

  componentWillMount(){
    Firebase.init();
  }  
  
  render() {
    return <AppContainer />;
  }
}  