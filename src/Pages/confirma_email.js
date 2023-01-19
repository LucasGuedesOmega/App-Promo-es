import React from "react";

import { View, ScrollView } from "react-native";
import { styles } from "../temas/base";
import {  StyledInput, StyledButton, StyledButtonCadastro, StyledTextWhite } from "../components/styledComponents";
import Ionicons from "react-native-vector-icons/Ionicons"
import Feather from "react-native-vector-icons/Feather";

export class ConfirmaEmail extends React.Component {
    _isMounted = false;
    constructor(props){
        super(props);
        this.state = {
            codigo: null
        }
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
                                <StyledButton onPress={()=>{console.log(this.state.email)}}>
                                    Enviar
                                </StyledButton>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}