//
//  VLCameraViewController.m
//
//  Created by etop on 15/12/22.
//  Copyright (c) 2015年 etop. All rights reserved.
//

#import "VLCameraViewController.h"
#import "VLTopView.h"
#import "SVehicleLicense.h"
#import "AppDelegate.h"

@interface VLCameraViewController ()<UIAlertViewDelegate,AVCaptureVideoDataOutputSampleBufferDelegate>{
    AVCaptureSession *_captureSession;
    AVCaptureDeviceInput *_captureInput;
    AVCaptureStillImageOutput *_captureOutput;
    AVCaptureVideoPreviewLayer *_capturePreview;
    AVCaptureDevice *_captureDevice;
    
    SVehicleLicense *_sVehicleLicense; //识别核心
    VLTopView *_topView; //检测视图层
    BOOL _isCameraAuthor; //是否有打开摄像头权限
    BOOL _isRecognize; //是否识别
    BOOL _isChangeType;//识别方式切换
    BOOL _isPhotoRecog;//是否是拍照识别
    NSTimer *_timer; //定时器
    BOOL _flash; //控制闪光灯
    CGPoint linePoint;//扫描线初始位置
    UIButton* photoBtn;
    UIButton* flashBtn;
    UIButton* backBtn;
    UIButton* changeBtn;
    BOOL _isTransform;
    BOOL _isFocusing;
    BOOL _isFocusPixels;//是否相位对焦
    GLfloat _FocusPixelsPosition;//相位对焦下镜头位置
    GLfloat _curPosition;//当前镜头位置
    
    NSMutableArray *pointCorner;
    CAShapeLayer* _shapeLayer;
    UIBezierPath* _bezierPath;
}
@end

@implementation VLCameraViewController

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
    _sVehicleLicense = [[SVehicleLicense alloc] init];
    
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
    
    //设置检测视图层
    _shapeLayer = [CAShapeLayer layer];
    
    CGRect screenRect = self.view.bounds;
    CGFloat offset = 1.0f;
    if ([[UIScreen mainScreen] scale] >= 2) {
        offset = 0.5;
    }
    
    if (!_topView) {
        _topView = [[VLTopView alloc] initWithFrame:self.view.bounds];
    }
    
    CGRect centerFrame = _topView.centerRect;
    CGRect centerRect = CGRectInset(centerFrame, -offset, -offset) ;
    
    _bezierPath = [UIBezierPath bezierPath];

    [_shapeLayer setFillRule:kCAFillRuleEvenOdd];
    [_shapeLayer setFillColor:[[UIColor colorWithWhite:0 alpha:0.5] CGColor]];
    [self.view.layer addSublayer:_shapeLayer];
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
}

