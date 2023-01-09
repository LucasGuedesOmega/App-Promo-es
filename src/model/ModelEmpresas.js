import React from "react";

import { TextInputMask } from "react-native-masked-text";
import { View, TouchableOpacity, Text, Modal, FlatList, ToastAndroid, Alert} from "react-native";
import { styles } from "../temas/base";

import api from "../services/api";
import SyncStorage from 'sync-storage';

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ModelPromocaoCampact } from "./ModelPromocaoCompactado";

import Barcode from "react-native-barcode-builder";
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
            voucher: null
        }

    }   

    componentDidMount(){
        if(this.state.dados_dict){
            this.setState({
                modalVisible: false
            })
        }
    }

    async get_promocoes(){
        let empresa_promocao = [];
        await api.get(`api/v1/empresas-promocao?id_empresa=${this.props.item.item.id_empresa}`, { headers : {Authorization: SyncStorage.get('token')}})
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
            if(error.name === "AxiosError"){
                this.props.navigation.navigate("login")
            }
        })
        
        if (this.state.empresas_promocao && this.props.id_promocao === null){
            let promocoes = [];
            let hoje = new Date();
            for(let i = 0; i < this.state.empresas_promocao.length; i++){
                await api.get(`api/v1/promocao?id_promocao=${this.state.empresas_promocao[i].id_promocao}`, { headers : {Authorization: SyncStorage.get('token')}})
                .then(async (results)=>{
                    if (results.data.length > 0){
                        for (let i = 0; i < results.data.length; i++){
                            if (results.data[i].status === true){
                                await this.compare_days_of_week(results.data[i])
    
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
                    if(error.name === "AxiosError"){
                        this.props.navigate("login")
                    }
                })
            }
            if (promocoes.length > 0){
                this.setState({
                    promocoes: promocoes,
                    modalVisible: true
                })
            }else{
                ToastAndroid.show("Está empresa não tem promoções.", ToastAndroid.LONG);
            }   
        }else if (this.state.empresas_promocao && this.props.id_promocao !== null){
            this.get_voucher()
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

        await api.post("api/v1/gera-voucher", dados_dict, { headers : {Authorization: SyncStorage.get('token')}})
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
                    </View>
                </TouchableOpacity>
                <Modal animationType="slide" transparent={true} visible={this.state.modalVisible} onRequestClose={()=>{this.setState({modalVisible: false})}} >
                    <View style={styles.centeredModalMenu}>
                        <View style={styles.modalView}>
                            <View style={styles.headerModalMenu}>
                                <View style={styles.headerModalMenuTitulo}>
                                    <Text style={styles.headerModalTextTitulo}>Promoções</Text>
                                </View>
                                <View style={styles.headerModalMenuVoltar}>
                                    <TouchableOpacity style={styles.buttonVoltarModalMenu} onPress={()=>{this.setState({modalVisible: false})}}>
                                        <Ionicons name="backspace-outline" size={25} style={styles.backspaceIconModelMenu}/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.bodyModalMenu}>
                                <FlatList
                                    data={this.state.promocoes}
                                    style={styles.listModalMenu}
                                    renderItem={(items)=>(<ModelPromocaoCampact navigation={this.props.navigation} empresa={this.props.item.item} items={items}/>)}
                                />
                            </View>

                        </View>
                    </View> 
                </Modal>
                <Modal animationType="slide" transparent={true} visible={this.state.modalVoucher} onRequestClose={()=>{this.setState({modalVoucher: false})}}>
                    <TouchableOpacity  onPress={()=>{this.setState({modalVoucher: false})}} style={styles.contentModelTransparent}>
                        <View style={styles.modalContentVoucher}>
                            <View style={{flex: 2, flexDirection: "row"}}>
                                <View style={{ padding: 15, alignItems: 'center', width: '100%' }}>
                                    <Text style={styles.textColorModalVoucher}>Voucher</Text>
                                </View>
                            </View>
                            <View style={{flex: 2, flexDirection: "row"}}>
                                <View style={{ padding: 15, alignItems: 'center', width: '100%' }}><Barcode value={`${this.state.voucher}`} format="CODE128" /></View>
                            </View>
                            <View style={{flex: 2, flexDirection: "row", marginTop: '10%'}}>
                                <View style={{ padding: 15, alignItems: 'center', width: '100%' }}><Text style={styles.textColorModalVoucher}>{this.state.voucher}</Text></View>
                            </View>
                            <View style={{flex: 2, flexDirection: "row"}}>
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
