import React from "react";
import api from "../services/api";
import SyncStorage from 'sync-storage';
import jwtDecode from "jwt-decode";
import Ionicons from "react-native-vector-icons/Ionicons";

import { View, Text, FlatList,  BackHandler, TextInput, TouchableOpacity} from "react-native";
import { styles } from "../temas/base";
import { ModelEmpresas } from "../model/ModelEmpresas";


export class GeraVoucher extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            token: null,
            empresas: [],
            empresasPromocao: [],
            promocao: this.props.route.params.id_promocao,
            procurar: '', 
        }

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    async componentDidMount(){
        await this.setState({
            token: jwtDecode(SyncStorage.get('token')) 
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
        await api.get(`api/v1/empresas-promocao?id_promocao=${this.state.promocao}&status=true`,  { headers: { Authorization: SyncStorage.get('token')}})
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
            await api.get(`api/v1/empresa?id_empresa=${this.state.empresasPromocao[i].id_empresa}`, { headers: { Authorization: SyncStorage.get('token')}})
            .then((results)=>{
                if(results.data.length > 0){
                    empresa.push(results.data[0])
                }
            }).catch((error)=>{
                if(error.name === 'AxiosError'){
                    erro = true;
                }
            })
        }

        await this.setState({
            empresas: empresa
        })
        let contador_erro = 0;
        if(erro === true){
            contador_erro += 1;
            if(contador_erro > 10){
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
           
        }
    }

    filtrar(text){
        if (this.timeout){
            clearTimeout(this.timeout);
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
                <View style={styles.bodyVoucher}>
                    <FlatList
                        data={this.state.empresas}
                        renderItem={(items)=><ModelEmpresas item={items}/>}
                    />
                </View>
            </View>
        );
    }
}