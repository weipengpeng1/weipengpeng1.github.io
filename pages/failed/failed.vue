<template>
    <view style="padding: 0px 40px;">
        <div class="animate__animated  animate__backInDown center" style="text-align: center;">
            <u-icon color="#fa3534" size="128" name="close-circle"></u-icon>
            <!-- <u-icon color="#72c240" size="256" name="checkmark-circle"></u-icon> -->
            <text style="color: #515151;font-size: 18px;">身份核验失败</text>
        </div>
        <view style="position: fixed;bottom: 20px;width: calc(100% - 80px);">
            <view><u-button shape="circle" :custom-style="{'color':'#2979ff'}" :ripple="true" @click="subOK" ripple-bg-color="#f2f2f2">重新识别</u-button></view>
            <view style="margin-top:20px;">
                <u-button shape="circle" :ripple="true" ripple-bg-color="#f2f2f2" @click="handleout">退出识别</u-button>
				</view>
            <view style="margin-top:20px;text-align: center;color:#ccc">
                - 百度大脑技术支持 -
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                url:'',
            };
        },
        onLoad(options) {
			setTimeout(()=>{
				try{
				    webUni.postMessage({
				        data: {handlerIdent:0}
				    });  
				        
				    webUni.navigateBack({
				       delta: 1
				     });
				   
				     window.flutter_inappwebview.callHandler('handlerIdent',0)
				           .then(function(result) {
				             console.log(JSON.stringify(result));
				         });
				}catch(e){
				    console.log(e)
				}
			},6000)
        },
        methods:{
            subOK(){
                try{
                    uni.navigateTo({
                         url: '/pages/success/success'
                     })
                    // webUni.postMessage({
                    //     data: {handlerIdent:2}
                    // });  
                         
                    // webUni.navigateBack({
                    //    delta: 1
                    //  });
                 
                    
                     
                    //  window.flutter_inappwebview.callHandler('handlerIdent',2)
                    //        .then(function(result) {
                    //          console.log(JSON.stringify(result));
                    //      });
                }catch(e){
                    console.log(e)
                }
            },
            handleout(){
                try{
                    webUni.postMessage({
                        data: {handlerIdent:0}
                    });  
                        
                    webUni.navigateBack({
                       delta: 1
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
    }
</script>

<style lang="scss">
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
