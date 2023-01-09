import React from "react";

import { View, BackHandler, Text, FlatList, ToastAndroid, TextInput } from "react-native";

import { styles } from "../temas/base";
import { ModelEmpresas } from "../model/ModelEmpresas";

import Ionicons from "react-native-vector-icons/Ionicons";
import api from "../services/api";
import SyncStorage from 'sync-storage';
import jwtDecode from "jwt-decode";
export class Promocao extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            empresas: null,
            tokenDecode: jwtDecode(SyncStorage.get('token')),
            procurar: '', 
            showToastCounter: 0,
            dados_voucher: this.props.route.params
        }

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    async componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        this.get_empresas();
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    
    handleBackButtonClick() {
        this.props.navigation.goBack();
        return true;
    }

    get_empresas(){
        api.get(`api/v1/empresa?id_grupo_empresa=${this.state.tokenDecode.id_grupo_empresa}`, { headers: { Authorization: SyncStorage.get('token')}})
        .then(async (results)=>{
            if (results.data.length > 0){
                await this.setState({
                    empresas: results.data
                })
            }
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    filtrar(text){
        if (this.timeout){
            clearTimeout(this.timeout);
        }
        
        let counter = this.state.showToastCounter;
        if(this.state.showToastCounter < 1){
            ToastAndroid.show("CNPJ sem pontuação", ToastAndroid.LONG);
            
            counter++

            this.setState({
                showToastCounter: counter
            })
        }

        this.timeout = setTimeout(()=>{
            let upperText = text.toUpperCase();

            this.setState({procurar: upperText});
            if (upperText === ''){
                this.get_empresas();
            } else {
                let filteredData = this.state.empresas.filter((item)=> {
                    if (item.razao_social.toUpperCase().indexOf(upperText) > -1){
                        return true;
                    } else if (item.cnpj.indexOf(upperText) > -1){
                        return true;
                    } else {
                        return false;
                    }
                    
                });
                this.setState({
                    empresas: filteredData
                });
            }
        }, 650);
    }

    render(){
        return(
            <View style={styles.content}>
                <View style={styles.headerPromocao}>
                    <View style={styles.contentHeaderEmpresa}>
                        <View style={styles.viewTitleEmpresa}>
                            <Text style={styles.titleEmpresa}>Estabelecimentos</Text>
                        </View>
                        <View style={styles.viewVoltarModalEmpresa}>
                        </View>
                    </View>
                    <View style={styles.viewSearch}>
                        <Ionicons name="md-search-sharp" size={25} style={styles.iconLupa}/>
                        <TextInput placeholder="Digite para pesquisar" autoCapitalize="none" onChangeText={(text)=>{this.filtrar(text)}} style={styles.inputSearch}/>
                    </View>
                </View>
                <View style={styles.corpo}>
                    <FlatList
                        data={this.state.empresas}
                        navigation={this.props.navigation}
                        renderItem={(items)=><ModelEmpresas id_promocao={null} dados_dict={this.state.dados_voucher} navigation={this.props.navigation} item={items}/>}
                    />
                </View>
            </View>
        );
    }
}