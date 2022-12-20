import React from "react";

import { View, Text } from "react-native";
import { styles } from "../temas/base";

export class ModelValores extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <View style={styles.colunaModel}>
                <View style={styles.linhaModel}>
                    <Text style={styles.modelValoresText}>
                        {this.props.items.titulo}
                    </Text>
                </View>
                <View style={styles.linhaModel}>
                    <Text style={styles.modelValoresText}>
                        {this.props.items.value}
                    </Text>
                </View>
            </View>
        );
    }
}