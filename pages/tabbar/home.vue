<template>
	<view class="content page">
		<!-- 区域 -->
		<view class="location">
			<view class="locationContent">
				<image :src="ImgUrl + 'static/temporary/location1.png'"></image>
				<picker mode="selector" @change="locationChange" :value="locationIndex" :range="location">
					<view>{{location[locationIndex]}}</view>
				</picker>
			</view>
		</view>
		
		<!-- 顶部4个button -->
		<view class="head">
			<view class="headButton" :class="[popup === true ? 'popupContent' : '']" @click="aboutUsButton()">
				<image :src="ImgUrl + 'static/temporary/aboutUs.png'"></image>
				关于我们
				<view class="popupChange" v-if="popup === true" >
					<view class="popupChangeOne" :class="(index + 1) === view.length ? 'popupChangeLast' : ''" 
					v-for="(item,index) in view" :key="item" @click="webView(item.url)">{{item.name}}</view>
				</view>
			</view>
			<view class="headButton" @tap="toField()">
				<image :src="ImgUrl + 'static/temporary/field.png'"></image>
				场地合作
			</view>
			<view class="headButton" @tap="toVisit()">
				<image :src="ImgUrl + 'static/temporary/visit.png'"></image>
				预约参观
			</view>
			<view class="headButton" @tap="toApply()">
				<image :src="ImgUrl + 'static/temporary/Apply.png'"></image>
				入驻申请
			</view>
		</view>
		
		<web-view v-if="headShow" :src="popupChange"></web-view>
		
		<!-- 空间类型 -->
		<view class="type">
			<view class="typeTitle">空间类型</view>
			<scroll-view scroll-x="true">
				<view class="typeScroll">
					<view class="typeView" v-for="item in type" :key="item">
						<image class="typeImg" :src="ImgUrl + item.img "></image>
						<view class="typeContentTitle">{{item.name}}</view>
						<view class="typeContent">
							{{item.txt}}
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		
		<!-- 热推空间 -->
		<view class="space">
			<view class="spaceTitle">热推空间</view>
			<view class="spaceContent" v-for="(item,index) in space" :key="item" @click="toSpace(index)">
				<view class="spaceImg" :style="'background-image: url(' + ImgUrl + item.file_url +')'"></view>
				<view>
					<view class="spaceContentTitle">
						{{item.name}}
						<text>({{item.office_number}}人)</text>
					</view>
					<view class="spaceName">
						广州市南沙区香江国际科创中心
					</view>
					<view class="spaceLocation">
						<image :src="ImgUrl + 'static/temporary/placeholder.png'"></image>
						{{item.address}}
					</view>
					<view class="spaceMoney"><text>{{item.money}}</text>元/间/月</view>
				</view>
			</view>
		</view>
		
		<!-- 活动 -->
		<view class="activity">
			<view class="title">活动报名</view>
			<view class="activityContent"  v-for="(item,index) in activityData" :key="item" 
			:style="'background-image: url(' + ImgUrl + item.file_url + ');'" 
			@tap="activity(item.activity_id)">
				<view class="activityTitle">{{item.title}}</view>
				<view class="activityNum">{{item.explain}}</view>
			</view>
		</view>
		
		<view class="popup" @tap="changePopup" v-if="popup"></view>
		
		<view class="wxLogin" v-if="wxLogin === true" @click="changeWxLogin">
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
				popup: false,
				tourist: false,
				wxLogin: true,
				activityData: [],
				ImgUrl: this.ImgUrl,
				location: [],
				locationIndex: 0,
				locationId: {},
				space: {},
				popupChange: '',
				headShow: false,
				type: {},
				view: {}
			}
		},
		onLoad() {
			this.getUser()
			
			this.getArea()
			
			this.getWe()
			
			this.getSpace()
			
			
			uni.setStorage({
				key: 'tourist',
				data: false
			})
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
									key: 'openid',
									data: id.data.data.openid,
									success:function(){
										that.getUser()
									}
								})
							}
						})
			
					}
				})
			},
			
			// 判断用户是否存在
			getUser() {
				let baseUrl = this.WebUrl
				let that = this
				uni.getStorage({
					key: 'openid',
					success: function(id){
						console.log(id.data)
						uni.request({
							url: baseUrl + '/judgeUser',
							method: 'POST',
							data: {
								openid: id.data
							},
							success: (res) => {
								if (res.data.msg === "用户已存在！"){
									that.tourist = true
									that.wxLogin = false
									uni.setStorage({
										key: 'u_id',
										data: res.data.data.u_id
									})
									
									uni.setStorage({
										key: 'tourist',
										data: true
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
			
			// 授权登录
			getUserInfo(res) {
				let that = this
				let baseUrl = this.WebUrl
				let area_id = 0
				for(let key in this.locationId){
					console.log(key)
					if(key === this.location[this.locationIndex]){
						area_id = this.locationId[key].id
					}
				}
			
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
										area_id: area_id,
										city: data.city,
										gender: data.gender,
										nickName: data.nickName,
										avatarUrl: data.avatarUrl,
										openid: id.data
									},
									success(resd) {
										console.log(resd)
										that.getUser()
									}
								})
							}
						})
					},
					fail: (err) => {
						console.log(err)
					}
				})
			},
			
			// 头部跳转
			webView(url) {
				console.log(url)
				uni.showModal({
					title:"该地址无法跳转",
					showCancel: false
				})
				// this.headShow = true
				// this.popupChange === url
			},
			
			// 获取区域
			getArea() {
				let baseUrl = this.WebUrl
				let that = this
				uni.request({
					url: baseUrl + '/getArea',
					success(res) {
						res.data.data.forEach(function(item){
							that.location.push(item.dict_name)
							that.locationId[item.dict_name] = {id:item.dict_id}
						})
						that.getActivity()
						that.getHot()
						uni.getStorage({
							key: 'area_id',
							success:(res) => {
								console.log(res)
							},
							fail:() => {
								console.log(res.data.data[0].dict_id)
								uni.setStorage({
									key: "area_id",
									data: res.data.data[0].dict_id
								})
							}
						})
						
					}
				})
			},
			
			// 获取关于我们
			getWe() {
				let baseUrl = this.WebUrl
				let that = this
				uni.request({
					url: baseUrl + '/getWe',
					success(res) {
						that.view = res.data.data
						console.log(res.data.data)
						console.log('关于我们')
					}
				})
			},
			
			// 获取空间类型
			getSpace() {
				let baseUrl = this.WebUrl
				let that = this
				uni.request({
					url: baseUrl + '/getSpace',
					success(res) {
						that.type = res.data.data
					}
				})
			},
			
			// 获取热推空间
			getHot() {
				let baseUrl = this.WebUrl
				let that = this
				let area_id
				for(let key in this.locationId){
					console.log(key)
					if(key === this.location[this.locationIndex]){
						area_id = this.locationId[key].id
					}
				}
				
				uni.request({
					url: baseUrl + '/getHot',
					data: {
						area_id: area_id
					},
					success(res) {
						that.space = res.data.data
						console.log(res)
						console.log('aaa')
					}
				})
			},
			
			// 获取活动
			getActivity() {
				let baseUrl = this.WebUrl
				let that = this
				let area_id
				for(let key in this.locationId){
					console.log(key)
					if(key === this.location[this.locationIndex]){
						area_id = this.locationId[key].id
					}
				}
				uni.request({
					url: baseUrl + '/getActivity',
					data: {
						area_id: area_id
					},
					success(res) {
						that.activityData = res.data.data
						console.log(that.activityData)
					}
				})
			},
			
			// 切换市
			locationChange(e) {
				this.locationIndex = e.target.value
				this.getActivity()
				let area_id
				for(let key in this.locationId){
					if(key === this.location[this.locationIndex]){
						area_id = this.locationId[key].id
					}
				}
				console.log(area_id)
				uni.setStorage({
					key: "area_id",
					data: area_id
				})
			},
			
			// 点开关于我们
			aboutUsButton() {
				console.log(1)
				if(this.popup) {
					this.popup = false
				}else {
					this.popup = true
				}
			},
			
			// 跳转场地合作
			toField() {
				uni.navigateTo({
					url: '../home/field'
				});
			},
			
			// 跳转预约参观
			toVisit() {
				if (this.tourist) {
					uni.navigateTo({
						url: '../home/visit'
					});
				}else {
					uni.showModal({
						title: "提示",
						content: "请先授权登录",
						success: (res) => {
							if (res.confirm) {
								this.wxLogin = true
							}
						}
					})
				}
			},
			
			// 跳转入驻申请
			toApply() {
				if (this.tourist) {
					uni.navigateTo({
						url: '../home/apply'
					});
				}else {
					uni.showModal({
						title: "提示",
						content: "请先授权登录",
						success: (res) => {
							if (res.confirm) {
								this.wxLogin = true
							}
						}
					})
				}
			},
			
			// 跳转热推空间
			toSpace(id) {
				console.log(this.space[id].infor_id)
				uni.navigateTo({
					url: '../home/space?infor_id=' + this.space[id].infor_id
				})
			},
			
			// 跳转活动界面
			activity(id) {
				uni.navigateTo({
					url: '../home/activity?id=' + id
				});
			},
			
			// 点击遮罩
			changePopup() {
				this.popup = false
			},
			
			// 授权遮罩
			changeWxLogin() {
				if(this.wxLogin === true){
					this.wxLogin = false
				}else {
					this.wxLogin = true
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FCFCFC;
	}
	
	.location {
		margin: 24rpx 0 38rpx 3%;
		
		.locationContent {
			font-size: 30rpx;
			color: #000000;
			display: flex;
			font-size: 26rpx;
			line-height: 50rpx;
			
			image {
				width: 290rpx;
				height: 50rpx;
				vertical-align: middle;
				margin-right: 16rpx;
			}
		}
		
		.locationContent::after {
			margin-left: 2rpx;
			margin-top: 10rpx;
			content: '';
			border: 6rpx solid #000000;
			border-top: 6rpx solid rgba(255,255,255,0);
			border-right: 6rpx solid rgba(255,255,255,0);
			height: 0;
			vertical-align: middle;
			transform: rotate(-45deg) translate(0,10rpx);
		}
	}
	
	.head {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		margin: 0 20rpx;
		
		.headButton {
			width: 336rpx;
			height: 180rpx;
			border-radius: 12rpx;
			margin-bottom: 20rpx;
			box-shadow:0rpx 0rpx 4rpx 4rpx rgba(79,82,139,.1);
			line-height: 180rpx;
			text-align: center;
			background-color: #FFFFFF;
			
			image {
				width: 44rpx;
				height: 44rpx;
				margin-right: 27rpx;
				vertical-align: middle;
			}
		}
	}
	
	.space {
		margin: 0 3%;
		
		.spaceTitle {
			margin: 56rpx 0 38rpx;
			font-size: 36rpx;
			font-weight: 500;
			letter-spacing: 7rpx;
		}
		
		.spaceContent {
			height: 250rpx;
			padding: 36rpx 12rpx;
			border-bottom: 4rpx solid #FDFDFD;
			background: #FFFFFF;
			border-radius: 12rpx;
			
			.spaceImg {
				width: 236rpx;
				height: 236rpx;
				float: left;
				margin-right: 36rpx;
				background-size: cover;
				background-repeat: no-repeat;
				background-position:center;
				border-radius: 12rpx;
			}
			
			.spaceContentTitle {
				font-size: 32rpx;
				color: #333333;
				
				text {
					font-size: 24rpx;
				}
			}
			
			.spaceName {
				font-size: 24rpx;
				color: #666666;
				margin: 34rpx 0 18rpx;
				text-overflow:ellipsis;
				overflow: hidden;
				white-space: nowrap;
				width: 300rpx;
			}
			
			.spaceLocation {
				font-size: 22rpx;
				color: #666666;
				
				image {
					width: 24rpx;
					height: 24rpx;
					vertical-align: middle;
					margin-right: 8rpx;
				}
			}
			
			.spaceMoney {
				font-size: 16rpx;
				color: #EF2424;
				float: right;
				margin-top: 40rpx;
				
				text{
					font-size: 30rpx;
				}
			}
		}
	}
	
	.type {
		margin: 0 3%;
		
		.typeTitle {
			margin: 46rpx 0 38rpx;
			font-size: 36rpx;
			font-weight: 500;
			letter-spacing: 7rpx;
		}
		
		.typeScroll {
			white-space: nowrap;
			display: flex;
			width: 960rpx;
			
			.typeView {
				margin-right: 12rpx;
				width: 308rpx;
				height: 375rpx;
				background-color: #FFFFFF;
				border-radius: 12rpx;
				
				.typeImg {
					width: 100%;
					height: 168rpx;
					border-radius: 12rpx 12rpx 0 0;
				}
				
				.typeContentTitle {
					margin: 26rpx 0 16rpx 16rpx;
					font-size: 24rpx;
					color: #333333;
					font-weight: bold;
				}
				
				.typeContent {
					font-size: 22rpx;
					margin: 0 16rpx;
					color: #666666;
					display: -webkit-box;
					overflow: hidden;
					text-overflow: ellipsis;
					word-wrap: break-word;
					white-space: normal !important;
					-webkit-line-clamp: 3;
					-webkit-box-orient: vertical;
					text-align: left;
				}
				
				.typeDetails {
					float: right;
					margin-top: 24rpx;
					width: 98rpx;
					height: 46rpx;
				}
			}
		}
	}
	
	.activity {
		margin: 0 3%;
		.title {
			margin: 36rpx 0rpx 38rpx;
			font-size: 36rpx;
			font-weight: 500;
			letter-spacing: 7rpx;
		}
		
		.activityContent {
			width: 100%;
			height: 315rpx;
			background-size:100%;
			background-repeat: no-repeat;
			border-radius: 10rpx;
			text-align: center;
			margin-bottom: 20rpx;
			
			.activityTitle {
				font-size: 36rpx;
				color: #FFFFFF;
				padding-top: 100rpx;
			}
			
			.activityNum {
				font-size: 26rpx;
				color: #FFFFFF;
				padding-top: 22rpx;
			}
		}
	}
	
	.popupContent {
		z-index: 100;
		
		.popupChange {
			background-color: rgba(255,255,255,.8);
			margin-left: 306rpx;
			margin-top: -30rpx;
			width: 280rpx;
			border-radius: 12rpx;
			
			.popupChangeOne {
				margin: 0 20rpx;
				height: 99rpx;
				line-height: 99rpx;
				border-bottom: 1rpx solid #C8C7CC;
			}
			
			.popupChangeLast {
				border: none;
			}
		}
	}
	
	.popup {
		width: 100%;
		height: 100%;
		position: fixed;
		left: 0;
		top: 0;
		background-color: rgba(223,223,223,.6);
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
