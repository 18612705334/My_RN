//
//  SVehicleLicense.h
//  SVehicleLicense
//
//  Created by etop on 15/12/23.
//  Copyright © 2015年 etop. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface SVehicleLicense : NSObject


//识别结果
@property(copy, nonatomic) NSString *nsPlateNo; //车牌号码
@property(copy, nonatomic) NSString *nsVehicleType;  //车辆类型
@property(copy, nonatomic) NSString *nsOwner; //所有人
@property(copy, nonatomic) NSString *nsAddress;  //住址
@property(copy, nonatomic) NSString *nsUseCharacter; //使用性质
@property(copy, nonatomic) NSString *nsModel;  //品牌型号
@property(copy, nonatomic) NSString *nsVIN; //车辆识别代号
@property(copy, nonatomic) NSString *nsEngineNo;  //发动机号码
@property(copy, nonatomic) NSString *nsRegisterDate; //注册日期
@property(copy, nonatomic) NSString *nsIssueDate;  //发证日期

//识别区域图像
@property(strong, nonatomic) UIImage *resultImg;

//初始化核心
-(int)initSVehicleLicense:(NSString *)nsUserID nsReserve:(NSString *) nsReserve;
//检四边
-(int)detectSVehicleLicenseSide:(UInt8 *)buffer Width:(int)width Height:(int)height Corner:(NSMutableArray*) cornerArray;
//预览识别
-(int) recognizeSVehicleLicense:(UInt8 *)buffer Width:(int)width Height:(int)height;
//拍照识别
-(int) recognizeSvehicleLicensePhoto:(UIImage*)image;
//设置识别区域
-(int) setRecognizeRegionWithLeft:(int)left Top:(int)top Right:(int)right Bottom:(int)bottom;
//识别vin码、品牌型号、发动机号三行
-(int) recognizeSVehicleLicenseThreeLines:(UInt8 *)buffer Width:(int)width Height:(int)height;
//释放核心
- (void) freeSVehicleLicense;
@end
