//
//  SaoYiSaoViewController.m
//  SaoYiSao
//
//  Created by ClaudeLi on 16/4/21.
//  Copyright © 2016年 ClaudeLi. All rights reserved.
//

#import "OBDScanController.h"
#define RealValue(value) ((value)/320.0f*[UIScreen mainScreen].bounds.size.width)
#define kScreenWidth [UIScreen mainScreen].bounds.size.width
#define kScreenHeight [UIScreen mainScreen].bounds.size.height
// 距顶部高度
#define Top_Height 0.2*kScreenHeight
// 中间View的宽度
#define MiddleWidth 0.8*kScreenWidth


static NSString *saoText = @"将二维码/条形码放入框内，即可自动扫描";

@interface OBDScanController ()<UIAlertViewDelegate,UIGestureRecognizerDelegate>
{
    bool _canOpen;
    UILabel * _inputLabel;
    NSString * _resultStr;
}

@end

@implementation OBDScanController

- (instancetype)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        _canOpen = NO;
      
    }
    return self;
}



- (void)viewDidLoad {
    [super viewDidLoad];
    self.title = @"手动绑定";
    self.view.backgroundColor = [UIColor whiteColor];
    [self creatBackGroundView];
    [self creatUI];
}

-(void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    [self setupCamera];
}

- (void)viewWillDisappear:(BOOL)animated{
    [super viewWillDisappear:animated];
    [timer invalidate];
    timer = nil;
    [_session stopRunning];
}

-(void)lineAnimation{
    CGFloat leadSpace = (kScreenWidth - MiddleWidth)/ 2;
    if (upOrdown == NO) {
        num ++;
        _line.frame = CGRectMake(leadSpace, Top_Height+2*num, MiddleWidth, 12);
        if (2*num >= MiddleWidth-12) {
            upOrdown = YES;
            _line.image = [UIImage imageNamed:@"Icon_SaoLineOn"];
        }
    }else {
        num --;
        _line.frame = CGRectMake(leadSpace, Top_Height+2*num, MiddleWidth, 12);
        if (num == 0) {
            upOrdown = NO;
            _line.image = [UIImage imageNamed:@"Icon_SaoLine"];
        }
    }
}
//点击确定按钮事件响应
-(void)backAction{

  
    [self.navigationController dismissViewControllerAnimated:YES completion:^{
       self.JsBolock(_resultStr,@"scan");
    }];
}

- (void)setupCamera{
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        // Device
        if (!_device) {
            _device = [AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo];
            // Input
            _input = [AVCaptureDeviceInput deviceInputWithDevice:self.device error:nil];
            
            // Output
            _output = [[AVCaptureMetadataOutput alloc]init];
            [_output setMetadataObjectsDelegate:self queue:dispatch_get_main_queue()];
            
            
            CGSize size = self.view.bounds.size;
            CGRect cropRect = CGRectMake((kScreenWidth-MiddleWidth)/2.0, Top_Height, MiddleWidth, MiddleWidth);
            CGFloat p1 = size.height/size.width;
            CGFloat p2 = 1920.0/1080.0;  //使用了1080p的图像输出
            
            // Session
            _session = [[AVCaptureSession alloc]init];
            [_session setSessionPreset:AVCaptureSessionPresetHigh];
            if ([_session canAddInput:self.input]){
                [_session addInput:self.input];
                _canOpen = YES;
            }else{
                dispatch_async(dispatch_get_main_queue(), ^{
                    //回到主线程
                    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"提示" message:@"打开相机权限" delegate:self cancelButtonTitle:@"取消" otherButtonTitles:@"去设置", nil];
                    [alert show];
                });
            }
            if (_canOpen) {
                if ([_session canAddOutput:self.output]){
                    [_session addOutput:self.output];
                }
                
                _output.metadataObjectTypes=[NSMutableArray arrayWithObjects:AVMetadataObjectTypeAztecCode, AVMetadataObjectTypeCode128Code, AVMetadataObjectTypeCode39Code, AVMetadataObjectTypeCode39Mod43Code, AVMetadataObjectTypeCode93Code, AVMetadataObjectTypeEAN13Code, AVMetadataObjectTypeEAN8Code, AVMetadataObjectTypePDF417Code, AVMetadataObjectTypeQRCode, AVMetadataObjectTypeUPCECode, AVMetadataObjectTypeInterleaved2of5Code, AVMetadataObjectTypeITF14Code, AVMetadataObjectTypeDataMatrixCode,nil];
                __weak typeof(self) weakSelf = self;
                [[NSNotificationCenter defaultCenter]addObserverForName:AVCaptureInputPortFormatDescriptionDidChangeNotification
                                                                 object:nil
                                                                  queue:[NSOperationQueue mainQueue]
                                                             usingBlock:^(NSNotification * _Nonnull note) {
                                                                 if (weakSelf){
                                                                     //调整扫描区域
                                                                     AVCaptureMetadataOutput *output = weakSelf.session.outputs.firstObject;
                                                                     //                                                                     output.rectOfInterest = CGRectMake(cropRect.origin.y/size.height, cropRect.origin.x/size.width, MiddleWidth/size.height, MiddleWidth/ size.width);
                                                                     if (p1 < p2) {
                                                                         CGFloat fixHeight =self.view.bounds.size.width * 1920.0 / 1080.0;
                                                                         CGFloat fixPadding = (fixHeight - size.height)/2.0;
                                                                         output.rectOfInterest = CGRectMake((cropRect.origin.y + fixPadding)/fixHeight,
                                                                                                            cropRect.origin.x/size.width,
                                                                                                            cropRect.size.height/fixHeight,
                                                                                                            cropRect.size.width/size.width);
                                                                     } else {
                                                                         CGFloat fixWidth = self.view.bounds.size.height * 1080.0 / 1920.0;
                                                                         CGFloat fixPadding = (fixWidth - size.width)/2.0;
                                                                         output.rectOfInterest = CGRectMake(cropRect.origin.y/size.height,
                                                                                                            (cropRect.origin.x + fixPadding)/fixWidth,
                                                                                                            cropRect.size.height/size.height,
                                                                                                            cropRect.size.width/fixWidth);
                                                                     }
                                                                     
                                                                 }
                                                             }];
                // Preview
                _preview =[AVCaptureVideoPreviewLayer layerWithSession:self.session];
                _preview.videoGravity = AVLayerVideoGravityResizeAspectFill;
                dispatch_async(dispatch_get_main_queue(), ^{
                    //回到主线程
                    _preview.frame =CGRectMake(0,0,kScreenWidth,kScreenHeight);
                    [self.view.layer insertSublayer:self.preview atIndex:0];
                });
            }
        }
        // Start
        if (_canOpen) {
            dispatch_async(dispatch_get_main_queue(), ^{
                //回到主线程
                timer = [NSTimer scheduledTimerWithTimeInterval:.02 target:self selector:@selector(lineAnimation) userInfo:nil repeats:YES];
                [_session startRunning];
            });
        }
    });
}

