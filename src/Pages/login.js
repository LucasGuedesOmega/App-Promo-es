import React from "react";
import api from "../services/api";
import SyncStorage from 'sync-storage';

import { View, Text, TextInput, TouchableOpacity} from "react-native";
import { styles } from "../temas/base";



export class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            username: null,
            senha: null,
            
            token: null
        }

        this.commit_form = this.commit_form.bind(this);
    }

    componentDidMount(){
        let token = SyncStorage.get('token');

        if (token){
            api.post('/api/v1/login-token', {'token': token}, { headers: { Authorization: token}})
            .then((results)=>{
                this.props.navigation.navigate('home')
            })  
            .catch((error)=>{
                if (error.response.data.error === 'Signature verification failed'){
                    this.props.navigation.navigate('login')
                }else if(error.response.data.error === 'Token expirado'){
                    this.props.navigation.navigate('login')
                }  
            })
        } else {
            SyncStorage.init()
        }
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

        await api.post('/api/v1/login', [{'username': this.state.username, 'senha': this.state.senha, 'tipo': 'app'}])
        .then(async (results)=>{

            let token = results.data.token;
            
            SyncStorage.set("token", token)

            this.props.navigation.navigate('home')
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