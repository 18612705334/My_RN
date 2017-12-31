//
//  SystomTools.m
//  FE_Sass
//
//  Created by 赵健 on 2017/6/15.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "SystomTools.h"

@implementation SystomTools

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(openAppaleShop){
 

    NSString *str = [NSString stringWithFormat:@"https://itunes.apple.com/us/app/%E7%AC%AC1%E8%BD%A6%E8%B4%B7/id1071762059?l=zh&ls=1&mt=8"];
    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:str]];
}
@end
