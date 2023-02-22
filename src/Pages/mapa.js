import React from "react";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import { styles } from "../temas/base";

import { Platform, View, Linking, Image } from 'react-native';
import RNPermissions, { PERMISSIONS } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import MapView, { Marker } from 'react-native-maps';

import MarkerUser from '../assets/marker-user.png'
import MarkerGasStation from '../assets/marker-gas-station.png'
import { Cabecalho } from "../components";

export class Mapa extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            permissaoLocalizacao: false,
            latitude_atual: null,
            longitude_atual: null,

            token: null,
            tokenDecode: null,

            empresas: []
        };

        this.pedePermissao = this.pedePermissao.bind(this);
        this.getLocalizacaoAtual = this.getLocalizacaoAtual.bind(this);

    }

    async componentDidMount(){
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
                console.log('Permissão de localização concedida.');
                this.setState({
                    permissaoLocalizacao: true
                })
            }
        }
    }

    async getEmpresas(){
        await api.get(`api/v1/empresa?id_grupo_empresa=${this.state.tokenDecode.id_grupo_empresa}`, {headers: { Authorization: this.state.token}})
        .then((results)=>{
            if (results.data.length > 0){
                this.setState({
                    empresas: results.data
                })
            }

            console.log(this.state.empresas, 'olaaaaaaaaaa')
        })
        .catch(async (error)=>{
            console.log(error.response)
            if(error.response.data.erros[0] === 'Sem conexao com a api ou falta fazer login.'){
                this.props.navigation.navigate('login')
                await AsyncStorage.setItem("token", null)
                return;
            }
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
                                    />
                                ))
                            }
                        </MapView>
                    </View>
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