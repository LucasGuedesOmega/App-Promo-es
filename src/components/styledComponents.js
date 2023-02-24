import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "../temas/base";

import { TextInputMask } from "react-native-masked-text";
import { Checkbox } from 'react-native-paper';

import Entypo from "react-native-vector-icons/Entypo";
export class StyledText extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <Text style={styles.styledText}>{this.props.children}</Text>
        );
    }
}

export class StyledTituloText extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <Text style={styles.styledTituloText}>{this.props.children}</Text>
        );
    }
}

export class StyledTextWhite extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <Text style={styles.styledTextWhite}>{this.props.children}</Text>
        );
    }
}

export class StyledButton extends React.Component{
    constructor(props){
        super(props)
        this.onClickButton = this.onClickButton.bind(this);
    }

    onClickButton(){
        this.props.onPress?.();
    }

    render(){
        return(
            <TouchableOpacity style={styles.styledButton} onPress={this.onClickButton}>
                <StyledTextWhite>{this.props.children}</StyledTextWhite>
            </TouchableOpacity>
        );
    }
}

export class StyledButtonCadastro extends React.Component{
    constructor(props){
        super(props)
        this.onClickButton = this.onClickButton.bind(this);
    }

    onClickButton(){
        this.props.onPress?.();
    }

    render(){
        return(
            <TouchableOpacity style={styles.styledButtonCadastro} onPress={this.onClickButton}>
                
                { 
                this.props.ativo ?
                <StyledTextWhite>
                    {this.props.children}
                </StyledTextWhite>
                
                :
                this.props.children
                }
            </TouchableOpacity>
        );
    }
}


export class StyledButtonWhite extends React.Component{
    constructor(props){
        super(props)
        this.onClickButton = this.onClickButton.bind(this);
    }

    onClickButton(){
        this.props.onPress?.();
    }

    render(){
        return(
            <TouchableOpacity style={styles.styledButtonWhite} onPress={this.onClickButton}>
                <Text style={styles.textButtonEntrar}>{this.props.children}</Text>
            </TouchableOpacity>
        );
    }
}

export class StyledInput extends React.Component{
    constructor(props){
        super(props)
        this.onChangeInput = this.onChangeInput.bind(this);
    }

    onChangeInput(text){
        this.props.onChange?.(text);
    }

    render(){
        return(
            <View style={styles.contentInputStyled}>
                <Text style={{marginHorizontal: 5}}>{this.props.children}</Text>
                <TextInput
                    onChangeText={(text)=>{this.onChangeInput(text)}}
                    value={this.props.value}
                    style={styles.textInputStyled}
                    placeholder={this.props.placeholder}
                    placeholderTextColor={styles.placeholderColor.color}
                    secureTextEntry={this.props.isPassword}
                />
            </View>
            
        );
    }
}

export class StyledInputPassword extends React.Component{
    constructor(props){
        super(props)
        this.onChangeInput = this.onChangeInput.bind(this);
        this.state = {
            isPassword: true,
            value: this.props.value
        }
    }

    onChangeInput(value){
        this.props.onChange?.(value);
    }

    changeEye(){    
        if (this.state.isPassword){
            this.setState({
                isPassword: false
            })
        }else{
            this.setState({
                isPassword: true
            })
        }
    }

    render(){
        return(
            <View style={styles.contentInputStyledPassword}>
                <Text style={{marginHorizontal: 5}}>{this.props.children}</Text>
                <TextInput
                    onChangeText={(value)=>{this.onChangeInput(value)}}
                    style={styles.textInputStyled}
                    placeholder={this.props.placeholder}
                    placeholderTextColor={styles.placeholderColor.color}
                    secureTextEntry={this.state.isPassword}
                    value={this.state.value}
                />
                <TouchableOpacity onPress={()=>{this.changeEye()}}>
                    <Entypo name={ this.state.isPassword ? "eye" : "eye-with-line"} size={20} style={styles.iconInputStyled}/>
                </TouchableOpacity>
            </View>
            
        );
    }
}

export class StyledInputMasked extends React.Component{
    constructor(props){
        super(props)
        this.onChangeInput = this.onChangeInput.bind(this);
        this.state = {
            cpf: this.props.value
        }
    }

    onChangeInput(value){
        this.props.onChange?.(value);
    }

    render(){
        return(
            <View style={styles.contentInputStyled}>
                <Text style={{marginHorizontal: 5}}>{this.props.children}</Text>
                <TextInputMask
                    onChangeText={(value)=>{this.onChangeInput(value)}}
                    style={styles.textInputStyled}
                    placeholder={this.props.placeholder}
                    placeholderTextColor={styles.placeholderColor.color}
                    type={this.props.type}
                    value={this.state.cpf}
                />
            </View>
            
        );
    }
}

export class CheckBoxStyled extends React.Component{
    constructor(props){
        super(props)
        this.state = {
           
        }
    }
    
    onChange(){
        this.props.onChange?.();
    }

    render(){
        return(
            <View style={styles.contentCheckStyled}>
                <Checkbox
                    status={this.props.value ? 'checked': 'unchecked'}
                    onPress={()=>{this.onChange()}}
                    style={styles.checkBoxStyled}
                />
                <Text style={styles.iconInputStyled}>{this.props.text}</Text>
            </View>
        );
    }
}