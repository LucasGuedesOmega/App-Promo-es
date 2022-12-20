import React from "react";
import { View, TouchableOpacity, Text, Button } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { ModelValores } from "../model/ModelValores";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";

import { styles } from "../temas/base";

export class Cabecalho extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            activeIndexValores: 0,
            valores: [
                {value: "R$ 0.00", titulo: 'CashBack'},
                {value: "R$ 0.01", titulo: 'CashBack'},
                {value: "R$ 0.02", titulo: 'CashBack'},
                {value: "R$ 0.03", titulo: 'CashBack'},
                {value: "R$ 0.04", titulo: 'CashBack'},
                {value: "R$ 0.05", titulo: 'CashBack'},
            ],
        }
    }

    pagination_valores(){
        return (
            <Pagination
                dotsLength={this.state.valores.length}
                activeDotIndex={this.state.activeIndexValores}
                containerStyle={{backgroundColor: 'transparent', maxHeight: '2%'}}
                dotStyle={styles.dotStyle}
                dotContainerStyle={{width: '2%', maxHeight: '0.01%', backgroundColor: 'red'}}
                inactiveDotStyle={styles.inactiveDotStyle}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
                ref={(c)=>{this._pagination=c;}}
            />
        )
    }

    render(){
        return (
            <View style={styles.cabecalho}>
                <View style={styles.cabecalhoSection}>
                    <Carousel
                        loop
                        layout="default"
                        ref={(c)=>{this._carousel=c;}} 
                        nativeID="carousel_valores"
                        sliderWidth={100} 
                        itemWidth={100}
                        data={this.state.valores} 
                        autoplay={true}
                        autoplayDelay={3000}
                        autoplayInterval={3000}
                        renderItem={({item})=> <ModelValores items={item} />}
                        onSnapToItem={(index)=>{this.setState({activeIndexValores: index})}}
                    />
                    {this.pagination_valores()}
                </View>
                <View style={styles.cabecalhoSection2}>
                    <TouchableOpacity style={styles.buttonCart}>
                        <Text><FontAwesome style={styles.icons} name="shopping-cart" size={30} color={30}/></Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonAlert}>
                        <Text><Ionicons style={styles.icons} name="notifications" size={30} color={30}/></Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonUser}>
                        <Text><FontAwesome name="user" size={30} color={30}/></Text>
                    </TouchableOpacity>
                </View>
            </View>
        );

    }
}

export class ToggleButton extends React.Component{
    constructor(props){
        super(props);
        this.onClickButton = this.onClickButton.bind(this);
    }

    onClickButton(){
        this.props.onPress?.();
    }

    render(){
        return(
            <TouchableOpacity style={this.props.selected ? styles.activeButtonSelected : styles.buttonNotSelected} onPress={this.onClickButton}>
                <Text style={this.props.selected ? styles.activeText : styles.notActiveText}>{`${this.props.text}`}</Text>
            </TouchableOpacity>
        )
    }
}