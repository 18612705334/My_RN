/**
 * Created by zhengnan on 2017/5/5.
 */


import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    ListView,
    Text,
} from  'react-native';

import BaseComponent from  '../../component/BaseComponent';
import AllNavigationView from '../../component/AllNavigationView';
import *as fontAndColor from '../../constant/fontAndColor';
import PixelUtil from  '../../utils/PixelUtil';
let  Pixel = new PixelUtil();




export default  class  ReceiptInfoScene extends BaseComponent{

    initFinish=()=>{

    }

    // 构造
      constructor(props) {
        super(props);

        let data = this.props.data;
          this.datatArray=[
              [{title:'借款人',value:data.username}
                  ,{title:'身份证号',value:data.idcard_number}
                  ,{title:'手机号码',value:data.phone}
	              ,{title:'借款金额',value:data.money_str}
	              ,{title:'贷款人',value:data.lender}
                  ,{title:'起息日(以实际放款日为准)',value:data.start_time}
                  ,{title:'到期日',value:data.end_time}
                  ,{title:'还款方式',value:data.repayment_type}
                  ,{title:'收款银行卡号',value:data.bank_name+"  "+data.bank_card}
                  ],
              [{title:'车架号',value:data.vin}]];

          let getSectionData = (dataBlob, sectionID) => {
              return dataBlob[sectionID];
          };

          let getRowData = (dataBlob, sectionID, rowID) => {
              return dataBlob[sectionID + ":" + rowID];
          };


          const dataSource =  new ListView.DataSource({
              getSectionData: getSectionData,
              getRowData: getRowData,
              rowHasChanged: (r1, r2) => r1 !== r2,
              sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
          });

          var dataBlob = {}, sectionIDs = [], rowIDs = [],cars = [];
          for (var i = 0; i < this.datatArray.length; i++) {
              sectionIDs.push(i);
              dataBlob[i] = '';
              cars = this.datatArray[i];
              rowIDs[i] = [];
              for (var j = 0; j < cars.length; j++) {
                  rowIDs[i].push(j);
                  dataBlob[i + ':' + j] = cars[j];
              }
          }

          this.state = {

              dataSource: dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),

          };
      }


    render(){
        return(<View style={styles.rootContainer}>
            <ListView dataSource={this.state.dataSource}
                      renderSectionHeader={this.renderSectionHeader}
                      renderRow={this.renderRow}
                      removeClippedSubviews={false}
                      renderSeparator={this._renderSeparator}


            />
            <AllNavigationView title="借据信息" backIconClick={this.backPage}/>
        </View>)
    }

    _renderSeparator(sectionId, rowId) {

        return (
            <View style={styles.Separator} key={rowId + '123'}>
                <View style={{flex:1, backgroundColor:fontAndColor.COLORA3}}>

                </View>
            </View>
        )
    }


    // 每一行中的数据
    renderRow = (rowData, sectionID, rowID) => {

        return (
                <View style={styles.rowCell}>
                    <Text allowFontScaling={false}  style={{color:fontAndColor.COLORA0, fontSize:Pixel.getFontPixel(fontAndColor.CONTENTFONT24)}}>{rowData.title}</Text>
                    <Text allowFontScaling={false}  style={{color:fontAndColor.COLORA1, fontSize:Pixel.getFontPixel(fontAndColor.CONTENTFONT24),textAlign:'right'}}>{rowData.value}</Text>
                </View>
        )
    };

    // 每一组对应的数据
    renderSectionHeader = (sectionData, sectionId) => {

        return (
            <View style={styles.sectionHeader}/>
        );
    }

}


const styles = StyleSheet.create({

    rootContainer:{
        flex:1,
        backgroundColor:fontAndColor.COLORA3,
        paddingTop:Pixel.getTitlePixel(64),
    },
    sectionHeader:{
        height:Pixel.getPixel(10),
    },
    rowCell:{
        height:Pixel.getPixel(44),
        backgroundColor:'white',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal:Pixel.getPixel(15)
    },
    Separator: {
        backgroundColor: '#fff',
        height: Pixel.getPixel(1),
        paddingLeft: Pixel.getPixel(15),
        paddingRight: Pixel.getPixel(15)


    }
});