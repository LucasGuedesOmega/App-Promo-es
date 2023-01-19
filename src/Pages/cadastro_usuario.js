import React from "react";

import { View, ScrollView, TouchableOpacity, Alert } from "react-native";
import { styles } from "../temas/base";
import { CheckBoxStyled, StyledInput, StyledInputMasked, StyledInputPassword, StyledButton, StyledButtonCadastro, StyledText, StyledTextWhite, StyledButtonWhite } from "../components/styledComponents";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import jwtDecode from "jwt-decode";
import api from "../services/api";

const EMPRESA = 4;   
const GRUPO_EMPRESA = 1;

export class CadastrarUsuario extends React.Component {
    _isMounted = false;
    constructor(props){
        super(props);
        this.state = {
            token: null,
            tokenDecode: null,
            cpf: '10829658980',
            checkBoxValue: false,
            telefone: '41988509779',
            password: '2112',
            email: 'lucas.guedes@omegaautomacao.com',
            usuario: 'guedes',
            nome: 'Lucas Guidolin Guedes'
        }
    }
    componentDidMount(){
        if(this.props.route.params){
            this.setState({
                token: this.props.route.params.token,
                tokenDecode: jwtDecode(this.props.route.params.token)
            })

            this.get_user()
            this.get_cliente()
        }
    }

    get_user(){
        api.get(`api/v1/ususario?id_usuario=${this.state.tokenDecode.id_usuario}`, {headers : {Authorization: this.state.token}})
        .then((results)=>{
            if (results.data.length>0){
                this.setState({
                    usuario: results.data[0].username,
                    password: results.data[0].senha
                })
            }
        })
        .catch((error)=>{
            if (error.response.data.error === 'Signature verification failed'){
                this.props.navigation.navigate('login')
            }else if(error.response.data.error === 'Token expirado'){
                this.props.navigation.navigate('login')
            }else if(error.response.data.error === 'não autorizado'){
                this.props.navigation.navigate('login')
            }
        })
    }       

