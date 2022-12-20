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
    grid_view:{
        flex: 1.5,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center', 
        minHeight: 110
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
    buttonCart: {
        margin: 10
    },
    buttonAlert: {
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
    viewScrollSectionFooter: {
        flex: 1,
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
    textModalPromo: {
        color: TEXTCOLOR,
        textAlign: 'center',
        fontSize: 17
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
    cabecalhoSectionImg: {
        flex: 1,
        justifyContent: "center",
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
    imgPromoModal: {
        width: '100%',
        height: '100%'
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
        backgroundColor: BUTTONSCOLORS,
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
        borderColor: BUTTONSCOLORS,
        maxHeight: 45
    },
    activeText: {
        color: THIRDCONTENTCOLOR,
        textAlign: 'center'
    },
    notActiveText: {
        color: BUTTONSCOLORS,
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
        flexDirection: 'row'
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
        padding: 0
    },
    iconLupa:{
        justifyContent: 'center',
        alignItems: 'center',
    },
    btVolatrModalEmpresa:{
        flexDirection: 'row',
        justifyContent: 'center',
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
    bodyVoucher: {
        flex: 8,
        width: '100%',
        backgroundColor: CONTENTCOLORTRASPARENTVOUCHER,
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
    colunaModelEmpresa:{
        flex: 3,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
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
    }
});