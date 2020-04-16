<template>
	<view class="page">
		<view class="box" v-for="item in inform" :key="item" :class="item.status ? 'out': ''">
			<view>
				<view class="boxTime">{{item.create_time}}</view>
				<view class="boxTitle">账单通知</view>
				<view class="boxCenter">{{item.content}}</view>
			</view>
			
			<view class="boxRight">
				<image class="boxReturn" :src="item.status ? icReturn2 : icReturn"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				inform: {},
				icReturn2: this.ImgUrl + "static/mine/ic-Return2.png",
				icReturn: this.ImgUrl + "static/mine/ic-Return.png"
			}
		},
		methods: {
			// 获取通知
			getInform(firm_id) {
				let baseUrl = this.WebUrl
				let that = this
				uni.getStorage({
					key: 'u_id',
					success: (id) => {
						uni.request({
							url: baseUrl + '/getInform',
							data: {
								u_id: id.data
							},
							success: (res) => {
								res.data.data.forEach(function(item,index){
									let data = {
										create_time: item.create_time,
										content: item.content,
										status: item.status
									}
									that.$set(that.inform,index,data)
								})
							}
						})
					}
				})
			},
		},
		onLoad() {
			this.getInform()
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FCFCFC;
	}
	
	.box {
		width: 94%;
		margin: 20rpx auto;
		background-color: #FFFFFF;
		// box-shadow:0rpx 0rpx 4rpx 4rpx rgba(79,82,139,.1);
		display: flex;
		justify-content: space-between;
		border-radius: 12rpx;
		
		.boxTime {
			margin: 30rpx 0 0 32rpx;
			font-size: 22rpx;
			color: #333333;
		}
		
		.boxTitle {
			margin: 30rpx 0 20rpx 32rpx;
			font-size: 32rpx;
			color: #333333;
			font-weight: bold;
		}
		
		.boxCenter {
			margin: 0 0 30rpx 32rpx;
			font-size: 26rpx;
			color: #333333;
		}
		
		.boxRight {
			line-height: 220rpx;
			margin-right: 34rpx;
			
			.boxReturn {
				width: 16rpx;
				height: 26rpx;
			}
		}
	}
	
	.out {
		background-color: #F0F0F0;
	}
</style>
