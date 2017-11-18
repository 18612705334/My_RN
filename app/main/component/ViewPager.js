import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Easing,
    Dimensions,
    Image,
    TouchableWithoutFeedback,
    TouchableOpacity
} from 'react-native';


import ViewPager from 'react-native-viewpager';
const {width, height} = Dimensions.get('window');
import  PixelUtil from '../../utils/PixelUtils'
var Pixel = new PixelUtil();

var IMGS = [
    'https://images.unsplash.com/photo-1441260038675-7329ab4cc264?h=1024',
    'https://images.unsplash.com/photo-1441126270775-739547c8680c?h=1024',
    'https://images.unsplash.com/photo-1440964829947-ca3277bd37f8?h=1024',
    'https://images.unsplash.com/photo-1441126270775-739547c8680c?h=1024',
    'https://images.unsplash.com/photo-1440964829947-ca3277bd37f8?h=1024',
    'https://images.unsplash.com/photo-1440964829947-ca3277bd37f8?h=1024'
];

let ds = new ViewPager.DataSource({pageHasChanged: (p1, p2) => p1 !== p2})

export default  class  ViewPagers extends Component {



    constructor(props){
        super(props)

        let imageItems = [];

        if (this.props.items.length<=0 || this.props.items == null){  //没后数据

            imageItems.push({id: '-200', ret_img: '', ret_url: '', title: ''});

        }else {
            imageItems = this.props.items
        }

        let ds =  new ViewPager.DataSource({pageHasChanged: (p1, p2) => p1 !== p2})

        this.state ={
            source: ds.cloneWithPages(imageItems)
        }


    }

    componentWillReceiveProps(props){
        let imageItems = [];

        if (props.items.length<=0 || props.items == null){  //没后数据

            imageItems.push({id: '-200', ret_img: '', ret_url: '', title: ''});

        }else {
            imageItems = props.items
        }

        let ds =  new ViewPager.DataSource({pageHasChanged: (p1, p2) => p1 !== p2})

        this.setState ( {
            source: ds.cloneWithPages(imageItems)
        })
    }



    render(){
        return(

            <ViewPager
                dataSource = {this.state.source}
                renderPage = {this._renderPage}
                autoPlay = {true}
                isLoop = {true}
                onChangePage = {this.props.onChangePage}
                locked = {this.props.items.length<=1?true:false}
            />

        )
    }

    _renderPage = (data, pageID)=> {

        if (data.ret_img == ''){

            return(
                <Image style={styles.postPosition}
                       source={require('../../../image/mainImage/homebanner.png')}
                />
            )

        }


        return (
            <TouchableOpacity
                onPress = {()=>{
                    if(data.ret_url=='finance'){
                        this.props.toNext();
                    }else if(data.ret_url){
                        this.props.callBack(data.ret_url);
                    }
                }}
                activeOpacity = {1}
            >
                <Image style={styles.postPosition} source={{uri: data.ret_img}}/>
            </TouchableOpacity>



        )
    }

}


const styles = StyleSheet.create({
    postPosition: {
        width: width,
        height: Pixel.getPixel(225),
        resizeMode: 'stretch'
    },
});

