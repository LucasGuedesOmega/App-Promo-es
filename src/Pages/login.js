import React from "react";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { View, Text, TextInput, TouchableOpacity, Alert} from "react-native";
import { styles } from "../temas/base";
import { getUniqueId } from 'react-native-device-info';
import moment from "moment";
export class Login extends React.Component {
    _isMounted = false;
    constructor(props){
        super(props);
        this.state = {
            username: null,
            senha: null,
            
            token: null,
            uniqueID: null
        }

        this.commit_form = this.commit_form.bind(this);
    }

    async get_unique_id(){
        await getUniqueId()
        .then((uniqueID)=>{
            this.setState({
                uniqueID: uniqueID
            })
            
        })
    }

    async componentDidMount(){
        await this.get_unique_id()

        this.get_historico()
    }   

    get_historico(){
        api.get(`/api/v1/historico-login?name_hardware=${this.state.uniqueID}`)
        .then((results)=>{
            if(results.data.length > 0){
                this.setState({
                    ultimoLogin: results.data
                }, (()=>{
                    if (this.compara_datas(results.data[0].data_ultimo_login)){
                        //
                    }
                }))
            }
        })
        .catch((error)=>{
            let count_error = this.state.contadorError;
            if(error.name === "AxiosError"){
                this.get_historico()
                count_error += 1
                this.setState({
                    contadorError: count_error
                })
                if (this.state.contadorError === 25){
                    Alert.alert("Atenção", "Sem conexão com a API.",
                    [
                        {
                            text: "OK",
                            onPress: ()=>{return;}
                        }
                    ]
                    )
                }
            }
        })
    }   

    compara_datas(data_ultimo_login){
        var hoje = new Date();
        var data_split = data_ultimo_login.split('/');
        var format_data = moment(data_split, "YYYY-MM-DD HH:mm:ss")
        var date = new Date(format_data)
        var somar_data = new Date(date.setMonth(date.getMonth() + 1))

        if (hoje < somar_data){
            return true;
        }

        return false;
    }

    async commit_form(){
        if (!this.state.username){
            alert("Digite um usuário");
            return;
        }
        if (!this.state.senha){
            alert("Digite uma senha")
            return;
        }

        await api.post('/api/v1/login', [{'username': this.state.username, 'senha': this.state.senha,'name_hardware': this.state.uniqueID, 'tipo': 'app'}])
        .then(async (results)=>{

            let token = results.data.token;
            
            await AsyncStorage.setItem("token", token)
            .then((token)=>{
                this.props.navigation.navigate('home')
            })

        })
        .catch((error)=>{
            
            if(error.response.data.Error === 'Parametros invalidos'){
                alert("Login inválido.")
            }else if(error.name === 'AxiosError'){
                alert("Sem conexão com a API.")
            }
        })  
    }

    render(){
        return (
            <View style={styles.content}>
                <View style={{flex: 1, justifyContent: 'flex-end', alignItems:'flex-start', paddingHorizontal: '5%'}}>
                    <Text style={styles.title} >Login</Text>
                </View>
                <View>
                    <TextInput style={styles.input} placeholder="Usuário"  autoCapitalize={"none"} placeholderTextColor={'rgb(180, 180, 180)'} onChangeText={(value)=>{this.setState({username: value})}} />
                </View>
                <View>
                    <TextInput secureTextEntry={true} style={styles.input} placeholder="Senha"  autoCapitalize={"none"} placeholderTextColor={'rgb(180, 180, 180)'} onChangeText={(value)=>{this.setState({senha: value})}} />
                </View>
                <View>
                    <TouchableOpacity style={styles.button} onPress={this.commit_form}>
                        <Text style={{color: 'white', textAlign: 'center', fontSize: 20}}>Entrar</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1}}></View>
            </View>
        );
    }
}