//创建提示信息
- (void)createPormptInfo{
    
    UITapGestureRecognizer *singleFingerOne = [[UITapGestureRecognizer alloc] initWithTarget:self
                                                                                      action:@selector(handleSingleFingerEvent:)];
    singleFingerOne.numberOfTouchesRequired = 1; //手指数
    singleFingerOne.numberOfTapsRequired = 1; //tap次数
    [self.view addGestureRecognizer:singleFingerOne];
    
    CGFloat screenHeight = [UIScreen mainScreen].bounds.size.height;
    if(screenHeight == 480){
        photoBtn = [[UIButton alloc]initWithFrame:CGRectMakeImage(130,460,40,40)];
    }
    else{
        photoBtn = [[UIButton alloc]initWithFrame:CGRectMakeImage(130,496,60,60)];
    }
    photoBtn.tag = 1000;
    photoBtn.hidden = YES;
    [photoBtn setImage:[UIImage imageNamed:@"take_pic_btn"] forState:UIControlStateNormal];
    [photoBtn addTarget:self action:@selector(photoBtn) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:photoBtn];
    
    changeBtn = [[UIButton alloc]initWithFrame:CGRectMakeImage(130,10,60,60)];
    changeBtn.tag = 1000;
    changeBtn.hidden = NO;
    [changeBtn setImage:[UIImage imageNamed:@"change_btn"] forState:UIControlStateNormal];
    [changeBtn addTarget:self action:@selector(recognizeTypeBtn) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:changeBtn];
    
    flashBtn = [[UIButton alloc]initWithFrame:CGRectMakeImage(260,10,60,60)];
    flashBtn.tag = 1000;
    flashBtn.hidden = NO;
    [flashBtn setImage:[UIImage imageNamed:@"flash_on"] forState:UIControlStateNormal];
    [flashBtn addTarget:self action:@selector(flashOnBtn) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:flashBtn];
    
    backBtn = [[UIButton alloc]initWithFrame:CGRectMakeImage(0,10,60,60)];
    backBtn.tag = 1000;
    backBtn.hidden = NO;
    [backBtn setImage:[UIImage imageNamed:@"back_btn"] forState:UIControlStateNormal];
    [backBtn addTarget:self action:@selector(back_btn) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:backBtn];
    
    CGPoint center;
    center.x = CGRectGetMidX(_topView.centerRect);
    center.y = CGRectGetMidY(_topView.centerRect);
    
    _topView.promptLabel = [[UILabel alloc] initWithFrame:CGRectMakeImage(0, 0, 568, 80)];
    _topView.promptLabel.text = @"请将行驶证置于框内";
    _topView.promptLabel.font = [UIFont fontWithName:@"Helvetica" size:25];
    _topView.promptLabel.textColor = [UIColor whiteColor];
    _topView.promptLabel.textAlignment = NSTextAlignmentCenter;
    _topView.promptLabel.transform = CGAffineTransformMakeRotation(3.14/2);
    [_topView.promptLabel setCenter:center];
    [self.view addSubview:_topView.promptLabel];
    
    _topView.promptLabel1 = [[UILabel alloc] initWithFrame:CGRectMakeImage(0, 0, 400, 60)];
    _topView.promptLabel1.text = @"";
    _topView.promptLabel1.font = [UIFont fontWithName:@"Helvetica" size:15];
    _topView.promptLabel1.textColor = [UIColor whiteColor];
    _topView.promptLabel1.textAlignment = NSTextAlignmentCenter;
    _topView.promptLabel1.transform = CGAffineTransformMakeRotation(3.14/2);
    CGPoint promptLabel1 = center;
    promptLabel1.x += _topView.centerRect.size.width/2-30;
    [_topView.promptLabel1 setCenter:promptLabel1];
    [self.view addSubview:_topView.promptLabel1];
    
    _topView.label = [[UILabel alloc] initWithFrame:CGRectMakeImage(0, 0, 400, 260)];
    _topView.label.text = @"";
    _topView.label.numberOfLines = 0;
    _topView.label.font = [UIFont fontWithName:@"Helvetica" size:20];
    _topView.label.textColor = [UIColor greenColor];
    _topView.label.textAlignment = NSTextAlignmentLeft;
    _topView.label.transform = CGAffineTransformMakeRotation(3.14/2);
    [_topView.label setCenter:center];
    [self.view addSubview:_topView.label];
    

}


- (void) viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    
    self.navigationController.navigationBarHidden = YES;
    AVCaptureDevice*camDevice =[AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo];
    //注册通知
    [camDevice addObserver:self forKeyPath:@"adjustingFocus" options:NSKeyValueObservingOptionNew context:nil];
    if (_isFocusPixels) {
        [camDevice addObserver:self forKeyPath:@"lensPosition" options:NSKeyValueObservingOptionNew context:nil];
    }
    //定时器
    _timer = [NSTimer scheduledTimerWithTimeInterval:1.0 target:self selector:@selector(startMotionManager) userInfo:nil repeats:NO];
    

    //初始化识别核心
    int nRet = [_sVehicleLicense initSVehicleLicense:@"4D39F52BD46AC7CD8470" nsReserve:@""];
    if ([self.delegate respondsToSelector:@selector(initVehicleLicenseWithResult:)]) {
        [self.delegate initVehicleLicenseWithResult:nRet];
    }
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
    _isRecognize = YES;
    _isChangeType = YES;
    _isPhotoRecog = NO;
    pointCorner = [[NSMutableArray alloc] init];
    if(![_captureSession isRunning])
        [_captureSession startRunning];
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
    //关闭定时器
    [_timer invalidate];
    _timer = nil;
    _isRecognize = NO;
    //移除监听
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    //释放核心
    [_sVehicleLicense freeSVehicleLicense];
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
    
    if(!_isPhotoRecog){
        if(!_isFocusing){
    if (_isRecognize == YES) {
        if(_curPosition==_FocusPixelsPosition){
            //开始识别
            NSMutableArray *tempArray = [[NSMutableArray alloc] init];
            int bSuccess = [_sVehicleLicense detectSVehicleLicenseSide:baseAddress Width:(int)width Height:(int)height Corner:tempArray];
            //识别成功
            if(bSuccess != 33)
            {
                CGPoint point1 = CGPointFromString([tempArray objectAtIndex:0]);
                CGPoint point2 = CGPointFromString([tempArray objectAtIndex:1]);
                CGPoint point3 = CGPointFromString([tempArray objectAtIndex:2]);
                CGPoint point4 = CGPointFromString([tempArray objectAtIndex:3]);
                [pointCorner removeAllObjects];
                [pointCorner addObject:NSStringFromCGPoint(point1)];
                [pointCorner addObject:NSStringFromCGPoint(point2)];
                [pointCorner addObject:NSStringFromCGPoint(point3)];
                [pointCorner addObject:NSStringFromCGPoint(point4)];
                point1 = [self translatePoint:point1];
                point2 = [self translatePoint:point2];
                point3 = [self translatePoint:point3];
                point4 = [self translatePoint:point4];
                _topView.cornerLeftUp = point1;
                _topView.cornerRightUp = point2;
                _topView.cornerLeftDown = point4;
                _topView.cornerRightDown = point3;
                dispatch_async(dispatch_get_main_queue(), ^{
                    [_topView setLeftHidden:NO];
                    [self drawNewBezierPathWithCorner];
                });
                if(bSuccess==0){
                    [self captureimage];
                    _isRecognize = NO;
                }
            }
            else{
                [pointCorner removeAllObjects];
                dispatch_async(dispatch_get_main_queue(), ^{
                    [_topView setLeftHidden:YES];
                    [self drawNewBezierPathWithCorner];
                });
            }
            [self performSelectorOnMainThread:@selector(showErrorInfo:) withObject:[NSNumber numberWithInt:bSuccess] waitUntilDone:NO];
        }else{
            _curPosition=_FocusPixelsPosition;
        }
    }
        }
    }
    CVPixelBufferUnlockBaseAddress(imageBuffer,0);
    
}

