import React from "react";

import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { styles } from "../temas/base";

import api from "../services/api";
import SyncStorage from 'sync-storage';

export class ModelPromocaoCampact extends React.Component{
    constructor(props){
        super(props);
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

        let dados_dict = {
            data_ini: data_ini,
            id_promocao: this.props.items.item.id_promocao,
            id_empresa: this.props.empresa.id_empresa,
            status: true,
            tipoCodigo: 'CASHBACK',
            usado: false
        }

        await api.post("api/v1/gera-voucher", dados_dict, { headers : {Authorization: SyncStorage.get('token')}})
        .then((results)=>{
            console.log(results.data)
            if (results.data.Voucher){
                Alert.alert("Voucher", 
                `${results.data.Voucher}`,
                [
                    {
                        text: "OK",
                        onPress: ()=>{return;}
                    }
                ]
                )
            }
        })
    }

    render(){
        console.log(this.props.empresa)
        return(
            <View>
                <TouchableOpacity style={styles.linhaModelMenu} onPress={()=>{this.get_voucher()}}>
                    <View style={styles.colunaModelMenuImage}>
                        <Image source={{uri: `${this.props.items.item.imagem}`}} style={styles.imgPromoMenu}/>
                    </View>
                    <View style={styles.colunaModelMenu}>
                        <Text style={styles.textModalMenu}>
                            {this.props.items.item.titulo}
                        </Text>
                        <Text style={styles.textModalMenu}>
                            Válido de {this.format_date(this.props.items.item.data_ini)} até {this.format_date(this.props.items.item.data_fim)}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            
        );
    }
}