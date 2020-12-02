'use strict';

const request   = require('request');
const jsrsasign = require('jsrsasign');

const apiUrl = 'https://vk4uikzpgc.execute-api.ap-east-1.amazonaws.com/dev/creditable';
const appId = 'phisellerdemo';
const prvKey = '-----BEGIN RSA PRIVATE KEY-----\
MIIEpAIBAAKCAQEAxctKgr/81w0DiKajF65FziG+CIM4EY+4s/niF9bkbHS6DbPw\
ILOY48EHwHS1FZXNF5DuYrKlk9vHogqpDXmJKsciFfAkg/kIU2OuRCEVsmw3O2Ou\
Ua0ancClf7KrZDBPk2jZrLf06STTqnnAM9tC+Mx7j9wWBVZIiljDWJhni7lzIKD5\
slSK/Ekhe9rAAqq4idlotsD8yBl4jNDd6sEeKb/8jQ8NHhnMbGYbfKIUBCD15Ekb\
HDm+WnP0bU+BzYi2c4cn1QYyI+gC3nfI0jsj2/aLcQyN2EPGqhURjP+RUrchJ+l/\
PHaru4GeLv2FKrI760oPwS0gp+/C5WCHc9AkQQIDAQABAoIBAGmkEXDSD73gQoHq\
1nLgboIQ/YlYZErk4zalAP/Qk4HlujV1ZIxiwAbs4zIEY29a6gZrLxdh6ROWsAI5\
BV+gCQXjA66J60bdbHf1Zm8W6Jq6N6mtrL4M4YleCkaw699/+hB2UMRyIAmh1LdZ\
fbF0q0ltFZWZa91/3xCdJgCcrbku6i4nvW+QND+3UEv/wMDvdDEh8/0mV++IuDxT\
1lajU/20+me4Zs9uq/x4dcYjLmLB5qr2rHx4S5fGKR6PZbzhT03HhlE9Dk+rZOc/\
JeJP4dbv7jJ2UpkTsQWWuSId1LObsVXqqoi/n+AfvUrPvgnFbZTIIIrMsQwHoN7r\
bBOG8ZECgYEA/xWVP4v2Lw2Axfjdi9U1/ZYLKUIomdzVbuKnJwg1YcLeU0+xDPtL\
+FjE+rW+VyxlvmbrLgLbvqGG3Z/B55fVUk00Bwqgzirl4oqJBLYG4jgI8H+VDhFf\
5074ml0B8PPTBzv4Da42o8OI1F4+CvZBXuX3ooBiYgfEsFT4J4OfblUCgYEAxoEP\
QVzSSC+7K7yP1HGtH/5bs1FTjLPtA6NNXRWY/bKuM4zvE+QwMa7jRz4NJq3Z6Lj8\
P7wtmp4q0S+vHIPkBpP+iaBW/GQvUC0rf2q7ixmdKUz8ckXh48dTccML9mmjo5qo\
vDXgxgIy+uaSWIsrjnpV2OGlmYSoGalhuCftcj0CgYEA5ExN0p0SjdQ4/3aX2lHN\
y5MhlCCZM/P4thB257EqDcAZuVimrmau/Kt+SKCmpWCgAwQb0odOYtQwX2RfaEZ0\
7v8X5IF3oG22Z8XzkdrUWF0sawrUvc2BFwWP7J/3X87pfR0ICj50uqcDbIaYYrk5\
kpShyLe81d38BJFXtA3SgC0CgYBNLEnJCJQ8OkpTU6i7WEKNaK8wBNMtpZnkyy09\
njLvlvMA2a7tFc7i0fJMdURZoEdSofB3uuoj7ZAJ6bbzqBcTs5/G085dq3l1e0oo\
7E7jYl7meqa+qoqKqqi3VrQk5acX6P3mxi+P67T0NIX65IhXiRotCnT+PUO5Tk/O\
b79xpQKBgQCmgh/cfOhOhYwN3QgZ0A58HgY5CxnXw6NrW/sAWQ/bwfqdAk3g89PG\
/DjybzpQG/GVB41/2f5K4VQyjuClsirsYCimDVRZKs3x2FkgJfX7VEdc9AeGR/Sy\
3XBs9SJAG2A0tS5TZb6RaAlYbRB71YI6D77PbOeXFYKM/zVsGW5ePw==\
-----END RSA PRIVATE KEY-----'

module.exports = class api {
    
    sendRequest(method, payload, callback) {
        var sign = this.getSignature(payload, prvKey);

        var options = {
            url: apiUrl,
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'sign_type': 'SHA256WithRSA',
                'appid': appId,   // appid
                'sign': sign,
                'retrieve': method, // method
                'seq': '0'
            },
            json: payload
        };

        // console.log('Debug', 'sendRequest', 'url', options.url);
        // console.log('Debug', 'sendRequest', 'body', payload);
        // console.log('Debug', 'sendRequest', 'headers', options.headers);

        request(options, callback);
    }

    getSignature(payload, secret) {
        // console.log('Debug', 'getSignature', 'payload', payload);
        var payloadStr = JSON.stringify(payload);
        let sig = new jsrsasign.crypto.Signature({"alg": "SHA256withRSA"});
        sig.init(secret);
        sig.updateString(payloadStr);
        let hSigVal = sig.sign();
        return jsrsasign.hextob64(hSigVal);
    }   

}
