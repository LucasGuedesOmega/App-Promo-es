import { StyleSheet } from "react-native";

const CONTENTCOLOR = '#26262c';
const SECONDCONTENTCOLOR = 'rgb(108, 108, 114)'
const THIRDCONTENTCOLOR = 'rgb(255, 255, 255)'
const CONTENTCOLORTRASPARENT = 'rgba(38, 38, 44, 0.74)';
const BUTTONSCOLORS = 'rgba(3, 20, 100, 0.92)'
const INPUTSCOLOR = 'rgb(180, 180, 180)'
const TEXTCOLOR = 'rgb(100, 100, 100)'
const TITLESCOLOR = 'rgb(210, 210, 210)'
const CONTENTCOLORTRASPARENTVOUCHER = 'rgba(68, 68, 74, 0.74)';

export const styles = StyleSheet.create({
    content: {
        height: '100%',
        flexDirection: 'column',
        backgroundColor: CONTENTCOLOR,
        alignItems: 'center'
    },
    text: {
        color: 'black'
    },
    input: {
        color: THIRDCONTENTCOLOR,
        minWidth: '80%',
        borderWidth: 1,
        borderRadius: 7,
        borderColor: INPUTSCOLOR,
        margin: '1.8%',
        fontSize: 18,
        paddingLeft: 5
    },
    button:{ 
        backgroundColor: BUTTONSCOLORS,
        minWidth: '40%',
        borderRadius: 8,
        padding: "3%"
    },
    title: {
        fontSize: 35,
        fontFamily: 'Roboto',
        color: TITLESCOLOR
    },
    cabecalho:{
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent'
    },
    cabecalhoSection: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
        margin: '2%'
    },  
    cabecalhoSection2: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: 'center',
        margin: '2%'
    },  
    corpo: {
        flex: 5,
        backgroundColor: THIRDCONTENTCOLOR,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        width: '100%',
    },
    tabBar:{
        backgroundColor: CONTENTCOLOR,
        color: THIRDCONTENTCOLOR,
        borderTopColor: 'transparent',
        activeTintColor: '#fff',
    },
    icons: {
        color: THIRDCONTENTCOLOR,
        width: '30px',
        height: '30px'
    },
    colunaModel:{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    linhaModel: {
        flexDirection: "row"
    },
    modelValoresText: {
        color: THIRDCONTENTCOLOR,
        fontFamily: 'Roboto',
        fontSize: 20,
        fontWeight: 'bold'
    },
    dotStyle: {
        width: 10,
        height: 10,
        borderRadius: 10,
        marginHorizontal: 8,
        backgroundColor: BUTTONSCOLORS,
        marginBottom: 70
    },
    inactiveDotStyle: {
        backgroundColor: SECONDCONTENTCOLOR,
    },
    buttonUser: {
        backgroundColor: THIRDCONTENTCOLOR,
        width: 55,
        height: 55,
        borderRadius: 90,
        borderWidth: 2,
        borderColor: SECONDCONTENTCOLOR,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10
    },
    scrollView:{
        padding: 2,
    },
    viewScrollSection: {
        flex: 1,
        flexDirection: 'column',
        paddingHorizontal: 0
    },
    viewScrollSectionHeader: {
        flex: 1,
        justifyContent: 'flex-start',
        padding: 10
    },
    viewScrollSectionBody:{
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 13
    },
    viewScrollSectionBodyCarousel: {
        minHeight: 450,
        justifyContent: 'center'
    },
    scrollTextTitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: TEXTCOLOR,
        margin: '1%'
    },
    imgPromo: {
        width: '95%',
        height: '100%',
        borderRadius: 7,
    },
    viewImgPromo: {
        flex: 3,
        paddingHorizontal: "2.7%"
    },
    viewButtons:{
        flex: 1
    },
    btAcoes:{
        backgroundColor: SECONDCONTENTCOLOR,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        borderRadius: 6,
        marginHorizontal: 15,
        marginBottom: 5,
        flex: 1
    },
    carouselPromo: {
        flex: 1
    },
    cabecalhoModal: {
        flex: 2,
        width: '100%', 
        justifyContent: 'center',
        alignItems: 'center'
    },
    corpoModal:{
        flex: 5,
        backgroundColor: THIRDCONTENTCOLOR,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        width: '100%',
        padding: 1
    },
    buttonVoltarModal: {
        zIndex: 1,
        position: 'absolute',
        top: '2%',
        left: '79%'
    },
    textBtVoltarModal: {
        backgroundColor: CONTENTCOLORTRASPARENT,
        padding: '2%',
        borderRadius: 7
    },
    btPostos: {
        backgroundColor: BUTTONSCOLORS,
        padding: 15,
        flex: 1,
        margin: 5,
        justifyContent: "center",
        alignItems: 'center',
        borderRadius: 100,
    },
    btTextPostos: {
        color: THIRDCONTENTCOLOR,
        fontSize: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    activeButtonSelected: {
        backgroundColor: CONTENTCOLOR,
        padding: 10,
        borderRadius: 20,
        flex: 1,
        borderWidth: 1,
        maxHeight: 45
    },
    buttonNotSelected: {
        backgroundColor: THIRDCONTENTCOLOR,
        padding: 10,
        borderRadius: 20,
        flex: 1,
        borderWidth: 1,
        borderColor: CONTENTCOLOR,
        maxHeight: 45
    },
    activeText: {
        color: THIRDCONTENTCOLOR,
        textAlign: 'center'
    },
    notActiveText: {
        color: CONTENTCOLOR,
        textAlign: 'center'
    },
    textInfo: {
        color: SECONDCONTENTCOLOR,
        margin: '1%'
    },
    btGeraVoucher: {
        backgroundColor: BUTTONSCOLORS,
        padding: 10,
        borderRadius: 20,
        borderWidth: 1,
        flex: 1,
        maxHeight: 50
    },
    contentHeaderEmpresa:{
        flex: 1,
        flexDirection: 'row',
        margin: '1%'
    },  
    viewTitleEmpresa: {
        flex: 1,
        padding: 15,
        width: '100%',
    },  
    viewVoltarModalEmpresa:{
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        width: '100%',
        padding: 17
    },
    viewSearch: {
        marginVertical: 5,
        marginHorizontal: '15%',
        flexDirection: 'row',
        borderBottomColor: INPUTSCOLOR,
        borderBottomWidth: 1
    },
    inputSearch: {
        width: '100%',
        padding: 0,
        margin: '1%'
    },
    iconLupa:{
        justifyContent: 'center',
        alignItems: 'center',
        margin: '1%'
    },
    backspaceIcon: {
        margin: 2
    },
    headerVoucher:{
        flex: 2,
        marginBottom: 3,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 10,
        width: '100%',
    },
    headerPromocao:{
        flex: 1.2,
        marginBottom: 3,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 10,
        width: '100%',
    },
    bodyVoucher: {
        flex: 8,
        width: '100%',
        backgroundColor: THIRDCONTENTCOLOR,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    iconVoltar:{
        marginTop: 2
    },
    linhaModelEmpresa: {
        flexDirection: "row",
        paddingVertical: 20,
        borderBottomColor: INPUTSCOLOR,
        borderBottomWidth: 1
    },
    colunaModelEmpresaInfo:{
        flex: 3,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    colunaModelEmpresaIcone:{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleEmpresa:{
        fontSize: 19
    },
    viewModalPromo:{
        flex: 1
    },
    viewModalPromoSection: {
        flex: 1,
        flexDirection: 'column'
    },
    viewModalPromoSectionBody: {
        flex: 1,
        padding: 10,
    },
    viewModalPromoSectionBodyBtVoucher:{
        flex: 3,
        padding: 10,
        justifyContent: 'flex-end'
    },
    viewButtonsDesconto: {
        flex: 1,
        flexDirection: 'row'
    },
    buttonAbastecer:{
        backgroundColor: '#09649d',
        width: '38%',
        height: '150%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: "15%",
        borderRadius: 45
    },
    centeredModalMenu: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalView: {
        flexDirection: 'column',
        backgroundColor: 'white',
        alignItems: 'center',
    },
    headerModalMenu: {
        width: '100%',
        flexDirection: 'row',
        backgroundColor: CONTENTCOLOR,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
    },
    bodyModalMenu: {
        flex: 7,
        width: '100%',
        flexDirection: 'column'
    },
    textModalMenuTitulo: {
        color: TEXTCOLOR,
        fontSize: 20
    },
    textModalMenu: {
        color: TEXTCOLOR,
        fontSize: 15
    },
    listModalMenu: {
        padding: 10,
        height: '100%',
        borderTopWidth: 2,
        borderTopColor: INPUTSCOLOR
    },
    headerModalMenuTitulo:{
        flex: 2,
        alignItems: 'flex-start'
    },
    headerModalMenuVoltar: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    headerModalTextTitulo:{
        fontSize: 25,
        color: 'white'
    },
    backspaceIconModelMenu:{
        color: 'white'
    },
    buttonVoltarModalMenu:{
        flex: 1,
        marginTop: '6%',
        marginLeft: '2%'
    },
    colunaModelMenu:{
        flex: 3,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    colunaModelMenuImage: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginRight: '5%'
    },
    imgPromoMenu: {
        width: '100%',
        height: '100%',
    },
    linhaModelMenu: {
        flex: 1,
        flexDirection: "row",
        marginVertical: '1%',
        borderBottomWidth: 1,
        borderBottomColor: INPUTSCOLOR,
        paddingBottom: 10
    },
    textModelProdutos: {
        color: TEXTCOLOR
    },
    colunaModelProduto:{
        flex: 3,
        paddingHorizontal: 5,
        justifyContent: "flex-start",
        alignItems:'center'
    },
    linhaModelProduto:{
        flex: 1,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: INPUTSCOLOR,
        paddingVertical: 25,
    },
    contentModelTransparent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: CONTENTCOLORTRASPARENTVOUCHER
    },
    modalContentCashBack: {
        width: "85%",
        height: "25%",
        backgroundColor: THIRDCONTENTCOLOR,
        borderRadius: 4
    },
    modalContentVoucher: {
        flexDirection: 'column',
        width: "85%",
        height: "50%",
        backgroundColor: THIRDCONTENTCOLOR,
        borderRadius: 4,
        zIndex: 1000
    },
    textColorModalCash: {
        fontSize: 15,
        color: TEXTCOLOR
    },
    textColorModalVoucher: {
        fontSize: 20,
        color: TEXTCOLOR,
        textAlign: "center"
    },
    textColorModalVoucherAviso: {
        fontSize: 20,
        color: CONTENTCOLOR,
        textAlign: "center"
    },
    buttonVoucher: {
        flex: 0.8,
        width: '100%',
        backgroundColor: CONTENTCOLOR,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
    },
    textColorButtonVoucher: {
        color: THIRDCONTENTCOLOR,
        fontSize: 15
    },
    viewListaPromocao: {
        width: '100%',
        flexDirection: 'row'
    },
    headerPaginainicial:{
        flex: 3,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: CONTENTCOLOR
    },
    bodyPaginainicial:{
        flex: 6,
        width: '100%',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: THIRDCONTENTCOLOR,
        flexDirection: 'column'
    },
    footerPaginainicial:{
        flex: 3,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: THIRDCONTENTCOLOR
    },
    styledText: {
        fontSize: 15,
        color: CONTENTCOLOR
    },
    styledTextWhite: {
        fontSize: 15,
        color: THIRDCONTENTCOLOR
    },
    styledButton: {
        backgroundColor: CONTENTCOLOR,
        borderWidth: 1,
        borderColor: THIRDCONTENTCOLOR,
        borderRadius: 23,
        padding: 10,
        width: "40%",
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5
    },
    styledButtonWhite: {
        backgroundColor: THIRDCONTENTCOLOR,
        borderWidth: 1,
        borderColor: CONTENTCOLOR,
        borderRadius: 23,
        padding: 10,
        width: "40%",
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5
    },
    textButtonEntrar: {
        fontSize: 15,
        color: CONTENTCOLOR
    },
    headerBodyPaginaInicial: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    bodyBodyPaginaInicial: {
        flex: 1.5,
        width: '100%',
        alignItems: 'center'
    },
    styledTituloText: {
        fontSize: 25,
        color: CONTENTCOLOR
    }
});