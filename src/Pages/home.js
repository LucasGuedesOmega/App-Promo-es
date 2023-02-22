import React from "react";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";

import { View, ScrollView, Text, FlatList, BackHandler, Alert, ToastAndroid } from "react-native";
import { styles } from "../temas/base";

import { ModelButtons } from "../model/ModelButtons";
import { Cabecalho } from "../components";
import { CarrouselPromo } from "../components/carouselPromocoes";
// import { ModelPostos } from "../model/ModelPostos";


export class Home extends React.PureComponent {
    _isMounted = false;
    constructor(props){
        super(props);
        this.state = {
            token: null,
            tokenDecode: null,
            buttonAcoes: [
                {icon: 'pluscircle'},
                {icon: 'barschart'},
                {icon: 'codesquareo'},
                {icon: 'frown'},
                {icon: 'frown'},
                {icon: 'frown'}
            ],
            empresas: null,
            contadorClicks: 0
        }

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.get_empresas = this.get_empresas.bind(this);
    }

    async componentDidMount(){
        await AsyncStorage.getItem('token')
        .then((token)=>{
            this.setState({
                tokenDecode: jwtDecode(token),
                token: token
            })
        })

        this.get_empresas()

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        let count_clicks = this.state.contadorClicks

        count_clicks ++

        this.setState({
            contadorClicks: count_clicks
        })

        if (count_clicks === 1){
            ToastAndroid.show("Toque mais uma vez para sair.", ToastAndroid.LONG);
        }else if (count_clicks === 2){
            BackHandler.exitApp();
        }
        return true;
    }

    get_empresas(){
        api.get(`/api/v1/empresa?id_grupo_empresa=${this.state.tokenDecode.id_grupo_empresa}`, {headers: { Authorization: this.state.token}})
        .then((results)=>{
            if (results.data.length > 0){
                
                this.setState({
                    empresas: results.data
                })
            }
        })
        .catch((error)=>{
            console.log(error.response, 'ola')
            let count_error = this.state.contadorError;
            if(error.name === "AxiosError"){
                
                count_error += 1
                this.setState({
                    contadorError: count_error
                })
                if (this.state.contadorError === 25){
                    Alert.alert("Atenção", "Sem conexão com a API.",
                    [
                        {
                            text: "OK",
                            onPress: ()=>{return;}
                        }
                    ]
                    )
                }else{
                    this.get_empresas()
                }
            }    
            if (error.response.data.error === 'Signature verification failed'){
                this.props.navigation.navigate('login')
                return;
            }else if(error.response.data.error === 'Token expirado'){
                this.props.navigation.navigate('login')
                return;
            }else if(error.response.data.error === 'Token expirado'){
                this.props.navigation.navigate('login')
                return;
            }else if(error.response.data.erros[0] === 'Sem conexao com a api ou falta fazer login.'){
                this.props.navigation.navigate('login')
                return;
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