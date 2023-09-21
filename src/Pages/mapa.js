import React, {Fragment} from "react";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import { styles } from "../temas/base";

import { Platform, View, Linking, Modal, TouchableOpacity, Text, Alert, ToastAndroid, FlatList} from 'react-native';
import RNPermissions, { PERMISSIONS } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import MapView, { Marker } from 'react-native-maps';

import MarkerUser from '../assets/marker-user.png'
import MarkerGasStation from '../assets/marker-gas-station.png'
import { Cabecalho, Loading } from "../components";
import { ModelPromocaoCampact } from "../model/ModelPromocaoCompactado";

import Ionicons from "react-native-vector-icons/Ionicons";

export class Mapa extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            permissaoLocalizacao: false,
            latitude_atual: null,
            longitude_atual: null,

            token: null,
            tokenDecode: null,

            empresas: [],
            promocoes: [],
            modalVisible: false,
            promocaoEmpresa: null,

            loading: false
        };

        this.pedePermissao = this.pedePermissao.bind(this);
        this.getLocalizacaoAtual = this.getLocalizacaoAtual.bind(this);

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

        await this.pedePermissao();
        await this.getLocalizacaoAtual();
        await this.getEmpresas();

        this.setState({
            loading: false
        });
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

    async getEmpresas(){
        await api.get(`api/v1/empresa?id_grupo_empresa=${this.state.tokenDecode.id_grupo_empresa}&imagens=false`, {headers: { Authorization: this.state.token}})
        .then((results)=>{
            if (results.data.length > 0){
                this.setState({
                    empresas: results.data
                })
            }
        })
        .catch(async (error)=>{
            console.log(error)
            if(error.response.data.erros[0] === 'Sem conexao com a api ou falta fazer login.'){
                this.props.navigation.navigate('login')
                await AsyncStorage.removeItem('token')
                return;
            } else if(error.response.data.erros[0] === 'Sem conexao com a api ou falta fazer login.'){
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

    async markerPostoClicked(value){

        let promocoes = [];

        var distancia = this.getDistanceFromLatLonInKm(
            {lat: this.state.latitude_atual, lng: this.state.longitude_atual},
            {lat: value.latitude, lng: value.longitude}    
        )
        
        if(distancia < 100){
            await api.get(`api/v1/empresas-promocao?id_empresa=${value.id_empresa}`, { headers : {Authorization: this.state.token}})
            .then((results)=>{
                if(results.data[0].status){
                    promocoes = results.data
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
            
            if (promocoes.length < 1){
                ToastAndroid.show("Esse posto não tem promoções.", ToastAndroid.LONG);
                return;
            }
            
            await this.get_promocoes(promocoes);

            this.setState({
                modalVisible: true,
                promocaoEmpresa: value
            })


        }else{
            Alert.alert("Atenção", "Você precisa estar a menos de 100 metros do posto para continuar.",
                [
                    {
                        text: "OK",
                        onPress: ()=>{return;}
                    }
                ]
            )
        }
        
    }

    async get_promocoes(id_promocoes){
        let promocoes = [];
        for(let i = 0; i < id_promocoes.length; i ++){
            await api.get(`api/v1/promocao?id_promocao=${id_promocoes[i].id_promocao}`, {headers: {Authorization: this.state.token}})
            .then((results)=>{
                if(results.data.length > 0){
                    promocoes.push(results.data[i])
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

        this.setState({
            promocoes: promocoes
        })
    }

    render(){

        let dados_mapa = {
            latitude: this.state.latitude_atual,
            longitude: this.state.longitude_atual, 
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
        }

        if (dados_mapa.latitude !== null && dados_mapa.longitude !== null && this.state.empresas){
            return (
                <View style={styles.content}>
                    <Cabecalho/>
                    <View style={styles.corpo}>
                        
                        {
                            this.state.loading?
                            (
                                <Loading/>
                            ):
                            (
                                <Fragment>
                                    <MapView style={styles.mapa} region={dados_mapa}>
                                        <Marker
                                            coordinate={{
                                                latitude: this.state.latitude_atual, 
                                                longitude: this.state.longitude_atual,
                                            }}
                                            title={"Você está aqui."}
                                            description={"Olá estou aqui."}
                                            pinColor={'blue'}
                                            image={MarkerUser}
                                        />
                                        {
                                            this.state.empresas.map((value, index)=>(
                                                <Marker
                                                    coordinate={{
                                                        latitude: value.latitude, 
                                                        longitude: value.longitude,
                                                    }}
                                                    title={value.razao_social}
                                                    description={value.cnpj.replace(/\D/g, '')
                                                    .replace(/^(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/, "$1.$2.$3/$4-$5")}
                                                    image={MarkerGasStation}
                                                    key={index}
                                                    onPress={()=>{this.markerPostoClicked(value)}}
                                                />
                                            ))
                                        }
                                    </MapView>
                                </Fragment>
                            )
                        }
                        
                    </View>
                    <Modal animationType="slide" transparent={true} visible={this.state.modalVisible} onRequestClose={()=>{this.setState({modalVisible: false})}} >
                        <View style={styles.centeredModalMenu}>
                            <View style={styles.modalView}>
                                <View style={styles.headerModalMenu}>
                                    <View style={styles.headerModalMenuVoltar}>
                                        <TouchableOpacity style={styles.buttonVoltarModalMenu} onPress={()=>{this.setState({modalVisible: false})}}>
                                            <Ionicons name="chevron-back-sharp" size={25} style={styles.backspaceIconModelMenu}/>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.headerModalMenuTitulo}>
                                        <Text style={styles.headerModalTextTitulo}>Promoções</Text>
                                    </View>
                                </View>
                                <View style={styles.bodyModalMenu}>
                                    <View style={styles.viewListaPromocao}>
                                        <FlatList
                                            data={this.state.promocoes}
                                            style={styles.listModalMenu}
                                            renderItem={(items)=>(<ModelPromocaoCampact navigation={this.props.navigation} empresa={this.state.promocaoEmpresa} items={items}/>)}
                                        />
                                    </View>
                                </View>

                            </View>
                        </View> 
                    </Modal>
                </View>
            );
        }else{
            return(
                <View style={styles.content}>
                    <View style={styles.cabecalho}></View>
                    <View style={styles.corpo}></View>
                </View>
            );
        }
        
    }
}