#pragma mark  -- -- -- -- -- AVCapture Metadata Output Objects Delegate
- (void)captureOutput:(AVCaptureOutput *)captureOutput didOutputMetadataObjects:(NSArray *)metadataObjects fromConnection:(AVCaptureConnection *)connection{
    NSString *stringValue;
    if ([metadataObjects count] >0){
        AVMetadataMachineReadableCodeObject * metadataObject = [metadataObjects objectAtIndex:0];
        stringValue = metadataObject.stringValue;
    }
    _resultStr = stringValue;
    [_session stopRunning];
    [timer invalidate];
    timer = nil;
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"扫描结果" message:stringValue delegate:self cancelButtonTitle:@"确定" otherButtonTitles:nil, nil];
    [alert show];
}

#pragma mark - - UIAlertView Delegate - - - - - - - - - - - - - -
- (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex
{
    //    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:@"prefs:root=Privacy&path=CONTACTS"]];
    if (buttonIndex == 0) {
        [self backAction];
  
    }
}

#pragma mark  -- -- -- -- -- MakeView

- (void)creatBackGroundView{
    UIImageView *maskView = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, kScreenWidth, kScreenHeight)];
    maskView.image = [UIImage maskImageWithMaskRect:maskView.frame clearRect:CGRectMake((kScreenWidth-MiddleWidth)/2, Top_Height, MiddleWidth, MiddleWidth)];
    [self.view addSubview:maskView];
}

- (void)creatUI{
#pragma mark  -- -- -- -- -- 创建label  扫不上手动输入。。

    UILabel * labIntroudction= [[UILabel alloc] initWithFrame:CGRectMake(0, Top_Height+MiddleWidth + 20, kScreenWidth, 35)];
    labIntroudction.numberOfLines=2;

    NSMutableAttributedString *str=[[NSMutableAttributedString alloc]initWithString:@"扫不上," attributes:@{NSForegroundColorAttributeName:[UIColor blackColor]}];
    
    NSAttributedString *result=[[NSAttributedString alloc]initWithString:@"手动输入"  attributes:@{NSForegroundColorAttributeName:[UIColor colorWithRed:0.76 green:0.59 blue:0.31 alpha:1.00]}];
    
    [str appendAttributedString:result];
    labIntroudction.attributedText = str;
    labIntroudction.textAlignment = NSTextAlignmentCenter;
    labIntroudction.font = [UIFont systemFontOfSize:RealValue(14)];
    [self.view addSubview:labIntroudction];
    _inputLabel = labIntroudction;


    
#pragma mark  -- -- -- -- -- 带四个角的扫描框 的创建
    CGFloat leadSpace = (kScreenWidth - MiddleWidth)/ 2;
    UIImageView * imageView = [[UIImageView alloc]initWithFrame:CGRectMake(leadSpace, Top_Height, MiddleWidth, MiddleWidth)];
    imageView.image = [UIImage imageNamed:@"Icon_SaoYiSao"];
    
    [self.view addSubview:imageView];
    
    upOrdown = NO;
    num =0;
    _line = [[UIImageView alloc] initWithFrame:CGRectMake(leadSpace, Top_Height, MiddleWidth, 12)];
    _line.image = [UIImage imageNamed:@"Icon_SaoLine"];
    _line.contentMode = UIViewContentModeScaleToFill;
    [self.view addSubview:_line];
}
#pragma mark  -- -- -- -- -- 为label设置点击事件

- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
{
    UITouch *touch = [touches anyObject];
    
    CGPoint point = [touch locationInView:self.view];
    if(CGRectContainsPoint(_inputLabel.frame, point))
    {
      [self.navigationController dismissViewControllerAnimated:YES completion:^{
        self.JsBolock(@"呵呵",@"input");
      }];
    
    }
}

@end


@implementation UIImage (mask)

+ (UIImage *)maskImageWithMaskRect:(CGRect)maskRect clearRect:(CGRect)clearRect{
    
    UIGraphicsBeginImageContext(maskRect.size);
    CGContextRef ctx = UIGraphicsGetCurrentContext();
//    CGContextSetRGBFillColor(ctx, 1,1,1,0.6);
    CGContextSetFillColorWithColor(ctx, [UIColor whiteColor].CGColor);

    CGRect drawRect =maskRect;
    
    
    CGContextFillRect(ctx, drawRect);   //draw the transparent layer
    
    drawRect = clearRect;
    CGContextClearRect(ctx, drawRect);  //clear the center rect  of the layer
    
    UIImage* returnimage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return returnimage;
}

@end
