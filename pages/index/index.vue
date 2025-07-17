<template>
    <view class="u-content" @click="handleClick">
        <u-parse :html="content" ></u-parse>
    </view>
</template>

<script>
export default {
	data() {
		return {
            content: '',
        }
	},
	onLoad(options) {
	    const id = options.id || '1760507434822107138'
        this.getProtocol(id)
	},
	methods:{
        handleClick(){
            uni.navigateTo({
                url: '/pages/success/success'
            })
        },
        async getProtocol(id){
            try{
                const { data: res } = await uni.$http.get('/system/dev/article/detail',{id})
                this.content = res.data.content
            }catch(e){
               uni.$showMsg("网络错误") 
            }
     
        }
	}
};
</script>

<style lang="scss" scoped>
	.u-content {
		// margin-top: 100rpx;
        padding: 12px;
	}
</style>