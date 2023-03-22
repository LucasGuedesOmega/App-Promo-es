import React from "react";

import { View, ScrollView, BackHandler, FlatList, Text, TextInput} from "react-native";
import { styles } from "../temas/base";
import { ModelProdutos } from "../model/modelProdutos";

import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import Ionicons from "react-native-vector-icons/Ionicons";
export class Produtos extends React.Component{
    _isMounted = false;
    constructor(props){
        super(props);
        this.state = {
            produtos: [],
            tokenDecode: null,
            token: null,
            showToastCounter: 0,
            procurar: ''
        }
    
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    async componentDidMount(){
        await AsyncStorage.getItem('token')
        .then((token)=>{
            this.setState({
                tokenDecode: jwtDecode(token),
                token: token
            })
        })

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

        await this.get_produtos();
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    
    handleBackButtonClick() {
        this.props.navigation.goBack();
        return true;
    }

    async get_produtos(){
        api.get(`/api/v1/integracao/produto/lista?id_grupo_empresa=${this.state.tokenDecode.id_grupo_empresa}`, { headers: { Authorization:this.state.token}})
        .then((results)=>{
            if (results.data.length > 0){
                this.setState({
                    produtos: results.data
                });
            }
        })
        .catch(async (error)=>{
            if(error.response.data.erros[0] === 'Sem conexao com a api ou falta fazer login.'){
                this.props.navigation.navigate('login')
                await AsyncStorage.removeItem('token')
                return;
            }else if (error.response.data.error === 'Signature verification failed'){
                this.props.navigation.navigate('login')
                await AsyncStorage.removeItem('token')
                return;
            }else if(error.response.data.error === 'Token expirado'){
                this.props.navigation.navigate('login')
                await AsyncStorage.removeItem('token')
                return;
            }else if(error.response.data.error === 'Token expirado'){
                this.props.navigation.navigate('login')
                await AsyncStorage.removeItem('token')
                return;
            }
        })
    }

    filtrar(text){
        if (this.timeout){
            clearTimeout(this.timeout);
        }
        
        let counter = this.state.showToastCounter;
        if(this.state.showToastCounter < 1){
            // ToastAndroid.show("CNPJ sem pontuação", ToastAndroid.LONG);
            counter++

            this.setState({
                showToastCounter: counter
            })
        }

        this.timeout = setTimeout(()=>{
            let upperText = text.toUpperCase();

            this.setState({procurar: upperText});
            if (upperText === ''){
                this.get_produtos();
            } else {
                let filteredData = this.state.produtos.filter((item)=> {
                    if (item.descricao.toUpperCase().indexOf(upperText) > -1){
                        return true;
                    } else if (item.codigo_barras.indexOf(upperText) > -1){
                        return true;
                    } else if (item.id_externo.indexOf(upperText) > -1){
                        return true;
                    } else {
                        return false;
                    }
                    
                });
                this.setState({
                    produtos: filteredData
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
                            <Text style={styles.titleEmpresa}>Produtos</Text>
                        </View>
                        <View style={styles.viewVoltarModalEmpresa}>
                        </View>
                    </View>
                    <View style={styles.viewSearch}>
                        <Ionicons name="md-search-sharp" size={25} style={styles.iconLupa}/>
                        <TextInput placeholder="Digite para pesquisar" autoCapitalize="none" onChangeText={(text)=>{this.filtrar(text)}} style={styles.inputSearch}/>
                    </View>
                </View>
                <View style={styles.corpoTransparente}>
                    <FlatList
                        data={this.state.produtos}
                        navigation={this.props.navigation}
                        renderItem={(items)=><ModelProdutos dados_dict={this.state.dados_voucher} navigation={this.props.navigation} item={items}/>}
                    />
                </View>
            </View>
        );
    }
}