<template>
    <view>
        <!-- <u-button @click="succ">月落</u-button> -->
        <div class="app-loading" v-if="show">
            <div class="app-loading__logo"></div>
            <div><span class="dot dot-spin"><i></i><i></i><i></i><i></i></span></div>
            <div class="app-loading__title">正在加载数据，请耐心等待</div>
        </div>
		
        <div v-else class="animate__animated  animate__backInDown center" style="text-align: center;">
            <u-icon color="#72c240" size="128" name="checkmark-circle"></u-icon>
            <!-- <u-icon color="#72c240" size="256" name="checkmark-circle"></u-icon> -->
            <text style="color: #515151;font-size: 18px;">身份核验成功</text>
        </div>
        <div>
        	<u-button shape="circle" :ripple="true" ripple-bg-color="#f2f2f2" @click="handleout">退出识别</u-button>
        	</div>
    </view>
</template>

<script>
    export default {
      data() {
    return {
        pageOptions: null,
        retryCount: 0,  // 添加重试计数
        maxRetries: 3   // 最大重试次数
    }
},

onLoad(options) {
    try {
        console.log('收到的原始参数:', options)
        const formattedOptions = {
            uid: options.uid || '',
            token: options.token || '',
            type: options.type || 2,
            satoken: options.satoken || ''
        }
        
        this.retryCount = 0  // 重置重试次数
        this.pageOptions = formattedOptions
        this.succ(formattedOptions)
    } catch (error) {
        console.error('参数处理错误:', error)
        uni.showToast({
            title: '参数错误',
            icon: 'none',
            duration: 2000
        })
    }
},
onShow(){
  // this.show = true
  console.log('循环进入页面');
  uni.showToast({
      title: `循环进入页面`,
      icon: 'none',
      duration: 1500
  })
  this.retryCount = 0  
  this.succ(this.pageOptions)
},
methods:{

async succ(result) {
	uni.showToast({
	    title: `循环调用了succ这个方法`,
	    icon: 'none',
	    duration: 3000
	})
    try {
        if (!result || typeof result !== 'object') {
            throw new Error('参数格式错误')
        }

        console.log('请求参数:', result, '当前重试次数:', this.retryCount)

        const [error, res] = await uni.request({
            url: 'https://api-driver.sph56.cn/api/auth/faceOcr/user/faceSuccess',
            method: 'POST',
            header: {
        'content-type': 'application/json',
        'satoken': result.satoken || '47a0eedc-0bfb-40d4-b2a8-53be86be227a'  // 添加到请求头
    },
            data: {
                uid: result.uid || '1874029560005812225',
                token: result.token || 'nertaKt7Jgo509OiwIxoDV0Y',
                type: result.type || 2,
            }
        })

        if (error) {
            throw new Error('网络请求失败')
        }

        const response = res.data
        let flag = 0

        if (response.code === 200) {
            this.show = !this.show
            flag = 1
            
            // 成功后执行后续操作
            await this.handleSuccess(flag)
        } else {
            // 处理失败情况
            this.retryCount++
            
            if (this.retryCount < this.maxRetries) {
                // 还可以重试
                uni.showToast({
                    title: `认证失败，第${this.retryCount}次重试`,
                    icon: 'none',
                    duration: 1500
                })
                
                // 延迟1.5秒后重试
                setTimeout(() => {
                    this.succ(result)
                }, 1500)
            } else {
                // 达到最大重试次数，跳转到失败页面
                uni.showToast({
                    title: '认证失败次数过多',
                    icon: 'none',
                    duration: 2000
                })
                
                setTimeout(() => {
                    uni.navigateTo({
                        url: '/pages/failed/failed'  // 替换为实际的失败页面路径
                    })
                }, 2000)
            }
        }

    } catch (e) {
        console.error('认证失败:', e)
        
        // 处理异常情况的重试
        this.retryCount++
        if (this.retryCount < this.maxRetries) {
            uni.showToast({
                title: `认证失败，第${this.retryCount}次重试`,
                icon: 'none',
                duration: 1500
            })
            
            setTimeout(() => {
                this.succ(result)
            }, 1500)
        } else {
            uni.showToast({
                title: '认证失败次数过多',
                icon: 'none',
                duration: 2000
            })
            
            setTimeout(() => {
                uni.navigateTo({
                    url: '/pages/failed/failed'  // 替换为实际的失败页面路径
                })
            }, 2000)
        }
    }
},

// 成功后的处理逻辑单独提取出来
async handleSuccess(flag) {
	uni.showToast({
	    title: `认证成功，给小程序传递的数据：${flag}`,
	    icon: 'none',
	    duration: 5000
	})
    await new Promise(resolve => {
        setTimeout(async () => {
            try {
                webUni.postMessage({
                    data: { handlerIdent: flag }
                })

                uni.reLaunch({ 
                    url:"/pages/my/my",
					success(){
						console.log('成功--');
						uni.showToast({
						    title: '返回小程序成功',
						    icon: 'none',
						    duration: 7000
						})
					},
					fail(err){
						console.log('返回小程序失败-',err);
						uni.showToast({
						    title: '返回小程序失败',
						    icon: 'none',
						    duration: 7000
						})
					}
                })
                const result = await window.flutter_inappwebview.callHandler('handlerIdent', flag)
                console.log('Flutter回调结果:小程序--', JSON.stringify(result))
            } catch (e) {
                console.error('消息处理失败:', e)
            }
            resolve()
        }, 1500)
    })
}
},
 handleout(){
                try{
                    webUni.postMessage({
                        data: {handlerIdent:1}
                    });  
                        
                    webUni.navigateBack({
                       delta: 5
                     });
                   
                     window.flutter_inappwebview.callHandler('handlerIdent',0)
                           .then(function(result) {
                             console.log(JSON.stringify(result));
                         });
                }catch(e){
                    console.log(e)
                }
            }
    }
