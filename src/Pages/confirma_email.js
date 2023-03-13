import React from "react";

import { View, ScrollView, TouchableOpacity, Alert } from "react-native";
import { styles } from "../temas/base";
import {  StyledInput, StyledButton, StyledButtonCadastro, StyledTextWhite, StyledText } from "../components/styledComponents";
import Ionicons from "react-native-vector-icons/Ionicons"
import Feather from "react-native-vector-icons/Feather";
import api from "../services/api";

export class ConfirmaEmail extends React.Component {
    _isMounted = false;
    constructor(props){
        super(props);
        this.state = {
            codigo: null,
            nome: this.props.route.params.nome,
            id_usuario: this.props.route.params.id_usuario,
            email: this.props.route.params.email,
        }
    }

    onClickReenviar(){
        if(!this.state.id_usuario){
            Alert.alert("Atenção", 'Por favor envie os dados cadastrais para enviar o e-mail de confirmação.',
            [
                {
                    text: 'OK',
                    onPress: ()=>{return;}
                }
            ]
            )
        }

        let dados_email = [
            {
                nome: this.state.nome,
                destinatario: this.state.email,
                tipo_email: 'confirmacao_email',
                id_usuario: this.state.id_usuario
            }
        ]

        api.post('api/v1/envia-email', dados_email)
        .then((results)=>{
            Alert.alert("Sucesso", 'E-mail enviado com sucesso.',
            [
                {
                    text: 'OK',
                    onPress: ()=>{return;}
                }
            ]
            )
        })
        .catch((error)=>{
            Alert.alert("Atenção", 'Tente novamente mais tarde.',
            [
                {
                    text: 'OK',
                    onPress: ()=>{return;}
                }
            ]
            )
        })
    }

    submitForm(){   

        if(!this.state.codigo){
            Alert.alert("Atenção", 'Por favor informe o código',
            [
                {
                    text: 'OK',
                    onPress: ()=>{return;}
                }
            ]
            )
        }

        api.post('/api/v1/confirma-email', {codigo: this.state.codigo})
        .then((results)=>{
            Alert.alert("Sucesso", 'E-mail confirmado com sucesso.',
            [
                {
                    text: 'OK',
                    onPress: ()=>{return;}
                }
            ]
            )
        })
        .catch((error)=>{
            console.log(error)
            Alert.alert("Atenção", 'Tente novamente mais tarde.',
            [
                {
                    text: 'OK',
                    onPress: ()=>{return;}
                }
            ]
            )
        })
    }

    render(){
        return (
            <View style={styles.content}>
                <View style={styles.headerPaginainicial}>
                    <View style={styles.contentHeaderPaginaIinical}>
                        <View style={styles.viewContentHeader}>
                            <StyledButtonCadastro ativo={false}  onPress={()=>{this.props.navigation.navigate('cadastro_usuario')}}>
                                <Feather name="user" size={40} />
                            </StyledButtonCadastro>
                            <StyledTextWhite>Dados Cadastrais</StyledTextWhite>
                        </View>
                        <View style={styles.viewContentHeader}>
                            <StyledButtonCadastro ativo={true}  onPress={()=>{this.props.navigation.navigate('confirma_email')}}>
                                <Feather name="check-circle" size={40} />
                            </StyledButtonCadastro>
                            <StyledTextWhite>Confirmar E-mail</StyledTextWhite>
                        </View>
                    </View>
                </View>
                <View style={styles.bodyPaginainicial}>
                    <ScrollView style={styles.scrollView}>
                        <View style={styles.bodyBodyPaginaInicial}>
                            <StyledInput placeholder={'Código'} value={this.state.codigo} onChange={(value)=>{this.setState({codigo: value})}}> 
                                <Ionicons name="md-pencil-sharp" size={20} style={styles.iconInputStyled}/>
                            </StyledInput>
                            
                            <View style={styles.contentCheckStyled}>
                                <StyledButton onPress={()=>{this.submitForm()}}>
                                    Confirmar
                                </StyledButton>
                            </View>
                            <View style={styles.contentCheckStyled}>
                                <TouchableOpacity onPress={()=>{this.onClickReenviar()}}>
                                    <StyledText>
                                        Reenviar o código!
                                    </StyledText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}