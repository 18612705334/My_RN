//
//  TopView.h
//
//  Created by etop on 15/12/22.
//  Copyright (c) 2015年 etop. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface VLTopView : UIView

@property (assign ,nonatomic) CGRect centerRect;  //检测区域
@property (assign ,nonatomic) NSString *nsResult; //显示识别结果
@property (retain ,nonatomic) UILabel *label;
@property (retain ,nonatomic) UILabel *promptLabel;
@property (retain ,nonatomic) UILabel *promptLabel1;
@property (retain ,nonatomic) UIImageView *resultImg; //裁切的图像
@property (retain ,nonatomic) UIImageView *scan_line; //扫描线

@property (assign, nonatomic) BOOL leftHidden;
@property (assign, nonatomic) BOOL rightHidden;
@property (assign, nonatomic) BOOL topHidden;
@property (assign, nonatomic) BOOL bottomHidden;

@property (assign, nonatomic) CGPoint cornerLeftUp;
@property (assign, nonatomic) CGPoint cornerRightUp;
@property (assign, nonatomic) CGPoint cornerLeftDown;
@property (assign, nonatomic) CGPoint cornerRightDown;
@end
