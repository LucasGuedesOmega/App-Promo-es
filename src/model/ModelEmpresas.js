import React from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TextInputMask } from "react-native-masked-text";
import { View, TouchableOpacity, Text } from "react-native";
import { styles } from "../temas/base";

export class ModelEmpresas extends React.PureComponent{
    constructor(props){
        super(props);
    }

    render(){
       
        return(
            <TouchableOpacity style={styles.linhaModelEmpresa}>
                <View style={styles.colunaModelEmpresaIcone}>
                    <MaterialCommunityIcons name="gas-station" size={30} color={"rgb(100, 100, 100)"}/>
                </View>
                <View style={styles.colunaModelEmpresaInfo}>
                    <Text style={styles.textInfo}> {this.props.item.item.razao_social}</Text>
                    <TextInputMask type={"cnpj"} editable={false} style={styles.textInfo} value={this.props.item.item.cnpj}/>
                </View>
            </TouchableOpacity>
        );
    }
}