import React from "react";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import Ionicons from "react-native-vector-icons/Ionicons";

import { View, Text, FlatList,  BackHandler, TextInput, TouchableOpacity} from "react-native";
import { styles } from "../temas/base";
import { ModelEmpresas } from "../model/ModelEmpresas";


export class GeraVoucher extends React.Component {
    _isMounted = false;
    constructor(props){
        super(props);
        this.state = {
            token: null,
            empresas: [],
            empresasPromocao: [],
            promocao: this.props.route.params.id_promocao,
            procurar: '', 
            showToastCounter: 0, 
            token: null,
            tokenDecode: null,
            contadorError: 0
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

        await this.get_empresas_promocao()
        this.get_empresas()

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    
    handleBackButtonClick() {
        this.props.navigation.navigate('home');
        return true;
    }

    async get_empresas_promocao(){
        await api.get(`api/v1/empresas-promocao?id_promocao=${this.state.promocao}&status=true`,  { headers: { Authorization: this.state.token}})
        .then((results)=>{
            if(results.data.length > 0){
                this.setState({
                    empresasPromocao: results.data
                })
            }
        }).catch(async (error)=>{
            if(error.name === 'AxiosError'){
                await this.get_empresas_promocao()
            }
        })
    }

    async get_empresas(){
        var empresa = []
        var erro = false;
        for (let i = 0; this.state.empresasPromocao.length > i; i++){
            await api.get(`api/v1/empresa?id_empresa=${this.state.empresasPromocao[i].id_empresa}`, { headers: { Authorization: this.state.token}})
            .then((results)=>{
                if(results.data.length > 0){
                    empresa.push(results.data[0])
                }
            }).catch((error)=>{
                let count_error = this.state.contadorError;
                if(error.name === "AxiosError"){
                    
                    count_error += 1
                    this.setState({
                        contadorError: count_error
                    })
                    if (this.state.contadorError === 25){
                        Alert.alert("Atenção", "Sem conexão com a API.",
                        [
                            {
                                text: "OK",
                                onPress: ()=>{return;}
                            }
                        ]
                        )
                    }else{
                        this.get_empresas()
                    }
                    
                }else if (error.response.data.error === 'Signature verification failed'){
                    this.props.navigation.navigate('login')
                }else if(error.response.data.error === 'Token expirado'){
                    this.props.navigation.navigate('login')
                }else if(error.response.data.error === 'não autorizado'){
                    this.props.navigation.navigate('login')
                }
            })
        }

        await this.setState({
            empresas: empresa
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
        return (
            <View style={styles.content}>
                <View style={styles.headerVoucher}>
                    <View style={styles.contentHeaderEmpresa}>
                        <View style={styles.viewTitleEmpresa}>
                            <Text style={styles.titleEmpresa}>Estabelecimentos</Text>
                        </View>
                        <View style={styles.viewVoltarModalEmpresa}>
                            <TouchableOpacity onPress={()=>{this.handleBackButtonClick()}}><Text><Ionicons name="backspace-outline" size={20} style={styles.iconVoltar}/></Text></TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.viewSearch}>
                        <Ionicons name="md-search-sharp" size={25} style={styles.iconLupa}/>
                        <TextInput placeholder="Digite para pesquisar" autoCapitalize="none" onChangeText={(text)=>{this.filtrar(text)}} style={styles.inputSearch}/>
                    </View>
                </View>
                <View style={styles.corpoTransparente}>
                    <FlatList
                        data={this.state.empresas}
                        renderItem={(items)=><ModelEmpresas id_promocao={this.state.promocao} telaInicial={true} item={items}/>}
                    />
                </View>
            </View>
        );
    }
}