//
//  ViewController.h
//  自定义相机
//
//  Created by 夏桂峰 on 15/12/1.
//  Copyright (c) 2015年 夏桂峰. All rights reserved.
//

#import <UIKit/UIKit.h>

typedef void(^selectImageBlock)(UIImage *selectImage);

@interface CameraController : UIViewController

@property (nonatomic,strong)selectImageBlock ImageBlock;

@end

