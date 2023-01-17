import React from "react";

import { TouchableOpacity, View } from "react-native";
import { styles } from "../temas/base";
import { StyledTituloText, StyledButton, StyledButtonWhite } from "../components/styledComponents";

export class CadastrarUsuario extends React.Component {
    _isMounted = false;
    constructor(props){
        super(props);
        this.state = {
            token: null
        }
    }
    
    render(){
        return (
            <View style={styles.content}>
                <View style={styles.headerPaginainicial}>
                    
                </View>
                <View style={styles.bodyPaginainicial}>
                    <View style={styles.headerBodyPaginaInicial}>
                        
                    </View>
                    <View style={styles.bodyBodyPaginaInicial}>
                        
                    </View>
                </View>
            </View>
        );
    }
}