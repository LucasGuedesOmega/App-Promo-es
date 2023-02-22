import React from "react";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";

import { View } from 'react-native';

export class Resgate extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        
        };
    }

    async componentDidMount(){

    }

    render(){
        return (
            <View></View>
        );
    }
}