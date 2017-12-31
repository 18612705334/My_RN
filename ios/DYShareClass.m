//
//  DYShareClass.m
//  My_Saas
//
//  Created by 丁永刚 on 2017/12/28.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "DYShareClass.h"
#import "DYShareViewController.h"

@implementation DYShareClass
RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(shareAction, setShareArray:(NSArray *)sharArray resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject){
  
  dispatch_async(dispatch_get_main_queue(), ^{
    DYShareViewController *vc = [[DYShareViewController alloc]init];
    [vc shareData:sharArray result:^(NSString *resultStr, NSError *error) {
      if (error) {
        reject(@"分享失败", @"0", error);
      }else{
        resolve(resultStr);
      }
    }];
  });
}

@end
