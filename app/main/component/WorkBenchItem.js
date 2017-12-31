import React, {Component, PureComponent} from 'react';
import {
    AppRegistry,
    View,
    TouchableOpacity,
    Text,
    Image,
    StyleSheet,
    Dimensions,
} from 'react-native';

let {height, width} = Dimensions.get('window');
import  PixelUtil from '../../utils/PixelUtils'
import  * as fontAndColor from '../../constant/FontAndColor'
var Pixel = new PixelUtil();
import HomeJobButton from './HomeJobButton';

export default class WorkBenchItem extends PureComponent{

    constructor(props){
        super(props)
        this.list = this.props.items.childList
    }


    render(){
        let childList = []
        this.list.map((item, index)=>{

            childList.push(
                 <HomeJobButton
                        key = {index}
                        image = {item.image}
                        name = {item.name}
                        click = {()=>{
                            this.props.callBack({id:item.id,name:item.componentName, component:item.component, params:{}})
                        }}
                />
            )

        })

        return(
            <View  style = {styles.container}>
                <View  style = {styles.title_container}>
                    <View style = {{backgroundColor:fontAndColor.NAVI_BAR_COLOR, width:4}}/>
                    <Text allowFontScaling = {false} style = {{color:fontAndColor.COLORA1,marginLeft:5, fontSize:15}}>{this.props.items.name}</Text>

                </View>
                <View style = {styles.item_container} >
                    {childList}
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({

    container:{
        backgroundColor:'white',


    },
    title_container:{
        flexDirection:'row',
        paddingLeft:15,
        marginTop:15,

    },
    item_container:{
        flexDirection:'row',
        flexWrap:'wrap',
        marginVertical:5,
    }

})