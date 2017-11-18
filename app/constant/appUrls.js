/**
 * 开发地址
 */
//export const BASEURL = 'http://dev.api-gateway.dycd.com/';


/**
 * 测试地址
 */
export const BASEURL = 'http://api-gateway.test.dycd.com/';


/**
 * 正式地址
 */
//export const BASEURL = 'https://gatewayapi.dycd.com/';

/**
 * 预发布地址
 */
// export const BASEURL = 'https://stgatewayapi.dycd.com/';

/**
 * 版本号1
 */
export const V = "v1/";

/**
 * 版本号2
 *
 export const V2 = "v2/";

 /**
 * 版本号3
 */
// export const V3 = "v3/";

/**
 * 分享测试地址
 */
export const FENXIANGTEST = 'http://test.bms.dycd.com/platform/car_detail.html';

/**
 * 分享正式地址
 */
export const FENXIANGOPEN = 'http://m.dycd.com/platform/car_detail.html';


/**
 * 上传图片
 */
export const INDEX_UPLOAD = BASEURL + V + 'index/upload';

/**
 *属性配置
 */
export const CAR_CONFIG = BASEURL + V + 'car/config';

/**
 * 获取车品牌
 */
export const CAR_HOME_BRAND = BASEURL + V + 'home/brand';

/**
 * 获取车系
 */
export const CAR_HOME_SERIES = BASEURL + V + 'home/series';


/**
 * 获取车型
 */
export const CAR_HOME_MODELS = BASEURL + V + 'home/models';

/**
 * 获取省份
 */
export const GET_PROVINCE = BASEURL + V + 'home/getProvince';

/**
 * 获取
 */
export const INDEX_CITY = BASEURL + V + 'index/city';


/**
 * 获取车源列表
 */
export const CAR_INDEX = BASEURL + V + 'car/index';

/**
 * 获取车辆搜索历史
 */
export const CAR_HiSTORY = BASEURL + V + 'car/searchHistory';

/**
 * 获取车辆搜索匹配信息
 */
export const CAR_SEARCH_TOP = BASEURL + V + 'car/searchTop';

/**
 * 获取车辆详情
 */
export const CAR_DETAIL = BASEURL + V + 'car/detail';


/**
 * 获取车辆配置信息
 */
export const CAR_CONFIGURATION = BASEURL + V + 'car/modelsConfig';

/**
 * 获取车辆保养
 */
export const CAR_GET_ERPORT = BASEURL + V + 'che/report';

/**
 * 获取车辆违章记录
 */
export const CAR_GET_ILLEGAL = BASEURL + V + 'che/illegal';

/**
 * 获取车辆参考价
 */
export const CAR_GET_REFERENCEPRICE = BASEURL + V + 'che/referencePrice';

/**
 * 获取车辆残值价格
 */
export const CAR_GET_RESIDUALS = BASEURL + V + 'che/residuals';

/**
 * 车辆下订单
 */
export const CAR_ORDER_SAVE = BASEURL + V + 'order/save';

// /**
//  * 获取客服电话号码
//  */
// export const CAR_CUSTOMER_PHONE_NUMBER = BASEURL + V + '/index/getCustomService';

/**
 * 获取客服电话号码-商户号码
 */
export const CAR_CUSTOMER_PHONE_NUMBER = BASEURL + V + '/index/companyPhone';

/**
 * 获取我的车源-已上架/下架
 */
export const CAR_USER_CAR = BASEURL + V + 'user/car';

/**
 * 我的车源-已上架/下架-操作
 */
export const CAR_STATUS = BASEURL + V + 'car/status';

/**
 * 我的车源-更新车辆发布时间
 */
export const CAR_REFRESH_TIME = BASEURL + V + 'car/refreshPublisherTime';

/**
 * 我的车源-删除车辆
 */
export const CAR_DELETE = BASEURL + V + 'car/delete';

/**
 * 我的车源-已售操作
 */
export const CAR_SALE = BASEURL + V + 'car/sale';

// /**
//  * 我的车源-创建已售消息
//  */
// export const CAR_SASS_SALED = BASEURL + 'cheshang/sass/saled';

/**
 * 我的车源-创建已售消息
 */
