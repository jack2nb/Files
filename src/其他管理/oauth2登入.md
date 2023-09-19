# oauth2





## 微信登入

```
GET https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code
```

[文档](https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/Wechat_Login.html)



## 企业微信

```
https://open.weixin.qq.com/connect/oauth2/authorize?appid=ww9c0c7927b70a1368&redirect_uri=http%3A%2F%2Foa.ouqiyj.com%3A8081%2Fouqi%2Fportal%2Fphone%2Fmain.jsp%3Fapplication%3D11e8-b82b-b7056a2c-b266-7907d3bcd381%26action%3Dnull%26returnUrl%3D&response_type=code&scope=snsapi_base&agentid=1000002&state=11e8-b82d-bbed2547-9ee2-053d1e776df4#wechat_redirect
```

|               |                                      | 备注     |
| ------------- | ------------------------------------ | -------- |
| appid         | ww9c0c7927b70a1368                   | 应用id   |
| redirect_uri  |                                      | 回调网址 |
| response_type | code                                 | 扫码     |
| scope         | snsapi_base                          |          |
| agentid       | 1000002                              |          |
| state         | 11e8-b82d-bbed2547-9ee2-053d1e776df4 |          |

## 支付宝

```
https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=商户的APPID&scope=auth_user&redirect_uri=ENCODED_URL&state=init
```

[参考](https://opendocs.alipay.com/apis/009zwz)

## qq登入



## 钉钉登入

扫码登入url

```
https://oapi.dingtalk.com/gettoken?appkey=xxx&appsecret=xxx
```

### 扫码登入url



```
https://oapi.dingtalk.com/connect/qrconnect?appid=xxxx&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=https://www.baidu.com/
```

[test](https://oapi.dingtalk.com/connect/qrconnect?appid=2733882725&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=https://www.baidu.com/)