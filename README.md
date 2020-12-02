# merchant_demo_nodejs

## 服务和签名方法

### 1. 服务地址

```
# 测试环境 testnet
https://testapi.889bcd.com.tw/dev/creditable

# 生产环境 mainnet
https://zapi.889bcd.com.tw/prd/creditable
```

### 2. 签名方法

SHA256withRSA, 用密钥签名, 通过 https 包头传递签名

```
headers: {
    'content-type': 'application/json',
    'sign_type': 'SHA256WithRSA',
    'appid': appid,         // appid
    'sign': sign,
    'retrieve': method,     // api method
    'seq': '0'
}
```

* 注意保护密钥的安全.

### 3. 密钥创建方法

```
# 生成 RSA 密钥
openssl genrsa -out private.pem 2048
# 生成公钥
openssl rsa -in private.pem -outform PEM -pubout -out public.pem
# 生成 PKCS8 格式密钥，程序一般用这个进行签名
openssl pkcs8 -topk8 -inform PEM -in private.pem -outform PEM -nocrypt > private_pkcs8.pem
```

### 4. 接口申请

申请时提交参数包括：

* 公钥
* 商户名称
* 商户绑定的钱包手机号和区号
* 代收或代付回调地址

邮件发送至 <cs@bitoll.com>


## 接口说明

```
seq格式：1602860399123-xxxxxx

前面的整数是客户端请求时刻的毫秒整数时间戳

后面是根据业务类型的唯一ID。seq需要保证是唯一的
```

### 0010. 按手机号码查询 asset_query

- 请求 Request

```
{
    phone: "12345678",      // 手机号
    phone_code: "852",      // 区号
    auto_register: "YES"    // 自动注册 "YES"/"NO", default "YES"
}
```

- 响应 Response

```
{
    phone: "12345678",      // 手机号
    phone_code: "852",      // 区号
    user_no: "DE064122",    // 宝号
    is_registered: "YES",   // "YES" - 已注册, "NO" - 未注册 
    assets: [{asset_name: "USDT", address: "0x4Af23788148c4278eD525C9E197D2DD26C97B201"}] // 链上地址
    retrieve: "asset_query",
    seq: "0",
    result: 0,            // 0 - success, 其他 - 错误
    comment: "success"
}
```

### 0020. 按地址查询 address_query

- 请求 Request

```
{
    address: "0x4Af23788148c4278eD525C9E197D2DD26C97B201", // ERC20 地址
}
```

- 响应 Response

```
{
    address: "0x4Af23788148c4278eD525C9E197D2DD26C97B201", // 链上地址
    status: "STATUS_OCCUPIED", // "STATUS_NOT_FOUND" - 地址不存在, "STATUS_OCCUPIED" - 地址已占用
    is_registered: "YES",   // "YES" - 已注册, "NO" - 未注册, "AUTO" - 自动注册 
    is_sub_address: true,   //true or false
    merchantid: "testpay88", 
    group: "GROUP_IVI",//GROUP_IVI, GROUP_INITIAL(default)
    retrieve: "address_query",
    seq: "0",
    result: 0,            // 0 - success, 其他 - 错误
    comment: "success"
}
```

### 0030. 按宝号查询 user_no_query

- 请求 Request

```
{
    user_no: "DE064122", // 宝号
}
```

- 响应 Response

```
{
    user_no: "DE064122",    // 宝号
    is_registered: "YES",   // "YES" - 已注册, "NO" - 未注册 
    retrieve: "user_no_query",
    seq: "0",
    result: 0,            // 0 - success, 其他 - 错误
    comment: "success"
}
```

### 0040. 按宝号代付 merchant_transfer

- 请求 Request

```
{
    amount: "1234567",      // 金额，需乘以USDT的小数位10^6，例如转1.234567USDT时amount=1234567
    asset_name: "USDT",     // 货币名称 
    order_id: "ORD123456",  // 订单号
    to_user_no: "DE064122", // 宝号
}
```

- 响应 Response

```
{
    amount: "1234567",      // 金额
    asset_name: "USDT",     // 货币名称
    order_id: "ORD123456",  // 订单号
    to_user_no: "DE064122", // 宝号
    retrieve: "merchant_transfer",
    seq: "0",
    result: 0,            // 0 - success, 其他 - 错误
    comment: "transfer success"
}
```

