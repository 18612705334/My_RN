//
//  VinCameraViewController.m
//
//  Created by etop on 15/12/22.
//  Copyright (c) 2015年 etop. All rights reserved.
//

#import "VinCameraViewController.h"
#import "TopView.h"
#import "vinTyper.h"
#import "AppDelegate.h"

@interface VinCameraViewController ()<UIAlertViewDelegate,AVCaptureVideoDataOutputSampleBufferDelegate>{
    AVCaptureSession *_captureSession;
    AVCaptureDeviceInput *_captureInput;
    AVCaptureStillImageOutput *_captureOutput;
    AVCaptureVideoPreviewLayer *_capturePreview;
    AVCaptureDevice *_captureDevice;
    
    VinTyper *_vinTyper; //识别核心
    TopView *_topView; //检测视图层
    BOOL _isCameraAuthor; //是否有打开摄像头权限
    BOOL _isRecognize; //是否识别
    BOOL _flash; //控制闪光灯
    BOOL _isScan; //控制扫描线
    CGPoint linePoint;//扫描线初始位置
    UIButton* photoBtn;
    UIButton* flashBtn;
    UIButton* backBtn;
    BOOL _isTransform;
    NSTimer* _timer;
    BOOL _isFocusing;//是否正在对焦
    BOOL _isFocusPixels;//是否相位对焦
    GLfloat _FocusPixelsPosition;//相位对焦下镜头位置
    GLfloat _curPosition;//当前镜头位置
}
@end

@implementation VinCameraViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    self.view.backgroundColor = [UIColor clearColor];
    self.navigationController.navigationBarHidden = YES;
    //初始化识别核心
    [self performSelectorInBackground:@selector(initRecogKernal) withObject:nil];
    //初始化相机和视图层
    [self initCameraAndLayer];
    //创建提示信息
    [self createPormptInfo];
}

//初始化识别核心
- (void) initRecogKernal
{
    _vinTyper = [[VinTyper alloc] init];
    
}

