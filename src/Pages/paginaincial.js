import React from "react";

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