export const CAR_SASS_SALED = BASEURL + 'cheshang/sass_php/addSaledMessage';

/**
 * 获取我的车源-未审核
 */
export const CAR_PERLIST = BASEURL + V + 'car/preList';

/**
 * 创建收车任务
 */
export const CAR_SASS_PUBLISH = BASEURL + 'cheshang/sass/publish';

/**
 * 创建收车管理列表
 */
export const CAR_SASS_SELECT_LIST= BASEURL + 'cheshang/sass/selectList';

/**
 * 收车任务详情
 */
export const CAR_SASS_SELECT_MSG= BASEURL + 'cheshang/sass/selectMsg';

/**
 * 整备车辆任务列表
 */
export const CAR_CHESHANG_TASKS= BASEURL + 'cheshang/sass/tasks';

/**
 * 创建整备任务
 */
export const CAR_CHESHANG_PUBLISHTASK= BASEURL + 'cheshang/sass/publishTask';

/**
 * saas-发布车辆
 */
export const CAR_CHESHANG_PUBLISHCAR= BASEURL + 'cheshang/sass/publishCar';

/**
 * 查看整备任务
 */
export const CAR_CHESHANG_TASKINFO= BASEURL + 'cheshang/sass/taskInfo';

/**
 * 整备任务 - 评估师提交任务
 */
export const CAR_CHESHANG_PGS_EDIT_TASK= BASEURL + 'cheshang/sass/pgsEditTask';

/**
 * 整备任务 - 整备员提交任务
 */
export const CAR_CHESHANG_ZBY_EDIT_TASK= BASEURL + 'cheshang/sass/zbyEditTask';

/**
 * 整备任务 - 经理提交任务
 */
export const CAR_CHESHANG_MANAGER_EDIT_TASK= BASEURL + 'cheshang/sass/managerEditTask';

/**
 * 整备任务 - 运营专员交任务
 */
export const CAR_CHESHANG_YYZY_EDIT_TASK= BASEURL + 'cheshang/sass/updateTaskByyyzy';

/**
 * 获取销售员
 */
export const CAR_CHESHANG_GET_ALLCHILD= BASEURL + 'cheshang/sass_php/subAccountGetAllChild';

/**
 * 分享成功回调
 */
export const CAR_CHESHANG_SHARE_MOMENT_COUNT= BASEURL + 'cheshang/sass/shareMomentCount';

/**
 * 获取登记人信息
 */
export const GET_REGISTRANT = BASEURL + V + 'car.borrower/getRegistrants';

/**
 * 添加登记人信息
 */
export const ADD_REGISTRANT = BASEURL + V + 'car.borrower/addRegistrant';

/**
 * 验证车架号
 */
export const VIN_CHECK = BASEURL + V + 'car/checkVin';

/**
 * 根据VIN获取车辆详情
 */
export const VININFO = BASEURL + V + 'car/vininfo';

/**
 * 添加&修改车源
 */
export const CAR_SAVE = BASEURL + V + 'car/save';

/**
 * 图形验证码
 */
export const IDENTIFYING = BASEURL + V + "index/captcha";// v1/index/captcha

/**
 * 首页数据
 */
export const HOME = BASEURL + V + "home";//

/**
 * 金融转发
 */
export const FINANCE = BASEURL + V + "finance/index";//

/**
 * 收藏列表
 */
export const FAVORITES = BASEURL + V + "user.favorites/index";//

/**
 * 浏览历史
 */
export const USER_HISTORY = BASEURL + V + "user.history/index";//

/**
 * 取消收藏
 */
export const DELETE = BASEURL + V + "user.favorites/delete";//

/**
 * 清空浏览历史
 */
export const USER_HISTORY_DELETE = BASEURL + V + "user.history/delete";//

/**
 * 员工列表
 */
export const USER_EMPLOYE = BASEURL + V + "user.employe/index";

/**
 * 选择的当前企业信息
 */
export const USER_GET_SELECT_ENTERPRISE_INFO = BASEURL + V + "user/getSelectEnterpriseInfo";

/**
 * from @zhaojian
 *
 * 获取借款主体
 **/
export const LOAN_SUBJECT = 'api/v1/user/get_loan_subject_list';

