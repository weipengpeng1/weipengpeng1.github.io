import Vue from "vue"
var jweixin = require('jweixin-module')
export default {
    // 调试模式
    debug: false,
    // api列表
    jsApiList: [
        'updateAppMessageShareData',
        'updateTimelineShareData',
        'closeWindow',
        'getLocation',
        'openLocation',
        'openAddress',
        'scanQRCode',
        'chooseImage',
        'chooseWXPay'
    ],
    // 判断是否在微信中
    isWechat: function() {
        var ua = window.navigator.userAgent.toLowerCase()
        return ua.match(/micromessenger/i) == 'micromessenger' ? true : false
    },
    // 初始化sdk配置
    initJssdk: function(callback) {
        if (this.isWechat()) {
            Vue.prototype.$http.post('/wechat/share', {
                url: window.location.href
            }).then(res => {
                var share = JSON.parse(res.data.share)
                jweixin.config({
                    debug: share.debug || this.debug,
                    appId: share.appId,
                    timestamp: share.timestamp,
                    nonceStr: share.nonceStr,
                    signature: share.signature,
                    jsApiList: share.jsApiList || this.jsApiList
                })
                if (typeof callback === 'function') {
                    callback(share)
                }
         
        })
    }},
    // 关闭页面事件
    closeWindow: function(callback) {
        if (this.isWechat()) {
            this.initJssdk(function(init) {
                jweixin.ready(function(wx) {
                    wx.closeWindow()
                    if (typeof callback === 'function') {
                        callback(jweixin)
                    }
                })
            })
        }
    },
    // 微信分享
    share: function(data, callback) {
        if (this.isWechat()) {
            this.initJssdk(function(init) {
                jweixin.ready(function() {
                    var shareData = {
                        title: data.title,
                        desc: data.desc,
                        link: window.location.href,
                        imgUrl: data.image,
                        success: function(res) {
                            callback(res)
                        },
                        cancel: function(res) {
                            callback(res)
                        }
                    }
                    jweixin.updateAppMessageShareData(shareData)
                    jweixin.updateTimelineShareData(shareData)
                })
            })
        }
    },
    // 获取位置信息
    getLocation: function(callback) {
        if (this.isWechat()) {
            this.initJssdk(function(init) {
                jweixin.ready(function() {
                    jweixin.getLocation({
                        type: 'gcj02',
                        success: function(res) {
                            callback(res)
                        },
                        fail: function(err) {
                            callback(err)
                        }
                    })
                })
            })
        }
    },
    // 查看位置信息
    openLocation: function(data, callback) {
        if (this.isWechat()) {
            this.initJssdk(function(init) {
                jweixin.ready(function() {
                    jweixin.openLocation({
                        latitude: data.latitude,
                        longitude: data.longitude
                    })
                })
            })
        }
    },
    // 获取微信收货地址
    openAddress: function(callback) {
        if (this.isWechat()) {
            this.initJssdk(function(init) {
                jweixin.ready(function() {
                    jweixin.openAddress({
                        success: function(res) {
                            callback(res)
                        },
                        fail: function(err) {
                            callback(err)
                        }
                    })
                })
            })
        }
    },
    // 微信扫码
    scanQRCode: function(callback) {
        if (this.isWechat()) {
            this.initJssdk(function(init) {
                jweixin.ready(function() {
                    jweixin.scanQRCode({
                        needResult: 1, // 0:微信处理|1:返回扫描结果
                        scanType: ["qrCode", "barCode"],
                        success: function(res) {
                            let durl = /https:\/\/([^\/]+)\//i
                            let domain
                            res.resultStr.replace(durl, (e) => {
                                domain = e
                            })
                            callback(res)
                        },
                        fail: function(err) {
                            callback(err)
                        }
                    })
                })
            })
        }
    },
    // 选择图片
    chooseImage: function(callback) {
        if (this.isWechat()) {
            this.initJssdk(function(init) {
                jweixin.ready(function() {
                    jweixin.chooseImage({
                        count: 1,
                        sizeType: ['compressed'],
                        sourceType: ['album'],
                        success: function(res) {
                            callback(res)
                        }
                    })
                })
            })
        }
    },
    // 微信支付
    wxpay: function(data, callback) {
        console.log(data)
        if (this.isWechat()) {
                jweixin.chooseWXPay({
                    timestamp: data.timeStamp,
                    nonceStr: data.nonceStr,
                    package: data.package,
                    signType: data.signType,
                    paySign: data.paySign,
                    success: function(res) {
                        callback(res)
                    },
                    cancel: function(res) {
                        callback(res)
                    },
                    fail: function(err) {
                        callback(err)
                    }
                })
        }
    },
    // 微信支付 另一种方式
    wxpayBridge: function(data, callback) {
 
       console.log("Wx"+data)
                jweixin.ready(function() {
                    WeixinJSBridge.invoke(
                        'getBrandWCPayRequest', {
                            "appId": data.appId,
                            "timeStamp": data.timeStamp,
                            "nonceStr": data.nonceStr,
                            "package": data.package,
                            "signType": "MD5",
                            "paySign": data.paySign
                        },
                        function(res) {
                            callback(res)
                        }
                    )
                })
 
        
    }
}