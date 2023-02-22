import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import { styles } from "./temas/base";
import { Home } from "./Pages/home";
import { Login } from "./Pages/login";

import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Entypo from "react-native-vector-icons/Entypo";
import { Produtos } from "./Pages/produtos";
import { GeraVoucher } from "./Pages/gerarvoucher";
import { Promocao } from "./Pages/promocao";
import { PaginaInicial } from "./Pages/paginaincial";
import { ConfirmaEmail } from "./Pages/confirma_email";
import { CadastrarUsuario } from "./Pages/cadastro_usuario";
import { Mapa } from "./Pages/mapa";
import { Resgate } from "./Pages/resgate";

const tab = createBottomTabNavigator();

export class Routes extends React.Component{
    constructor(props){
        super(props)
    }
    
    render(){
       
        return(
            <tab.Navigator screenOptions={{ tabBarStyle: styles.tabBar, tabBarActiveTintColor: 'white', tabBarInactiveTintColor: 'rgb(138, 138, 144)' }}> 
                <tab.Screen options={{ headerShown: false, tabBarStyle: { display: "none" }, tabBarButton: () => null}} name="pagina_inicial" component={PaginaInicial}/>
                <tab.Screen options={{ headerShown: false, tabBarStyle: { display: "none" }, tabBarButton: () => null}} name="login" component={Login}/>
                <tab.Screen options={{ headerShown: false, tabBarStyle: { display: "none" }, tabBarButton: () => null}} name="cadastro_usuario" component={CadastrarUsuario}/>
                <tab.Screen options={{ headerShown: false, tabBarStyle: { display: "none" }, tabBarButton: () => null}} name="confirma_email" component={ConfirmaEmail}/>
                <tab.Screen options={{ unmountOnBlur: true, headerShown: false, tabBarButton: () => null,  tabBarStyle: { display: "none" }}} name="gera_voucher" component={GeraVoucher}/>
                <tab.Screen options={{ unmountOnBlur: true, headerShown: false, title:"Inicio", tabBarIcon: ({size, color})=>(<Ionicons name="home" size={size} color={color}/>)}} name="home" component={Home}/>
                <tab.Screen options={{ unmountOnBlur: true, headerShown: false, title:"Mapa", tabBarIcon: ({size, color})=>(<MaterialCommunityIcons name="google-maps" size={size} color={color}/>)}} name="mapa" component={Mapa}/>
                <tab.Screen options={{ unmountOnBlur: true, headerShown: false, tabBarItemStyle: {color: 'red'}, title:"Abastecer", tabBarIcon: ({size, color})=>(<View style={styles.buttonAbastecer}><MaterialCommunityIcons name="gas-station" size={size} color={color}/></View>)}} name="promocao" component={Promocao}/>
                <tab.Screen options={{ unmountOnBlur: true, headerShown: false, title:"Resgate", tabBarIcon: ({size, color})=>(<FontAwesome5 name="money-bill-wave" size={size} color={color}/>)}} name="resgate" component={Resgate}/>
                <tab.Screen options={{ unmountOnBlur: true, headerShown: false, title:"Produtos", tabBarIcon: ({size, color})=>(<Entypo name="shop" size={size} color={color}/>)}} name="produtos" component={Produtos}/>
            </tab.Navigator>
        );
    }
    
}