/**
 * from @zhaojian
 *
 * 获取企业合同列表
 **/
export const USER_GET_USER_LIST = 'api/v1/user/get_user_list';

/**
 * from @zhaojian
 *
 * 获取更新信息
 **/
export const APP_UPDATE = BASEURL + 'v1/system/index';

/**
 * from @zhaojian
 *
 * 获取还款列表
 **/
export const REPAYMENT_GETLIST = 'api/v2/Repayment/getList';

/**
 * from @zhaojian
 *
 * 获取还款历史
 **/
export const GETHISTORICALLIST = 'api/v1/Repayment/getHistoricalList';

/**
 * from @zhaojian
 *
 * 添加采购贷车辆
 **/
export const PURCHAAUTO_ADDAUTO = 'api/v2/purchaAuto/addAuto';

/**
 * from @zhaojian
 *
 * 获取角色列表
 **/
export const USER_ROLE = BASEURL + 'v1/user/role';

/**
 * from @zhaojian
 *
 * 添加||编辑员工
 **/
export const USER_EMPLOYEE_SAVE = BASEURL + 'v1/user.employee/save';

/**
 * from @zhaojian
 *
 * 查看员工
 **/
export const USER_EMPLOYEE_VIEW = BASEURL + 'v1/user.employee/view';

/**
 * from @zhaojian
 *
 * 开通个人账户
 **/
export const USER_OPEN_ACCOUNT_PERSONAL = BASEURL + 'v1/user.open_account/personal';

/**
 * from @zhaojian
 *
 * 修改个人账户
 **/
export const USER_ACCOUNT_SAVEPERSONAL = BASEURL + 'v1/user.account/savePersonal';

/**
 * from @zhaojian
 *
 * 修改交易密码
 **/
export const USER_ACCOUNT_EDITPAYPWD = BASEURL + 'v1/user.account/editPayPwd';

/**
 * from @zhaojian
 *
 * 通过商户ID获取财务是否有账户管理权限
 **/
export const GETACCOUNTSTATUSBYUID = BASEURL + 'v1/user.account/getAccountStatusByUID';

/**
 * from @zhaojian
 *
 * 重置交易密码
 **/
export const USER_ACCOUNT_RESETPAYPWD = BASEURL + 'v1/user.account/resetPayPwd';

/**
 * from @zhaojian
 *
 * 修改绑定银行卡手机号
 **/
export const USER_BANK_EDITPHONE = BASEURL + 'v1/user.bank/editPhone';

/**
 * from @zhaojian
 *
 * 绑定银行卡
 **/
export const USER_BANK_BIND = BASEURL + 'v1/user.bank/bind';

/**
 * from @zhaojian
 *
 * 开通企业账户
 **/
export const USER_OPEN_ACCOUNT_COMPANY = BASEURL + 'v1/user.open_account/company';

/**
 * from @zhaojian
 *
 * 修改企业账户
 **/
export const USER_ACCOUNT_SAVECOMPANY = BASEURL + 'v1/user.account/saveCompany';

/**
 * from @zhaojian
 *
 * 获取账户信息
 **/
export const USER_ACCOUNT_INFO = BASEURL + 'v1/user.account/info';

/**
 * from @zhaojian
 *
 * 获取用户功能权限
 **/
export const GETFUNCTIONBYTOKENENTER = BASEURL + 'v1/user/getFunctionByTokenEnter';

/**
 * from @zhaojian
 *
 * 获取账户管理首页
 **/
export const USER_ACCOUNT_INDEX = BASEURL + 'v1/user.account/index';

/**
 * from @zhaojian
 *
 * 获取交易流水
 **/
export const USER_ACCOUNT_PAYLOG = BASEURL + 'v1/user.account/payLog';

/**
 * from @huangning
 *
 * 获取交易流水
 **/
export const ACCOUNT_PAYLOG = BASEURL + 'v2/user.account/payLog';

/**
 * from @zhaojian
 *
 * 注销员工
 **/
export const USER_EMPLOYEE_DESTROY = BASEURL + 'v1/user.employee/destroy';

/**
 * from @zhaojian
 *
 * 解绑银行卡
 **/
export const USER_BANK_UNBIND = BASEURL + 'v1/user.bank/unBind';

