//
//  DYShareViewController.m
//  My_Saas
//
//  Created by 丁永刚 on 2017/12/28.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "DYShareViewController.h"

@interface DYShareViewController (){
  NSInteger _currentShare;
  NSMutableArray *_shareArray;
}
@property (strong, nonatomic) MBProgressHUD *hud;
@end

@implementation DYShareViewController

- (void)viewDidLoad {
    [super viewDidLoad];
}

- (void)shareData:(NSArray *)data result:(callBack)callBack{
  
  UIView *rootV = [UIApplication sharedApplication].delegate.window.rootViewController.view;
  _hud = [MBProgressHUD showHUDAddedTo:rootV animated:YES];
  _hud.labelText = @"获取分享信息";
  _hud.removeFromSuperViewOnHide = YES;
  _hud.dimBackground = NO;
  
  _cb = callBack;
  _shareArray = [NSMutableArray array];
  _currentShare = 0;
  
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    
    for (int i = 0; i<data.count; i++) {
      
      NSDictionary *d = data[i];
        
        if(d[@"image"]){
          NSData *i_d = [NSData dataWithContentsOfURL:[NSURL URLWithString:d[@"image"]]];
          UIImage *image = [UIImage imageWithData:i_d];
          
          
          if (image.size.width > image.size.height) {
            image = [self scaleToSize:image size:CGSizeMake(715 * 1.2, 511 * 1.2)];
            
          } else {
            image = [self scaleToSize:image size:CGSizeMake(715 * 1.2, 1000 * 1.2)];
          }
          [_shareArray addObject:image];
          
        }
        if(d[@"title"]){
          [_shareArray addObject:d[@"title"]];
        }
        if(d[@"url"]){
          NSURL *URL = [NSURL URLWithString:d[@"url"]];
          [_shareArray addObject:URL];
        }
      
    }
    
    [self openShare:_shareArray];
  });
}


-(void)openShare:(NSArray *)shareItem{
  
  dispatch_async(dispatch_get_main_queue(), ^{
    
    [_hud hide:YES];
    
    UIActivityViewController *activityVC = [[UIActivityViewController alloc]initWithActivityItems:shareItem applicationActivities:nil];
    activityVC.excludedActivityTypes = @[UIActivityTypePostToFacebook,UIActivityTypePostToTwitter, UIActivityTypePostToWeibo, UIActivityTypeMessage,UIActivityTypeMail,UIActivityTypePrint,UIActivityTypeCopyToPasteboard,UIActivityTypeAssignToContact,UIActivityTypeSaveToCameraRoll,UIActivityTypeAddToReadingList,UIActivityTypePostToFlickr,UIActivityTypePostToVimeo,UIActivityTypePostToTencentWeibo,UIActivityTypeAirDrop,UIActivityTypeOpenInIBooks];
    
    [[UIApplication sharedApplication].delegate.window.rootViewController presentViewController:activityVC animated:YES completion:nil];
    
    [activityVC setCompletionWithItemsHandler:^(UIActivityType  _Nullable activityType, BOOL completed, NSArray * _Nullable returnedItems, NSError * _Nullable activityError) {
      
      if(completed&&activityError==nil){
        
        _cb(@"分享成功", nil);
        
        //_cb(@"分享成功", nil);
        
      }else{
        _cb(nil, [NSError errorWithDomain:@"取消分享" code:0 userInfo:nil]);
      }
      
    }];
  });
  
}


-(UIImage *)scaleToSize:(UIImage *)img size:(CGSize)size{
  UIGraphicsBeginImageContext(size);
  [img drawInRect:CGRectMake(0, 0, size.width, size.height)];
  UIImage *scaleImage = UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();
  return scaleImage;
}



@end