### 0050. 按宝号代付订单查询 merchant_transfer_order

- 请求 Request

```
{
    merchant_order_id: "ORD123456", // 订单号
}
```

- 响应 Response

```
{
    id: "5e7d8874d6bcaf0007301509",
    appid: "BITOLLWALLETDEMO",
    amount: "1234567",    // 金额
    asset_name: "USDT",   // 货币名称
    order_id: "ORD123456", // 订单号
    to_user_no: "DE064122", // 宝号
    fee: "0",
    fee_paid_by: "",
    paid_total: "1234567", // amount + fee
    status: "STATUS_PENDING", // STATUS_PENDING, STATUS_FINISHED
    merchantid: "testpay88", // 商户号
    create_time: "2020-03-27T05:00:36Z",
    update_time: "2020-03-27T05:00:36Z",
    retrieve: "merchant_transfer_order",
    seq: "0",
    result: 0,            // 0 - success, 其他 - 错误
    comment: "success" 
}
```

### 0060. 按地址代付 merchant_withdraw

- 请求 Request

```
{
    amount: "1234567",      // 金额，需乘以USDT的小数位10^6，例如转1.234567USDT时amount=1234567
    asset_name: "USDT",     // 货币名称 
    order_id: "ORD123457",  // 订单号
    to: "0x4Af23788148c4278eD525C9E197D2DD26C97B201", // 地址
    merchant_name: "NAME"   // optional name
}
```

- 响应 Response

```
{
    id: "5e7d8874d6bcaf0007301509"
    amount: "1234567",      // 金额
    asset_name: "USDT",     // 货币名称
    order_id: "ORD123457",  // 订单号
    to: "0x4Af23788148c4278eD525C9E197D2DD26C97B201", // 地址
    fee: "1000000",         // 提币手续费1USDT 
    create_time: "2020-03-27T05:00:36Z",
    merchant_name: "NAME",
    is_transfer: false,
    retrieve: "merchant_withdraw",
    seq: "0",
    result: 0,            // 0 - success, 其他 - 错误
    comment: "withdraw success"
}
```

### 0070. 按地址代付订单查询 merchant_withdraw_order

- 请求 Request

```
{
    merchant_order_id: "ORD123457", // 订单号
}
```

- 响应 Response

```
{
    id: "5e7d8874d6bcaf0007301509",
    appid: "BITOLLWALLETDEMO",
    amount: "1234567",      // 金额
    asset_name: "USDT",     // 货币名称
    order_id: "ORD123456",  // 订单号
    to: "0x4Af23788148c4278eD525C9E197D2DD26C97B201", // 地址
    fee: "1000000",
    fee_paid_by: "",
    paid_total: "2234567",  // amount + fee
    status: "STATUS_FINISHED", // "STATUS_INITIAL" - 新建, "STATUS_PROCESSING" - 处理中, "STATUS_SIGNED" - 已签名, "STATUS_FINISHED" - 已完成
    merchantid: "testpay88", // 商户号
    block_number: "9790000", // 区块高度
    tx_hash: "0x9b57c18ec8950725728be6caa99c3a842c536ad43bb68e8f2743e493ac64eead", // 交易哈希
    create_time: "2020-03-27T05:00:36Z",
    update_time: "2020-03-27T05:00:36Z",
    retrieve: "merchant_withdraw_order",
    seq: "0",
    result: 0,            // 0 - success, 其他 - 错误
    comment: "success" 
}
```
## notification

- //const  "**retrieve**":"transfer_notify"//内部转账
- //const  "**retrieve**":"deposit_notify" //大地址链上充值
- //const  "**retrieve**":"deposit_payment_notify"//小地址链上充值
- //const  "**retrieve**":"deposit_payment_unconfirm_notify"//小地址链上充值还未确认的回调
- //const  "**retrieve**":"withdraw_transfer_payment_notify"//往小地址的链上提币
- //const  "**retrieve**":"withdraw_notify"//大地址的链上提币
- //const  "**retrieve**":"payment_notify"//扫码充值
- //const  "**retrieve**":"frozen_notify"//冻结通知
- //const  "**retrieve**":"unfrozen_approve_notify"//解冻成功通知
- //const  "**retrieve**":"unfrozen_return_notify"//解冻拒绝通知

### 0080. 按宝号代付回调 transfer_notify

