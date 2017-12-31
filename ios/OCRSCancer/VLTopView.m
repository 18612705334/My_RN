//
//  TopView.m
//
//  Created by etop on 15/12/22.
//  Copyright (c) 2015年 etop. All rights reserved.
//

#import "VLTopView.h"
#import <CoreText/CoreText.h>

@implementation VLTopView{
    
    CGPoint leftBottom; //横屏左下角
    CGPoint rightBottom; //横屏右下角
    CGPoint leftTop;  //横屏左上角
    CGPoint rightTop;  //横屏右上角
}

- (id) initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        
        CGRect rect_screen = [[UIScreen mainScreen]bounds];
        CGFloat width = rect_screen.size.width;
        CGFloat height = rect_screen.size.height;
        CGFloat hRatio = height/568.0;
        
        leftBottom = CGPointMake(0, 0);
        rightBottom = CGPointMake(0, height);
        leftTop = CGPointMake(width, 0);
        rightTop = CGPointMake(width, height);
        self.centerRect = CGRectMake(0, 0, width, height);
//        if(width == 320&&height==480){ //iphone 4/4s
//            leftBottom = CGPointMake(30, 40);
//            rightBottom = CGPointMake(30, 440);
//            leftTop = CGPointMake(290, 40);
//            rightTop = CGPointMake(290, 440);
//            self.centerRect = CGRectMake(30, 40, 260, 400);
//        }
//        else { //iphone 5/5s/6/6 plus/6s/6s plus
//            leftBottom = CGPointMake(30*hRatio, 84*hRatio);
//            rightBottom = CGPointMake(30*hRatio, 484*hRatio);
//            leftTop = CGPointMake(290*hRatio, 84*hRatio);
//            rightTop = CGPointMake(290*hRatio, 484*hRatio);
//            self.centerRect = CGRectMake(30*hRatio, 84*hRatio, 260*hRatio, 400*hRatio);
//        }
    }
    return self;
}


- (void) drawRect:(CGRect)rect
{
    [super drawRect:rect];
    
    //   [[UIColor colorWithRed:1.0 green:0.5 blue:0.0 alpha:1.0] set];
//    [[UIColor greenColor] set];
    CGContextRef context = UIGraphicsGetCurrentContext();
//    //设置线宽
//    CGContextSetLineWidth(context, 3.0f);
//    
//    //画角线
//    CGContextMoveToPoint(context,leftBottom.x, leftBottom.y+20);
//    CGContextAddLineToPoint(context, leftBottom.x, leftBottom.y);
//    CGContextAddLineToPoint(context, leftBottom.x+20, leftBottom.y);
//    
//    CGContextMoveToPoint(context, rightBottom.x,rightBottom.y-20);
//    CGContextAddLineToPoint(context, rightBottom.x,rightBottom.y);
//    CGContextAddLineToPoint(context, rightBottom.x+20,rightBottom.y);
//    
//    CGContextMoveToPoint(context, leftTop.x-20,leftTop.y);
//    CGContextAddLineToPoint(context, leftTop.x,leftTop.y);
//    CGContextAddLineToPoint(context, leftTop.x,leftTop.y+20);
//    
//    CGContextMoveToPoint(context, rightTop.x, rightTop.y-20);
//    CGContextAddLineToPoint(context, rightTop.x, rightTop.y);
//    CGContextAddLineToPoint(context, rightTop.x-20, rightTop.y);
//    
//    CGContextStrokePath(context);
    
//    [[UIColor whiteColor] set];
//    context = UIGraphicsGetCurrentContext();
//    //设置线宽
//    CGContextSetLineWidth(context, 0.2f);
//    //画边线
//    CGContextMoveToPoint(context,leftBottom.x, leftBottom.y);
//    CGContextAddLineToPoint(context, leftBottom.x, rightBottom.y);
//    CGContextAddLineToPoint(context, rightTop.x, rightBottom.y);
//    CGContextAddLineToPoint(context, rightTop.x, leftTop.y);
//    CGContextAddLineToPoint(context, leftBottom.x, leftTop.y);
//    CGContextStrokePath(context);
    
    [[UIColor whiteColor] set];
    context = UIGraphicsGetCurrentContext();
    //设置线宽
    CGContextSetLineWidth(context, 2.0f);
    //四条线
    if (!_leftHidden) {
        CGContextMoveToPoint(context, _cornerLeftUp.x, _cornerLeftUp.y);
        CGContextAddLineToPoint(context, _cornerLeftDown.x,_cornerLeftDown.y);
    }
    if (!_rightHidden) {
        CGContextMoveToPoint(context, _cornerRightUp.x,_cornerRightUp.y);
        CGContextAddLineToPoint(context, _cornerRightDown.x, _cornerRightDown.y);
    }
    
    if (!_topHidden) {
        CGContextMoveToPoint(context, _cornerLeftUp.x,_cornerLeftUp.y);
        CGContextAddLineToPoint(context, _cornerRightUp.x, _cornerRightUp.y);
    }
    if (!_bottomHidden) {
        CGContextMoveToPoint(context, _cornerLeftDown.x, _cornerLeftDown.y);
        CGContextAddLineToPoint(context, _cornerRightDown.x,_cornerRightDown.y);
    }
    CGContextStrokePath(context);
}
- (void) setTopHidden:(BOOL)topHidden
{
    _topHidden = topHidden;
    [self setNeedsDisplay];
}

- (void) setLeftHidden:(BOOL)leftHidden
{
    _leftHidden = leftHidden;
    _topHidden = leftHidden;
    _rightHidden = leftHidden;
    _bottomHidden = leftHidden;
    [self setNeedsDisplay];
}

- (void) setBottomHidden:(BOOL)bottomHidden
{
    _bottomHidden = bottomHidden;
    [self setNeedsDisplay];
}

- (void) setRightHidden:(BOOL)rightHidden
{
    _rightHidden = rightHidden;
    [self setNeedsDisplay];
}

@end
