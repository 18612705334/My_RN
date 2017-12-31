//
//  VLCameraViewController.h
//
//  Created by etop on 15/11/22.
//  Copyright (c) 2015年 etop. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import <AVFoundation/AVFoundation.h>
#import <AudioToolbox/AudioToolbox.h>
#import <CoreMedia/CoreMedia.h>
#import <CoreMotion/CoreMotion.h>
typedef void(^scanBlock)(NSString *scane,NSError *error);
@class VLCameraViewController;
@protocol CameraDelegate <NSObject>

@required
//vin码初始化结果，判断核心是否初始化成功
- (void)initVehicleLicenseWithResult:(int)nInit;

@optional

@end

@interface VLCameraViewController : UIViewController

@property (nonatomic,strong)scanBlock  scaneResult;
@property (assign, nonatomic) id<CameraDelegate>delegate;
//@property(strong, nonatomic) UIImage *resultImg; //图像
@property (copy, nonatomic) NSString *nsUserID; //授权码
@property (nonatomic, strong) CMMotionManager* motionManager;
@end
