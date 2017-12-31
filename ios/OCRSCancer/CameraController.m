//
//  ViewController.m
//  自定义相机
//
//  Created by 夏桂峰 on 15/12/1.
//  Copyright (c) 2015年 夏桂峰. All rights reserved.
//

#import "CameraController.h"
#import <AVFoundation/AVFoundation.h>
#import <CoreGraphics/CoreGraphics.h>
#import <QuartzCore/QuartzCore.h>
#define RealValue(value) ((value)/320.0f*[UIScreen mainScreen].bounds.size.width)

#define kWidth ([UIScreen mainScreen].bounds.size.width)
#define kHeight ([UIScreen mainScreen].bounds.size.height)

@interface CameraController ()

@property(nonatomic,strong)AVCaptureSession *session;
@property(nonatomic,strong)AVCaptureDeviceInput *input;
@property(nonatomic,strong)AVCaptureStillImageOutput *output;
@property(nonatomic,strong)AVCaptureVideoPreviewLayer *previewLayer;
//拍照
@property(nonatomic,strong)UIButton *shutterBtn;
//返回
@property(nonatomic,strong)UIButton *backBtn;
//确认
@property(nonatomic,strong)UIButton *saveBtn;
//取消
@property(nonatomic,strong)UIButton *cancelBtn;
//蒙版
@property(nonatomic,strong)UIImageView *mengbanView;
@end

@implementation CameraController