</script>

<style lang="scss">
.dot{
      animation:antRotate 1.2s infinite linear;
      transform:rotate(45deg);
      position:relative;
      display:inline-block;
      font-size:32px;
      width:32px;
      height:32px;
      box-sizing:border-box
    }
    .dot i{
      width:14px;
      height:14px;
      position:absolute;
      display:block;
      background-color:#de8b53;
      border-radius:100%;
      transform:scale(.75);
      transform-origin:50% 50%;
      opacity:.3;
      animation:antSpinMove 1s infinite linear alternate
    }
    .dot i:nth-child(1){
      top:0;left:0
    }
    .dot i:nth-child(2){
      top:0;right:0;
      -webkit-animation-delay:.4s;
      animation-delay:.4s
    }
    .dot i:nth-child(3){
      right:0;bottom:0;
      -webkit-animation-delay:.8s;
      animation-delay:.8s
    }
    .dot i:nth-child(4){
      bottom:0;left:0;
      -webkit-animation-delay:1.2s;
      animation-delay:1.2s
    }
    @keyframes antRotate{
      to{-webkit-transform:rotate(405deg);transform:rotate(405deg)}
    }
    @-webkit-keyframes antRotate{
      to{-webkit-transform:rotate(405deg);transform:rotate(405deg)}
    }
    @keyframes antSpinMove{
      to{opacity:1}}@-webkit-keyframes antSpinMove{to{opacity:1}
    }
    .app-loading {
      position: absolute;top:0px;
      left:0px;right:0px;
      bottom:0px;display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      /* background: #fff; */
    }
    .app-loading__logo {margin-bottom: 30px;}
    .app-loading__logo img {width: 90px;vertical-align: bottom;}
    .app-loading__title { font-size: 14px;
    color: #515151;margin-top: 30px;}
    @keyframes loader {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
    .center{
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        display: flex;
        // justify-content: center;
        margin-top: 150px;
        align-items: center;
        flex-direction: column;
    }
</style>
