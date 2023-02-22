import React from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

import { Touchable, TouchableOpacity, View } from "react-native";
import { styles } from "../temas/base";
import { StyledTituloText, StyledButton, StyledButtonWhite } from "../components/styledComponents";

export class PaginaInicial extends React.Component {
    _isMounted = false;
    constructor(props){
        super(props);
        this.state = {
            token: null
        }
    }   

    async componentDidMount(){
        await this.verifica_token()
    }

    async verifica_token(){
        await AsyncStorage.getItem('token')
        .then((token)=>{
            this.setState({
                token: token
            })
        })
        
        await this.confere_token()
    }

    async confere_token(){
        let login = true;

        if (this.state.token){
            await api.post(`api/v1/login-token`, { 'token' : this.state.token }, { headers: { Authorization: this.state.token}})
            .then(()=>{
                login = false;
            })
            .catch((error)=>{
                console.log(error.response, 'ola')
            })
        }

        if (login === false){
            this.props.navigation.navigate('home')
        }
    }

    onPressButonEntrar(){
        this.props.navigation.navigate('login')
    }
    onBtCadastrar(){
        this.props.navigation.navigate('cadastro_usuario')
    }
    render(){
        return (
            <View style={styles.content}>
                <View style={styles.headerPaginainicial}>
                    
                </View>
                <View style={styles.bodyPaginainicial}>
                    <View style={styles.headerBodyPaginaInicial}>
                        <StyledTituloText>Faça seu cadastro já!</StyledTituloText>
                    </View>
                    <View style={styles.bodyBodyPaginaInicial}>
                        <StyledButton onPress={()=>{this.onBtCadastrar()}}>Cadastrar</StyledButton>
                        <StyledButtonWhite onPress={()=>{this.onPressButonEntrar()}}>Entrar</StyledButtonWhite>
                    </View>
                </View>
            </View>
        );
    }
}