- (void)viewDidLoad
{
    [super viewDidLoad];
    self.view.backgroundColor=[UIColor blackColor];
    [self setUpSession];
    [self initCameraLayer];
    [self setMengban];
    [self ceateUI];
    [self createFunctionalUI];
    
}
-(void)setMengban{
    //添加蒙版效果
    _mengbanView=[[UIImageView alloc]initWithFrame:CGRectMake(0, RealValue(60), kWidth, kHeight-RealValue(120))];
    _mengbanView.image = [UIImage imageNamed:@"相机蒙版"];
    [_mengbanView setContentMode:UIViewContentModeScaleAspectFit];
    
    [self.view addSubview:_mengbanView];
    
}
//开始任务
-(void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    [self.navigationController setNavigationBarHidden:YES];
    self.tabBarController.tabBar.hidden=YES;
    [_session startRunning];
}
//停止任务
-(void)viewWillDisappear:(BOOL)animated
{
    [super viewWillDisappear:animated];
    [self.navigationController setNavigationBarHidden:NO];
    self.tabBarController.tabBar.hidden=YES;
    [_session stopRunning];
}
//初始化抓取任务
-(void)setUpSession
{
    _session=[[AVCaptureSession alloc]init];
    AVCaptureDevice *device=nil;
    NSArray *devices=[AVCaptureDevice devicesWithMediaType:AVMediaTypeVideo];
    for(AVCaptureDevice *tmp in devices)
    {
        if(tmp.position==AVCaptureDevicePositionBack)
            device=tmp;
    }
    _input=[[AVCaptureDeviceInput alloc]initWithDevice:device error:nil];
    _output=[[AVCaptureStillImageOutput alloc]init];
    _output.outputSettings=@{AVVideoCodecKey:AVVideoCodecJPEG};
    if([_session canAddInput:_input])
        [_session addInput:_input];
    if([_session canAddOutput:_output])
        [_session addOutput:_output];
}
//初始化相机预览层
-(void)initCameraLayer
{
    _previewLayer=[[AVCaptureVideoPreviewLayer alloc]initWithSession:_session];
    [self.previewLayer setFrame:CGRectMake(0, RealValue(60), kWidth, kHeight- RealValue(120))];
    [self.previewLayer setVideoGravity:AVLayerVideoGravityResizeAspectFill];
    [self.view.layer addSublayer:_previewLayer];
}
//搭建UI
-(void)ceateUI
{
    //拍照按钮
    _shutterBtn=[[UIButton alloc]initWithFrame:CGRectMake((kWidth-RealValue(50))/2, kHeight-RealValue(50), RealValue(50), RealValue(50))];
    [_shutterBtn setImage:[UIImage imageNamed:@"xiangjianniu"] forState:UIControlStateNormal];
    [_shutterBtn setImage:[UIImage imageNamed:@"xiangjianniu"] forState:UIControlStateHighlighted];
    
    [_shutterBtn addTarget:self action:@selector(shutter) forControlEvents:UIControlEventTouchUpInside];
    _shutterBtn.backgroundColor=[UIColor clearColor];
    _shutterBtn.layer.cornerRadius=25;
    
    [self.view addSubview:_shutterBtn];
    //返回按钮
    _backBtn=[[UIButton alloc]initWithFrame:CGRectMake(RealValue(20), kHeight-RealValue(50), RealValue(50), RealValue(50))];
    [_backBtn setTitle:@"取消" forState:UIControlStateNormal];
    
    [_backBtn addTarget:self action:@selector(back) forControlEvents:UIControlEventTouchUpInside];
    _backBtn.backgroundColor=[UIColor clearColor];
    [self.view addSubview:_backBtn];
    
    
    
    
    _cancelBtn=[[UIButton alloc]initWithFrame:CGRectMake(RealValue(30), kHeight - RealValue(50), RealValue(50), RealValue(40))];
    [_cancelBtn setTitle:@"取消" forState:UIControlStateNormal];
    [_cancelBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    _cancelBtn.backgroundColor=[UIColor colorWithWhite:0.8 alpha:0.8];
    _cancelBtn.layer.cornerRadius=5;
    _cancelBtn.layer.borderColor=[UIColor whiteColor].CGColor;
    _cancelBtn.layer.borderWidth=1.0;
    _cancelBtn.tag = 10003;
    [_cancelBtn addTarget:self action:@selector(cancel:) forControlEvents:UIControlEventTouchUpInside];
    CGFloat raduis=M_PI_2;
    if(_input.device.position==AVCaptureDevicePositionFront)
        raduis=M_PI_2*3;
    _cancelBtn.transform=CGAffineTransformMakeRotation(raduis);
    [self.view addSubview:_cancelBtn];
    
    _saveBtn=[[UIButton alloc]initWithFrame:CGRectMake(kWidth-RealValue(85), kHeight -RealValue(50), RealValue(50), RealValue(40))];
    [_saveBtn setTitle:@"确定" forState:UIControlStateNormal];
    [_saveBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    _saveBtn.backgroundColor=[UIColor colorWithWhite:0.8 alpha:0.8];
    _saveBtn.layer.cornerRadius=5;
    _saveBtn.layer.borderColor=[UIColor whiteColor].CGColor;
    _saveBtn.layer.borderWidth=1.0;
    _saveBtn.tag = 10002;
    [_saveBtn addTarget:self action:@selector(save:) forControlEvents:UIControlEventTouchUpInside];
    _saveBtn.transform=CGAffineTransformMakeRotation(raduis);
    [self.view addSubview:_saveBtn];
    self.backBtn.hidden = NO;
    self.shutterBtn.hidden = NO;
    self.saveBtn.hidden = YES;
    self.cancelBtn.hidden = YES;
}
-(void)back{
    [self dismissViewControllerAnimated:YES completion:nil];
}
//功能性UI
-(void)createFunctionalUI
{
    //闪光灯开启关闭按钮
    UIButton *flashBtn=[[UIButton alloc]initWithFrame:CGRectMake(10, 10, 40, 40)];
    //flashBtn.transform=CGAffineTransformMakeRotation(M_PI_2);
    [flashBtn setTitle:@"⚡️关" forState:UIControlStateNormal];
    [flashBtn setTitle:@"⚡️开" forState:UIControlStateSelected];
    [flashBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    flashBtn.titleLabel.font=[UIFont systemFontOfSize:14];
    flashBtn.backgroundColor=[UIColor clearColor];
    flashBtn.layer.cornerRadius=20;
    flashBtn.layer.borderColor=[UIColor whiteColor].CGColor;
    flashBtn.layer.borderWidth=2;
    [self.view addSubview:flashBtn];
    [flashBtn addTarget:self action:@selector(flasAction:) forControlEvents:UIControlEventTouchUpInside];
    
    //切换前后摄像头
    UIButton *shiftBtn=[[UIButton alloc]initWithFrame:CGRectMake(kWidth-60, 10, 40, 40)];
    [shiftBtn setImage:[UIImage imageNamed:@"shift"] forState:UIControlStateNormal];
    [shiftBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    shiftBtn.titleLabel.font=[UIFont systemFontOfSize:12];
    shiftBtn.backgroundColor=[UIColor clearColor];
    
    shiftBtn.layer.cornerRadius=10;
    [self.view addSubview:shiftBtn];
    [shiftBtn addTarget:self action:@selector(shiftCamera:) forControlEvents:UIControlEventTouchUpInside];
}
//切换前后相机
-(void)shiftCamera:(UIButton *)sender
{
    sender.selected=!sender.isSelected;
    AVCaptureDevice *device=nil;
    NSArray *devices=[AVCaptureDevice devicesWithMediaType:AVMediaTypeVideo];
    //切换至前置摄像头
    if(sender.isSelected)
    {
        for(AVCaptureDevice *tmp in devices)
        {
            if(tmp.position==AVCaptureDevicePositionFront)
                device=tmp;
        }
        [_session beginConfiguration];
        [_session removeInput:_input];
        _input=nil;
        _input=[[AVCaptureDeviceInput alloc]initWithDevice:device error:nil];
        if([_session canAddInput:_input])
            [_session addInput:_input];
        [_session commitConfiguration];
    }
    //切换至后置摄像头
    else
    {
        for(AVCaptureDevice *tmp in devices)
        {
            if(tmp.position==AVCaptureDevicePositionBack)
                device=tmp;
        }
        [_session beginConfiguration];
        [_session removeInput:_input];
        _input=nil;
        _input=[[AVCaptureDeviceInput alloc]initWithDevice:device error:nil];
        if([_session canAddInput:_input])
            [_session addInput:_input];
        [_session commitConfiguration];
    }
}
//闪光灯按钮的操作
-(void)flasAction:(UIButton *)sender
{
    sender.selected=!sender.isSelected;
    AVCaptureDevice *device = [AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo];
    if ([device hasTorch] && [device hasFlash])
    {
        [device lockForConfiguration:nil];
        //闪光灯开
        if (sender.isSelected)
        {
            [device setFlashMode:AVCaptureFlashModeOn];
        }
        //闪光灯关
        else
        {
            [device setFlashMode:AVCaptureFlashModeOff];
        }
        //闪光灯自动，这里就不写了，可以自己尝试
        //[device setFlashMode:AVCaptureFlashModeAuto];
        [device unlockForConfiguration];
    }
}
//拍照
-(void)shutter
{
    AVCaptureConnection *connect=[_output connectionWithMediaType:AVMediaTypeVideo];
    if(!connect)
    {
        NSLog(@"拍照失败");
        return;
    }
    __weak typeof(self) weakSelf=self;
    [_output captureStillImageAsynchronouslyFromConnection:connect completionHandler:^(CMSampleBufferRef imageDataSampleBuffer, NSError *error) {
        if(imageDataSampleBuffer==NULL)
            return;
        NSData *imageData=[AVCaptureStillImageOutput jpegStillImageNSDataRepresentation:imageDataSampleBuffer];
        UIImage *image=[UIImage imageWithData:imageData];
        [weakSelf showCapturedImage:image];
    }];
}
//显示拍摄到的照片
-(void)showCapturedImage:(UIImage *)image
{
    self.backBtn.hidden = YES;
    self.saveBtn.hidden = NO;
    self.cancelBtn.hidden = NO;
    self.shutterBtn.hidden = YES;
    UIImageView *imv=[[UIImageView alloc]initWithFrame:CGRectMake(0, RealValue(60), kWidth, kHeight-RealValue(120))];
    imv.image=image;
    imv.tag = 1001;
    if(_input.device.position==AVCaptureDevicePositionFront)
        imv.transform=CGAffineTransformMakeRotation(M_PI);
    [self.view addSubview:imv];
    
    
}
//拍照以后取消
-(void)cancel:(UIButton *)sender
{
    UIImageView *imv = (UIImageView *)[self.view viewWithTag:(1001)];
    [imv removeFromSuperview];
    self.backBtn.hidden = NO;
    self.saveBtn.hidden = YES;
    self.cancelBtn.hidden = YES;
    self.shutterBtn.hidden = NO;
    
    
}
//确定
-(void)save:(UIButton *)sender
{
    self.backBtn.hidden = NO;
    self.saveBtn.hidden = YES;
    self.cancelBtn.hidden = YES;
    UIImageView *imv=(UIImageView *)[self.view viewWithTag:(1001)];
  
    [imv removeFromSuperview];
    [self dismissViewControllerAnimated:YES completion:^{
       self.ImageBlock(imv.image);
    }];
}
//隐藏状态栏
-(BOOL)prefersStatusBarHidden
{
    return YES;
}

@end
