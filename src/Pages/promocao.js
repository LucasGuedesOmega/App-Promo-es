import React from "react";

import { View, BackHandler, Text, FlatList, ToastAndroid, TextInput, ScrollView } from "react-native";

import { styles } from "../temas/base";
import { ModelEmpresas } from "../model/ModelEmpresas";

import Ionicons from "react-native-vector-icons/Ionicons";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import { Loading } from "../components";

import RNPermissions, { PERMISSIONS } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
export class Promocao extends React.PureComponent{
    _isMounted = false;
    constructor(props){
        super(props);

        this.state = {
            empresas: null,
            tokenDecode: null,
            token: null,
            procurar: '', 
            showToastCounter: 0,
            dados_voucher: this.props.route.params,
            
            loading: false,
            latitude_atual: null,
            longitude_atual: null
        }

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    async componentDidMount(){
        this.setState({
            loading: true
        });

        await AsyncStorage.getItem('token')
        .then((token)=>{
            this.setState({
                tokenDecode: jwtDecode(token),
                token: token
            })
        })
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        await this.pedePermissao();

        await this.getLocalizacaoAtual();

        await this.get_empresas();
    
        this.setState({
            loading: false
        });
    }
    
    async pedePermissao(){
        if (Platform.OS === 'android') {
            const granted = await RNPermissions.request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
            if (granted === 'blocked'){
                Linking.openSettings();
            }

            if (granted === 'granted') {
                this.setState({
                    permissaoLocalizacao: true
                })
            }
        }
    }

    getDistanceFromLatLonInKm(position1, position2) {
        "use strict";
        var deg2rad = function (deg) { return deg * (Math.PI / 180); },
            R = 6371,
            dLat = deg2rad(position2.lat - position1.lat),
            dLng = deg2rad(position2.lng - position1.lng),
            a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(deg2rad(position1.lat))
                * Math.cos(deg2rad(position1.lat))
                * Math.sin(dLng / 2) * Math.sin(dLng / 2),
            c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return ((R * c *1000).toFixed());
    }

    async getLocalizacaoAtual(){
        if (this.state.permissaoLocalizacao){
            Geolocation.getCurrentPosition(
                (position)=>{
                    this.setState({
                        latitude_atual: position.coords.latitude,
                        longitude_atual: position.coords.longitude,
                    })
                },
                (error)=>{
                    console.log(error)
                }
            );
        }
        
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    
    handleBackButtonClick() {
        this.props.navigation.goBack();
        return true;
    }

    async get_empresas(){

        await api.get(`api/v1/empresa?id_grupo_empresa=${this.state.tokenDecode.id_grupo_empresa}`, { headers: { Authorization:this.state.token}})
        .then((results)=>{
            if (results.data.length > 0){
                for(let i = 0; i<results.data.length;i++){
                    let distancia = this.getDistanceFromLatLonInKm(
                        {lat: this.state.latitude_atual, lng: this.state.longitude_atual},
                        {lat: results.data[i].latitude, lng: results.data[i].longitude}    
                    )
                    results.data[i].distancia = distancia
                }
                
                results.data.sort((a, b) => a.distancia - b.distancia);
                
                this.setState({
                    empresas: results.data
                })
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
                <View style={styles.corpoTransparente}>
                    <View style={styles.viewScrollSection}>
                        <View style={styles.viewScrollSectionBody}>
                            { this.state.loading ? 
                            (
                                <Loading/>
                            )
                            :
                            (
                                <FlatList
                                    data={this.state.empresas}
                                    navigation={this.props.navigation}
                                    style={styles.flatlistEmpresa}
                                    renderItem={(items)=><ModelEmpresas id_promocao={null} dados_dict={this.state.dados_voucher} navigation={this.props.navigation} item={items}/>}
                                />
                            )

                            }
                            
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}