/**
 * from @zhaojian
 *
 * 提现接口
 **/
export const USER_ACCOUNT_WITHDRAW = BASEURL + 'v1/user.account/withdraw';

/**
 * from @zhaojian
 *
 * 获取绑定银行卡信息
 **/
export const USER_BANK_QUERY = BASEURL + 'v1/user.bank/query';

/**
 * from @zhaojian
 *
 * 存储错误信息
 **/
export const ADDACCOUNTMESSAGEINFO = BASEURL + 'v1/user.account/addAccountMessageInfo';

/**
 * from @zhaojian
 *
 * 根据卡号获取虚拟账号信息
 **/
export const USER_ACCOUNT_COMPANYINFO = BASEURL + 'v1/user.account/companyInfo';

/**
 * from @zhaojian
 *
 * 生成订单合同
 **/
export const CONTRACT_APPLYPLSEAL = BASEURL + 'v1/contract/applyPlSeal';

/**
 * from @zhaojian
 *
 * 用户发起转账
 **/
export const USER_ACCOUNT_TRANSFER = BASEURL + 'v1/user.account/transfer';

/**
 * from @zhaojian
 *
 * 更新采购贷车辆
 **/
export const PURCHAAUTO_UPDATEAUTO = 'api/v2/purchaAuto/updateAuto';

/**
 * from @zhaojian
 *
 * 获取还款计划列表
 **/
export const GETPLANLIST = 'api/v2/Repayment/getPlanList';

/**
 * from @zhaojian
 *
 * 获取还款计划详情
 **/
export const GETPLANINFO = 'api/v2/Repayment/getPlanInfo';

/**
 * from @zhaojian
 *
 * 新获取还款计划详情
 **/
export const REPAYMENT_GET_PLAN_INFO = 'api/v5/Repayment/get_plan_info';

/**
 * from @zhaojian
 *
 * 获取采购贷车辆照片分类
 **/
export const PURCHAAUTO_GETPURCHAAUTOPICCATE = 'api/v2/purchaAuto/getPurchaAutoPicCate';

/**
 * from @zhaojian
 *
 * 获取还款详情
 **/
export const REPAYMENT_GETINFO = 'api/v2/Repayment/getInfo';

/**
 * from @zhaojian
 *
 * 获取提前还款详情
 **/
export const NEWREPAYMENT_CREDIT_APPLY_REPAYMENT = 'api/v5/NewRepayment/credit_apply_repayment';

/**
 * from @zhaojian
 *
 * 获取新还款详情
 **/
export const NEWREPAYMENT_GET_INFO = 'api/v5/NewRepayment/get_info';

/**
 * from @zhaojian
 *
 * 获取新还款计划
 **/
export const REPAYMENT_GET_ADJUST_INFO = 'api/v5/Repayment/get_adjust_info';

/**
 * from @zhaojian
 *
 * 申请提前还款
 **/
export const APPLYREPAYMENT = 'api/v1/Repayment/applyRepayment';

/**
 * from @zhaojian
 *
 * 单个企业优惠券
 **/
export const COUPON_LISTBYUID = BASEURL + 'v1/user.coupon/listByUid';

/**
 * from @zhaojian
 *
 * 新申请提前还款
 **/
export const NEWREPAYMENT_APPLY_REPAYMENT = 'api/v5/NewRepayment/apply_repayment';

/**
 * from @zhaojian
 *
 * 获取优惠券列表
 **/
export const REPAYMENT_GET_ADJUST_USE = 'api/v5/Repayment/get_adjust_use';


/**
 * from @zhaojian
 *
 * 使用优惠券
 **/
export const REPAYMENT_GET_ADJUST_SAVE = 'api/v5/Repayment/get_adjust_save';

/**
 * from @zhaojian
 *
 * 获取库融还款计划详情
 **/
export const REPAYMENT_GETONLINEINFO = 'api/v2/Repayment/getOnlineInfo';

/**
 * from @zhaojian
 *
 * 获取合同数据
 **/
export const GET_CONTRACT_DATA = 'api/v1/account/get_contract_data';

/**
 * from @zhaojian
 *
 * 获取借款单合同数据
 **/
