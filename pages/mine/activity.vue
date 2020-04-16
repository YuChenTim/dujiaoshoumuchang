<template>
	<view class="page">
		<view class="dynamic">
			<view class="dynamicOne" :class="[ dynamic1 === true ? 'dynamicClass1' : '' ]" @tap="tapInformation(1)">
				全部
			</view>
			<view class="dynamicOne" :class="[ dynamic2 === true ? 'dynamicClass1' : '' ]" @tap="tapInformation(2)">
				进行中
			</view>
			<view class="dynamicOne" :class="[ dynamic3 === true ? 'dynamicClass1' : '' ]" @tap="tapInformation(3)">
				已结束
			</view>
		</view>
		
		<!-- 进行中 -->
		<view v-if="typeA === true">
			<view class="box">
				<view class="boxTop">
					<view class="boxTopLeft">
						<view class="boxTopLeftL"></view>
						<view class="boxTitle">咖啡加啤酒 加班到永久</view>
					</view>
					
					<view class="boxRight">签到详情</view>
				</view>
				
				<view class="boxTime">
					<view>
						<view>10:30</view>
						<view class="boxDay">2020-01-03</view>
					</view>
					<view class="boxLine">————</view>
					<view >
						<view >18:30</view>
						<view class="boxDay">2020-01-03</view>
					</view>
				</view>
				
				<view class="place">
					<image :src="ImgUrl + 'static/temporary/placeholder.png'"></image>
					广东省广州市
				</view>
				
				<view class="number">
					<view class="enrollNumber">
						<view class="numberTitle">报名人数</view>
						<view class="numberCentent">160</view>
					</view>
					
					<view class="signNumber">
						<view class="numberTitle">签到人数</view>
						<view class="numberCentent">0</view>
					</view>
				</view>
				
				<button class="startButton">开始签到</button>
			</view>
		</view>
		
		<!-- 已结束 -->
		<view v-if="typeB === true" class="out">
			<view class="box">
				<view class="boxTop">
					<view class="boxTopLeft">
						<view class="boxTopLeftL"></view>
						<view class="boxTitle">咖啡加啤酒 加班到永久</view>
					</view>
					
					<view class="boxRight">签到详情</view>
				</view>
				
				<view class="boxTime">
					<view>
						<view>10:30</view>
						<view class="boxDay">2020-01-03</view>
					</view>
					<view class="boxLine">————</view>
					<view >
						<view >18:30</view>
						<view class="boxDay">2020-01-03</view>
					</view>
				</view>
				
				<view class="place">
					<image :src="ImgUrl + 'static/temporary/placeholder.png'"></image>
					广东省广州市
				</view>
				
				<view class="number">
					<view class="enrollNumber">
						<view class="numberTitle">报名人数</view>
						<view class="numberCentent">160</view>
					</view>
					
					<view class="signNumber">
						<view class="numberTitle">签到人数</view>
						<view class="numberCentent">0</view>
					</view>
				</view>
				
				<button class="startButton">活动已结束</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dynamic1: true,
				dynamic2: false,
				dynamic3: false,
				typeA: true,
				typeB: true,
				ImgUrl: this.ImgUrl
			}
		},
		methods: {
			//切换内容
			tapInformation(e) {
				if (e == 1) {
					this.dynamic1 = true;
					this.dynamic2 = false;
					this.dynamic3 = false;
					this.typeA = true;
					this.typeB = true;
				} else if (e == 2) {
					this.dynamic1 = false;
					this.dynamic2 = true;
					this.dynamic3 = false;
					this.typeA = true;
					this.typeB = false;
				}
				else if (e == 3) {
					this.dynamic1 = false;
					this.dynamic2 = false;
					this.dynamic3 = true;
					this.typeA = false;
					this.typeB = true;
				}
			},
			
			// 获取活动
			getUserAct() {
				let baseUrl = this.WebUrl
				let that = this
				let status = -1
				if(!this.typeA) {
					status = 1
				}else if (!this.typeB) {
					status = 0
				}
				uni.getStorage({
					key: 'u_id',
					success: (id) => {
						uni.request({
							url: baseUrl + '/getUserAct',
							data: {
								u_id: id.data,
								status: status
							},
							success: (res) => {
								console.log(res)
								res.data.data.forEach(function(item,index){
									begin_date = item.begin_time.split(' ')[0]
									begin_time = item.begin_time.split(' ')[1]
									end_date = item.end_time.split(' ')[0]
									end_time = item.end_time.split(' ')[1]
									let data = {
										title: item.title,
										begin_time: begin_time,
										begin_date: begin_date,
										end_time: end_time,
										end_date: end_date,
										address: item.address,
										join: item.join,
										browse: item.browse,
										status: item.status
									}
								})
							}
						})
					}
				})
			}
		},
		onLoad() {
			this.getUserAct()
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FCFCFC;
	}
	
	.dynamic {
		padding-top: 20rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		background-color: #FFFFFF;
		font-size: 28rpx;
		
		.dynamicOne{
			padding: 30rpx 0 20rpx;
		}
		
		.dynamicClass1 {
			color: #4E54C8;
			border-bottom: 4rpx solid #4E54C8;
		}
	}
	
	.box {
		width: 94%;
		margin: 30rpx auto 66rpx;
		background-color: #FFFFFF;
		
		.boxTop {
			padding: 30rpx;
			display: flex;
			justify-content: space-between;
			
			.boxTopLeft {
				display: flex;
				
				.boxTopLeftL{
					background-color: #4E54C8;
					margin-right: 16rpx;
					width: 16rpx;
					height: 40rpx;
					border-radius: 8rpx;
				}
				
				.boxTitle {
					font-size: 28rpx;
					color: #333333;
				}
			} 
			
			.boxRight {
				font-size: 26rpx;
				color: #4E54C8;
			}
		}
		
		.boxTime {
			display: flex;
			justify-content: center;
			font-size: 36rpx;
			color: #333333;
			text-align: center;
			margin-top: 30rpx;
			
			.boxLine {
				margin: 0 28rpx;
			}
			
			.boxDay {
				font-size: 22rpx;
				color: #999999;
				margin-top: 24rpx;
			}
		}
		
		.place {
			margin: 48rpx 0 48rpx 30rpx;
			font-size: 22rpx;
			color: #333333;
			
			image {
				width: 36rpx;
				height: 36rpx;
				vertical-align: middle;
			}
		}
		
		.number {
			display: flex;
			justify-content: space-around;
			text-align: center;
			
			.numberTitle {
				font-size: 22rpx;
				color: #999999;
				margin-bottom: 20rpx;
			}
			
			.numberCentent {
				font-size: 28rpx;
				color: #333333;
			}
		}
		
		.startButton {
			background-color: #4E54C8;
			font-size: 32rpx;
			color: #FFFFFF;
			width: 360rpx;
			height: 76rpx;
			border-radius: 38rpx;
			margin: 0 auto;
			position: relative;
			left: 0;
			top: 36rpx;
		}
	}
	
	.out {
		.startButton {
			background-color: #F0F0F0;
		}
	}
</style>