- 回调 Callback

status:
- STATUS_INITIAL 
- STATUS_SUBMITED
- STATUS_FINISHED
- STATUS_REJECTED
- STATUS_NORMAL  
- STATUS_FAILED  
- STATUS_PENDING 
- STATUS_AUTODONE
- STATUS_RETURN_PENDING
- STATUS_RETURNED
```
{
    "retrieve": "transfer_notify",
    "sign": sign,           // 要用币付宝提供的公钥验证签名 
    "id": id,               // 系统ID
    "asset_name": "USDT",   // 货币代号
    "amount": "1234567",    // 包含小数位，要除以USDT的小数位10^6，1234567=1.234567
    "fee": "0",             // 手续费
    "order_id": order_id,   // 订单号
    "status": status,       // 状态
    "ref_transfer_id": rid, // 参考号
    "to_user_no"            // 宝号 ADD
    "create_time": "2020-03-27T05:00:36Z",
    "update_time": "2020-03-27T05:00:36Z",
    "from_phone"            // DELETE
    "from_phone_code"       // DELETE
    "to_phone"              // DELETE
    "to_phone_code"         // DELETE
    "from_user_no"
    "to_user_no"
}
```

- 响应 Response

```
{
    retrieve: "transfer_notify",
    seq: "0",
    result: 0,            // 0 - success, 其他 - 错误
    comment: "success"
}
```

### 0090. 按地址代付回调 withdraw_notify

- 回调 Callback

status:
- STATUS_INITIAL   
- STATUS_PROCESSING
- STATUS_SIGNED    
- STATUS_FINISHED  
- STATUS_REJECTED  
- STATUS_CANCELED  
- STATUS_UNKNOWN   
- STATUS_PENDING   
- STATUS_PENDING_WALLET
- STATUS_PENDING_SETTLEMENT
- STATUS_FINISHED_SETTLEMENT
```
{
    "retrieve": "withdraw_notify",
    "sign": sign,           // 要用币付宝提供的公钥验证签名 
    "appid": appid,         
    "id": id,               // 系统ID
    "asset_name": "USDT",   // 货币代号
    "amount": "1234567",    // 包含小数位，要除以USDT的小数位10^6，1234567=1.234567
    "fee": "0",             // 手续费
    "block_number": "9790000", // 区块高度
    "tx_hash": tx_hash,     // 交易哈希
    "confirm_number": "6",  // 链上确认次数
    "vid": vid,
    "status": status,       // 状态
    "to_address":           // 地址 ADD 
    "create_time": "2020-03-27T05:00:36Z",
    "update_time": "2020-03-27T05:00:36Z",
    "from_user"             // DELETE
    "from_phone"            // DELETE
    "from_phone_code"       // DELETE
    "to_phone"              // DELETE
    "to_phone_code"         // DELETE
    "from_user_no"
    "to_user_no"
}
```

- 响应 Response

```
{
    retrieve: "withdraw_notify",
    seq: "0",
    result: 0,            // 0 - success, 其他 - 错误
    comment: "success"
}
```

### 0100. 代收回调 payment_notify

- 回调 Callback

status:
- STATUS_INITIAL
- STATUS_SUBMITED
- STATUS_PAID
- STATUS_REJECTED
- STATUS_RETURN_PENDING
- STATUS_RETURNED
```
{
    "retrieve": "payment_notify",
    "sign": sign,           // 要用币付宝提供的公钥验证签名 
    "id": id,               // 系统ID
    "asset_name": "USDT",   // 货币代号
    "amount": "1234567",    // 包含小数位，要除以USDT的小数位10^6，1234567=1.234567
    "fee": "0",             // 手续费
    "order_id": order_id,   // 订单号
    "merchantid": merchant, // 商户号
    "merchant_name": NAME,  // 商户名
    "status": status,       // 状态
    "from_user_no"          // 宝号 ADD
    "create_time": "2020-03-27T05:00:36Z",
    "update_time": "2020-03-27T05:00:36Z",
    "from_phone"            // DELETE
    "from_phone_code"       // DELETE
    "to_phone"              // DELETE
    "to_phone_code"         // DELETE
}
```

- 响应 Response

```
{
    retrieve: "payment_notify",
    seq: "0",
    result: 0,            // 0 - success, 其他 - 错误
    comment: "success"
}
```
### 0110. 小地址充值支付回调 deposit_payment_notify

