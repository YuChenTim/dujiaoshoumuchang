<template>
	<view class="page">
		<view class="box">
			<image class="boxImg" :src="ImgUrl + 'static/temporary/nansha.png'"></image>
			<view class="text">
				<view class="title">广州南沙独角兽牧场</view>
				<view class="content">我是地址我是地址我是地址</view>
			</view>
		</view>
		<view class="box">
			<image class="boxImg" :src="ImgUrl + 'static/temporary/zhaoqing.png'"></image>
			<view class="text">
				<view class="title">广州肈庆独角兽牧场</view>
				<view class="content">我是地址我是地址我是地址</view>
			</view>
		</view>
		
		<button class="button" @tap="toDemand">我有需求</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				ImgUrl: this.ImgUrl
			}
		},
		methods: {
			toDemand() {
				uni.navigateTo({
					url: './demand'
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FCFCFC;
	}
	
	.box {
		border-radius: 12rpx;
		margin: 30rpx auto;
		width: 690rpx;
		background-color: #FFFFFF;
		text-align: center;
		
		.boxImg {
			width: 100%;
			height: 316rpx;
		}
		
		.text {
			height: 152rpx;
			display: flex;
			justify-content: space-around;
			flex-direction: column;
			
			.title {
				font-size: 32rpx;
				color: #333333;
				font-weight: bold;
			}
			
			.content {
				font-size: 26rpx;
				color: #333333;
			}
		}
	}
	
	.button {
		width: 690rpx;
		background-color: #4E54C8;
		margin: 0 auto;
		color: #FFFFFF;
		margin-bottom: 30rpx;
	}
</style>