export const CONTRACTBYLIST = 'api/V1/Contract/contractbylist';

/**
 * from @zhaojian
 *
 * 线下库容获取合同数据
 **/
export const CONTRACT_LOAN_CONTRACT_LIST = 'api/v1/contract/loan_contract_list';

/**
 * from @zhaojian
 *
 * 签署合同
 **/
export const CONTRACT_SIGN = 'api/v1/account/contract_sign';

/**
 * from @zhaojian
 *
 * 新签署合同
 **/
export const SIGN_CONTRACT_BY_ONE = 'api/v1/contract/sign_contract_by_one';


/**
 * from @zhaojian
 *
 * 获取库融调整详情
 **/
export const REPAYMENT_GETADJUSTINFO = 'api/v2/Repayment/getAdjustInfo';

/**
 * from @zhaojian
 *
 * 元通查看合同
 **/
export const CONTRACT_CONTRACTDETAIL = 'api/v1/Contract/contractDetail';

/**
 * from @zhaojian
 *
 * 获取借款首页数据
 **/
export const GET_MNY = 'api/v3/account/get_mny';


/**
 * from @lhc
 *
 * 获取借款首页数据
 **/
export const GET_APPLY_INFO = 'api/v3/account/get_apply_info';

/**
 * from @huangning
 *
 * 获取借款首页数据
 * 获取借款详情
 **/
export const CARLOAN_LOAN_INFO = 'api/v3/carloan/loan_info';

/**
 * from @lhc
 *
 * 获取借款进度列表
 **/
export const GET_PAYMENT_SCHEDULE_ALL = 'api/v1/account/get_payment_schedule'

/**
 * from @lhc
 *
 * 修改借款金额
 **/
export const SET_APPLY_MNY = 'api/v3/account/set_apply_mny'

/**
 * from 黄宁
 *
 * 车抵贷 修改借款金额
 **/
export const CARLOAN_SET_APPLY_MNY = 'api/v3/carloan/set_apply_mny'

/**
 * from @lhc
 * 获取订单车辆列表
 **/
export const GET_APPLY_CARLIST = 'api/v2/account/get_apply_carlist';
/**
 * from @lhc
 * 删除车辆
 **/
export const DELETEAUTO = 'api/v2/purchaAuto/deleteAuto'
/**
 * from @lhc
 * 获取订单车辆详情
 **/

export const GET_CAR_INFO = 'api/v1/account/get_car_info'
/**
 * from @lhc
 * 取消借款单车/库容
 **/
export const CANCEL_LOAN = 'api/v3/account/cancel_loan'

/**
 * from @huangning
 * 取消借款
 **/
export const CARLOAN_CANCEL_LOAN = 'api/v3/carloan/cancel_loan'

/**
 * from @zhaojian
 *
 * 获取借款记录
 **/
export const GET_APPLY_LIST = 'api/v3/account/get_apply_list';

/**
 * from @zhaojian
 *
 * 选择借款主体
 **/
export const OPT_LOAN_SUBJECT = 'api/v1/user/opt_loan_subject';

/**
 * from @zhaojian
 *
 * 单车借款信息
 **/
export const GET_APPLY_LOAN_DATA = 'api/v3/account/get_apply_loan_data';
/**
 * from @lhc
 *
 * 采购贷借款车辆列表
 **/
export const AUTOLIST = 'api/v2/purchaAuto/autoList'
/**
 * from @lhc
 *
 * 订单融资车辆列表
 **/
export const DDAUTOLIST = 'api/v1/Order/autoList'
/**
 * from @huangning
 *
 * 申请展期
 **/
export const DO_EXTENSION = 'api/v1/account/do_extension';

/**
 * from @huangning
 *
 * 绑定OBD设备
 **/
export const BINDOBD = 'api/v1/purchaAuto/bindObd';

/**
 * from @huangning
 *
 * 绑定OBD设备 订单融资
 **/
export const BINDOBDDDRZ = 'api/v5/PlatformOrder/bind_obd';

/**
 * 获取微众申请页面数据
 */
export const GETAPPLYDATA = "/api/v1/microchinese/get_apply_data";

/**
 * 获取借据数据列表
 */
