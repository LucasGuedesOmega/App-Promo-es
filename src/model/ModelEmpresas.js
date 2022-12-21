import React from "react";

import { TextInputMask } from "react-native-masked-text";
import { View, TouchableOpacity, Text, Modal, FlatList, ToastAndroid, ScrollView } from "react-native";
import { styles } from "../temas/base";

import api from "../services/api";
import SyncStorage from 'sync-storage';

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ModelPromocaoCampact } from "./ModelPromocaoCompactado";
export class ModelEmpresas extends React.PureComponent{
    constructor(props){
        super(props);
        this.state = {
            promocoes: null,
            empresas_promocao: null,
            modalVisible: false,
            textVoucher: '______',
            dados_dict: this.props.dados_dict
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
        
        if (this.state.empresas_promocao){
            let promocoes = [];
            for(let i = 0; i < this.state.empresas_promocao.length; i++){
                await api.get(`api/v1/promocao?id_promocao=${this.state.empresas_promocao[i].id_promocao}`, { headers : {Authorization: SyncStorage.get('token')}})
                .then((results)=>{
                    if (results.data.length > 0){
                        promocoes.push(results.data[0])
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
            
        }
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
            </View>
            
        );
    }
}
