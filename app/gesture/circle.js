import React, {PropTypes, Component} from 'react'
import {StyleSheet, View} from 'react-native'
import PixelUtil from  '../utils/PixelUtils'

var Pixel  = new PixelUtil;

// c + space 添加注释
export default class circle extends Component{

    constructor(props){
        super(props)

    }

    render(){

        let {color, normalColor, fill, x, y, r, inner, outer} = this.props;
        return(

            <View
                style = {[styles.outer,
                    {left:x-r, top:y-r, height:2*r, width:2*r, borderRadius:r},
                    {borderColor:normalColor},
                    fill && {borderColor:color},
                    !outer && {borderWidth:0}
                ]}
            >

                {inner &&
                <View
                    style={[!outer&&styles.inner, {width:2*r/3, height:2*r/3, borderRadius:r/3}, fill && {backgroundColor:color}]}
                />
                }
            </View>
        )
    }
}


circle.propTypes = {
    color: PropTypes.string,
    fill: PropTypes.bool,
    x: PropTypes.number,
    y: PropTypes.number,
    r: PropTypes.number,
    inner: PropTypes.bool,
    outer: PropTypes.bool
}

circle.defaultProps = {
    inner: true,
    outer: true
}

const styles = StyleSheet.create({
    outer:{
        position:'absolute',
        borderColor:'#8E91A8',
        justifyContent:'center',
        alignItems:'center',
        borderWidth:2,
    },
    inner:{
        backgroundColor:'#8E91A8'
    }
})

module.exports = circle;    // for compatible with require only