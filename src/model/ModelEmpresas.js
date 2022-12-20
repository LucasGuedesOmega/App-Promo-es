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
                    <Text style={styles.activeText}><MaterialCommunityIcons size={25} style={styles.icons} name={'gas-station'} /></Text>
                </View>
                <View style={styles.colunaModelEmpresa}>
                    <Text style={styles.activeText}>{this.props.item.item.razao_social}</Text>
                </View>
                <View style={styles.colunaModelEmpresa}>
                    <TextInputMask type={"cnpj"} editable={false} style={styles.activeText} value={this.props.item.item.cnpj}/>
                </View>
            </TouchableOpacity>
        );
    }
}