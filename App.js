import React from "react";

import { NavigationContainer } from '@react-navigation/native';
import { Routes } from "./src/routes";
import SyncStorage from 'sync-storage';

export default class App extends React.Component{
  _isMounted = false;
  constructor(props){
    super(props);
    this.state = {

    }
  }

  render(){
    return(
      <NavigationContainer>
        <Routes/>
      </NavigationContainer>
    )
  }
}