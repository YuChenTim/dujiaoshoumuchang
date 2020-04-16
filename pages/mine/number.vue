<template>
	<view class="page">
		<view class="headBox">
			<view class="headLeft">
				<view class="headTitle">总积分</view>
				<view class="headNumber">{{total_int}}</view>
				<view class="headContain">(总积分包含<text>{{give_int}}</text>赠送积分)</view>
				<view class="headLeftExplain">赠送积分将在每月1日清零重置</view>
			</view>
			
			<view class="headRight">
				<view class="headTitle">充值积分</view>
				<view class="headNumber headRightNumber">{{recharge_int}}</view>
				<view class="headContain">10积分=1RMB</view>
				<button class="headButton" @click="recharge">积分充值</button>
			</view>
		</view>
		
		<view class="numberCentent">
			<view class="numberCententTitle">积分明细</view>
			<view>
				<view class="numberCententEvery" v-for="item in numberCentent" :key="item">
					<view>
						<view class="numberCententEveryTitle">{{item.consume_name}}</view>
						<view class="numberCententEveryTime">{{item.create_time}}</view>
					</view>
					<view class="numberCententEveryNumbder">{{item.inter}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				firm_id: 0,
				give_int: 0,
				recharge_int: 0,
				total_int: 0,
				numberCentent: {}
			}
		},
		methods: {
			// 充值
			recharge() {
				uni.navigateTo({
					url:'./chargeMoney?firm_id=' + this.firm_id
				})
			},
			
			// 获取公司积分
			getIntegral(){
				let baseUrl = this.WebUrl
				let that = this
				uni.getStorage({
					key: 'u_id',
					success: (id) => {
						uni.request({
							url: baseUrl + '/getIntegral',
							data: {
								u_id: id.data
							},
							success: (res) => {
								console.log(res)
								that.firm_id = res.data.data.firm_id
								that.give_int = res.data.data.give_int
								that.recharge_int = res.data.data.recharge_int
								that.total_int = res.data.data.total_int
								
								that.getIntRecord()
							}
						})
					}
				})
			},
			
			// 获取积分使用记录
			getIntRecord() {
				let baseUrl = this.WebUrl
				let that = this
				uni.request({
					url: baseUrl + '/getIntRecord',
					data: {
						firm_id: that.firm_id
					},
					success: (res) => {
						console.log(res)
						res.data.data.forEach(function(item,index){
							let data = {
								consume_name: item.consume_name,
								create_time: item.create_time,
								inter: item.inter,
							}
							that.$set(that.numberCentent,index,data)
						})
						console.log(that.numberCentent)
					}
				})
			}
		},
		onLoad() {
			this.getIntegral()
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FCFCFC;
	}
	
	.headBox {
		background-color: #FFFFFF;
		display: flex;
		width: 94%;
		margin: 50rpx auto;
		border-radius: 12rpx;
		
		.headLeft {
			margin: 48rpx 0 24rpx 24rpx;
			width: 55%;
			
			.headLeftExplain {
				margin-top: 60rpx;
				color: #007AFF;
				font-size: 22rpx;
			}
		}
		
		.headRight {
			margin: 48rpx 24rpx 0 36rpx;
			width: 35%;
			
			.headRightNumber {
				color: #4E54C8;
			}
			
			.headButton {
				width: 160rpx;
				height: 60rpx;
				color: #FFFFFF;
				background-color: #4E54C8;
				font-size: 26rpx;
				float: right;
				margin-top: 30rpx;
			}
		}
		
		.headTitle {
			font-size: 22rpx;
			color: #333333;
		}
		
		.headNumber {
			font-size: 64rpx;
			color: #333333;
			margin: 28rpx 0 14rpx;
		}
		
		.headContain {
			font-size: 22rpx;
			color: #DFDFDF;
			
			text {
				color: #4E54C8;
			}
		}
	}
	
	.numberCentent {
		.numberCententTitle {
			margin: 0 3%;
			font-size: 32rpx;
			color: #333333;
			font-weight: bold;
			letter-spacing: 7rpx;
		}
		
		.numberCententEvery {
			padding: 0 3%;
			background-color: #FFFFFF;
			display: flex;
			justify-content: space-between;
			height: 120rpx;
			margin-top: 20rpx;
			
			.numberCententEveryTitle {
				padding-top: 30rpx;
				font-size: 28rpx;
				color: #333333;
				line-height: 38rpx;
			}
			
			.numberCententEveryTime {
				font-size: 22rpx;
				color: #999999;
			}
			
			.numberCententEveryNumbder {
				text-align: center;
				width: 106rpx;
				height: 54rpx;
				border: 1rpx solid #4E54C8;
				color: #4E54C8;
				border-radius: 27rpx;
				margin-top: 33rpx;
			}
		}
	}
</style>
