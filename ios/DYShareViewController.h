//
//  DYShareViewController.h
//  My_Saas
//
//  Created by 丁永刚 on 2017/12/28.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "MBProgressHUD.h"

typedef void(^callBack)(NSString *resultStr, NSError *error);

@interface DYShareViewController : UIViewController

@property(strong, nonatomic) callBack cb;

- (void)shareData:(NSArray *)data result:(callBack)callBack;

@end
