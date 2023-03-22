import React from "react";

import { View, Text, TouchableOpacity, Image, Modal} from "react-native";
import { styles } from "../temas/base";
import { CheckBoxStyled } from "../components/styledComponents";

import { ToggleButton } from "../components";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

import jwtDecode from "jwt-decode";

import Barcode from "react-native-barcode-builder";

export class ModelPromocaoCampact extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            open_modal: false,
            selectedPromocao: true,
            selectedCash: false,
            modalVoucher: false,
            voucher: null,
            checkBoxValue: false,
            disableCheckbox: true
        }
    }

    async componentDidMount(){
        await AsyncStorage.getItem('token')
        .then((token)=>{
            this.setState({
                tokenDecode: jwtDecode(token),
                token: token
            })
        })
    }

    format_date(date){
        
        let data = new Date(date)

        var ano = data.getFullYear();
   
        var dia;
        if (data.getDate() < 10 ){
            dia = '0' + data.getDate()
        }else {
            dia = data.getDate()
        }

        var mes;
        let mes_ = data.getMonth()+1
        if ( mes_ < 10){
            mes = '0' + mes_;
        }else{
            mes = data.getMonth()+1;
        }

        return dia + '/' + mes + '/' + ano
    }

    async get_voucher(){
        let data_ini = new Date()

        var dd = String(data_ini.getDate()).padStart(2, '0');
        var mm = String(data_ini.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = data_ini.getFullYear();

        data_ini = mm + '/' + dd + '/' + yyyy;

        let tipo_promocao = null;
        
        if (this.state.selectedCash){
            tipo_promocao = 'CASHBACK'
        } else if (this.state.selectedPromocao) {
            tipo_promocao = 'DESCONTO'
        } 

        if (this.state.checkBoxValue){
            tipo_promocao = 'RESGATE'
        }

        let dados_dict = {
            data_ini: data_ini,
            id_promocao: this.props.items.item.id_promocao,
            id_empresa: this.props.empresa.id_empresa,
            status: true,
            tipoCodigo: tipo_promocao,
            usado: false
        }

        await api.post("api/v1/gera-voucher", dados_dict, { headers : {Authorization: this.state.token}})
        .then((results)=>{
            if (results.data.Voucher){
                this.setState({
                    modalVoucher: true,
                    open_modal: false,
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

    onClickButtonSelected(){
        if (this.state.selectedPromocao===true && this.state.selectedCash === false){
            this.setState({
                selectedPromocao: false,
                selectedCash: true
            })
        }else if (this.state.selectedPromocao===false && this.state.selectedCash === true){
            this.setState({
                selectedPromocao: true,
                selectedCash: false
            })
        }
    }
    
    onChangeCheckBox(){
        if (this.state.checkBoxValue){
            this.setState({
                checkBoxValue: false
            })
        }else{
            this.setState({
                checkBoxValue: true
            })
        }
    }

    render(){
        return(
            <View>
                <TouchableOpacity style={styles.linhaModelMenu} onPress={()=>{this.setState({open_modal: true})}}>
                    <View style={styles.colunaModelMenuImage}>
                        <Image source={{uri: `${this.props.items.item.imagem}`}} style={styles.imgPromoMenu}/>
                    </View>
                    <View style={styles.colunaModelMenu}>
                        <Text style={styles.textModalMenuTitulo}>
                            {this.props.items.item.titulo}
                        </Text>
                        <Text style={styles.textModalMenu}>
                            Válido de {this.format_date(this.props.items.item.data_ini)} até {this.format_date(this.props.items.item.data_fim)}
                        </Text>
                    </View>
                </TouchableOpacity>
                <Modal animationType="slide" transparent={true} visible={this.state.open_modal} onRequestClose={()=>{this.setState({open_modal: false})}}>
                    <TouchableOpacity onPress={()=>{this.setState({open_modal: false})}} style={styles.contentModelTransparent}>
                        <View style={styles.modalContentCashBack}>
                            <View style={{flex: 1, flexDirection: "row",  justifyContent: "center", alignItems: 'flex-end'}}>
                                <View><Text style={styles.textColorModalCash}>Qual a forma da promoção?</Text></View>
                            </View>
                            <View style={styles.activeViewToggleButton}>
                                <View style={{marginHorizontal: 5, flex: 1}} ><ToggleButton disabled={this.state.checkBoxValue} text={'Desconto'} selected={this.state.selectedPromocao} onPress={()=>{this.onClickButtonSelected()}} /></View>
                                <View style={{marginHorizontal: 5, flex: 1}}><ToggleButton disabled={this.state.checkBoxValue} text={'CashBack'} selected={this.state.selectedCash} onPress={()=>{this.onClickButtonSelected()}} /></View> 
                            </View>
                            <View style={{flex: 1, flexDirection: "row", justifyContent: "center", alignItems: 'flex-start'}}>
                                <CheckBoxStyled
                                    text={'Resgatar CashBack'}
                                    onChange={()=>{this.onChangeCheckBox()}}
                                    value={this.state.checkBoxValue}
                                />
                            </View>
                            <TouchableOpacity onPress={()=>{this.get_voucher()}} style={styles.buttonVoucher}><Text style={styles.textColorButtonVoucher}>GERAR VOUCHER</Text></TouchableOpacity>
                        </View>
                        <Text style={{color: 'white', fontSize: 15}}>Para sair toque fora da caixa</Text>
                    </TouchableOpacity>
                </Modal>
                <Modal animationType="slide" transparent={true} visible={this.state.modalVoucher} onRequestClose={()=>{this.setState({modalVoucher: false})}}>
                    <TouchableOpacity  onPress={()=>{this.setState({modalVoucher: false})}} style={styles.contentModelTransparent}>
                        <View style={styles.modalContentVoucher}>
                            <View style={{flex: 2, flexDirection: "row"}}>
                                <View style={{ alignItems: 'center', width: '100%' }}>
                                    <Text style={styles.textColorModalVoucher}>Voucher</Text>
                                </View>
                            </View>
                            <View style={{flex: 2, flexDirection: "row"}}>
                                <View style={{ alignItems: 'center', width: '100%'}}><Barcode height={60} value={`${this.state.voucher}`} format="CODE128" /></View>
                            </View>
                            <View style={{flex: 2, flexDirection: "row"}}>
                                <View style={{ alignItems: 'center', width: '100%' }}><Text style={styles.textColorModalVoucher}>{this.state.voucher}</Text></View>
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