//初始化相机和检测视图层
- (void) initCameraAndLayer
{
    //判断摄像头是否授权
    _isCameraAuthor = NO;
    AVAuthorizationStatus authorStatus = [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo];
    if(authorStatus == AVAuthorizationStatusRestricted || authorStatus == AVAuthorizationStatusDenied){
        NSUserDefaults * userDefaults = [NSUserDefaults standardUserDefaults];
        NSArray * allLanguages = [userDefaults objectForKey:@"AppleLanguages"];
        NSString * preferredLang = [allLanguages objectAtIndex:0];
        if (![preferredLang isEqualToString:@"zh-Hans"]) {
            UIAlertView * alt = [[UIAlertView alloc] initWithTitle:@"Please allow to access your device’s camera in “Settings”-“Privacy”-“Camera”" message:@"" delegate:self cancelButtonTitle:nil otherButtonTitles:@"OK", nil];
            [alt show];
        }else{
            UIAlertView * alt = [[UIAlertView alloc] initWithTitle:@"未获得授权使用摄像头" message:@"请在 '设置-隐私-相机' 中打开" delegate:self cancelButtonTitle:nil otherButtonTitles:@"知道了", nil];
            [alt show];
        }
        _isCameraAuthor = YES;
        return;
    }
    
    //创建会话层,视频浏览分辨率为1280*720
    _captureSession = [[AVCaptureSession alloc] init];
    [_captureSession setSessionPreset:AVCaptureSessionPreset1280x720];
    
    //创建、配置输入
    NSArray *devices = [AVCaptureDevice devicesWithMediaType:AVMediaTypeVideo];
    
    for (AVCaptureDevice *device in devices)
    {
        if (device.position == AVCaptureDevicePositionBack){
            _captureDevice = device;
            _captureInput = [AVCaptureDeviceInput deviceInputWithDevice:device error:nil];
        }
    }
    [_captureSession addInput:_captureInput];
    
    AVCaptureVideoDataOutput *captureOutput = [[AVCaptureVideoDataOutput alloc]init];
    
    captureOutput.alwaysDiscardsLateVideoFrames = YES;
    
    dispatch_queue_t queue;
    queue = dispatch_queue_create("cameraQueue", NULL);
    [captureOutput setSampleBufferDelegate:self queue:queue];
    
    NSString* formatKey = (NSString*)kCVPixelBufferPixelFormatTypeKey;
    NSNumber* value = [NSNumber
                       numberWithUnsignedInt:kCVPixelFormatType_32BGRA];
    NSDictionary* videoSettings = [NSDictionary
                                   dictionaryWithObject:value forKey:formatKey];
    [captureOutput setVideoSettings:videoSettings];
    [_captureSession addOutput:captureOutput];
    
    //创建、配置输出
    _captureOutput = [[AVCaptureStillImageOutput alloc] init];
    NSDictionary *outputSettings = [[NSDictionary alloc] initWithObjectsAndKeys:AVVideoCodecJPEG,AVVideoCodecKey,nil];
    [_captureOutput setOutputSettings:outputSettings];
    [_captureSession addOutput:_captureOutput];
    //
    _capturePreview = [AVCaptureVideoPreviewLayer layerWithSession: _captureSession];
    _capturePreview.frame = CGRectMake(0, 0, self.view.frame.size.width, self.view.frame.size.height);
    _capturePreview.videoGravity = AVLayerVideoGravityResizeAspectFill;
    [self.view.layer addSublayer:_capturePreview];
    [_captureSession startRunning];
    
    //设置检测视图层
    CAShapeLayer *layerWithHole = [CAShapeLayer layer];
    
    CGRect screenRect = self.view.bounds;
    CGFloat offset = 1.0f;
    if ([[UIScreen mainScreen] scale] >= 2) {
        offset = 0.5;
    }
    
    if (!_topView) {
        _topView = [[TopView alloc] initWithFrame:self.view.bounds];
    }
    
    CGRect centerFrame = _topView.centerRect;
    CGRect centerRect = CGRectInset(centerFrame, -offset, -offset) ;
    
    UIBezierPath *bezierPath = [UIBezierPath bezierPath];
    [bezierPath moveToPoint:CGPointMake(CGRectGetMinX(screenRect), CGRectGetMinY(screenRect))];
    [bezierPath addLineToPoint:CGPointMake(CGRectGetMinX(screenRect), CGRectGetMaxY(screenRect))];
    [bezierPath addLineToPoint:CGPointMake(CGRectGetMaxX(screenRect), CGRectGetMaxY(screenRect))];
    [bezierPath addLineToPoint:CGPointMake(CGRectGetMaxX(screenRect), CGRectGetMinY(screenRect))];
    [bezierPath addLineToPoint:CGPointMake(CGRectGetMinX(screenRect), CGRectGetMinY(screenRect))];
    [bezierPath moveToPoint:CGPointMake(CGRectGetMinX(centerRect), CGRectGetMinY(centerRect))];
    [bezierPath addLineToPoint:CGPointMake(CGRectGetMinX(centerRect), CGRectGetMaxY(centerRect))];
    [bezierPath addLineToPoint:CGPointMake(CGRectGetMaxX(centerRect), CGRectGetMaxY(centerRect))];
    [bezierPath addLineToPoint:CGPointMake(CGRectGetMaxX(centerRect), CGRectGetMinY(centerRect))];
    [bezierPath addLineToPoint:CGPointMake(CGRectGetMinX(centerRect), CGRectGetMinY(centerRect))];
    [layerWithHole setPath:[bezierPath CGPath]];
    [layerWithHole setFillRule:kCAFillRuleEvenOdd];
    [layerWithHole setFillColor:[[UIColor colorWithWhite:0 alpha:0.35] CGColor]];
    [self.view.layer addSublayer:layerWithHole];
    [self.view.layer setMasksToBounds:YES];
    
    _topView.backgroundColor = [UIColor clearColor];
    [self.view addSubview:_topView];
    
    //判断是否相位对焦
    if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 8.0) {
        AVCaptureDeviceFormat *deviceFormat = _captureDevice.activeFormat;
        if (deviceFormat.autoFocusSystem == AVCaptureAutoFocusSystemPhaseDetection){
            _isFocusPixels = YES;
        }
    }
    
    [_vinTyper setVinRecognizeType:0];
    //设置vin码的检测区域
    [_vinTyper setVinRegionWithLeft:225 Top:247 Right:1025 Bottom:472];
//    [_vinTyper setVinRegionWithLeft:414 Top:0 Right:865 Bottom:720];
}

