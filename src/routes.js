import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import { styles } from "./temas/base";
import { Home } from "./Pages/home";
import { Login } from "./Pages/login";

import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";
import { Produtos } from "./Pages/produtos";
import { GeraVoucher } from "./Pages/gerarvoucher";
import { Promocao } from "./Pages/promocao";
import { PaginaInicial } from "./Pages/paginaincial";

import AsyncStorage from "@react-native-async-storage/async-storage";

import api from "./services/api";
import { CadastrarUsuario } from "./Pages/cadastro_usuario";

const tab = createBottomTabNavigator();

export class Routes extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            token: null,
            login: false
        }
    }   

    async componentDidMount(){
        await this.verifica_token()
    }

    async verifica_token(){
        await AsyncStorage.getItem('token')
        .then((token)=>{
            this.setState({
                token: token
            })
        })

        this.confere_token()
    }

    confere_token(){
        if (this.state.token){
            api.post(`api/v1/login-token`, { 'token' : this.state.token }, { headers: { Authorization: this.state.token}})
            .then((results)=>{
                //
            })
            .catch((error)=>{
                console.log(error)
                let login = false;

                if (error.response.data.error === 'Signature verification failed'){
                    login = true;
                }else if(error.response.data.error === 'Token expirado'){
                    login = true;
                }else if(error.response.data.error === 'não autorizado'){
                    login = true;
                }
                
                this.setState({
                    login: login
                })
            })
        }else{
            this.setState({
                login: true,
                home: false
            })
        }
        
    }
    
    render(){
        if (!this.state.token){
            return(
                <tab.Navigator screenOptions={{ tabBarStyle: styles.tabBar, tabBarActiveTintColor: 'white', tabBarInactiveTintColor: 'rgb(138, 138, 144)' }}> 
                    <tab.Screen options={{ headerShown: false, tabBarStyle: { display: "none" }, tabBarButton: () => null}} name="pagina_inicial" component={PaginaInicial}/>
                    <tab.Screen options={{ headerShown: false, tabBarStyle: { display: "none" }, tabBarButton: () => null}} name="login" component={Login}/>
                    <tab.Screen options={{ headerShown: false, tabBarStyle: { display: "none" }, tabBarButton: () => null}} name="cadastro_usuario" component={CadastrarUsuario}/>
                    <tab.Screen options={{ unmountOnBlur: true, headerShown: false, tabBarButton: () => null,  tabBarStyle: { display: "none" }}} name="gera_voucher" component={GeraVoucher}/>
                    <tab.Screen options={{ unmountOnBlur: true, headerShown: false, title:"Inico", tabBarIcon: ({size, color})=>(<Ionicons name="home" size={size} color={color}/>)}} name="home" component={Home}/>
                    <tab.Screen options={{ unmountOnBlur: true, headerShown: false, tabBarItemStyle: {color: 'red'}, title:"Abastecer", tabBarIcon: ({size, color})=>(<View style={styles.buttonAbastecer}><MaterialCommunityIcons name="gas-station" size={size} color={color}/></View>)}} name="promocao" component={Promocao}/>
                    <tab.Screen options={{ unmountOnBlur: true, headerShown: false, title:"Produtos", tabBarIcon: ({size, color})=>(<Entypo name="shop" size={size} color={color}/>)}} name="produtos" component={Produtos}/>
                </tab.Navigator>
            );
        }else if (this.state.login){
            return(
                <tab.Navigator screenOptions={{ tabBarStyle: styles.tabBar, tabBarActiveTintColor: 'white', tabBarInactiveTintColor: 'rgb(138, 138, 144)' }}> 
                    <tab.Screen options={{ headerShown: false, tabBarStyle: { display: "none" }, tabBarButton: () => null}} name="login" component={Login}/>
                    <tab.Screen options={{ headerShown: false, tabBarStyle: { display: "none" }, tabBarButton: () => null}} name="cadastro_usuario" component={CadastrarUsuario}/>
                    <tab.Screen options={{ unmountOnBlur: true, headerShown: false, tabBarButton: () => null,  tabBarStyle: { display: "none" }}} name="gera_voucher" component={GeraVoucher}/>
                    <tab.Screen options={{ unmountOnBlur: true, headerShown: false, title:"Inico", tabBarIcon: ({size, color})=>(<Ionicons name="home" size={size} color={color}/>)}} name="home" component={Home}/>
                    <tab.Screen options={{ unmountOnBlur: true, headerShown: false, tabBarItemStyle: {color: 'red'}, title:"Abastecer", tabBarIcon: ({size, color})=>(<View style={styles.buttonAbastecer}><MaterialCommunityIcons name="gas-station" size={size} color={color}/></View>)}} name="promocao" component={Promocao}/>
                    <tab.Screen options={{ unmountOnBlur: true, headerShown: false, title:"Produtos", tabBarIcon: ({size, color})=>(<Entypo name="shop" size={size} color={color}/>)}} name="produtos" component={Produtos}/>
                </tab.Navigator>
            );
        }else{
            return(
                <tab.Navigator screenOptions={{ tabBarStyle: styles.tabBar, tabBarActiveTintColor: 'white', tabBarInactiveTintColor: 'rgb(138, 138, 144)' }}> 
                    <tab.Screen options={{ unmountOnBlur: true, headerShown: false, title:"Inico", tabBarIcon: ({size, color})=>(<Ionicons name="home" size={size} color={color}/>)}} name="home" component={Home}/>
                    <tab.Screen options={{ unmountOnBlur: true, headerShown: false, tabBarButton: () => null,  tabBarStyle: { display: "none" }}} name="gera_voucher" component={GeraVoucher}/>
                    <tab.Screen options={{ unmountOnBlur: true, headerShown: false, tabBarItemStyle: {color: 'red'}, title:"Abastecer", tabBarIcon: ({size, color})=>(<View style={styles.buttonAbastecer}><MaterialCommunityIcons name="gas-station" size={size} color={color}/></View>)}} name="promocao" component={Promocao}/>
                    <tab.Screen options={{ unmountOnBlur: true, headerShown: false, title:"Produtos", tabBarIcon: ({size, color})=>(<Entypo name="shop" size={size} color={color}/>)}} name="produtos" component={Produtos}/>
                </tab.Navigator>
            );
        }
        
    }
    
}