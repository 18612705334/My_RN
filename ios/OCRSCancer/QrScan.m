//
//  QrScan.m
//  FE_Sass
//
//  Created by lcus on 17/4/11.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "QrScan.h"
#import "OBDScanController.h"
#import "AppDelegate.h"
@implementation QrScan
RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(scan,
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject){
  dispatch_async(dispatch_get_main_queue(), ^{
  OBDScanController *obd=[[OBDScanController alloc]init];
  AppDelegate *app = (AppDelegate *)[[UIApplication sharedApplication] delegate];
  obd.JsBolock=^(NSString*successInfo,NSString* error){
    
    if (successInfo) {
      resolve(@{
                @"scan_result":successInfo,
                @"scan_hand":error
                });
      
      
    }else{
      reject(@"back",@"I am back" ,[NSError errorWithDomain:error code:191 userInfo:@{}]);
    }
    
  
  
  };
  
  [app.window.rootViewController presentViewController:[[UINavigationController alloc]initWithRootViewController:obd] animated:YES completion:nil];

  });
  
}
@end