//创建提示信息
- (void)createPormptInfo{
    
    UITapGestureRecognizer *singleFingerOne = [[UITapGestureRecognizer alloc] initWithTarget:self
                                                                                      action:@selector(handleSingleFingerEvent:)];
    singleFingerOne.numberOfTouchesRequired = 1; //手指数
    singleFingerOne.numberOfTapsRequired = 1; //tap次数
    [self.view addGestureRecognizer:singleFingerOne];
    
    CGFloat screenHeight = [UIScreen mainScreen].bounds.size.height;
    CGFloat screenWidth = [UIScreen mainScreen].bounds.size.width;
    CGFloat ratio = screenHeight/568.0;
    

    photoBtn = [[UIButton alloc]initWithFrame:CGRectMakeImage(130,495,60,60)];
    photoBtn.tag = 1000;
    [photoBtn setImage:[UIImage imageNamed:@"take_pic_btn"] forState:UIControlStateNormal];
    [photoBtn addTarget:self action:@selector(photoBtn) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:photoBtn];
    
    flashBtn = [[UIButton alloc]initWithFrame:CGRectMakeImage(260,0,60,60)];
    flashBtn.tag = 1000;
    flashBtn.hidden = NO;
    [flashBtn setImage:[UIImage imageNamed:@"flash_on"] forState:UIControlStateNormal];
    [flashBtn addTarget:self action:@selector(flashOnBtn) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:flashBtn];
    
    backBtn = [[UIButton alloc]initWithFrame:CGRectMakeImage(0,0,60,60)];
    backBtn.tag = 1000;
    backBtn.hidden = NO;
    [backBtn setImage:[UIImage imageNamed:@"back_btn"] forState:UIControlStateNormal];
    [backBtn addTarget:self action:@selector(back_btn) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:backBtn];

    CGPoint center;
    center.x = CGRectGetMidX(_topView.centerRect);
    center.y = CGRectGetMidY(_topView.centerRect);
    
    _topView.promptLabel = [[UILabel alloc] initWithFrame:CGRectMakeImage(0, 0, 355, 60)];
    _topView.promptLabel.text = @"将框置于VIN码前";
    _topView.promptLabel.font = [UIFont fontWithName:@"Helvetica" size:15];
    _topView.promptLabel.textColor = [UIColor whiteColor];
    _topView.promptLabel.textAlignment = NSTextAlignmentCenter;
    _topView.promptLabel.transform = CGAffineTransformMakeRotation(3.14/2);
    [_topView.promptLabel setCenter:center];
    [self.view addSubview:_topView.promptLabel];
    
    _topView.promptLabel2 = [[UILabel alloc] initWithFrame:CGRectMakeImage(0, 0, 355, 60)];
    _topView.promptLabel2.text = @"如无法自动识别，请点击拍照按钮保存图像";
    _topView.promptLabel2.font = [UIFont fontWithName:@"Helvetica" size:15];
    _topView.promptLabel2.textColor = [UIColor whiteColor];
    _topView.promptLabel2.textAlignment = NSTextAlignmentCenter;
    _topView.promptLabel2.transform = CGAffineTransformMakeRotation(3.14/2);
    CGPoint promptLabel2 = center;
    promptLabel2.x = center.x - _topView.centerRect.size.width/2 - _topView.promptLabel2.frame.size.width/2;
    [_topView.promptLabel2 setCenter:promptLabel2];
    [self.view addSubview:_topView.promptLabel2];
    
    int nSize = 22;
    if(ratio>1.0) nSize = 30;
    _topView.label = [[UILabel alloc] initWithFrame:CGRectMakeImage(0, 0, 355, 60)];
    _topView.label.text = @"";
    _topView.label.font = [UIFont fontWithName:@"Helvetica" size:nSize];
    _topView.label.textColor = [UIColor greenColor];
    _topView.label.textAlignment = NSTextAlignmentCenter;
    _topView.label.transform = CGAffineTransformMakeRotation(3.14/2);
    CGPoint label = center;
    label.x = center.x + _topView.centerRect.size.width/2 + _topView.label.frame.size.width/2;
    [_topView.label setCenter:label];
    [self.view addSubview:_topView.label];
    
    _topView.promptLabel1 = [[UILabel alloc] initWithFrame:CGRectMakeImage(0, 0, 355, 60)];
    _topView.promptLabel1.text = @"";
    _topView.promptLabel1.font = [UIFont fontWithName:@"Helvetica" size:15];
    _topView.promptLabel1.textColor = [UIColor whiteColor];
    _topView.promptLabel1.textAlignment = NSTextAlignmentCenter;
    _topView.promptLabel1.transform = CGAffineTransformMakeRotation(3.14/2);
    CGPoint promptLabel1 = center;
    promptLabel1.x = screenWidth-_topView.promptLabel1.frame.size.width/2;
    [_topView.promptLabel1 setCenter:promptLabel1];
    [self.view addSubview:_topView.promptLabel1];
    
    _topView.scan_line = [[UIImageView alloc] initWithFrame:CGRectMakeImage(0, 0, 355, 3)];
    [_topView.scan_line setImage:[UIImage imageNamed:@"scan_line"]];
    _topView.scan_line.transform = CGAffineTransformMakeRotation(3.14/2);
    _topView.scan_line.hidden = NO;
    [self.view addSubview:_topView.scan_line];
    CGPoint top = center;
    top.x += _topView.centerRect.size.width/2;
    [_topView.scan_line setCenter:top];
    [self.view addSubview:_topView.scan_line];
    linePoint = _topView.scan_line.center;
    
    _topView.resultImg = [[UIImageView alloc] initWithFrame:CGRectMakeImage(0, 0, 355, 100)];
    [_topView.resultImg setImage:nil];
    _topView.resultImg.transform = CGAffineTransformMakeRotation(3.14/2);
    [_topView.resultImg setCenter:center];
    [self.view addSubview:_topView.resultImg];
}

