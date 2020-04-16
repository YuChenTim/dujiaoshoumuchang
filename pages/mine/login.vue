<template>
	<view class="page">
		<view class="headImg">
			<image :src="avatarUrl"></image>
			
			<image class="photocamera" :src="ImgUrl +'static/mine/photocamera.png'"></image>
		</view>
		<view class="informationText">
			<view class="informationTitle">公司</view>
			<view>
				<picker class="informationCentent" @change="companyChange" mode="selector" :value="companyIndex" :range="companyName">
					<view>{{companyName[companyIndex]}}</view>
					<view>
						<image class="boxReturn" :src="ImgUrl +'static/mine/ic-Return.png'"></image>
					</view>
				</picker>
			</view>
			
			<view class="informationTitle">姓名</view>
			<input class="informationCentent" type="text" @input="nameValue" placeholder="请输入姓名">
			
			<view class="informationTitle">职位</view>
			<input class="informationCentent" type="text" @input="positionValue" placeholder="请输入职位">
			
			<view class="informationTitle">手机号码</view>
			<input class="informationCentent" type="number" @input="phoneValue" placeholder="请输入手机号码">
			
			<view class="informationTitle">区域</view>
			<view>
				<picker class="informationCentent" @change="areaChange" mode="selector" :value="areaIndex" :range="areaName">
					<view>{{areaName[areaIndex]}}</view>
					<view>
						<image class="boxReturn" :src="ImgUrl +'static/mine/ic-Return.png'"></image>
					</view>
				</picker>
			</view>
		</view>
		
		<button @click="setUser" class="button">保存</button>
		
		<view class="wxLogin" v-if="wxLogin === true" @click="changePopup">
			<view class="wxLoginBox">
				<image class="wxLoginLogo" :src="ImgUrl + 'static/temporary/logo.png'"></image>
				<button class="wxLoginButton" open-type="getUserInfo" withCredentials='true' lang="zn_CN"@getuserinfo='getUserInfo'>授 权 登 录</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name: '',
				position: '',
				phone: 0,
				companyName: [],
				companyNumber: [],
				companyIndex: 0,
				areaName: [],
				areaNumber: [],
				areaIndex: 0,
				wxLogin: false,
				avatarUrl: this.ImgUrl +'/static/mine/touxiang.png',
				openId: '',
				u_id: '',
				ImgUrl: this.ImgUrl,
				tourist: ''
			}
		},
		
		methods: {
			companyChange: function(e) {
				this.companyIndex = e.target.value
			},
			
			areaChange: function(e) {
				this.areaIndex = e.target.value
			},
			
			// 获取公司
			getCompany() {
				let baseUrl = this.WebUrl
				let that = this
				uni.request({
					url: baseUrl + '/getFirm',
					success(res) {
						console.log(res)
						res.data.data.forEach(function(item, index){
							that.companyNumber.push(item.firm_id)
							that.companyName.push(item.name)
						})
					}
				})
			},
			
			// 获取区域
			getArea() {
				let baseUrl = this.WebUrl
				let that = this
				uni.request({
					url: baseUrl + '/getArea',
					success(res) {
						console.log(res)
						res.data.data.forEach(function(item, index){
							that.areaName.push(item.dict_name)
							that.areaNumber.push(item.dict_id)
						})
					}
				})
			},
			
			nameValue(e) {
				this.name = e.target.value
			},
			
			positionValue(e) {
				this.position = e.target.value
			},
			
			phoneValue(e) {
				this.phone = e.target.value
			},
			
			// 添加用户信息
			setUser() {
				let baseUrl = this.WebUrl
				let that = this
				if (this.name === ''){
					uni.showModal({
						title: "提示",
						content: "请输入名字",
						showCancel: false
					})
				}else if (this.position === ''){
					uni.showModal({
						title: "提示",
						content: "请输入职位",
						showCancel: false
					})
				}else if (!(/^1[3456789]\d{9}$/.test(this.phone))) {
					uni.showModal({
						title: "提示",
						content: "手机号码有误，请重新输入",
						showCancel: false
					})
				}else {
					uni.request({
						url: baseUrl + '/getPersonnel',
						method: "POST",
						data: {
							u_id: that.u_id,
							firm_id: that.companyNumber[that.companyIndex],
							position: that.position,
							phone: that.phone,
							u_name: that.name,
							head: that.avatarUrl
						},
						success(res) {
							uni.showModal({
								title: "提示",
								content: res.data.msg,
								showCancel: false,
								success: (resd) => {
									if (resd.confirm) {
										uni.navigateBack({
											delta: 1
										})
									}
								}
							})
							console.log(res.data.msg)
							if(res.data.msg === "请求成功!" || "该用户已存在！"){
								console.log(111)
								uni.setStorage({
									key: 'companyName',
									data: that.companyNumber[that.companyIndex]
								})
							}
						}
					})
				}
			},
			
			// 授权登录
			getUserInfo(res) {
				let that = this
				let baseUrl = this.WebUrl
			
				uni.getUserInfo({
					provider: "weixin",
					success: (res) => {
						let data = {
							nickName: res.userInfo.nickName,
							avatarUrl: res.userInfo.avatarUrl,
							gender: res.userInfo.gender,
							city: res.userInfo.city
						}
						
						uni.getStorage({
							key: 'openid',
							success:function(id) {
								uni.request({
									url: baseUrl + '/addUser',
									method: "POST",
									data: {
										area_id: 3,
										city: data.city,
										gender: data.gender,
										nickName: data.nickName,
										avatarUrl: data.avatarUrl,
										openid: id.data
									},
									success(res) {
										that.u_id = res.data.data.u_id
										that.judgeUser()
									}
								})
							}
						})
					}
				})
			},
			
			// 登录微信
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
								}else {
									that.wxLogin = true
								}
							},
							fail:function(err){
								that.Login()
							}
						})
					}
				})
			},
			
			// 遮罩
			changePopup() {
				if(this.wxLogin === true){
					this.wxLogin = false
				}else {
					this.wxLogin = true
				}
			}
		},
		
		onLoad: function(){
			this.getCompany()
			
			this.getArea()
			
			this.judgeUser()
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FCFCFC;
	}
	
	.headImg {
		text-align: center;
		padding: 50rpx 0 80rpx;
		background-color: #FFFFFF;
		
		image {
			border-radius: 50%;
			width: 140rpx;
			height: 140rpx;
		}
		
		.photocamera {
			background-color: #FFFFFF;
			width: 48rpx;
			height: 48rpx;
			position: absolute;
			left: 50%;
			margin: 102rpx 0 0 22rpx;
		}
	}
	
	.informationText {
		background-color: #FFFFFF;
		padding: 0 3% 66rpx;
		
		.informationTitle {
			padding: 30rpx 0 20rpx;
			font-size: 32rpx;
			font-weight: bold;
		}
		
		.informationCentent {
			border-bottom: 1rpx solid #DFDFDF;
			padding-bottom: 18rpx;
			height: 40rpx;
		}
		
		.boxReturn {
			margin-top: -30rpx;
			margin-right: 34rpx;
			width: 16rpx;
			height: 26rpx;
			float: right;
		}
	}
	
	.button {
		width: 360rpx;
		height: 76rpx;
		line-height: 76rpx;
		margin: 60rpx auto;
		background-color: #4E54C8;
		color: #FFFFFF;
	}
	
	.wxLogin {
		position: fixed;
		height: 100%;
		width: 100%;
		left: 0;
		top: 0;
		background-color: rgba(223,223,223,.6);
		text-align: center;
		z-index: 10;
		
		.wxLoginBox {
			position: absolute;
			bottom: 0;
			background-color: #FFFFFF;
			width: 100%;
			height: 400rpx;
			display: flex;
			justify-content: center;
			flex-direction: column;
			
			.wxLoginLogo {
				margin: 0 auto;
				width: 292rpx;
				height: 240rpx;
			}
			
			.wxLoginButton {
				width: 360rpx;
				height: 76rpx;
				line-height: 76rpx;
				background-color: #4E54C8;
				color: #FFFFFF;
			}
		}
	}
</style>
