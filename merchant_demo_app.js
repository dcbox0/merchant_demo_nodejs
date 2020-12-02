'use strict';

const express   = require('express');
const api       = require('./lib/api');

const app = express();
const port = 8080;
const digits = {
    'USDT': 6,
    'USDB': 6
};

const merchantApi = new api;

app.get('/', async function(req, res) {
    var htmlString = '\
    <p>Hello merchant demo</p>\
    <a href="/merchant/asset_query?phone=10001001&phone_code=852">Try 1. asset_query</a><br>\
    <a href="/merchant/address_query?address=0x4Af23788148c4278eD525C9E197D2DD26C97B201">Try 2. address_query</a><br>\
    <a href="/merchant/user_no_query?user_no=DE064122">Try 3. user_no_query</a><br><br>\
    \
    <a href="/merchant/merchant_transfer?orderid=1009&amount=9&userid=DE064122">Try 4. merchant_transfer</a><br>\
    <a href="/merchant/merchant_transfer_order?orderid=1009">Try 5. merchant_transfer_order</a><br>\
    ';

    res.send(htmlString);
});

app.get('/merchant/asset_query', async function(req, res) {
    // try:
    // http://localhost:8080/merchant/asset_query?phone=10001001&phone_code=852
    var phone = req.query.phone;
    var phone_code = req.query.phone_code;

    var checkObj = {
        phone: phone,
        phone_code: phone_code,
        auto_register: 'YES'
    }

    merchantApi.sendRequest('asset_query', checkObj, 
        function(error, response, body) {
            if (!error && response.statusCode == 200) {
                // TODO do someting here
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(body));
                res.end();
            } else {
                // error
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(body));
                res.end();
            }
        }
    );

    console.log('Debug', 'asset_query', phone_code, phone);

    /* response:
    {"phone":"10001001","phone_code":"852","user_no":"DE064122","is_registered":"YES",
     "assets":
        [{"asset_name":"BTC","address":"2N1Eik6TLdZpCdRxt9u2xMmVvMq1Y884NGP"},
        {"asset_name":"DGT","address":"0x4Af23788148c4278eD525C9E197D2DD26C97B201"},
        {"asset_name":"ETH","address":"0x4Af23788148c4278eD525C9E197D2DD26C97B201"},
        {"asset_name":"USDB","address":"0x4Af23788148c4278eD525C9E197D2DD26C97B201"},
        {"asset_name":"USDT","address":"0x4Af23788148c4278eD525C9E197D2DD26C97B201"}],
    "retrieve":"asset_query","seq":"0","result":0,"comment":"success"}
    */
});

app.get('/merchant/address_query', async function(req, res) {
    // try:
    // http://localhost:8080/merchant/address_query?address=0x4Af23788148c4278eD525C9E197D2DD26C97B201
    var address = req.query.address;

    var checkObj = {
        address: address,
    }

    merchantApi.sendRequest('address_query', checkObj, 
        function(error, response, body) {
            if (!error && response.statusCode == 200) {
                // TODO do someting here
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(body));
                res.end();
            } else {
                // error
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(body));
                res.end();
            }
        }
    );

    console.log('Debug', 'address', address);
    /* response:
    {"address":"0x4Af23788148c4278eD525C9E197D2DD26C97B201","status":"STATUS_OCCUPIED","is_registered":"YES","retrieve":"address_query","seq":"0","result":0,"comment":"success"}
    */
});

app.get('/merchant/user_no_query', async function(req, res) {
    // try:
    // http://localhost:8080/merchant/user_no_query?user_no=DE064122
    var user_no = req.query.user_no;

    var checkObj = {
        user_no: user_no,
    }

    merchantApi.sendRequest('user_no_query', checkObj, 
        function(error, response, body) {
            if (!error && response.statusCode == 200) {
                // TODO do someting here
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(body));
                res.end();
            } else {
                // error
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(body));
                res.end();
            }
        }
    );

    console.log('Debug', 'user_no_query', user_no);
    /* response:
    {"user_no":"DE064122","is_registered":"YES","retrieve":"user_no_query","seq":"0","result":0,"comment":"success"}
    */
});

app.get('/merchant/merchant_transfer', async function(req, res) {
    // try:
    // http://localhost:8080/merchant/transfer?orderid=1008&amount=8&userid=DE064122
    var orderId = req.query.orderid;
    var amount = req.query.amount;
    var userNo = req.query.userid;

    var asset = 'USDT';
    var dAmount = parseFloat(amount) * Math.pow(10, digits[asset]);
    var iAmount = dAmount.toFixed(0);
    var strAmount = iAmount.toString();

    var transferObj = {
        amount: strAmount,
        asset_name: asset,
        order_id: orderId,
        to_user_no: userNo,
    };

    merchantApi.sendRequest('merchant_transfer', transferObj, 
        function(error, response, body) {
            if (!error && response.statusCode == 200) {
                // TODO do someting here
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(body));
                res.end();
            } else {
                // error
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(body));
                res.end();
            }
        }
    );

    console.log('Debug', 'merchant_transfer', orderId, amount, asset, userNo);

    /*
    {"order_id":"1008","asset_name":"USDT",
     "to_user_no":"DE064122","amount":"8000000","retrieve":"merchant_transfer","seq":"0",
     "result":0,"comment":"transfer success"}
    */
});

app.get('/merchant/merchant_transfer_order', async function(req, res) {
    // try:
    // http://localhost:8080/merchant/transfer_check?orderid=1001
    var orderId = req.query.orderid;

    var transferCheckObj = {
        merchant_order_id: orderId,
    };

    merchantApi.sendRequest('merchant_transfer_order', transferCheckObj, 
        function(error, response, body) {
            if (!error && response.statusCode == 200) {
                // TODO do someting here
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(body));
                res.end();
            } else {
                // error
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(body));
                res.end();
            }
        }   
    );

    console.log('Debug', 'merchant_transfer_order', orderId);

    /*
    {"id":"5e7d8874d6bcaf0007301509","appid":"BITOLLWALLETDEMO","asset_name":"USDT",
    "amount":"1000000","fee":"0","from_phone":"13801234567","from_phone_code":"86",
    "order_id":"1001","fee_paid_by":"","create_time":"2020-03-27T05:00:36Z",
    "update_time":"2020-03-27T05:00:36Z","status":"STATUS_PENDING","paid_total":"1000000",
    "merchantid":"phisellerdemo","retrieve":"merchant_transfer_order","seq":"0","result":0,
    "comment":"success"}
    */
});

app.listen(port, () => console.log(`Info Merchant Demo app listening on port ${port}`))
