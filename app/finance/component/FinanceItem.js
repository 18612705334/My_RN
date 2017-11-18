import  React, {Component, PropTypes} from  'react'
import  {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,

} from  'react-native'

import * as fontAndColor    from '../../constant/FontAndColor';

export default class FinanceItem extends Component{

    constructor(props){
        super(props)

    }

    render(){
        return(
            <TouchableOpacity
                onPress = {this.props.onPress}
                style = {{backgroundColor:'white', borderBottomColor:fontAndColor.COLORA1, borderBottomWidth:1}}
            >

                <View style = {styles.up_container}>
                    <Text allowFontScaling = {false} style = {styles.loan_type}>{this.props.data.product_type}</Text>
                    <Text allowFontScaling = {false} style = {styles.name}>{this.props.name}</Text>
                    <Text allowFontScaling = {false} style = {styles.code}>{this.props.data.loan_code}</Text>
                </View>
                <View style = {styles.down_container}>
                    <View style = {{justifyContent:'center', flex:1}}>
                        <Text allowFontScaling = {false} style = {styles.money_title}>借款金额</Text>
                        <Text allowFontScaling = {false} style = {styles.money}>{this.props.data.loan_mny}</Text>
                    </View>
                    <View style = {{justifyContent:'center', flex:1}}>
                        <Text allowFontScaling = {false} style = {styles.time_title}>借款期限</Text>
                        <Text allowFontScaling = {false} style = {styles.time}>{this.props.data.loan_life}</Text>
                    </View>
                    <Text  allowFontScaling = {false} style = {styles.status}>{this.props.data.status_str}</Text>

                </View>
            </TouchableOpacity>

        )
    }
}

const styles = StyleSheet.create({

    up_container:{
        flexDirection:'row',
        height:40,
        alignItems:'center',
        marginHorizontal:15,
        borderBottomWidth:.5,
        borderBottomColor:fontAndColor.COLORA1,

    },

    down_container:{
        flexDirection:'row',
        alignItems:'center',
        marginHorizontal:15,
        height:80
    },

    loan_type:{
        color:fontAndColor.NAVI_BAR_COLOR,
        borderColor:fontAndColor.NAVI_BAR_COLOR,
        borderWidth:1,
        borderRadius:3,
        textAlign:'center',
        paddingHorizontal:4,
        paddingTop:2,

    },
    name:{
        marginLeft:10,
        flex:1,
    },
    code:{
        color:fontAndColor.COLORA1
    },
    money_title:{
        color:fontAndColor.COLORA1,
        marginBottom:10,
    },
    money:{
        color:'red',
        fontSize:17,
    },
    time:{
        fontSize:17,
    },
    time_title:{
        marginBottom:10,
        color:fontAndColor.COLORA1
    },
    status:{
        flex:1,
        textAlign:'center',
        color:fontAndColor.COLORB3,
        borderColor:fontAndColor.COLORA1,
        borderWidth:.5,
        borderRadius:16,
        width:100,
        height:30,
        fontSize:17,
        paddingTop:5
    }

})