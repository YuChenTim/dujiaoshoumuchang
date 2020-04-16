<template>
	<!-- 活动 -->
	<view class="page">
		<view>
			<view class="titleImg" :style="'background-image: url(' + file_url + ');'"></view>
			
			<view class="head">
				<view class="headContent">
					<view class="headTitle">{{activity.title}}</view>
					
					<view class="joinPeople">
						<image :src="ImgUrl + 'static/temporary/eye.png'"></image>
						<text>{{activity.browse}}</text>
						<image :src="ImgUrl + 'static/temporary/join.png'"></image>
						<text>{{activity.join}}</text>
					</view>
					
					<view class="money"><text>￥</text>{{activity.money}}</view>
					
					<view class="explain">活动报名支付后一律不予退款</view>
					
					<view class="timePlaceholder">
						<view class="timePlaceholderContent">
							<image :src="ImgUrl + 'static/temporary/time.png'"></image>
							{{activity.begin_time}} - {{activity.end_time}}
						</view>
						<view class="timePlaceholderContent">
							<image :src="ImgUrl + 'static/temporary/placeholder.png'"></image>
							{{activity.address}}
						</view>
					</view>
					
					<view class="sponsor">
						<view class="sponsorLogo">
							<image class="sponsorImg" :src="ImgUrl + 'static/temporary/sponsor.png'"></image>
							<image class="logoImg" :src="ImgUrl + 'static/temporary/logo.png'"></image>
						</view>
						<view class="sponsorText">
							<view class="sponsorTitle">广州南沙独角兽牧场</view>
							<view class="sponsorContent">(不超过150字)</view>
						</view>
					</view>
				</view>
			</view>
			
			<view class="activityTitle">————     活动详情     ————</view>
			
			<view class="activityContent">
				<image :src="detail_url" mode='widthFix'></image>
			</view>
			
			<view class="activityButton">
				<button @click="toSign" :class="[sign === 0 ? '' : 'outmoded']">{{signText}}</button>
				<button @click="toApply" :class="[outmoded === 0 ? '' : 'outmoded']">{{applyText}}</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				sign: 0,
				signText: '签到',
				outmoded: -1,
				applyText: '立即报名',
				ImgUrl: this.ImgUrl,
				file_url: '',
				id: 0,
				activity: [],
				detail_url: ''
			}
		},
		methods: {
			// 签到
			toSign() {
				let baseUrl = this.WebUrl
				let that = this
				if(this.outmoded === 0) {
					uni.showModal({
						title: '请先报名活动',
						showCancel: false
					})
				}else if (this.outmoded === 2) {
					uni.showModal({
						title: '活动已结束',
						showCancel:false
					})
				}else {
					if (this.sign === 1) {
						uni.showModal({
							title: '已签到',
							showCancel: false
						})
					}else {
						uni.getStorage({
							key: 'u_id',
							success(res) {
								uni.request({
									url: baseUrl + '/sign',
									method: 'POST',
									data: {
										u_id: res.data,
										activity_id: that.id
									},
									success(resd) {
										if(resd.data.msg === '请求成功!') {
											uni.showModal({
												title: '签到成功',
												showCancel: false,
												success(resde) {
													if(resde.confirm) {
														that.getActDet()
													}
												}
											})
										}
									}
								})
							}
						})
					}
				}
			},
			
			// 报名
			toApply() {
				console.log(this.outmoded)
				if(this.outmoded === 0) {
					uni.navigateTo({
						url: './sign?activity_id=' + this.id
					});
				}else if(this.outmoded === 1){
					uni.showModal({
						title: '已报名',
						showCancel: false
					})
				}else {
					uni.showModal({
						title: '活动已结束',
						showCancel: false
					})
				}
			},
			
			// 获取活动
			getActDet() {
				let baseUrl = this.WebUrl
				let that = this
				uni.request({
					url: baseUrl + "/getActDet",
					data: {
						activity_id: that.id
					},
					success: (res) => {
						that.activity = res.data.data
						that.file_url = that.ImgUrl + res.data.data.file_url
						that.detail_url = that.ImgUrl + res.data.data.detail_url
						console.log(that.detail_url)
						that.getUserStatus()
					}
				})
			},
			
			// 获取用户状态
			getUserStatus() {
				let baseUrl = this.WebUrl
				let that = this
				
				uni.getStorage({
					key: 'u_id',
					success(res) {
						uni.request({
							url: baseUrl + '/getUserStatus',
							data: {
								activity_id: that.id,
								u_id: res.data
							},
							success(resd) {
								if (resd.data.data.apply === 1) {
									that.applyText = '已报名'
									that.outmoded = 1
									console.log(that.outmoded)
									
									if (resd.data.data.sign === 1) {
										that.signText = '已签到'
										that.sign = 1
										
									}else {
										that.setUserSign()
									}
								}else {
									that.setUserStatus()
								}
							}
						})
					}
				})
			},
			
			// 修改签到状态
			setUserSign() {
				let timestamp = (new Date()).valueOf();
				
				let beginTime = (new Date(this.activity.begin_time.replace(/-/g,'/'))).getTime()
				
				let endTime = (new Date(this.activity.end_time.replace(/-/g,'/'))).getTime()
				
				if (beginTime <= timestamp <= endTime) {
					this.sign = 0
					this.signText = '立即签到'
				}else {
					this.sign = 1
					this.signText = '已签到'
				}
			},
			
			// 修改报名状态
			setUserStatus() {
				let timestamp = (new Date()).valueOf();
				
				let endTime = (new Date(this.activity.end_time.replace(/-/g,'/'))).getTime()
				
				if (timestamp <= endTime) {
					this.outmoded = 0
					this.applyText = '立即报名'
				}else {
					this.outmoded = 2
					this.applyText = '已结束'
				}
			}
		},
		onLoad:function(option){
			this.id = option.id
		},
		onShow() {
			this.getActDet()
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FCFCFC;
	}
	
	.titleImg {
		width: 94%;
		margin: 20rpx auto;
		border-radius: 20rpx;
		height: 346rpx;
		background-size: cover;
		background-repeat: no-repeat;
		background-position:center;
	}
	
	.head {
		background-color: #FFFFFF;
		
		.headContent {
			width: 94%;
			margin: 0 auto ;
			
			.headTitle {
				font-size: 42rpx;
				color: #333333;
				line-height: 48rpx;
				padding-top: 24rpx;
				margin-bottom: 36rpx;
			}
			
			.joinPeople {
				image {
					height: 36rpx;
					width: 36rpx;
					vertical-align: middle;
				}
				
				text {
					color: #999999;
					font-size: 22rpx;
					margin: 0 48rpx 0 10rpx;
				}
			}
			
			.money {
				font-size: 64rpx;
				color: #F7554D;
				margin: 46rpx 0 10rpx;
				
				text {
					font-size: 32rpx;
				}
			}
			
			.explain {
				color: #999999;
				font-size: 22rpx;
			}
			
			.timePlaceholder {
				color: #333333;
				font-size: 26rpx;
				margin: 36rpx 0 10rpx;
				
				.timePlaceholderContent {
					margin-bottom: 26rpx;
					
					image {
						height: 36rpx;
						width: 36rpx;
						vertical-align: middle;
						margin-right: 22rpx;
					}
				}
			}
			
			.sponsor {
				border-top: 1rpx solid #DFDFDF;
				display: flex;
				
				.sponsorLogo {
					margin: 30rpx 28rpx 0 0;
					width: 146rpx;
					
					.sponsorImg {
						width: 100%;
						height: 52rpx;
					}
					
					.logoImg {
						margin-top: -15rpx;
						width: 100%;
						height: 120rpx;
					}
				}
				
				.sponsorText {
					.sponsorTitle {
						font-size: 36rpx;
						color: #333333;
						margin: 30rpx 0 24rpx;
					}
					
					.sponsorContent {
						font-size: 22rpx;
						color: #999999;
					}
				}
			}
		}
	}
	
	.activityTitle {
		text-align: center;
		color: #4E54C8;
		margin: 30rpx 0;
	}
	
	.activityContent {
		width: 94%;
		margin: 20rpx auto;
		
		image {
			border-radius: 20rpx;
			width: 100%;
		}
	}
	
	.activityButton {
		text-align: center;
		margin: 62rpx 0 88rpx;
		
		button {
			width: 230rpx;
			height: 94rpx;
			color: #FFFFFF;
			background-color: #4E54C8;
			box-shadow:0rpx 0rpx 4rpx 4rpx rgba(79,82,139,.36);
			border-radius: 47rpx;
			display: inline-block;
			margin: 0 19rpx;
		}
		
		.outmoded {
			background-color: #DFDFDF;
			box-shadow:0rpx 0rpx 4rpx 4rpx rgba(79,82,139,0);
		}
	}
</style>