- 回调 Callback

```
{
    "retrieve": "deposit_payment_notify",
    "sign": sign,           // 要用币付宝提供的公钥验证签名 
    "id": id,               // 系统ID
    "asset_name": "USDT",   // 货币代号
    "amount": "1234567",    // 包含小数位，要除以USDT的小数位10^6，1234567=1.234567
    "fee": "0",             // 手续费
    "order_id": order_id,   // 订单号
    "merchantid": merchant, // 商户号
    "merchant_name": NAME,  // 商户名
    "status": status,       // 状态
    "from_user_no"          // 宝号 ADD
    "create_time": "2020-03-27T05:00:36Z",
    "update_time": "2020-03-27T05:00:36Z",
    "from_phone"            // DELETE
    "from_phone_code"       // DELETE
    "to_phone"              // DELETE
    "to_phone_code"         // DELETE
    "tx_hash"               //0x010eff391d49625cda673e04861dfa5158ba8b4621a28e5c2950a579352f2dd2
    "deposit_from_address"
    "deposit_to_address"
    "to_user_no"
}
```

- 响应 Response

```
{
    order_id: "商户返回的订单ID",
    retrieve: "deposit_payment_notify",
    seq: "0",
    result: 0,            // 0 - success, 其他 - 错误
    comment: "success"
}
```
### 0111. 小地址充值支付还未确认的回调 deposit_payment_unconfirm_notify
//需要先提供一个与资产回调相同或者不同的URL
- 回调 Callback

```
{
    "retrieve": "deposit_payment_unconfirm_notify",
    "sign": sign,           // 要用币付宝提供的公钥验证签名 
    "id": id,               // 系统ID
    "asset_name": "USDT",   // 货币代号
    "amount": "1234567",    // 包含小数位，要除以USDT的小数位10^6，1234567=1.234567
    "fee": "0",             // 手续费
    "order_id": order_id,   // 订单号
    "merchantid": merchant, // 商户号
    "merchant_name": NAME,  // 商户名
    "status": status,       // 状态
    "from_user_no"          // 宝号 ADD
    "create_time": "2020-03-27T05:00:36Z",
    "update_time": "2020-03-27T05:00:36Z",
    "from_phone"            // DELETE
    "from_phone_code"       // DELETE
    "to_phone"              // DELETE
    "to_phone_code"         // DELETE
    "tx_hash"               //0x010eff391d49625cda673e04861dfa5158ba8b4621a28e5c2950a579352f2dd2
    "deposit_from_address"
    "deposit_to_address"
    "to_user_no"
    "confirm_number": 6, //valid range: 0-6
}
```

- 响应 Response

```
{
    retrieve: "deposit_payment_unconfirm_notify",
    seq: "0",
    result: 0,            // 0 - success, 其他 - 错误
    comment: "success"
}
```
### 0120. 小地址提币变成内部转账充值支付回调 withdraw_transfer_payment_notify

- 回调 Callback

```
{
    "retrieve": "withdraw_transfer_payment_notify",
    "sign": sign,           // 要用币付宝提供的公钥验证签名 
    "id": id,               // 系统ID
    "asset_name": "USDT",   // 货币代号
    "amount": "1234567",    // 包含小数位，要除以USDT的小数位10^6，1234567=1.234567
    "fee": "0",             // 手续费
    "order_id": order_id,   // 订单号
    "merchantid": merchant, // 商户号
    "merchant_name": NAME,  // 商户名
    "status": status,       // 状态
    "from_user_no"          // 宝号 ADD
    "create_time": "2020-03-27T05:00:36Z",
    "update_time": "2020-03-27T05:00:36Z",
    "from_phone"            // DELETE
    "from_phone_code"       // DELETE
    "to_phone"              // DELETE
    "to_phone_code"         // DELETE
    "deposit_from_address"  // 转出方提币地址
    "deposit_to_address"    // 转入方地址
    "to_user_no"
    "withdraw_from_user_no" //提币来自宝号
    "withdraw_from_merchantid" //提币来自商户号
}
```

- 响应 Response

```
{
    retrieve: "withdraw_transfer_payment_notify",
    seq: "0",
    result: 0,            // 0 - success, 其他 - 错误
    comment: "success"
}
```
### 0130. 商户支付订单查询 merchant_order_request