export const GET_IOU_LIST = "/api/v1/microchinese/get_iou_list";

/**
 * 确认借据操作
 */
export const CONFIRM_APPLY = "/api/v1/microchinese/confirm_apply";


/**
 * 微众额度申请
 */
export const APPLY_MNY = "/api/v1/microchinese/apply_mny";

/**
 * 获取短信验证码
 */
export const GET_SMS_VERIFY_CODE = "/api/v1/public/get_sms_verify_code";

/**
 * from @huangning
 *
 * 检测OBD
 **/
export const AUTODETECTOBD = "api/v1/purchaAuto/autoDetectObd";
/**
 * from @huangning
 *
 * 更新订单融资车辆
 **/
export const DDUPDATEAUTO = "api/v1/Order/updateAuto";
/**
 * from @huangning
 *
 * 获取采购贷车辆照片分类
 **/
export const GETPURCHAAUTOPICCATE = "api/v2/purchaAuto/getPurchaAutoPicCate";
/**
 * from @huangning
 *
 * 获取订单融资车辆照片分类
 **/
export const GETDINGDANAUTOPICCATE = "api/v1/Order/getOrderAutoPicCate";


/**
 * from @huangning
 *
 * 获取采购贷车辆列表
 **/
export const PURCHAAUTOAUTOLIST = "api/v1/purchaAuto/autoList";

/**
 * from @ZN
 *
 * 采购贷选择模式
 **/
export const APPLY_PATTERN_LIST = 'api/v3/account/apply_pattern_list';

/**
 * from @huangning
 *
 * 采购贷确认借款金额
 **/
export const ACCOUNTCONFIRM_AMOUNT = "api/v3/account/confirm_amount";

/**
 * from @huangning
 *
 * 申请展期-生成合同
 **/
export const DO_EXTENSIONPC = 'api/v3/account/extension_contract_pc';

/**
 * from @huangning
 *
 * 申请展期
 **/
export const APPLY_EXTENSION_CARLIST = 'api/v1/account/apply_extension_carlist';


/**
 * from @zhaojian
 *
 * 申请借款
 **/
export const APPLY_LOAN = 'api/v3/account/apply_loan'

/**
 * from huangning
 * 车抵贷申请借款
 */
export const CARLOAN_APPLY_LOAN = 'api/v3/carloan/apply_loan'

/**
 * from @huagnning
 *
 * 获取订单融资车辆详情
 **/
export const AUTODETAIL = 'api/v1/Order/autoDetail'

/**
 * from @huagnning
 *
 * 获取商户登记人/收车人列表
 **/
export const GETBUSINESSLIST = 'api/v1/Order/getBusinessList'

/**
 * 短信验证码
 *
 * device_code    设备码        必填
 * name    文件资源    object    'name' 名可以自定义
 * user_id    可空
 */
export const SEND_SMS = BASEURL + V + "auth/sendSmsCode";

/**
 * 登录
 *
 *code    短信验证码【必填】    string
 *device_code    设备识别码【必填】    string
 *img_code    图片验证码【必填】    string
 *phone    手机号【必填】    string
 *pwd    密码【必填】
 */
export const LOGIN = BASEURL + V + "auth/login";// auth/login

/**
 * 注册
 code             短信验证码【必填】          number
 confirm_pwd      确认密码【必填】            string
 device_code      设备代号【必填】            string
 idcard_img       身份证照片上传id【必填】     string
 license_img      营业执照照片上传id【必填】   string
 merchant_name    商户名称【必填】            string
 phone            手机号【必填】              string
 pwd              密码【必填】               string
 user_name        用户姓名【必填】            string
 */
export const REGISTER = BASEURL + V + "auth/register";//  auth/register

/**
 * 设置密码
 *
 * token=
 * device_code=
 * confirm_pwd    确认密码【必填】    string
 * pwd    密码【必填】
 */
export const SETPWD = BASEURL + V + "user/setPwd";

/**
 * 修改密码
 *
 * 变量名    含义    类型    备注
 * code    短信验证码【必填】    number
 * confirm_pwd    确认密码【必填】    string
 * phone    用户手机号【必填】    number
 * pwd
 */
export const CHANGEPWD = BASEURL + V + "user/resetPwd";
/**
 * 注册，图片上传
 */
