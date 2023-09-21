import React from "react";
import { View, TouchableOpacity, Text, ToastAndroid, ActivityIndicator } from "react-native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";

import { styles } from "../temas/base";

import api from "../services/api";
import jwtDecode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";

export class Cabecalho extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            activeIndexValores: 0,
            valor_cashback: 0.00,
            token: null,
            tokenDecode: null
        }
    }

    async componentDidMount(){
        await AsyncStorage.getItem('token')
        .then((token)=>{
            this.setState({
                tokenDecode: jwtDecode(token),
                token: token
            })
        })

        await this.get_valor_cashback();
    }

    async get_valor_cashback(){
        let cashback = 0;
        await api.get(`/api/v1/vendas?id_usuario=${this.state.tokenDecode.id_usuario}&tipo_desconto=CASHBACK&status_venda=CONCLUIDA`, {headers: { Authorization : this.state.token}})
        .then((results)=>{
            for(let i = 0; i < results.data.length ; i ++){
                cashback += results.data[i].desconto
            }
            this.setState({
                valor_cashback: cashback
            })
        })
        .catch(async (error)=>{
            if(error.response.data.erros[0] === 'Sem conexao com a api ou falta fazer login.'){
                this.props.navigation.navigate('login')
                await AsyncStorage.removeItem('token')
                return;
            }else if (error.response.data.error === 'Signature verification failed'){
                this.props.navigation.navigate('login')
                await AsyncStorage.removeItem('token')
                return;
            }else if(error.response.data.error === 'Token expirado'){
                this.props.navigation.navigate('login')
                await AsyncStorage.removeItem('token')
                return;
            }else if(error.response.data.error === 'Token expirado'){
                this.props.navigation.navigate('login')
                await AsyncStorage.removeItem('token')
                return;
            }
        })
    }

    render(){
        return (
            <View style={styles.cabecalho}>
                <View style={styles.cabecalhoSection}>
                    <View style={styles.colunaModel}>
                        <View style={styles.linhaModel}>
                            <Text style={styles.modelValoresText}>
                                Cashback
                            </Text>
                        </View>
                        <View style={styles.linhaModel}>
                            <Text style={styles.modelValoresText}>
                                R$ {this.state.valor_cashback}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.cabecalhoSection2}>
                    <TouchableOpacity style={styles.buttonCart}>
                        <Text><FontAwesome style={styles.icons} name="shopping-cart" size={30} color={30}/></Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonAlert}>
                        <Text><Ionicons style={styles.icons} name="notifications" size={30} color={30}/></Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonUser}>
                        <Text><FontAwesome name="user" size={30} color={30}/></Text>
                    </TouchableOpacity>
                </View>

            </View>
        );

    }
}

export class ToggleButton extends React.Component{
    constructor(props){
        super(props);
        this.onClickButton = this.onClickButton.bind(this);
    }

    onClickButton(){
        if (this.props.disabled){
            ToastAndroid.show("Flag de resgate selecionada.", ToastAndroid.SHORT);
            return;
        }
        this.props.onPress?.();
    }
    
    render(){
        return(
            <TouchableOpacity style={this.props.selected ? styles.activeButtonSelected : styles.buttonNotSelected} onPress={this.onClickButton}>
                <Text style={this.props.selected ? styles.activeText : styles.notActiveText}>{`${this.props.text}`}</Text>
            </TouchableOpacity>
        )
    }
}

export class Loading extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <View style={styles.viewLoading}>
                <ActivityIndicator size="large" style={styles.loading} />
            </View>
        )
    }
}
