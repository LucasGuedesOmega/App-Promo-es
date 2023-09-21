import React, { PureComponent } from "react";
import api from "../services/api";
import { View, Text } from "react-native";
import { styles } from "../temas/base";
import Carousel, { Pagination } from "react-native-snap-carousel";
import jwtDecode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ModelPromocoes } from "../model/ModelPromocoes";

export class CarrouselPromo extends PureComponent{
    constructor(props){
        super(props);
        this.state = {
            token: null,
            tokenDecode: null,
            indexPromotions:0,
            promotions: [],
            semana_: this.props.semana,
            contadorError: 0
        }

        this.get_promotion = this.get_promotion.bind(this);
        this.compare_days_of_week = this.compare_days_of_week.bind(this);
    }

    async componentDidMount(){
        await AsyncStorage.getItem('token')
        .then((token)=>{
            this.setState({
                tokenDecode: jwtDecode(token),
                token: token
            })
            
        })
        await this.get_promotion()
    }

    async get_promotion(){
        var promotion_list = [];
        var allPromotions_list = [];
        let hoje = new Date();
        console.log('ola')
        await api.get(`/api/v1/promocao?id_grupo_empresa=${this.state.tokenDecode.id_grupo_empresa}`, { headers : {Authorization:this.state.token}})
        .then((results)=>{
            if (results.data.length > 0){
                
                for(var i=0; i<results.data.length;i++){
                    this.compare_days_of_week(results.data[i])

                    let data_fim_promo = results.data[i].data_fim;
                    let data_ini_promo = results.data[i].data_ini
                    let data_fim = new Date(data_fim_promo.split('/').reverse().join('/'))
                    let data_ini = new Date(data_ini_promo.split('/').reverse().join('/'))

                    if(this.state.semana_ === true && data_fim > hoje && data_ini < hoje && results.data[i].status === true){
                        promotion_list.push(results.data[i])
                    }
                    if(data_fim > hoje && data_ini < hoje && results.data[i].status === true){
                        allPromotions_list.push(results.data[i])
                    }
                }

                if(this.props.semana === true){
                    this.setState({
                        promotions: allPromotions_list
                    })
                }else{
                    this.setState({
                        promotions: promotion_list
                    })
                }
                
            }
        })
        .catch(async (error)=>{
            console.log(error)
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

    pagination_imagens(){
        return (
            <Pagination
                dotsLength={this.state.promotions.length}
                activeDotIndex={this.state.indexPromotions}
                containerStyle={{backgroundColor: 'transparent', maxHeight: '10%'}}
                dotStyle={styles.dotStyle}
                dotContainerStyle={{width: '2%', maxHeight: '0.01%', backgroundColor: 'red'}}
                inactiveDotStyle={styles.inactiveDotStyle}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
                ref={(c)=>{this._pagination2=c;}}
                style={styles.paginationCarousel}
            />
        )
    }

    render(){
        return this.state.promotions.length > 0 ? (
            <View style={styles.carouselPromo}>
                <Carousel 
                    layout="default"
                    ref={(c)=>{this.carouselpromo=c;}}
                    nativeID="carousel_image"
                    sliderWidth={400}
                    itemWidth={400}
                    data={this.state.promotions}
                    renderItem={({item})=> <ModelPromocoes semana={this.props.semana} empresas={this.props.empresas} navigation={this.props.navigation} items={item} />}
                    onSnapToItem={(index)=>{this.setState({indexPromotions: index})}}
                    style={styles.carouselPromo}
                />
                {this.pagination_imagens()}
            </View>
        ):(
            <View style={styles.carouselPromo}>
                <Text style={styles.textSemPromoHome}>Sem promoções para hoje.</Text>
            </View>
        )
    }
}