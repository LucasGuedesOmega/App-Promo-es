import React, { PureComponent } from "react";
import api from "../services/api";
import { View } from "react-native";
import { styles } from "../temas/base";
import Carousel, { Pagination } from "react-native-snap-carousel";
import jwtDecode from "jwt-decode";
import SyncStorage from 'sync-storage';
import { ModelPromocoes } from "../model/ModelPromocoes";

export class CarrouselPromo extends PureComponent{
    constructor(props){
        super(props);
        this.state = {
            token: null,
            indexPromotions:0,
            promotions: [],
            semana_: this.props.semana
        }

        this.get_promotion = this.get_promotion.bind(this);
        this.compare_days_of_week = this.compare_days_of_week.bind(this);
    }

    async componentDidMount(){
        await this.setState({
            token: jwtDecode(SyncStorage.get('token')) 
        })

        this.get_promotion()
    }

    async get_promotion(){
        var promotion_list = [];
        var allPromotions_list = [];
        let hoje = new Date();
        
        await api.get(`/api/v1/promocao?id_empresa=${this.state.token.id_empresa}`, { headers: { Authorization: SyncStorage.get('token')}})
        .then(async (results)=>{
            if (results.data.length > 0){
                for(var i=0; i<results.data.length;i++){
                    await this.compare_days_of_week(results.data[i])

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
        .catch((error)=>{
            if (error.name === 'AxiosError'){
                this.get_promotion()
            }else if (error.response.data.error === 'Signature verification failed'){
                this.props.navigation.navigate('login')
            }else if(error.response.data.error === 'Token expirado'){
                this.props.navigation.navigate('login')
            }else if(error.response.data.error === 'Token expirado'){
                this.props.navigation.navigate('login')
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
            />
        )
    }

    render(){
        return(
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
                />
                {this.pagination_imagens()}
            </View>
        );
    }
}