    get_cliente(){
        api.get(`api/v1/cliente?id_usuario=${this.state.tokenDecode.id_usuario}`, {headers: {Authorization: this.state.token}})
        .then((results)=>{
            if (results.data.length>0){
                this.setState({
                    cpf: results.data[0].cpf,
                    email: results.data[0].email,
                    nome: results.data[0].nome,
                    telefone: results.data[0].telefone
                })
            }
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    onChangeCpf(value){
        this.setState({
            cpf: value
        })
    }

    onChangeCheckBox(){
        if (this.state.checkBoxValue){
            this.setState({
                checkBoxValue: false
            })
        }else{
            this.setState({
                checkBoxValue: true
            })
        }
        console.log(this.state)
    }

    submitForm(){
        if (!this.state.nome){
            Alert.alert("Atenção", "Digite um Nome", 
                [
                    {
                        text: 'OK',
                        onPress: ()=>{return;}
                    }
                ]
            )
        }
        if (!this.state.cpf){
            Alert.alert("Atenção", "Digite um CPF", 
                [
                    {
                        text: 'OK',
                        onPress: ()=>{return;}
                    }
                ]
            )
        }
        if (!this.state.telefone){
            Alert.alert("Atenção", "Digite um Telefone", 
                [
                    {
                        text: 'OK',
                        onPress: ()=>{return;}
                    }
                ]
            )
        }
        if (!this.state.email){
            Alert.alert("Atenção", "Digite um E-mail", 
                [
                    {
                        text: 'OK',
                        onPress: ()=>{return;}
                    }
                ]
            )
        }
        if (!this.state.usuario){
            Alert.alert("Atenção", "Digite um Usuário", 
                [
                    {
                        text: 'OK',
                        onPress: ()=>{return;}
                    }
                ]
            )
        }
        if (!this.state.password){
            Alert.alert("Atenção", "Digite uma Senha", 
                [
                    {
                        text: 'OK',
                        onPress: ()=>{return;}
                    }
                ]
            )
        }

        let dados_usuario = [
            {
                username: this.state.usuario,
                senha: this.state.password,
                status: true,
                user_admin: false,
                user_app: true,
                id_empresa: EMPRESA
            }
        ]

        let dados_cliente = [
            {
                nome: this.state.nome,
                cpf: this.state.cpf,
                telefone: this.state.telefone,
                email: this.state.email
   
            }
        ]
        
        api.post('api/v1/usuario')
        
    }

    envia_email(){
        let dados_email = [
            {
                nome: this.state.nome,
                destinatario: this.state.email,
                tipo_email: 'confirmacao_email'
            }
        ]

        api.post('api/v1/envia-email', dados_email)
        .then((results)=>{
            console.log(results)
        })
        .catch((error)=>{
            console.log(error)
        })
    }
    
    render(){
        return (
            <View style={styles.content}>
                <View style={styles.headerPaginainicial}>
                    <View style={styles.contentHeaderPaginaIinical}>
                        <View style={styles.viewContentHeader}>
                            <StyledButtonCadastro ativo={true}>
                                <Feather name="user" size={40} />
                            </StyledButtonCadastro>
                            <StyledTextWhite>Dados Cadastrais</StyledTextWhite>
                        </View>
                        {
                            !this.state.token ? 
                            (
                                <View style={styles.viewContentHeader}>
                                    <StyledButtonCadastro ativo={false}>
                                        <Feather name="check-circle" size={40} />
                                    </StyledButtonCadastro>
                                    <StyledTextWhite>Confirmar E-mail</StyledTextWhite>
                                </View>
                            )
                            :
                            (
                                <View></View>
                            )
                        }
                        
                    </View>
                </View>
                <View style={styles.bodyPaginainicial}>
                    <ScrollView style={styles.scrollView}>
                        <View style={styles.bodyBodyPaginaInicial}>
                            <StyledInput placeholder={'Nome'} value={this.state.nome} onChange={(value)=>{this.setState({nome: value})}}> 
                                <Ionicons name="md-pencil-sharp" size={20} style={styles.iconInputStyled}/>
                            </StyledInput>
                            <StyledInputMasked placeholder={'CPF'} type={'cpf'} onChange={(value)=>{this.onChangeCpf(value)}} value={this.state.cpf}> 
                                <MaterialCommunityIcons name="face-man" size={20} style={styles.iconInputStyled}/>
                            </StyledInputMasked>
                            <StyledInputMasked placeholder={'Telefone'} type={'cel-phone'} onChange={(value)=>{this.setState({telefone: value})}} value={this.state.telefone}> 
                                <MaterialCommunityIcons name="cellphone" size={20} style={styles.iconInputStyled}/>
                            </StyledInputMasked>
                            <StyledInput placeholder={'E-mail'} value={this.state.email} onChange={(value)=>{this.setState({email: value})}}> 
                                <Entypo name="email" size={20} style={styles.iconInputStyled}/>
                            </StyledInput>
                            <StyledInput placeholder={'Usuário'} value={this.state.usuario} onChange={(value)=>{this.setState({usuario: value})}}> 
                                <FontAwesome name="user" size={20} style={styles.iconInputStyled}/>
                            </StyledInput>
                            <StyledInputPassword placeholder={'Senha'} value={this.state.password} onChange={(value)=>{this.setState({password: value})}}> 
                                <MaterialCommunityIcons name="key" size={20} style={styles.iconInputStyled}/>
                            </StyledInputPassword>
                            {
                                !this.state.token ?
                                (
                                    <CheckBoxStyled
                                        text={'Li e aceito os termos de uso.'}
                                        onChange={()=>{this.onChangeCheckBox()}}
                                        value={this.state.checkBoxValue}
                                    />
                                )
                                :
                                (
                                    <View></View>
                                )
                            }
                            
                            <View style={styles.contentCheckStyled}>
                                <StyledButton onPress={()=>{this.submitForm()}}>
                                    Enviar
                                </StyledButton>
                            </View>
                            {
                                !this.state.token ?
                                (
                                    <View style={styles.contentCheckStyled}>
                                        <TouchableOpacity onPress={()=>{this.props.navigation.navigate('login')}}>
                                            <StyledText>
                                                Já tem login? Toque aqui para logar.
                                            </StyledText>
                                        </TouchableOpacity>
                                    </View>
                                )
                                :
                                (
                                    <View></View>
                                )
                            }
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}