import React from "react";

import { NavigationContainer } from '@react-navigation/native';
import { Routes } from "./src/routes";
import AsyncStorage from "@react-native-async-storage/async-storage";

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