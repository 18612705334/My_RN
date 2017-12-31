//
//  SaoYiSaoViewController.h
//  SaoYiSao
//
//  Created by ClaudeLi on 16/4/21.
//  Copyright © 2016年 ClaudeLi. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <AVFoundation/AVFoundation.h>


typedef void(^OBDNumBlock)(NSString *OBDnum,NSString *type);
typedef void (^JSOBDScanBlock)(NSString *OBDNum,NSString* type);

@interface OBDScanController : UIViewController<AVCaptureMetadataOutputObjectsDelegate>
{
    int num;
    BOOL upOrdown;
    NSTimer * timer;
}

@property (strong,nonatomic)AVCaptureDevice * device;
@property (strong,nonatomic)AVCaptureDeviceInput * input;
@property (strong,nonatomic)AVCaptureMetadataOutput * output;
@property (strong,nonatomic)AVCaptureSession * session;
@property (strong,nonatomic)AVCaptureVideoPreviewLayer * preview;
@property (nonatomic, retain) UIImageView * line;
@property (nonatomic,strong)JSOBDScanBlock JsBolock;

@property (nonatomic,strong)OBDNumBlock OBDBlock;

@end






@interface UIImage (mask)
/**
 *  遮罩层, RGBA=(0, 0, 0, 0.6)
 *
 *  @param maskRect  遮罩层的Rect
 *  @param clearRect 镂空的Rect
 *
 *  @return 遮罩层图片
 */
+ (UIImage *)maskImageWithMaskRect:(CGRect)maskRect clearRect:(CGRect)clearRect;

@end
