/**
 * Created by lhc on 2017/2/20.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    TouchableOpacity,
} from 'react-native';
import BaseComponent from '../../component/BaseComponent';
import AllNavigationView from '../../component/AllNavigationView'
import {LendDatePike,LendInputItem,CommenButton} from './component/ComponentBlob'

import {adapeSize,width,PAGECOLOR} from './component/MethodComponent'

export default class CGDaddCarScenes extends BaseComponent{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        const ds = new ListView.DataSource(
            {
                getRowData: this.getRowData,
                getSectionHeaderData: this.getSectionData,
                rowHasChanged: (row1, row2)=>row1 !== row2,
                sectionHeaderHasChanged: (s1, s2)=>s1 !== s2,
            })

        this.state = {

            dataSource: ds.cloneWithRowsAndSections(this.titleBlob)
        };
    }

    getSectionData = (dataBlob,sectionID) => {

        return dataBlob[sectionID];
    }
    getRowData = (datatBlob,sectionId,rowId)=>{

        return datatBlob[sectionId][rowId];
    }

    renderSeparator =(sectionID,rowId,adjacentRowHighlighted)=>{

        return (
            <View key={`${sectionID}-${rowId}`} style={{
                height:adjacentRowHighlighted?1:1,
                backgroundColor:adjacentRowHighlighted?'#3B5998' : '#CCCCCC'
            }}>

            </View>
        )
    }


    renderRow=(rowData,sectionId,rowId,highLight)=>{


        if ((sectionId==='1'&&rowId==='0'||rowId==='2')||sectionId==='2'){

            return <LendInputItem title={rowData.title} placeholder={rowData.placeHodel} unitStyle={{width:0}}/>
        }else {

            return <LendDatePike imageStyle={{width:15,height:15}} lefTitle={rowData.title} placeholder={rowData.placeHodel} imageSouce={require('../../../image' +
                '/mainImage/celljiantou.png')}/>
        }



    }

    renderSectionHeader =(_,sectionId)=>{



        return (
            <View style={{backgroundColor:'#f0eff5',flexDirection:'row',height:10 ,alignItems:'center', paddingLeft:15}}>
            </View>

        )


    }
    titleBlob =[

        section1=[

            {title:'出售城市',placeHodel:'请选择',key:'cityName'},
            {title:'选择车型',placeHodel:'请选择',key:'carType'}
        ],
        section2=[
            {title:'车架号',placeHodel:'请输入',key:'carFrameNum'},
            {title:'外观颜色',placeHodel:'请选择',key:'color'},
            {title:'行驶里程',placeHodel:'请输入',key:'licheng'},
            {title:'首次上牌时间',placeHodel:'请选择',key:'date'},
            {title:'收车人',placeHodel:'请选择',key:'people'},
        ],
        section3=[

            {title:'收购价(万元)',placeHodel:'请输入',key:'price'},

        ]
    ];

    render() {

        return (
            <View style={{flex:1,backgroundColor:PAGECOLOR.COLORA3}}>
                <ListView
                    removeClippedSubviews={false}
                    style={{marginTop:64}}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow }
                    renderSectionHeader={this.renderSectionHeader}
                    renderSeparator={this.renderSeparator}
                />
                <CommenButton textStyle={{color:'white'}}buttonStyle={styles.buttonStyleLeft} onPress={()=>{

                }} title="下一步"/>
                <AllNavigationView title='添加车辆' backIconClick={()=>{
                    this.backPage();
                }}/>
            </View>
        )
    }

}

const styles= StyleSheet.create({

    buttonStyleLeft:{

        height: adapeSize(44),
        backgroundColor: '#05c5c2',
        marginLeft: adapeSize(15),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: adapeSize(16),
        width: width - adapeSize(30),
        borderRadius:5,
    },

    textLeft:{

        color:'#05c5c2'

    }
})