- (void) viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];

    _topView.scan_line.hidden = NO;
    [self performSelector:@selector(moveScanline)];
    _isRecognize = YES;
    AVCaptureDevice*camDevice =[AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo];
    //注册通知
    [camDevice addObserver:self forKeyPath:@"adjustingFocus" options:NSKeyValueObservingOptionNew context:nil];
    if (_isFocusPixels) {
        [camDevice addObserver:self forKeyPath:@"lensPosition" options:NSKeyValueObservingOptionNew context:nil];
    }
    _timer = [NSTimer scheduledTimerWithTimeInterval:1.0 target:self selector:@selector(startMotionManager) userInfo:nil repeats:NO];

    //监听切换到前台事件
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(didBecomeActive) name:UIApplicationDidBecomeActiveNotification object:nil];
    //初始化识别核心
    int nRet = [_vinTyper initVinTyper:@"4D39F52BD46AC7CD8470" nsReserve:@""];
    if (nRet != 0) {
        if (_isCameraAuthor == NO) {
            [_captureSession stopRunning];
            NSUserDefaults * defaults = [NSUserDefaults standardUserDefaults];
            NSArray * appleLanguages = [defaults objectForKey:@"AppleLanguages"];
            NSString * systemLanguage = [appleLanguages objectAtIndex:0];
            if (![systemLanguage isEqualToString:@"zh-Hans"]) {
                NSString *initStr = [NSString stringWithFormat:@"Init Error!Error code:%d",nRet];
                UIAlertView *alertV = [[UIAlertView alloc]initWithTitle:@"Tips" message:initStr delegate:self cancelButtonTitle:nil otherButtonTitles:@"OK", nil];
                [alertV show];
            }else{
                NSString *initStr = [NSString stringWithFormat:@"初始化失败!错误代码:%d",nRet];
                UIAlertView *alertV = [[UIAlertView alloc]initWithTitle:@"提示" message:initStr delegate:self cancelButtonTitle:nil otherButtonTitles:@"OK", nil];
                [alertV show];
            }
        }
    }
    
}

//监听对焦
-(void)observeValueForKeyPath:(NSString*)keyPath ofObject:(id)object change:(NSDictionary*)change context:(void*)context {
    if([keyPath isEqualToString:@"adjustingFocus"]){
        _isFocusing =[[change objectForKey:NSKeyValueChangeNewKey] isEqualToNumber:[NSNumber numberWithInt:1]];
    }
    if([keyPath isEqualToString:@"lensPosition"]){
        _FocusPixelsPosition =[[change objectForKey:NSKeyValueChangeNewKey] floatValue];
    }
}

- (void) viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
}

- (void) viewWillDisappear:(BOOL)animated
{
    [super viewWillDisappear:animated];
    _isRecognize = NO;
    //关闭定时器
    [_timer invalidate];
    _timer = nil;
    //移除监听
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    //释放核心
   [_vinTyper freeVinTyper];
   [_motionManager stopDeviceMotionUpdates];
}

- (void) viewDidDisappear:(BOOL)animated{
    [super viewDidDisappear:animated];
    AVCaptureDevice*camDevice =[AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo];
    [camDevice removeObserver:self forKeyPath:@"adjustingFocus"];
    if (_isFocusPixels) {
        [camDevice removeObserver:self forKeyPath:@"lensPosition"];
    }
    [_captureSession stopRunning];

}

- (void)didBecomeActive{
    [self performSelector:@selector(moveScanline)];
}