export const AUTH_UPLOAD_FILE = BASEURL + V + "auth/upload";

/**
 * 合同列表
 */
export const CONTRACTLIST = 'api/v1/Contract/contract_list';

/**
 * 元通合同列表
 */
export const CONTRACT_CONTRACT_LIST = 'api/v1/Contract/contract_list';

/**
 * 转债权合同列表
 */
export const GET_CTC_CONTRACT_LIST_FOR_APP = 'api/v1/contract/get_ctc_contract_list_for_app';

/**
 * 获取合同提示信息
 */
export const GET_CONTRACT_REMIND = 'api/v1/contract/get_contract_remind';

/**
 * 线下合同列表
 */
export const CONTRACT_LOAN_LIST = 'api/v1/contract/loan_list';
/**
 * 查看合同详情
 */
export const CHECKOUT_CONTRACT = '/api/v1/Contract/contractDetail';
/**
 * from @ch
 *
 * 签署合同
 **/
export const CONTRACT_SIGN_MINE = 'api/v1/Contract/signContract';
/**
 * 获取商户登记人/收车人列表
 **/
export const GET_BUSINESS_LIST = 'api/v1/purchaseloanBusiness/getBusinessList';
/**
 * 获取采购贷车辆详情
 **/
export const PURCHA_AUTO_DETAIL = 'api/v2/purchaAuto/autoDetail';
/**
 * 获取车架好是否已存在以及校验规则
 **/
export const PURCHA_CHECK_IN = 'api/v2/purchaAuto/checkVin';
/**
 * 订单列表
 */
export const ORDER_INDEX = BASEURL + V + 'order/index';
/**
 * 订单搜索
 */
export const ORDER_SEARCH = BASEURL + V + 'order/search';
/**
 * 订单详情
 */
export const ORDER_DETAIL = BASEURL + V + 'order/detail';
/**
 * 订金、尾款支付
 */
export const ORDER_PAY = BASEURL + V + 'order/pay';
/**
 *  车辆成交价提交
 */
export const ORDER_SAVE_PRICE = BASEURL + V + 'order/savePrice';
/**
 *  卖家&买家取消订单
 */
export const ORDER_CANCEL = BASEURL + V + 'order/cancel';
/**
 *  确认收车
 */
export const ORDER_CONFIRM_CAR = BASEURL + V + 'order/confirmCar';
/**
 *  买家撤销取消订单
 */
export const ORDER_REVERT = BASEURL + V + 'order/revert';
/**
 *  卖家处理取消订单
 */
export const ORDER_CANCEL_HANDLER = BASEURL + V + 'order/cancelHandler';
/**
 *  车辆定价检查
 */
export const ORDER_CHECK_PRICE = BASEURL + V + 'order/checkPrice';
/**
 *  获取筛选订单状态
 */
export const ORDER_FIELD_DICT = BASEURL + V + 'order/fieldDict';
/**
 *  支付状态
 */
export const ORDER_CHECK_PAY = BASEURL + V + 'order/checkPay';
/**
 *  卖家同意取消订单
 */
export const ORDER_ALLOW_CANCEL = BASEURL + V + 'order/allowCancel';
/**
 *  卖家不同意取消订单
 */
export const ORDER_DENY_CANCEL = BASEURL + V + 'order/denyCancel';
/**
 * 查看订单某个类型合同
 */
export const ORDER_GET_CONTRACT = BASEURL + V + 'order/getContractByType';
/**
 *  获取借款人所属白名单状态【订单融资调用】
 */
export const ORDER_GET_MERGE_WHITE_PO_STATUS = 'api/v3/account/get_merge_white_po_status';
/**
 *  添加订单融资车辆
 */
export const ADD_PLATFORM_ORDER_CAR = BASEURL + V + 'order_finance_car/add';
/**
 *  融资订单贷款全额检查
 */
export const ORDER_LOAN_AMOUNT_CHECK = BASEURL + V + 'order_finance/orderLoanAmountCheck';
/**
 *  融资流程确认验收请求
 */
export const CONFIRM_FINANCING_ORDER = BASEURL + V + 'order_finance/confirmFinancingOrder';
/**
 *  融资订单支付首付款
 */
