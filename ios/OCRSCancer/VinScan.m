//
//  CalendatManager.m
//  LearnRN
//
//  Created by LHC on 2017/3/4.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "VinScan.h"
#import "VLCameraViewController.h"
#import "VinCameraViewController.h"
#import "AppDelegate.h"
// 0401140011406929
// 4928168

@implementation VinScan

RCT_EXPORT_MODULE();


RCT_REMAP_METHOD(scan,
                 type:(NSInteger)type
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  

  
  if (type==1) {
    dispatch_async(dispatch_get_main_queue(), ^{
      VLCameraViewController *one = [[VLCameraViewController alloc]init];
      one.nsUserID=@"4D39F52BD46AC7CD8470";
      one.scaneResult=^(NSString*successInfo,NSError*errorInfo){
        
        if (successInfo) {
          resolve(successInfo);
        }else{
          reject(@"back",@"I am back" ,errorInfo);
        }
        
      };
      AppDelegate *app = (AppDelegate *)[[UIApplication sharedApplication] delegate];
      [app.window.rootViewController presentViewController:one animated:YES completion:nil];
      
    });

  }else{
    dispatch_async(dispatch_get_main_queue(), ^{
      VinCameraViewController *onev=[[VinCameraViewController alloc]init];
      
      onev.scaneResult=^(NSString*successInfo,NSError*errorInfo){
        
        if (successInfo) {
          resolve(successInfo);
        }else{
          reject(@"back",@"I am back" ,errorInfo);
        }
        
      };
      
      AppDelegate *app = (AppDelegate *)[[UIApplication sharedApplication] delegate];
      [app.window.rootViewController presentViewController:onev animated:YES completion:nil];
    
    });
                   
    
  }
  
  

}




@end
