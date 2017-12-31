//
//  CustomCamera.m
//  FE_Sass
//
//  Created by lcus on 17/4/11.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "CustomCamera.h"
#import "CameraController.h"
#import "AppDelegate.h"
@implementation CustomCamera
RCT_EXPORT_MODULE();
RCT_REMAP_METHOD(takePic,
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject){
  
  dispatch_async(dispatch_get_main_queue(), ^{
  CameraController *cammer =[[CameraController alloc]init];
  
  AppDelegate *app = (AppDelegate *)[[UIApplication sharedApplication] delegate];
  cammer.ImageBlock=^(UIImage *selectImage){
    
    if (selectImage) {
  
      resolve(@{@"data":[self image2DataURL:selectImage]});
    }else{
      reject(@"back",@"I am back" ,[NSError errorWithDomain:@"" code:191 userInfo:@{}]);
    }
    
    
  };
  
  [app.window.rootViewController presentViewController:cammer animated:YES completion:nil];
  });
  
}

- (BOOL) imageHasAlpha: (UIImage *) image
{
  CGImageAlphaInfo alpha = CGImageGetAlphaInfo(image.CGImage);
  return (alpha == kCGImageAlphaFirst ||
          alpha == kCGImageAlphaLast ||
          alpha == kCGImageAlphaPremultipliedFirst ||
          alpha == kCGImageAlphaPremultipliedLast);
}
- (NSString *) image2DataURL: (UIImage *) image
{
  NSData *imageData = UIImageJPEGRepresentation(image, 0.6f);;
  
  return [imageData base64EncodedStringWithOptions:NSDataBase64Encoding64CharacterLineLength];
  
}
@end
