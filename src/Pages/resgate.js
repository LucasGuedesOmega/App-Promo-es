import React from "react";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";

import Ionicons from "react-native-vector-icons/Ionicons";
import { View, TextInput } from 'react-native';
import { styles } from "../temas/base";
import { Cabecalho } from "../components";

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
            <View style={styles.content}>
                <Cabecalho/>
                <View style={styles.corpo}>

                </View>
            </View>
        );
    }
}