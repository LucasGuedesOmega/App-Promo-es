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

const tab = createBottomTabNavigator();

export function Routes(){
 
    return(
        <tab.Navigator screenOptions={{ tabBarStyle: styles.tabBar, tabBarActiveTintColor: 'white', tabBarInactiveTintColor: 'rgb(138, 138, 144)' }}> 
            <tab.Screen options={{ headerShown: false, tabBarStyle: { display: "none" }, tabBarButton: () => null}} name="login" component={Login}/>
            <tab.Screen options={{ unmountOnBlur: true, headerShown: false, tabBarButton: () => null,  tabBarStyle: { display: "none" }}} name="gera_voucher" component={GeraVoucher}/>
            <tab.Screen options={{ unmountOnBlur: true, headerShown: false, title:"Inico", tabBarIcon: ({size, color})=>(<Ionicons name="home" size={size} color={color}/>)}} name="home" component={Home}/>
            <tab.Screen options={{ unmountOnBlur: true, headerShown: false, tabBarItemStyle: {color: 'red'}, title:"Abastecer", tabBarIcon: ({size, color})=>(<View style={styles.buttonAbastecer}><MaterialCommunityIcons name="gas-station" size={size} color={color}/></View>)}} name="promocao" component={Promocao}/>
            <tab.Screen options={{ unmountOnBlur: true, headerShown: false, title:"Produtos", tabBarIcon: ({size, color})=>(<Entypo name="shop" size={size} color={color}/>)}} name="produtos" component={Produtos}/>
        </tab.Navigator>
    );
}