import React from "react";
import api from "../services/api";
import SyncStorage from 'sync-storage';
import jwtDecode from "jwt-decode";

import { View, ScrollView, Text, FlatList, BackHandler, Alert} from "react-native";
import { styles } from "../temas/base";

import { ModelButtons } from "../model/ModelButtons";
import { Cabecalho } from "../components";
import { CarrouselPromo } from "../components/carouselPromocoes";
import { ModelPostos } from "../model/ModelPostos";


export class Home extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            token: null,
            buttonAcoes: [
                {icon: 'pluscircle'},
                {icon: 'barschart'},
                {icon: 'codesquareo'},
                {icon: 'frown'},
                {icon: 'frown'},
                {icon: 'frown'}
            ],
            empresas: null
        }

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.get_empresas = this.get_empresas.bind(this);
    }

    async componentDidMount(){
        await this.setState({
            token: jwtDecode(SyncStorage.get('token')) 
        })

        this.get_empresas()

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    
    handleBackButtonClick() {
        this.props.navigation.goBack(null);
        return true;
    }

    get_empresas(){
        api.get(`/api/v1/empresa?id_grupo_empresa=${this.state.token.id_grupo_empresa}`, {headers: { Authorization: SyncStorage.get('token')}})
        .then((results)=>{
            if (results.data.length > 0){
                
                this.setState({
                    empresas: results.data
                })
            }
        })
        .catch((error)=>{
            console.log(error)
            let count_error = 0
            if(error.name === "AxiosError"){
                this.get_empresas()
                count_error += 1
                if (count_error > 10){
                    Alert.alert("Atenção", "Sem conexão com a API.",
                    [
                        {
                            text: "OK",
                            onPress: ()=>{return;}
                        }
                    ]
                    )
                }
            }else if (error.response.data.error === 'Signature verification failed'){
                this.props.navigation.navigate('login')
            }else if(error.response.data.error === 'Token expirado'){
                this.props.navigation.navigate('login')
            }else if(error.response.data.error === 'Token expirado'){
                this.props.navigation.navigate('login')
            }
        })
    }

    render(){
        return (
            <View style={styles.content}>
                <Cabecalho/>
                <View style={styles.corpo}>
                    <ScrollView style={styles.scrollView}>
                        <View style={styles.viewScrollSection}>
                            <View style={styles.viewScrollSectionHeader}>
                                <Text style={styles.scrollTextTitulo}>Ações</Text>
                            </View>
                            <View style={styles.viewScrollSectionBody}>
                                <FlatList 
                                    data={this.state.buttonAcoes}
                                    horizontal={true}
                                    renderItem={({item})=><ModelButtons items={item} />}
                                />
                            </View>
                        </View>
                        {/* <View style={styles.viewScrollSection}>
                            <View style={styles.viewScrollSectionHeader}>
                                <Text style={styles.scrollTextTitulo}>Postos</Text>
                            </View>
                            <View style={styles.viewScrollSectionBody}>
                                <FlatList 
                                    data={this.state.empresas}
                                    horizontal={true}
                                    renderItem={({item})=><ModelPostos items={item} />}
                                />
                            </View>
                        </View> */}
                        <View style={styles.viewScrollSection}>
                            <View style={styles.viewScrollSectionHeader}>
                                <Text style={styles.scrollTextTitulo}>Promoções do dia</Text>
                            </View>
                            <View style={styles.viewScrollSectionBodyCarousel}>
                                <CarrouselPromo semana={false} navigation={this.props.navigation} empresas={this.state.empresas} />
                            </View>
                        </View>
                        <View style={styles.viewScrollSection}>
                            <View style={styles.viewScrollSectionHeader}>
                                <Text style={styles.scrollTextTitulo}>Promoções da semana</Text>
                            </View>
                            <View style={styles.viewScrollSectionBodyCarousel}>
                                <CarrouselPromo semana={true} navigation={this.props.navigation} empresas={this.state.empresas} />
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}