//返回按钮点击事件
- (void)back_btn{
    _isRecognize = NO;
    //释放核心
    [_captureSession stopRunning];
    [_sVehicleLicense freeSVehicleLicense];
    [self dismissViewControllerAnimated:YES completion:nil];
  
}

//拍照按钮点击事件
- (void)photoBtn{
    if(_isPhotoRecog){
        [self captureimage];
        if(_flash){
            [flashBtn setImage:[UIImage imageNamed:@"flash_on"] forState:UIControlStateNormal];
            _flash = NO;
        }
    }
}

//切换识别方式按钮点击事件
- (void)recognizeTypeBtn{
    if(_isChangeType){
        _topView.scan_line.hidden = YES;
        _isPhotoRecog = YES;
        _topView.promptLabel.text = @"请将行驶证置于框内再点击拍照按钮";
        photoBtn.hidden = NO;
        _topView.label.text = @"";
        _topView.promptLabel1.text = @"";
        _isChangeType = NO;
        dispatch_async(dispatch_get_main_queue(), ^{
            [_topView setLeftHidden:YES];
        });
    }
    else{
        _topView.scan_line.hidden = NO;
        _isPhotoRecog = NO;
        _topView.promptLabel.text = @"请将行驶证置于框内";
        _topView.label.text = @"";
        _topView.promptLabel1.text = @"";
        _isChangeType = YES;
        photoBtn.hidden = YES;
        dispatch_async(dispatch_get_main_queue(), ^{
            [_topView setLeftHidden:NO];
        });
    }
    _isRecognize = YES;
    [_captureSession startRunning];
}

//拍照
-(void)captureimage
{
    //将处理图片状态值置为YES
    //get connection
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
             [_captureSession stopRunning];
             //识别状态为NO
             _isRecognize = NO;
             NSData *imageData = [AVCaptureStillImageOutput jpegStillImageNSDataRepresentation:imageSampleBuffer];
             UIImage *tempImage = [[UIImage alloc] initWithData:imageData];
             UIImage *finalImage = [UIImage imageWithCGImage:tempImage.CGImage scale:1.0 orientation:UIImageOrientationUp];
             //保存图像到相册
             UIImageWriteToSavedPhotosAlbum(finalImage, self, nil, NULL);
             
             int nSuccess = [_sVehicleLicense recognizeSvehicleLicensePhoto:finalImage];
             
             if(nSuccess==0)
                 [self performSelectorOnMainThread:@selector(showResultAndImage:) withObject:nil waitUntilDone:NO];
             else{
                 [self performSelectorOnMainThread:@selector(showErrorInfo:) withObject:[NSNumber numberWithInt:nSuccess] waitUntilDone:NO];
             }
             }
