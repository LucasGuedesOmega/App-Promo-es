import React, {Fragment} from "react";

import { View, TouchableOpacity, Text, Modal, FlatList, ToastAndroid, Alert, Image } from "react-native";
import { styles } from "../temas/base";

import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ModelPromocaoCampact } from "./ModelPromocaoCompactado";

import jwtDecode from "jwt-decode";

import Barcode from "react-native-barcode-builder";

import RNPermissions, { PERMISSIONS } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';

export class ModelEmpresas extends React.PureComponent{
    constructor(props){
        super(props);
        this.state = {
            promocoes: null,
            empresas_promocao: null,
            modalVisible: false,
            dados_dict: this.props.dados_dict,
            semana_: false,
            modalVoucher: false,
            voucher: null,
            token: null, 
            tokenDecodde: null,
            permissaoLocalizacao: false,
            latitude_atual: null, 
            longitude_atual: null,
            distancia: null,
            sigla: null
        }

    }   

    async componentDidMount(){

        await this.pedePermissao();
        await this.getLocalizacaoAtual();
        await this.get_distancia();

        await AsyncStorage.getItem('token')
        .then((token)=>{
            this.setState({
                tokenDecode: jwtDecode(token),
                token: token
            })
        })
        if(this.state.dados_dict){
            this.setState({
                modalVisible: false
            })
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

    async get_promocoes(){
        var distancia = this.getDistanceFromLatLonInKm(
            {lat: this.state.latitude_atual, lng: this.state.longitude_atual},
            {lat: this.props.item.item.latitude, lng: this.props.item.item.longitude}    
        )

        let promocoes = [];
        let hoje = new Date();
        let empresa_promocao = [];
        
        if (distancia < 100){
            
            await api.get(`api/v1/empresas-promocao?id_empresa=${this.props.item.item.id_empresa}`, { headers : {Authorization: this.state.token}})
            .then((results)=>{
                if (results.data.length > 0){
                    for (let i = 0; i < results.data.length; i++){
                        if (results.data[i].status){
                            empresa_promocao.push(results.data[i])
                        }
                    }
                    this.setState({
                        empresas_promocao: empresa_promocao
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
            
            if (this.state.empresas_promocao && this.props.id_promocao === null){
                for(let i = 0; i < this.state.empresas_promocao.length; i++){
                    await api.get(`api/v1/promocao?id_promocao=${this.state.empresas_promocao[i].id_promocao}`, { headers : {Authorization: this.state.token}})
                    .then((results)=>{
                        if (results.data.length > 0){
                            for (let i = 0; i < results.data.length; i++){
                                if (results.data[i].status === true){
                                    this.compare_days_of_week(results.data[i])
        
                                    let data_fim_promo = results.data[i].data_fim;
                                    let data_ini_promo = results.data[i].data_ini;
                                    let data_fim = new Date(data_fim_promo.split('/').reverse().join('/'))
                                    let data_ini = new Date(data_ini_promo.split('/').reverse().join('/'))
                                    
                                    if(this.state.semana_ === true && data_fim > hoje && data_ini < hoje && results.data[i].status === true){
                                        promocoes.push(results.data[i])
                                    }
                                }
                            }
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

            }else if (this.state.empresas_promocao && this.props.id_promocao !== null){
                this.get_voucher()
                return;
            }

            if (promocoes.length < 1){
                ToastAndroid.show("Esse posto não tem promoções.", ToastAndroid.LONG);
                return;
            }
            
            this.setState({
                promocoes: promocoes,
                modalVisible: true
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
    
    compare_days_of_week(promo){
        
        let hoje = new Date();
        let dia = hoje.getDay();
        let semana = ['domingo','segunda','terca','quarta','quinta','sexta','sabado'];

        if (promo[semana[dia]] === true ){
            this.setState({
                semana_: true,
            })
        }else if(promo[semana[dia]] === false ){
            this.setState({
                semana_: false
            })
        }
    }

    async get_voucher(){
        let data_ini = new Date()

        var dd = String(data_ini.getDate()).padStart(2, '0');
        var mm = String(data_ini.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = data_ini.getFullYear();

        data_ini = mm + '/' + dd + '/' + yyyy;

        let dados_dict = {
            data_ini: data_ini,
            id_promocao: this.props.id_promocao,
            id_empresa: this.props.item.item.id_empresa,
            status: true,
            tipoCodigo: this.props.tipo_desconto,
            usado: false
        }

        await api.post("api/v1/gera-voucher", dados_dict, { headers : {Authorization:this.state.token}})
        .then((results)=>{
            if (results.data.Voucher){
                this.setState({
                    modalVoucher: true,
                    voucher: results.data.Voucher
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
    
    async get_distancia(){
        let distancia = this.props.item.item.distancia / 1000;
        let sigla = 'Km'

        if (this.props.item.item.distancia < 1000){
            sigla = 'm';
            distancia = this.props.item.item.distancia;
        } else{
            distancia = distancia 
        }

        this.setState({
            sigla: sigla,
            distancia: distancia 
        })
    }

    render(){

        
        return(
            <View>
                <TouchableOpacity style={styles.linhaModelEmpresa} onPress={()=>{this.get_promocoes()}}>
                    <View style={styles.colunaModelEmpresaIcone}>
                        {this.props.item.item.imagem ? 
                            (
                                <Fragment>
                                    <Image source={{uri: `${this.props.item.item.imagem}`}} style={styles.imgPosto}/>
                                </Fragment>
                            ):(
                                <MaterialCommunityIcons name="gas-station" size={30} color={"rgb(100, 100, 100)"}/>
                            )
                        }
                        
                    </View>
                    <View style={styles.colunaModelEmpresaInfo}>
                        <Text style={styles.textInfo}> {this.props.item.item.razao_social}</Text>
                        <Text style={styles.textInfoEndereco} >{`${this.props.item.item.endereco}, ${this.props.item.item.numero} - ${this.props.item.item.bairro}`}</Text>
                        <Text style={styles.textInfoDistancia}> {this.state.distancia} {this.state.sigla}</Text>
                    </View>
                </TouchableOpacity>
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
                                        renderItem={(items)=>(<ModelPromocaoCampact navigation={this.props.navigation} empresa={this.props.item.item} items={items}/>)}
                                    />
                                </View>
                            </View>

                        </View>
                    </View> 
                </Modal>
                <Modal animationType="slide" transparent={true} visible={this.state.modalVoucher} onRequestClose={()=>{this.setState({modalVoucher: false})}}>
                    <TouchableOpacity  onPress={()=>{this.setState({modalVoucher: false})}} style={styles.contentModelTransparent}>
                        <View style={styles.modalContentVoucher}>
                            <View style={{flex: 2}}>
                                <View style={{ alignItems: 'center', width: '100%' }}>
                                    <Text style={styles.textColorModalVoucher}>Voucher</Text>
                                </View>
                            </View>
                            <View style={{flex: 2}}>
                                <View style={{ alignItems: 'center', width: '100%' }}><Barcode height={60} value={`${this.state.voucher}`} format="CODE128" /></View>
                            </View>
                            <View style={{flex: 2}}>
                                <View style={{ alignItems: 'center', width: '100%' }}><Text style={styles.textColorModalVoucher}>{this.state.voucher}</Text></View>
                            </View>
                            <View style={{flex: 2}}>
                                <View style={{paddingHorizontal: 5 , alignItems: 'flex-start', width: '100%' }}><Text style={styles.textColorModalVoucherAviso}>Informe ao operador ou escaneie o código Voucher.</Text></View>
                            </View>
                            <TouchableOpacity onPress={()=>{this.setState({modalVoucher: false})}} style={styles.buttonVoucher}><Text style={styles.textColorButtonVoucher}>Fechar</Text></TouchableOpacity>
                        </View>
                        <Text style={{color: 'white', fontSize: 15}}>Para sair toque fora da caixa</Text>
                    </TouchableOpacity>
                </Modal>
            </View>
            
        );
    }
}
