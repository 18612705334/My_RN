//
//  vinTyper.h
//  vinTyper
//
//  Created by etop on 15/10/20.
//  Copyright (c) 2015年 etop. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface VinTyper : NSObject
//授权
@property (nonatomic ,copy) NSString *nsCompanyName;
@property (nonatomic ,copy) NSString *nsReserve;

//识别结果
@property(copy, nonatomic) NSString *nsResult;
//vin码区域图像（400*80）
@property(strong, nonatomic) UIImage *resultImg;

//初始化核心
-(int)initVinTyper:(NSString *)nsUserID nsReserve:(NSString *) nsReserve;
//释放核心
- (void) freeVinTyper;
//设置检测范围
- (void) setVinRegionWithLeft:(int)nLeft Top:(int)nTop Right:(int)nRight Bottom:(int)nBottom;
//识别
- (int) recognizeVinTyper:(UInt8 *)buffer Width:(int)width Height:(int)height;
//设置识别类型：0-横屏 1-竖屏
- (void)setVinRecognizeType:(int)type;
@end
