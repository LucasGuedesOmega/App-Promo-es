import React from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import { View, TouchableOpacity, Text } from "react-native";
import { styles } from "../temas/base";

export class ModelButtons extends React.PureComponent{
    constructor(props){
        super(props);
    }

    render(){
        let icones = `${this.props.items.icon}`
        return(
            <View style={styles.viewButtons}>
                <TouchableOpacity style={styles.btAcoes}><Text><AntDesign size={20} style={styles.icons} name={icones} /></Text></TouchableOpacity>
            </View>
        );
    }
}