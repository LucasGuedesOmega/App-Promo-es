import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { styles } from "../temas/base";

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