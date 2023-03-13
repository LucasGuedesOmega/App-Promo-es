import React, { PureComponent } from "react";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import Ionicons from "react-native-vector-icons/Ionicons";

import { View, Image, TouchableOpacity, Text, Modal, ScrollView, Alert, TextInput, FlatList } from "react-native";
import { styles } from "../temas/base";
import { ToggleButton } from "../components";

export class ModelPromocoes extends PureComponent{
    constructor(props){
        super(props);
        this.state = {
            token: null,
            openModalView: false,
            promotion: null,
            empresas: this.props.empresas,
            produto: null,
            selectedPromocao: true,
            selectedCash: false,
            openModalViewEmpresas: false,
            empresas_promocao: [],
            empresas_promocao_view: [],
            textWeekDays: null
        }

        this.voltar = this.voltar.bind(this);
        this.get_produto = this.get_produto.bind(this);
        this.format_date = this.format_date.bind(this);
    }       

    async componentDidMount(){
        await AsyncStorage.getItem('token')
        .then((token)=>{
            this.setState({
                tokenDecode: jwtDecode(token),
                token: token
            })
        })

        this.get_produto()
        this.get_day_of_week()
    }
    
    get_day_of_week(){
        let text = "";
        
        if (this.props.items.segunda){
            text = text + " " +  "Segunda"
        }
        if (this.props.items.terca){
            text = text + " " +  "Terça"
        }
        if (this.props.items.quarta){
            text = text + " " + "Quarta"
        }
        if (this.props.items.quinta){
            text = text + " " +  "Quinta"
        }
        if (this.props.items.sexta){
            text = text + " " +  "Sexta"
        }
        if (this.props.items.sabado){
            text = text + " " +  "Sabado"
        }
        if (this.props.items.domingo){
            text = text + " " +  "Domingo"
        }

        this.setState({
            textWeekDays: text
        })
    }

    async voltar() {
        await this.setState({
            openModalView: false,
        })
    }

    async openModal(){
        await this.setState({
            openModalView: true,
        })
    }

    get_produto(){
        api.get(`api/v1/integracao/produto/lista?id_produto=${this.props.items.id_produto}`, { headers: { Authorization: this.state.token}})
        .then((results)=>{
            if (results.data.length>0){
                this.setState({
                    produto: results.data[0]
                })
            }
        })
        .catch((error)=>{
            if (error.response.data.error === 'Signature verification failed'){
                this.props.navigation.navigate('login')
            }else if(error.response.data.error === 'Token expirado'){
                this.props.navigation.navigate('login')
            }else if(error.response.data.error === 'Token expirado'){
                this.props.navigation.navigate('login')
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

    render(){
        let descricao_produto;
        if (this.state.produto){
            descricao_produto = this.state.produto.descricao
        }
   
        return(
            <View style={styles.viewImgPromo}>
                <View style={{flex: 1}}>
                    <Text style={styles.textTituloPromo}>{this.props.items.titulo}</Text>
                </View>
                <View style={{flex: 45}}>
                    <TouchableOpacity style={styles.btImagemPromo} onPress={()=>{this.openModal()}}>
                        <Image source={{uri: `${this.props.items.imagem}`}} style={styles.imgPromo}/>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1}}>
                    <Text style={styles.text}>Valor: {this.props.items.desconto_total}</Text>
                    <Text style={styles.text}>Válido até: {this.format_date(this.props.items.data_fim)}</Text>
                </View>
                <Modal visible={this.state.openModalView} animationType={'fade'}>
                    <View style={styles.content}>
                        <View style={styles.cabecalhoModal}>
                            <TouchableOpacity onPress={()=>{this.voltar()}} style={styles.buttonVoltarModal}>
                                <Text style={styles.textBtVoltarModal}>
                                    <Ionicons name="backspace-sharp" style={styles.backspaceIcon} size={15}/>Voltar
                                </Text>
                            </TouchableOpacity>
                            <Image source={{uri: `${this.props.items.imagem}`}} style={styles.imgPromo} />
                        </View>
                        <View style={styles.corpoModal}>
                            <View style={styles.viewModalPromo}>
                                <View style={styles.viewModalPromoSection}>
                                    <View style={{padding: 10}}>
                                        <Text style={styles.scrollTextTitulo}>{this.props.items.titulo}</Text>
                                        <Text style={styles.textInfo}>{descricao_produto}</Text>
                                    </View>
                                    <View style={{padding: 10}}>
                                        <Text style={styles.scrollTextTitulo}>Infos e Regras</Text>
                                        <Text style={styles.textInfo}>Valido até: {this.format_date(this.props.items.data_fim)}</Text>
                                        <Text style={styles.textInfo}>Desconto por unidade: R${this.props.items.desconto_por_unidade}</Text>
                                        <Text style={styles.textInfo}>Dias da semana:{this.state.textWeekDays}</Text>
                                    </View>
                                    { !this.props.semana ?
                                        (
                                            <View style={{flex: 1}}>
                                                <View style={{padding: 10}}>
                                                    <Text style={styles.scrollTextTitulo}>Como Descontar</Text>
                                                </View>
                                                <View style={styles.viewButtonsDesconto}>
                                                    <View style={{ flex: 1}}><ToggleButton text={'Desconto'} selected={this.state.selectedPromocao} onPress={()=>{this.onClickButtonSelected()}} /></View>
                                                    <View style={{ flex: 1}}><ToggleButton text={'CashBack'} selected={this.state.selectedCash} onPress={()=>{this.onClickButtonSelected()}} /></View>     
                                                </View>
                                            
                                                <View style={styles.viewModalPromoSectionBodyBtVoucher}>
                                                    <TouchableOpacity style={styles.btGeraVoucher} 
                                                    onPress={()=>{this.props.navigation.navigate('gera_voucher', {id_promocao: this.props.items.id_promocao, promocao:this.state.selectedPromocao, cash:this.state.selectedCash})}}>
                                                        <Text style={styles.activeText}>Gerar Voucher</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        ):(
                                            <View></View>
                                        )
                                    }
                                    
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}