//从缓冲区获取图像数据进行识别
#pragma mark -
#pragma mark AVCaptureSession delegate
- (void)captureOutput:(AVCaptureOutput *)captureOutput
didOutputSampleBuffer:(CMSampleBufferRef)sampleBuffer
       fromConnection:(AVCaptureConnection *)connection
{
    
    CVImageBufferRef imageBuffer = CMSampleBufferGetImageBuffer(sampleBuffer);
    CVPixelBufferLockBaseAddress(imageBuffer,0);
    uint8_t *baseAddress = (uint8_t *)CVPixelBufferGetBaseAddress(imageBuffer);
    size_t width = CVPixelBufferGetWidth(imageBuffer);
    size_t height = CVPixelBufferGetHeight(imageBuffer);
    
    self.resultImg = nil;
    if(!_isFocusing){
    if (_isRecognize == YES) {
        if(_curPosition==_FocusPixelsPosition){
            //开始识别
            int bSuccess = [_vinTyper recognizeVinTyper:baseAddress Width:(int)width Height:(int)height];
            //识别成功
           if(bSuccess == 0)
            {
                //震动
                AudioServicesPlaySystemSound(kSystemSoundID_Vibrate);
                //显示区域图像
                [self performSelectorOnMainThread:@selector(showResultAndImage:) withObject:_vinTyper.resultImg waitUntilDone:NO];
                _isRecognize = NO;
            }
        }else{
            _curPosition=_FocusPixelsPosition;
        }
    }
    }
    CVPixelBufferUnlockBaseAddress(imageBuffer,0);
    
}

//显示结果跟图像
-(void)showResultAndImage:(UIImage *)image
{
  
  [self dismissViewControllerAnimated:YES completion:^{
       self.scaneResult(_vinTyper.nsResult,nil);
  }];
  
}

//拍照
-(void)captureimage
{
    AVCaptureConnection *videoConnection = nil;
    for (AVCaptureConnection *connection in _captureOutput.connections) {
        for (AVCaptureInputPort *port in [connection inputPorts]) {
            if ([[port mediaType] isEqual:AVMediaTypeVideo] ) {
                videoConnection = connection;
                break;
            }
        }
        if (videoConnection) { break; }
    }
    
    //get UIImage
    [_captureOutput captureStillImageAsynchronouslyFromConnection:videoConnection completionHandler:
     ^(CMSampleBufferRef imageSampleBuffer, NSError *error) {
         if (imageSampleBuffer != NULL) {
             //停止取景
//             [_captureSession stopRunning];
             _isRecognize = NO;
             NSData *imageData = [AVCaptureStillImageOutput jpegStillImageNSDataRepresentation:imageSampleBuffer];
             UIImage *tempImage = [[UIImage alloc] initWithData:imageData];
             UIImage *fullImage = [UIImage imageWithCGImage:tempImage.CGImage scale:1.0 orientation:UIImageOrientationUp];
             //裁切vin码图像区域
             CGRect rcVin = CGRectMake(225, 247, 800, 225);
             CGImageRef imageRef = fullImage.CGImage;
             CGImageRef subImageRef = CGImageCreateWithImageInRect(imageRef, rcVin);
             UIGraphicsBeginImageContext(rcVin.size);
             CGContextRef context = UIGraphicsGetCurrentContext();
             CGContextDrawImage(context, rcVin, subImageRef);
             UIImage *vinImage = [UIImage imageWithCGImage:subImageRef];
             UIGraphicsEndImageContext();
             CGImageRelease(subImageRef);
             
             //保存图像到相册
             UIImageWriteToSavedPhotosAlbum(vinImage, self, nil, NULL);
             [_topView.resultImg setImage:vinImage];
             _topView.label.text = @"图像已保存至相册";
             _topView.promptLabel.text = @"";
             _topView.promptLabel1.text = @"点击屏幕继续识别";
         }
     }];
}


//单击手势
- (void)handleSingleFingerEvent:(UITapGestureRecognizer *)sender
{
    if (sender.numberOfTapsRequired == 1) {
        //单指单击
        _isRecognize = YES;
        _topView.label.text = @"";
        _topView.promptLabel1.text = @"";
        _topView.promptLabel.text = @"将框置于VIN码前";
        [_topView.resultImg setImage:nil];
        _topView.scan_line.hidden = NO;
        }
}

//返回按钮点击事件
- (void)back_btn{
    _isRecognize = NO;
    //释放核心
    [_vinTyper freeVinTyper];
    [_captureSession stopRunning];
    [self dismissViewControllerAnimated:YES completion:nil];
  
}

