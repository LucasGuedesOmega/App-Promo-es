import React from "react";

import { View, ScrollView, BackHandler } from "react-native";
import { Cabecalho } from "../components";
import { styles } from "../temas/base";

export class Produtos extends React.Component{
    constructor(props){
        super(props);

    
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    async componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    
    handleBackButtonClick() {
        this.props.navigation.goBack();
        return true;
    }

    render(){
        return(
            <View style={styles.content}>
                <Cabecalho/>
                <View style={styles.corpo}>
                    <ScrollView style={styles.scrollView}>
                        <View style={styles.viewScrollSection}></View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}