- 查询支付订单信息请求

```
{
    "merchant_order_id": "ORD23456", //如果是子账户自动转账，这个id填上notify里面的id或者orderid（此种情况他们是一样的）
}
```

- 响应 Response

```
{
    "id"
    "appid"
    "asset_name"
    "amount"
    "fee"
    "from_phone"
    "from_phone_code"
    "from_user_no"
    "from_address"
    "order_id"
    "fee_paid_by"
    "create_time"
    "update_time"
    "type"
    "status"
    "paid_total"
    "merchantid"
    "merchant_name"
    "retrieve"
    "seq"
    "result": 0,            // 0 - success, 其他 - 错误
    "comment"
}
```
### 0140. 商户支付订单查询 sub_asset_query_by_userid

- 子资产查询绑定请求

```
{
    "merchant_name":"商户名称", //utf8
    "userid": "ID23456",
    auto_register: "YES"    // 自动注册 "YES"/"NO", default "YES"
}
```

- 响应 Response

```
{
    "merchant_name":"商户名称", //utf8
    "userid"
    "user_no"
    "is_registered":// "YES" - 已注册, "NO" - 未注册, "AUTO" - 自动注册 
    "assets":    //array of asset_info:asset_name,address,balance,frozen
    "sub_assets"://array of asset_info:asset_name,address,balance,frozen
    "retrieve"
    "seq"
    "result": 0,            // 0 - success, 其他 - 错误
    "comment"
}
```
### 0150. 扫码支付 - 代收的二维码数据获取

通过此接口获取二维码数据后，可以在 Javascript 或者 APP 内生成个性化二维码。

这个数据是 Bitoll Wallet V2 APP 可以识别的支付码。

服务器地址 - https://api-v2.bitoll.com/pay/qrdata

- 请求 Request

```
    merchant_id  商戶号
    amount       数量
    asset        数字货币
    order_id     商户订单号
```

- 响应 Response，此返回数据可用于生产二维码

```
gz://pay?n=bifubaopay&p=8a1eebaa8b9cd94f2b175bcfb2b6d133ef009c51e72dccac04909ee761311bd90421447056c72a5fed9de3cf5d6abc37
```

- 示例 Example

```
> curl "https://api-v2.bitoll.com/pay/qrdata?merchant_id=bifubaopay&amount=1&asset=USDT&order_id=123456"
gz://pay?n=bifubaopay&p=8a1eebaa8b9cd94f2b175bcfb2b6d133ef009c51e72dccac04909ee761311bd90421447056c72a5fed9de3cf5d6abc37
```

### 0160. APP支付 - 代收的 APP 唤醒支付

获取二维码数据后，将前缀 gz 改为 bitoll，然后打开此 URL，即可将已经安装了币付宝钱包的 APP 唤起支付。

```
bitoll://pay?n=bifubaopay&p=8a1eebaa8b9cd94f2b175bcfb2b6d133ef009c51e72dccac04909ee761311bd90421447056c72a5fed9de3cf5d6abc37
```

### 0170. H5支付 - 代收跳转到币付宝官网进行支付

适用于在浏览器前端传入参数，自动调整到二维码支付页面。

服务器地址 - https://api-v2.bitoll.com/pay/qrcode

- 请求 Request

```
    merchant_id  商戶号
    amount       数量
    asset        数字货币
    order_id     商户订单号
```

- 响应 Response

```
https://www.bitoll.com/qr.html?n=bifubaopay&p=8a1eebaa8b9cd94f2b175bcfb2b6d133c45217bdc5f9bbce9b04397bb094df749498ebeb847defc67232bc99c936bc98
```

- 示例 Example

在浏览器打开地址:

<https://api-v2.bitoll.com/pay/qrcode?merchant_id=bifubaopay&amount=1&asset=USDT&order_id=123456>

自动跳转到: 

<https://www.bitoll.com/qr.html?n=bifubaopay&p=8a1eebaa8b9cd94f2b175bcfb2b6d133c45217bdc5f9bbce9b04397bb094df749498ebeb847defc67232bc99c936bc98>

