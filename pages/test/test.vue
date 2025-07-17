<template>
    <view>
        <web-view :src="url"></web-view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                
            };
        },
        onLoad(options) {
            console.log(' urlurl', options.url);
            // this.url = options.url
            // this.url = "http://h5.ttqf.net/package-crossborder/pages/webview-allinpay/webview-allinpay?allin_alipay_url=https%253A%252F%252Fqr.alipay.com%252Fbax00151rks60ltx6xix0067"
        },
        onHide() {
            // 这里进行返回到收银台页面 传个参数 判断下是用过web-view过来的 弹窗  是否支付成功
            uni.navigateBack(1)
        }
    }
</script>

<style lang="scss">

</style>