//拍照按钮点击事件
- (void)photoBtn{
    if(_isRecognize){
        [self captureimage];
    }
}

//闪光灯按钮点击事件
- (void)flashOnBtn{
    
    if (![_captureDevice hasTorch]) {
        //NSLog(@"no torch");
    }else{
        [_captureDevice lockForConfiguration:nil];
        if(!_flash){
            [_captureDevice setTorchMode: AVCaptureTorchModeOn];
            [flashBtn setImage:[UIImage imageNamed:@"flash_off"] forState:UIControlStateNormal];
            _flash = YES;
        }
        else{
            [_captureDevice setTorchMode: AVCaptureTorchModeOff];
            [flashBtn setImage:[UIImage imageNamed:@"flash_on"] forState:UIControlStateNormal];
            _flash = NO;
        }
        [_captureDevice unlockForConfiguration];
    }
    
}

//移动扫描线
-(void)moveScanline{
    [_topView.scan_line setCenter:linePoint];
    [UIView animateWithDuration:2.5f delay:0.0f options:UIViewAnimationOptionRepeat animations:^{
        CGPoint center = linePoint;
        center.x -= _topView.centerRect.size.width;
        [_topView.scan_line setCenter:center];
    } completion:^(BOOL finished) {
    }];
}

- (void)startMotionManager{
    if (_motionManager == nil) {
        _motionManager = [[CMMotionManager alloc] init];
    }
    _motionManager.deviceMotionUpdateInterval = 1/15.0;
    if (_motionManager.deviceMotionAvailable) {
        //        NSLog(@"Device Motion Available");
        [_motionManager startDeviceMotionUpdatesToQueue:[NSOperationQueue currentQueue]
                                            withHandler: ^(CMDeviceMotion *motion, NSError *error){
                                                [self performSelectorOnMainThread:@selector(handleDeviceMotion:) withObject:motion waitUntilDone:YES];
                                                
                                            }];
    } else {
        //        NSLog(@"No device motion on device.");
        [self setMotionManager:nil];
    }
}

- (void)handleDeviceMotion:(CMDeviceMotion *)deviceMotion{
    double x = deviceMotion.gravity.x;
    double y = deviceMotion.gravity.y;
    if (fabs(y) >= fabs(x))
    {
        if(_isTransform){
            [UIView animateWithDuration:0.5 animations:^{
                backBtn.transform = CGAffineTransformMakeRotation(0);
                flashBtn.transform = CGAffineTransformMakeRotation(0);
                photoBtn.transform = CGAffineTransformMakeRotation(0);
            } completion:^(BOOL finished) {
                _isTransform = NO;
            }];
        }
    }
    else
    {
        if(!_isTransform){
            [UIView animateWithDuration:0.5 animations:^{
                backBtn.transform = CGAffineTransformMakeRotation(M_PI/2);
                flashBtn.transform = CGAffineTransformMakeRotation(M_PI/2);
                photoBtn.transform = CGAffineTransformMakeRotation(M_PI/2);
            } completion:^(BOOL finished) {
                _isTransform = YES;
            }];
        }
    }
}


//隐藏状态栏
- (UIStatusBarStyle)preferredStatusBarStyle{
    
    return UIStatusBarStyleDefault;
}
- (BOOL)prefersStatusBarHidden{
    return YES;
}

- (AVCaptureDevice *)captureDevicePosition:(AVCaptureDevicePosition)position
{
    NSArray *devices = [AVCaptureDevice devicesWithMediaType:AVMediaTypeVideo];
    for (AVCaptureDevice *device in devices)
    {
        if (device.position == position)
        {
            return device;
        }
    }
    return nil;
}


#pragma mark

CG_INLINE CGRect
CGRectMakeImage(CGFloat x, CGFloat y, CGFloat width, CGFloat height)
{
    CGRect rect;
    CGFloat screenHeight = [UIScreen mainScreen].bounds.size.height;
    CGFloat ratio = screenHeight/568.0;
    if (screenHeight==480) { //iphone 4/4s
        rect.origin.y = y * ratio;
        rect.origin.x = (x+30) * ratio;
        rect.size.width = width;
        rect.size.height = height;
    }else{
        rect.origin.x = x * ratio;
        rect.origin.y = y * ratio;
        rect.size.width = width * ratio;
        rect.size.height = height * ratio;
        
    }
    return rect;
}


@end
