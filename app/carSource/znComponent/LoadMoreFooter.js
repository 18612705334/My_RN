import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,

} from 'react-native';
import PixelUtil            from '../../utils/PixelUtils';
const Pixel = new PixelUtil();
import * as fontAnColor from '../../constant/FontAndColor'
import SaasText from "../../component/SaasText";

 class LoadMoreFooter extends Component{

    render(){
        const {isLoadAll,isCarFoot,footAllClick} = this.props;
        return(
            <TouchableOpacity
                onPress={()=>{

                    if(isCarFoot && isLoadAll)
                    {
                        footAllClick();
                    }

                }}

                activeOpacity={1}
            >


                <View

                    style={{
                        flex:1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height:Pixel.getPixel(60) ,
                    }}

                >
                    <SaasText
                        style={{
                            marginLeft: Pixel.getPixel(10),
                            fontSize: Pixel.getFontPixel(fontAnColor.LITTLEFONT28),
                            color: fontAnColor.COLORA2,
                        }}
                    >
                        {isLoadAll ? (isCarFoot?'查看全部车源>' :'已加载全部'): '正在加载更多……'}
                    </SaasText>
                </View>


            </TouchableOpacity>
        )

    }
}

export default LoadMoreFooter