export const FIRST_PAYMENT_PAY = BASEURL + V + 'order_finance/firstPaymentPay';
/**
 *  融资订单支付首付款回调
 */
export const FIRST_PAYMENT_PAY_CALLBACK = BASEURL + V + 'order_finance/firstPaymentPayCallback';

/**
 *  扣款协议合同
 */
export const FIRST_REPAYMENT_CONTRACT = '/api/v1/Contract/see_electron_repayment_contract';

/**
 *  签署-扣款协议合同
 */
export const FIRST_REPAYMENT_CONTRACT_SIGN = '//api/v1/Contract/sign_electron_repayment_contract';


/**
 *  form @dingyonggang
 *  签署订单合同
 */
export const SIGN_ORDER_CONTRACT = BASEURL + V + 'order/signContractAll';

//CRM TEST
export const PRE = "http://10.3.10.35:8080/";
/**
 *  门店管理web页
 */
export const STORE_RECEPTION_MANAGE = PRE + "ceshi.do?mobile=15102373842";
/**
 *  软文中心web页
 */
export const SOFT_ARTICLES_CENTER = "http://saas-static.dycd.com/inc/carmarket/articleList.html";
/**
 *  添加潜在客户
 */
export const CUSTOMER_ADD_URL = BASEURL + "cheshang/customer/create";
/**
 *  获取待办消息数量
 */
export const HANDLE_COUNT = BASEURL + "cheshang/sass/handleCount";
/**
 *  获取系统消息或车市头条消息数量
 */
export const SELECT_UNREAD_MESSAGE_COUNT = BASEURL + "cheshang/sass/selectUnReadMessageCount";
/**
 *  待办事项、系统消息、车市头条列表数据
 */
export const SELECT_MSG_BY_CONTENT_TYPE = BASEURL + "cheshang/sass/selectMsgByContentType";
/**
 *  门店查询当前人是否存在
 */
export const SELECT_CUST_IF_EXIST = BASEURL + "cheshang/customer/selectCustIfExist";
/**
 *  每日，周，月提醒
 */
export const DAILY_REMINDER_RANK_LEVEL = BASEURL + "cheshang/sass/rankLevel";
/**
 *  每日，周，月统计
 */
export const DAILY_REMINDER_STATISTICS = BASEURL + "cheshang/sass/statistics";
/**
 *  获取潜在客户列表
 */
export const POTENTIAL_CUSTOMER_LISTS = BASEURL + "cheshang/customer/lists";
//export const POTENTIAL_CUSTOMER_LISTS = PRE + "customer/querycustomerList.do";
/**
 *  获取潜在客户详情
 */
//export const POTENTIAL_CUSTOMER_DETAIL = "http://10.3.10.35:8080/customer/selectDetail.do";
export const POTENTIAL_CUSTOMER_DETAIL = BASEURL + "cheshang/customer/selectDetail";
/**
 *  获取所有跟进信息
 */
export const SELECT_ALL_FLOW = BASEURL + "cheshang/customer/selectAllFlow";
/**
 *  获取当前任务信息
 */
export const SELECT_FLOW = BASEURL + "cheshang/customer/selectFlow";
/**
 *  提交当前任务信息
 */
export const CUSTOMER_FLOW = BASEURL + "cheshang/customer/customerFlow";
/**
 *  搜索潜在客户列表
 */
export const QUERY_CUSTOMER_BY_SEARCH_KEY = BASEURL + "cheshang/customer/querycustomerBysearchkey";
/**
 *  获取保有客户数据列表
 */
export const TENURE_PERFECT_IF_LIST = BASEURL + "cheshang/tenure_customer/tenurePerfectIfList";
/**
 *  获取保有客户数据详情
 */
export const TENURE_CAR_PEOPLE_MSG = BASEURL + "cheshang/tenure_customer/tenureCarPeopleMsg";
/**
 *  获取保有客户数据提交
 */
export const UPDATE_CAR_WELFARE = BASEURL + "cheshang/tenure_customer/updateCarWelfare";
/**
 *  搜索保有客户数据
 */
export const SELECT_BY_SEARCH = BASEURL + "cheshang/tenure_customer/selectBySearch";


