<template>
	<view class="page">
		<view class="information" @tap="toInformation()" :style="'background: url('+ ImgUrl +'static/mine/background.png);background-repeat: no-repeat;background-position: 50% 100%;background-size: 1000rpx 800rpx;'">
			<view class="informationleft">
				<view class="informationImg">
					<image :src="avatarUrl"></image>
				</view>
				<view class="name">
					<view class="myname">{{nickname}}</view>
					<view class="companyName" v-if="per_status === 1">{{companyName}}</view>
				</view>
			</view>
			<view class="ic-Return">
				<image :src="ImgUrl + 'static/mine/ic-Return.png'"></image>
			</view>
		</view>
		
		<view class="box bigBox" @tap="toNmuber()">
			<view class="boxLeft">
				<image class="boxImg" :src="ImgUrl + 'static/mine/number.png'"></image>
				积分：{{number}}
			</view>
			<view class="boxRight">
				<image class="boxReturn" :src="ImgUrl + 'static/mine/ic-Return.png'"></image>
			</view>
		</view>
		
		<view class="bigBox">
			<view class="box" @tap="toCalendar()">
				<view class="boxLeft">
					<image class="boxImg" :src="ImgUrl + 'static/mine/Calendar.png'"></image>
					我的预定
				</view>
				<view class="boxRight">
					<image class="boxReturn" :src="ImgUrl + 'static/mine/ic-Return.png'"></image>
				</view>
			</view>
			
			<view class="box" @tap="toGroup()">
				<view class="boxLeft">
					<image class="boxImg" :src="ImgUrl + 'static/mine/Group.png'"></image>
					我的团队
				</view>
				<view class="boxRight">
					<image class="boxReturn" :src="ImgUrl + 'static/mine/ic-Return.png'"></image>
				</view>
			</view>
			
			<view class="box" @tap="toRing()">
				<view class="boxLeft">
					<image class="boxImg" :src="ImgUrl + 'static/mine/Ring.png'"></image>
					通知
				</view>
				<view class="boxRight">
					<image class="boxReturn" :src="ImgUrl + 'static/mine/ic-Return.png'"></image>
				</view>
			</view>
			
			<view class="box">
				<view class="boxLeft">
					<image class="boxImg" :src="ImgUrl + 'static/mine/message.png'"></image>
					留言
				</view>
				<view class="boxRight">
					<image class="boxReturn" :src="ImgUrl + 'static/mine/ic-Return.png'"></image>
				</view>
			</view>
		</view>
		
		<view class="box bigBox" @tap="toActivity()">
			<view class="boxLeft">
				<image class="boxImg" :src="ImgUrl + 'static/mine/activity.png'"></image>
				活动管理
			</view>
			<view class="boxRight">
				<image class="boxReturn" :src="ImgUrl + 'static/mine/ic-Return.png'"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loginBtnOne: uni.getStorageSync('hasLogin') || false,
				nickname: '游客',
				avatarUrl: this.ImgUrl + 'static/mine/touxiang.png',
				companyName: '',
				tourist: false,
				u_id: 0,
				ImgUrl: this.ImgUrl,
				number: 0,
				per_status: ''
			}
		},
		onShow() {
			this.judgeUser()
		},
		methods: {
			// login
			Login() {
				let baseUrl = this.WebUrl
				let that = this
				uni.login({
					provider: 'weixin',
					success: (Lg) => {
						let code = Lg.code
						uni.request({
							url: baseUrl + '/wxLogin',
							data: {
								code: code
							},
							method: 'GET',
							header: {
								'content-type': 'application/json'
							},
							success: (id) => {
								console.log(id)
								uni.setStorage({
									key: 'openId',
									data: id.data.data.openid,
									success: () => {
										that.judgeUser()
									}
								})
							}
						})
					}
				})
			},
			
			// 判断用户是否存在
			judgeUser() {
				let baseUrl = this.WebUrl
				let that = this
				
				uni.getStorage({
					key: 'openid',
					success: function(id) {
						uni.request({
							url: baseUrl + '/judgeUser',
							method: 'POST',
							data: {
								openid: id.data
							},
							success: (res) => {
								console.log(res)
								if(res.data.msg === "用户已存在！"){
									that.nickname = res.data.data.u_name || ''
									that.avatarUrl = res.data.data.head || ''
									that.u_id = res.data.data.u_id
									that.tourist = true
									
									uni.setStorage({
										key: 'tourist',
										data: true
									})
									
									uni.request({
										url: baseUrl + '/getUser',
										data: {
											u_id: res.data.data.u_id
										},
										success: (resd) => {
											that.companyName = resd.data.data.com_name || ''
											that.per_status = resd.data.data.per_status
											console.log(resd)
										}
									})
									uni.request({
										url: baseUrl + '/getIntegral',
										data: {
											u_id: res.data.data.u_id
										},
										success: (resNum) => {
											console.log(resNum)
											that.number = resNum.data.data.total_int
										}
									})
								}
							}
						})
					},
					fail:function(err){
						that.Login()
					}
				})
			},
			
			// 跳转个人信息界面
			toInformation() {
				let that = this
				console.log(this.per_status)
				if (this.per_status === 0) {
					uni.showModal({
						title: "提示",
						content: "您的身份审核中,请稍等或重新登录",
						showCancel: false
					})
				}else if (this.per_status === 1){
					uni.getStorage({
						key: 'companyName',
						success: function() {
							console.log(1)
							uni.navigateTo({
								url: '../mine/information?u_id=' + that.u_id
							});
						},
						fail:function(err){
							console.log(err)
							uni.navigateTo({
								url: '../mine/login'
							});
						}
					})
				}else if (this.per_status === 2) {
					uni.showModal({
						title: "提示",
						content: "您的信息已被退回,请重新填写",
						showCancel: false,
						success(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '../mine/login'
								});
							}
						}
					})
				}else {
					uni.navigateTo({
						url: '../mine/login'
					});
				}
			},
			
			// 跳转到积分界面
			toNmuber() {
				let that = this
				if (this.per_status === 0) {
					uni.showModal({
						title: "提示",
						content: "您的身份审核中,请稍等或重新登录",
						showCancel: false
					})
				}else if (this.per_status === 1){
					uni.navigateTo({
						url: '../mine/number'
					})
				}else if (this.per_status === 2) {
					uni.showModal({
						title: "提示",
						content: "您的信息已被退回,请重新填写",
						showCancel: false,
						success(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '../mine/login'
								});
							}
						}
					})
				}else {
					uni.showModal({
						title: "提示",
						content: "请先登录",
						showCancel: false
					})
				}
			},
			
			// 跳转预定界面
			toCalendar() {
				let that = this
				if (this.per_status === 0) {
					uni.showModal({
						title: "提示",
						content: "您的身份审核中,请稍等或重新登录",
						showCancel: false
					})
				}else if (this.per_status === 1){
					uni.navigateTo({
						url: '../mine/calendar'
					})
				}else if (this.per_status === 2) {
					uni.showModal({
						title: "提示",
						content: "您的信息已被退回,请重新填写",
						showCancel: false,
						success(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '../mine/login'
								});
							}
						}
					})
				}else {
					uni.showModal({
						title: "提示",
						content: "请先登录",
						showCancel: false
					})
				}
			},
			
			// 跳转团队界面
			toGroup() {
				let that = this
				if (this.per_status === 0) {
					uni.showModal({
						title: "提示",
						content: "您的身份审核中,请稍等或重新登录",
						showCancel: false
					})
				}else if (this.per_status === 1){
					uni.navigateTo({
						url: '../mine/group'
					})
				}else if (this.per_status === 2) {
					uni.showModal({
						title: "提示",
						content: "您的信息已被退回,请重新填写",
						showCancel: false,
						success(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '../mine/login'
								});
							}
						}
					})
				}else {
					uni.showModal({
						title: "提示",
						content: "请先登录",
						showCancel: false
					})
				}
			},
			
			// 跳转通知界面
			toRing() {
				let that = this
				if (this.per_status === 0) {
					uni.showModal({
						title: "提示",
						content: "您的身份审核中,请稍等或重新登录",
						showCancel: false
					})
				}else if (this.per_status === 1){
					uni.navigateTo({
						url: '../mine/ring'
					})
				}else if (this.per_status === 2) {
					uni.showModal({
						title: "提示",
						content: "您的信息已被退回,请重新填写",
						showCancel: false,
						success(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '../mine/login'
								});
							}
						}
					})
				}else {
					uni.showModal({
						title: "提示",
						content: "请先登录",
						showCancel: false
					})
				}
				
			},
			
			// 跳转活动管理
			toActivity() {
				uni.navigateTo({
					url: '../mine/activity'
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FCFCFC;
	}
	
	.information {
		height: 356rpx;
		
		display: flex;
		justify-content: space-between;
		
		.informationleft {
			display: flex;
			margin-top: 50rpx;
			
			.informationImg {
				margin: 30rpx;
				width: 140rpx;
				height: 140rpx;
				
				image {
					border: 6rpx solid rgba(255,255,255,.5);
					border-radius: 50%;
					width: 100%;
					height: 100%;
				}
			}
			
			.name {
				font-size: 42rpx;
				color: #FFFFFF;
				margin-top: 36rpx;
				
				.companyName {
					font-size: 28rpx;
					color: #FEFEFE;
					margin-top: 24rpx;
				}
			}
		}
		
		.ic-Return {
			height: 315rpx;
			margin-right: 64rpx;
			line-height: 356rpx;
			
			image {
				width: 16rpx;
				height: 26rpx;
			}
		}
	}
	
	.box {
		height: 120rpx;
		font-size: 28rpx;
		color: #333333;
		line-height: 120rpx;
		display: flex;
		justify-content: space-between;
		background-color: #FFFFFF;
		border-radius: 12rpx;
		
		.boxImg {
			width: 44rpx;
			height: 44rpx;
			margin: 0 30rpx;
			vertical-align: middle;
		}
		
		.boxReturn {
			margin-right: 34rpx;
			width: 16rpx;
			height: 26rpx;
		}
	}
	
	.bigBox {
		width: 690rpx;
		margin: 32rpx auto;
		box-shadow:0rpx 0rpx 4rpx 4rpx rgba(79,82,139,.1);
		border-radius: 12rpx;
	}
</style>