//         }
     }];
}

//显示结果跟图像
-(void)showResultAndImage:(UIImage *)image
{
    NSString *nsResult = [NSString stringWithFormat:@"%@",_sVehicleLicense.nsVIN];
  
   [self dismissViewControllerAnimated:YES completion:^{
     self.scaneResult(nsResult,nil);
     
   }];
  
}

-(void)showErrorInfo:(NSNumber *)nError
{
    if([(nError)intValue]==0){
        _topView.promptLabel.text = @"正在识别请稍后";
    }else if([(nError)intValue]==33){
        _topView.promptLabel.text = @"请将行驶证置于框内";
    }else if([(nError)intValue]==34){
        _topView.promptLabel.text = @"证件不清晰或者证件不是行驶证";
    }
    else if([(nError)intValue]==31){
        _topView.promptLabel.text = @"请将证件放近点";
    }else if([(nError)intValue]==32){
//        _topView.promptLabel.text = @"正在检线";
    }else{
//        NSString *nsResult = [NSString stringWithFormat:@"识别失败，返回值：%d",[(nError)intValue]];
        _topView.label.text = @"图像不清晰，请重新拍照";
        _topView.promptLabel.text = @"";
        _topView.promptLabel1.text = @"点击屏幕继续拍照识别";
        _isRecognize = YES;
    }
}

//单击手势
- (void)handleSingleFingerEvent:(UITapGestureRecognizer *)sender
{
    if (sender.numberOfTapsRequired == 1) {
        //单指单击
        _isRecognize = YES;
        _topView.label.text = @"";
        _topView.promptLabel1.text = @"";
        [_topView.resultImg setImage:nil];
        if(_isPhotoRecog){
            _topView.scan_line.hidden = YES;
            _topView.promptLabel.text = @"请将行驶证置于框内再点击拍照按钮";
            [_captureSession startRunning];
        }
        else{
            _topView.scan_line.hidden = NO;
            _topView.promptLabel.text = @"请将行驶证置于框内";
        }
        if(!_captureSession.isRunning)
            [_captureSession startRunning];
    }
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
                changeBtn.transform = CGAffineTransformMakeRotation(0);
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
                changeBtn.transform = CGAffineTransformMakeRotation(M_PI/2);
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
        rect.origin.y = y-20;
        rect.origin.x = x;
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

-(CGPoint) translatePoint:(CGPoint)point{
    CGFloat screenHeight = [UIScreen mainScreen].bounds.size.height;
    CGFloat screenWidth = [UIScreen mainScreen].bounds.size.width;
    CGPoint pointTemp;
    pointTemp.y = point.x*screenHeight/1280;
    pointTemp.x = (720 -point.y)*screenWidth/720;
    return pointTemp;
}

-(void)drawNewBezierPathWithCorner{
    [_bezierPath removeAllPoints];
    if([pointCorner count] == 4){
        [_shapeLayer setFillColor:[[UIColor colorWithWhite:0 alpha:0.5] CGColor]];
        CGRect screenRect = self.view.bounds;
        [_bezierPath moveToPoint:CGPointMake(CGRectGetMinX(screenRect), CGRectGetMinY(screenRect))];
        [_bezierPath addLineToPoint:CGPointMake(CGRectGetMinX(screenRect), CGRectGetMaxY(screenRect))];
        [_bezierPath addLineToPoint:CGPointMake(CGRectGetMaxX(screenRect), CGRectGetMaxY(screenRect))];
        [_bezierPath addLineToPoint:CGPointMake(CGRectGetMaxX(screenRect), CGRectGetMinY(screenRect))];
        [_bezierPath addLineToPoint:CGPointMake(CGRectGetMinX(screenRect), CGRectGetMinY(screenRect))];
        [_bezierPath moveToPoint:[self translatePoint:CGPointFromString([pointCorner objectAtIndex:0])]];
        [_bezierPath addLineToPoint:[self translatePoint:CGPointFromString([pointCorner objectAtIndex:1])]];
        [_bezierPath addLineToPoint:[self translatePoint:CGPointFromString([pointCorner objectAtIndex:2])]];
        [_bezierPath addLineToPoint:[self translatePoint:CGPointFromString([pointCorner objectAtIndex:3])]];
        [_bezierPath closePath];
    }else{
        [_shapeLayer setFillColor:[[UIColor clearColor] CGColor]];
    }
    [_shapeLayer setPath:[_bezierPath CGPath]];
}

@end
