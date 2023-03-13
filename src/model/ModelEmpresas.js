import React from "react";

import { TextInputMask } from "react-native-masked-text";
import { View, TouchableOpacity, Text, Modal, FlatList, ToastAndroid, Alert } from "react-native";
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
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

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
            longitude_atual: null
        }

    }   

    async componentDidMount(){
        await this.pedePermissao()
        await this.getLocalizacaoAtual()

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
                console.log('Permissão de localização concedida.');
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
            .catch((error)=>{
                console.log(error)
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
                    .catch((error)=>{
                        console.log(error)
                    })
                }

            }else if (this.state.empresas_promocao && this.props.id_promocao !== null){
                this.get_voucher()
                return;
            }
            
            console.log('ola')

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
            tipoCodigo: 'CASHBACK',
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
    }

    render(){
       
        return(
            <View>
                <TouchableOpacity style={styles.linhaModelEmpresa} onPress={()=>{this.get_promocoes()}}>
                    <View style={styles.colunaModelEmpresaIcone}>
                        <MaterialCommunityIcons name="gas-station" size={30} color={"rgb(100, 100, 100)"}/>
                    </View>
                    <View style={styles.colunaModelEmpresaInfo}>
                        <Text style={styles.textInfo}> {this.props.item.item.razao_social}</Text>
                        <TextInputMask type={"cnpj"} editable={false} style={styles.textInfo} value={this.props.item.item.cnpj}/>
                        <Text style={styles.textInfo} >{`${this.props.item.item.endereco}, ${this.props.item.item.numero} - ${this.props.item.item.bairro} - ${this.props.item.item.cidade} `}</Text>
                    </View>
                    <View style={styles.colunaModelEmpresaIcone}>
                        <FontAwesome5Icon name="angle-right" size={25} color={"rgb(100, 100, 100)"}/>
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
