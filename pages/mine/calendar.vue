<template>
	<view class="page">
		<view class="dynamic">
			<view class="dynamicOne" :class="[ dynamic1 === true ? 'dynamicClass1' : '' ]" @tap="tapInformation(1)">
				未开始
			</view>
			<view class="dynamicOne" :class="[ dynamic2 === true ? 'dynamicClass1' : '' ]" @tap="tapInformation(2)">
				已结束
			</view>
			<view class="dynamicOne" :class="[ dynamic3 === true ? 'dynamicClass1' : '' ]" @tap="tapInformation(3)">
				已取消
			</view>
		</view>
		
		<view>
			<view class="box" v-for="item in appoint" :key="item">
				<view class="bigCalendar" :class="type === 0 ? '' : 'bigCalendarBlack'">
					<image :src="type === 0 ? bigCalendar : bigCalendarBlack"></image>
					<text class="bigCalendarDay">{{item.month}}</text>
					<text class="bigCalendarMoney">{{item.day}}</text>
				</view>
				
				<view class="boxText">
					<view class="boxLeft">
						<view class="boxTitle">{{item.theme}}主题</view>
						<view class="boxTime">{{item.begin_time}}-{{item.end_time}}</view>
						<view class="boxPlace">{{item.meet_name}}</view>
					</view>
					<view class="roomPass" v-if="type === 0">门禁密码:{{item.pass}}</view>
				</view>
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
				type: 0,
				appoint: {},
				ImgUrl: this.ImgUrl,
				bigCalendar: this.ImgUrl + "/static/mine/bigCalendar.png",
				bigCalendarBlack: this.ImgUrl + "/static/mine/bigCalendarBlack.png"
			}
		},
		methods: {
			//切换内容
			tapInformation(e) {
				if (e == 1) {
					this.dynamic1 = true;
					this.dynamic2 = false;
					this.dynamic3 = false;
					this.type = 0
				} else if (e == 2) {
					this.dynamic1 = false;
					this.dynamic2 = true;
					this.dynamic3 = false;
					this.type = 2
				}
				else if (e == 3) {
					this.dynamic1 = false;
					this.dynamic2 = false;
					this.dynamic3 = true;
					this.type = 3
				}
				this.getAppoint()
			},
			
			// 获取预定
			getAppoint() {
				let baseUrl = this.WebUrl
				let that = this
				this.appoint = {}
				uni.getStorage({
					key: 'u_id',
					success: (id) => {
						uni.request({
							url: baseUrl + '/getAppoint',
							data: {
								u_id: id.data,
								status: that.type
							},
							success: (res) => {
								console.log(res)
								if(res.data.msg === '请求成功!'){
									res.data.data.forEach(function(item,index){
										let month = item.date.split('-')[1]
										let day = item.date.split('-')[2]
										let data = {
											meet_name: item.meet_name,
											begin_time: item.begin_time,
											end_time: item.end_time,
											month: month,
											day: day,
											theme: item.theme,
											pass: item.pass
										}
										that.$set(that.appoint,index,data)
									})
								}
							}
						})
					}
				})
			}
		},
		onLoad() {
			this.getAppoint()
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
		background-color: #FFFFFF;
		width: 94%;
		margin: 30rpx auto 0;
		
		.bigCalendar {
			float: left;
			width: 90rpx;
			height: 108rpx;
			margin: 42rpx 30rpx 42rpx 36rpx;
			color: #FFFFFF;
			
			image {
				width: 100%;
				height: 100%;
			}
			
			.bigCalendarDay {
				position: relative;
				left: 26rpx;
				top: -84rpx;
				font-size: 32rpx;
			}
			
			.bigCalendarMoney {
				position: relative;
				left: -4rpx;
				top: -50rpx;
				font-size: 22rpx;
			}
		}
		
		.bigCalendarBlack {
			color: #999999;
		}
		
		.boxText {
			display: flex;
			justify-content: space-between;
			
			.boxTitle {
				margin: 42rpx 0 24rpx;
				font-size: 32rpx;
				font-weight: bold;
			}
			
			.boxTime,.boxPlace {
				font-size: 28rpx;
				color: #666666;
				margin-bottom: 8rpx;
			}
			
			.boxPlace {
				margin-bottom: 44rpx;
			}
			
			.roomPass {
				line-height: 192rpx;
				margin-right: 30rpx;
			}
		}
	}
	
</style>
