import React from "react";

import { View, TouchableOpacity, Text } from "react-native";
import { styles } from "../temas/base";

import AntDesign from "react-native-vector-icons/AntDesign";

export class ModelProdutos extends React.PureComponent{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <View style={styles.linhaModelProduto}>
                <View style={styles.colunaModel}>
                    <Text style={styles.textModelProdutos}>{this.props.item.item.id_externo}</Text>
                </View>
                <View style={styles.colunaModelProduto}>
                    <View style={styles.linhaModel}><Text style={styles.textModelProdutos}>{this.props.item.item.descricao}</Text></View>
                    <View style={styles.linhaModel}><Text style={styles.textModelProdutos}>{this.props.item.item.codigo_barras}</Text></View>
                </View>
            </View>
        );
    }
}