import React from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { View, Image, TouchableOpacity, Text } from "react-native";
import { styles } from "../temas/base";

export class ModelPostos extends React.PureComponent{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <View style={styles.viewButtons}>
                <TouchableOpacity style={styles.btPostos}><Text style={styles.btTextPostos} ><MaterialCommunityIcons size={30} style={styles.icons} name={'gas-station'} /> {this.props.items.razao_social} </Text></TouchableOpacity>
            </View>
        );
    }
}