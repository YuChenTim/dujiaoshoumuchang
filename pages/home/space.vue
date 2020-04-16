<template>
	<!-- 空间详情 -->
	<view class="page">
		<view class="headTitle">
			{{spaceData.name}}
			<image class="headTitleImg" :src="ImgUrl + 'static/temporary/love.png'"></image>
		</view>
		<view class="headMap">
			<view class="headPlaceholder">
				<image class="headPlaceholderImg" :src="ImgUrl + 'static/temporary/placeholder.png'"></image>
				{{spaceData.address}}
			</view>
			<view class="headMapBorder"></view>
			<image class="headMapImg" src="../../static/headMapImg.png" @click="nav"></image>
		</view>
		
		<swiper class="example" autoplay="true" circular="true" indicator-dots="true" indicator-color="#FFFFFF" indicator-active-color="#4E54C8">
			<swiper-item class="exampleItem" v-for="item in topImg" :key="item">
				<image class="exampleImg" :src="ImgUrl + item"></image>
			</swiper-item>
		</swiper>
		
		<view class="box">
			<view class="boxTitle">空间介绍</view>
			<view class="boxContent">
				{{spaceData.detail}}
			</view>
		</view>
		
		<view class="box">
			<view class="boxTitle">服务设施</view>
			<image class="facility" :src="ImgUrl + office_facility"></image>
		</view>
		
		<view class="box">
			<view class="boxTitle">办公空间定价</view>
			<view class="smallBox">
				<image class="smallBoxImg" :src="ImgUrl + office"></image>
				<view class="smallBoxTitle">
					<text>￥</text>{{spaceData.office_money}}<text>元/工位/月</text>
					<view class="smallBoxTitletext">特价房</view>
				</view>
				<view class="smallBoxMoney">
					<view>
						<view class="smallBoxMoneyContent">{{spaceData.office_window}}</view>
						<view class="smallBoxMoneyTitle">位置</view>
					</view>
					<view>
						<view class="smallBoxMoneyContent">{{spaceData.office_fifty}}m²</view>
						<view class="smallBoxMoneyTitle">总面积</view>
					</view>
					<view>
						<view class="smallBoxMoneyContent">{{spaceData.office_interior}}</view>
						<view class="smallBoxMoneyTitle">区域优势</view>
					</view>
					<view>
						<view class="smallBoxMoneyContent">{{spaceData.office_number}}人</view>
						<view class="smallBoxMoneyTitle">容纳人数</view>
					</view>
					<view>
						<view class="smallBoxMoneyContent">{{spaceData.office_area}}m²</view>
						<view class="smallBoxMoneyTitle">
							<view>办公面积</view>
							<view>(不含共享空间)</view>
						</view>
					</view>
				</view>
				<view class="smallBoxContent">
					{{spaceData.office_remarks}}
				</view>
			</view>
		</view>
		
		<view class="box">
			<view class="boxTitle">地理位置</view>
			<view class="boxPlaceholderText">
				<image class="boxPlaceholderImg" :src="ImgUrl + 'static/temporary/placeholder.png'"></image>
				南沙区香江国际科创中心1栋17-18楼
			</view>
			<view class="boxPlaceholderText">
				<image class="boxMetroImg" :src="ImgUrl + 'static/temporary/metro.png'"></image>
				金洲站
			</view>
			<view class="boxExit">
				<view class="metroNum">4号线</view>
				<view class="metroExit">B出口</view>
			</view>
			<map class="map" :latitude="latitude" :longitude="longitude" @click="nav" :markers="markers"></map>
		</view>
		
		<view class="buttonBox"><button class="button" @click="toVisit">立即预约</button></view>
		<view class="buttonZhezhao"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				facilities: ['','',''],
				latitude: 22.79406,
				longitude: 113.545738,
				markers: [{
					iconPath: this.ImgUrl + 'static/temporary/location.png',
					id: 0,
					latitude: 22.79406,
					longitude: 113.545738,
					width: 20,
					height: 30
				}],
				ImgUrl: this.ImgUrl,
				spaceData: {},
				topImg: [],
				office: 'uploads/20200410/96970820fc89ebb32632841337596981.jpg',
				office_facility: 'uploads/20200410/8a5da8c3f390181a92cb868b770fe8c7.jpg'
			}
		},
		methods: {
			nav:function(){
				wx.getLocation({
					type: 'wgs84',
					success: function (res) {
						console.log(res.latitude)
						console.log(res.longitude)
						wx.openLocation({
							latitude: 22.79406,
							longitude: 113.545738,
							name: "香江国际金融大厦",
							address: '广东省广州市南沙区金州香江国际'
						})
					}
				})
			},
			
			VR() {
				uni.showModal({
					title: "提示",
					content: "该功能暂未开放",
					showCancel: false
				})
			},
			
			// 跳转预约参观
			toVisit() {
				uni.getStorage({
					key: 'tourist',
					success: (res)=> {
						if (res.data) {
							uni.navigateTo({
								url: '../home/visit'
							});
						}else {
							uni.showModal({
								title: "提示",
								content: "请先授权登录",
								success: (res) => {
									if (res.confirm) {
										uni.navigateBack({
											delta: 1
										})
									}
								}
							})
						}
					}
				})
			},
			
			// 获取详细信息
			getSitei(infor_id) {
				let baseUrl = this.WebUrl
				let that = this
				uni.request({
					url: baseUrl + '/getSitei',
					data: {
						infor_id: infor_id
					},
					success(res) {
						that.spaceData = res.data.data
						that.office = res.data.data.office
						that.office_facility = res.data.data.office_facility
						console.log(that.office_facility)
						console.log(that.spaceData)
						console.log('aaa')
						that.topImg = res.data.data.top_img.split(',')
						let GPS = res.data.data.office_GPS.split(',')
						that.longitude = GPS[0]
						that.latitude = GPS[1]
						that.markers.longitude = GPS[0]
						that.markers.latitude = GPS[1]
					}
				})
			}
		},
		onLoad:function(option) {
			this.getSitei(option.infor_id)
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FCFCFC;
	}
	
	.page {
		padding: 0 20rpx;
		
		.headTitle{
			margin-top: 80rpx;
			display: flex;
			justify-content: space-between;
			font-size: 50rpx;
			color: #333333;
			font-weight: bold;
			
			.headTitleImg {
				width: 52rpx;
				height: 46rpx;
				margin-top: 10rpx;
			}
		}
		
		.headMap {
			margin-top: 40rpx;
			display: flex;
			justify-content: space-between;
			
			.headPlaceholder {
				font-size: 30rpx;
				color: #333333;
				line-height: 56rpx;
				font-weight: bold;
				
				.headPlaceholderImg {
					width: 53rpx;
					height: 48rpx;
					margin: 0 30rpx 0 4rpx;
					vertical-align: middle;
					margin-bottom: 6rpx;
				}
			}
			
			.headMapBorder {
				border-left: 2rpx solid #E6E6E6;
				width: 0;
			}
			
			.headMapImg {
				width: 52rpx;
				height: 52rpx;
			}
		}
		
		.example {
			width: 100%;
			margin-top: 46rpx;
			height: 480rpx;
			
			.exampleItem {
				border-radius: 20rpx;
				
				.exampleImg {
					width: 100%;
					height: 480rpx;
				}
			}
		}
		
		.VR {
			width: 100%;
			height: 88rpx;
			margin-bottom: 10rpx;
			
			.VRImg {
				width: 100%;
				height: 100%;
			}
		}
		
		.box {
			margin-top: 55rpx;
			
			.boxTitle {
				font-size: 48rpx;
				color: #333333;
				font-weight: bold;
				margin-bottom: 40rpx;
			}
			
			.facility {
				width: 100%;
				height: 400rpx;
				box-shadow: 0 0 20rpx rgba(8,1,3,.1);
				border-radius: 10rpx;
			}
			
			.boxContent {
				color: #333333;
				font-size: 30rpx;
				line-height: 48rpx;
			}
			
			.smallBox {
				border-radius: 20rpx 20rpx 0 0;
				border: 1rpx solid #E6E6E6;
				margin-bottom: 40rpx;
				box-shadow: 0 0 20rpx rgba(8,1,3,.1);
				
				.smallBoxImg {
					border-radius: 20rpx 20rpx 0 0;
					width: 100%;
					height: 480rpx;
				}
				
				.smallBoxTitle {
					color: #EF2424;
					font-size: 36rpx;
					margin: 42rpx 0 35rpx 30rpx;
					display: flex;
					line-height: 30rpx;
					
					text {
						font-size: 24rpx;
					}
					
					.smallBoxTitletext {
						background-color: #FFB6B6;
						width: 74rpx;
						height: 30rpx;
						margin-left: 20rpx;
						line-height: 30rpx;
						border-radius: 4rpx;
						box-shadow: 0 0 1rpx #FD8888;
						font-size: 20rpx;
						text-align: center;
					}
				}
				
				.smallBoxMoney {
					display: flex;
					justify-content: space-between;
					border-top: 1rpx solid #E6E6E6;
					border-bottom: 1rpx solid #E6E6E6;
					height: 126rpx;
					margin: 0 30rpx;
					
					.smallBoxMoneyContent {
						color: #333333;
						font-size: 24rpx;
						line-height: 56rpx;
						margin-top: 12rpx;
						text-align: center;
					}
					
					.smallBoxMoneyTitle {
						color: #999999;
						font-size: 18rpx;
						text-align: center;
					}
				}
				
				.smallBoxContent {
					color: #333333;
					font-size: 24rpx;
					margin: 32rpx 32rpx 0 32rpx;
					height: 187rpx;
				}
			}
			
			.boxPlaceholderText {
				font-size: 30rpx;
				color: #333333;
				line-height: 50rpx;
				margin-bottom: 15rpx;
				
				.boxPlaceholderImg {
					width: 72rpx;
					height: 64rpx;
					vertical-align: middle;
				}
				
				.boxMetroImg {
					width: 42rpx;
					height: 42rpx;
					margin-right: 12rpx;
					vertical-align: middle;
					margin-left: 18rpx;
				}
			}
			
			.boxExit {
				display: flex;
				margin-top: 30rpx;
				font-size: 24rpx;
				line-height: 46rpx;
				
				.metroNum {
					color: #FFFFFF;
					text-align: center;
					width: 126rpx;
					background-color: #00A1CB;
					margin-right: 15rpx;
				}
				
				.metroExit {
					color: #333333;
				}
			}
			
			.map {
				width: 100%;
				height: 600rpx;
				margin-top: 23rpx;
			}
			
			.facilitiesScroll {
				display: flex;
				white-space: nowrap;
				margin-top: 30rpx;
				
				.facilitiesBox {
					display: inline-block;
					width: 315rpx;
					font-size: 30rpx;
					color: #333333;
					margin-right: 15rpx;
					
					.facilitiesImg {
						width: 100%;
						height: 420rpx;
						border-radius: 10rpx;
						margin-bottom: 20rpx;
					}
				}
			}
		}
		
		.bottom {
			margin-top: 15rpx;
			.bottomTitle {
				border-bottom: 1rpx solid #E6E6E6;
				font-size: 36rpx;
				color: #333333;
				line-height: 70rpx;
				margin: 45rpx 0;
				
				text {
					color: #666666;
				}
				
				.bottomImg {
					width: 26rpx;
					height: 30rpx;
					margin-right: 15rpx;
				}
			}
			
			.bottomContent {
				display: flex;
				flex-wrap: wrap;
				font-weight: bold;
				
				.bottomContentOne {
					width: 50%;
					font-size: 32rpx;
					color: #333333;
					margin-bottom: 30rpx;
				}
			}
		}
		
		.buttonBox {
			width: 100%;
			background-color: #FFFFFF;
			position: fixed;
			bottom: 0;
			left: 50%;
			transform: translateX(-50%);
			
			.button {
				height: 88rpx;
				width: calc(100% - 40rpx);
				color: #FFFFFF;
				font-size: 32rpx;
				background-color: #4E54C8;
				border-radius: 10rpx;
				margin: 30rpx 20rpx 20rpx;
			}
		}
		
		.buttonZhezhao {
			height: 138rpx;
			width: 100%;
		}
	}
</style>