### 180 order_list
```
//start_time required, will return data in the range [GMT0:date,GMT0:date+1]
//and Filer By start_time&end_time
//default PAGENUM = 100
//empty default to be all
TYPE_SEND转账转出方
TYPE_RECV转账接收方
TYPE_SELL理财赎出
TYPE_SEND_SELL理财赎出转出方
TYPE_BUY理财买入
TYPE_RECV_BUY理财买入接收方
TYPE_WITHDRAW链上转出
TYPE_PAYMENT支付转出方
TYPE_RECV_PAYMENT支付接收方
带RETURN后缀表示对应类型的退款
request:{
    "appid": "",
    "order_id": "w1599103680893VE008553",
    "user_no": "",
    "user": "",
    "type": "",//TYPE_SEND,TYPE_RECV,TYPE_SELL,TYPE_SEND_SELL,TYPE_BUY,TYPE_RECV_BUY,TYPE_WITHDRAW,TYPE_PAYMENT,TYPE_RECV_PAYMENT
    "accepted_from": "",//APP, API, ADMIN, SUPER, SYSTEM
    "asset": "",//USDT etc
    "address": "",
    "start_time": 1599097079, //必填
    "end_time": 0,
    "page_number": 0,
    "page_size": 0
}

response:{
    "tx_list": [
        {
            "id": "5f50641e812f3300060cb043",
            "asset": "USDT",
            "amount": "60000000000",
            "fee": "0",
            "fee_paid_by": "FROM",
            "paid_total": "60000000000",
            "order_id": "w1599103680893VE008553",
            "status": "STATUS_PAID",
            "type": "TYPE_PAYMENT_RETURN",
            //TYPE_SEND,TYPE_RECV,
            //TYPE_WITHDRAW,TYPE_DEPOSIT,TYPE_REDEEM,
            //TYPE_PAYMENT,TYPE_RECV_PAYMENT,
            //TYPE_FROZEN,TYPE_UNFROZEN,TYPE_RECV_UNFROZEN,
            //TYPE_SEND_RETURN,TYPE_RECV_RETURN,TYPE_PAYMENT_RETURN,TYPE_RECV_PAYMENT_RETURN,
            //TYPE_BUY,TYPE_RECV_BUY,TYPE_BUY_RETURN,TYPE_RECV_BUY_RETURN,
            //TYPE_SELL,TYPE_SEND_SELL,TYPE_SELL_RETURN,TYPE_SEND_SELL_RETURN,
            "from_phone": "13801234567",//for payment privacy, not showing merchant's phone
            "from_phone_code": "86",
            "from_user_no": "ZC144374",
            "from_user": "5e40f311bcb9380007164e72",
            "to_user_no": "VE008553",
            "to_user": "5f213f2a4916130007a7fc3b",
            "create_time": "2020-09-03T03:34:38Z",
            "merchantid": "wealthcenter",
            "merchant_name": "",
            "from_balance": "78002243497",
            "from_frozen": "1234567",
            "to_balance": "18002243497",
            "to_frozen": "1234567",
            "accepted_from": "APP",
            "gas_fee": ""
        },
        {
            "id": "5f5062c0a8bc9b000735c85d",
            "asset": "USDT",
            "amount": "60000000000",
            "fee": "0",
            "fee_paid_by": "TO",
            "paid_total": "60000000000",
            "order_id": "w1599103680893VE008553",
            "status": "STATUS_PAID",
            "type": "TYPE_RECV_PAYMENT",
            "from_phone": "12345673",
            "from_phone_code": "86",
            "from_user_no": "VE008553",
            "from_user": "5f213f2a4916130007a7fc3b",
            "to_user_no": "ZC144374",
            "to_user": "5e40f311bcb9380007164e72",
            "create_time": "2020-09-03T03:28:00Z",
            "merchantid": "wealthcenter",
            "merchant_name": "",
            "from_balance": "20002243497",
            "from_frozen": "1234567",
            "to_balance": "80002243497",
            "to_frozen": "1234567",
            "accepted_from": "APP",
            "gas_fee": ""
        }
    ],
    "appid": "",
    "user_no": "",
    "user": "",
    "type": "",
    "accepted_from": "",
    "asset": "",
    "address": "",
    "start_time": 1599097079,
    "end_time": 0,
    "page_number": 0,
    "page_size": 100,
    "order_id": "",
    "total": 2,
    "retrieve": "order_list",
    "seq": "2020-10-05T17:58:00+08:00",
    "result": 0,
    "comment": "success"
}
```
### 190 二次回调确认接口
```
```