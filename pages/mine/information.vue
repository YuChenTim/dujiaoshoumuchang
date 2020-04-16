<template>
	<view class="page">
		<view class="headImg">
			<image :src="avatarUrl"></image>
			
			<image class="photocamera" :src="ImgUrl +'static/mine/photocamera.png'"></image>
		</view>
		<view class="informationText">
			<view class="company">
				<view class="companyTitle">公司</view>
				<view>{{firmName}}</view>
			</view>
			
			<view class="informationTitle">姓名</view>
			<input class="informationCentent" type="text" @input="nameChange" :placeholder="nickname">
			
			<view class="informationTitle">职位</view>
			<input class="informationCentent" type="text" @input="positionChange" :placeholder="position">
			
			<view class="informationTitle">手机号码</view>
			<input class="informationCentent" type="number"  @input="phoneChange" :placeholder="phone">
		</view>
		
		<button class="button" @tap="updateUser">保存</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				nameValue: '',
				positionValue: '',
				phoneValue: 0,
				nickname: '',
				avatarUrl: '',
				firmName: '',
				position: '',
				phone: 0,
				u_id: 0,
				ImgUrl: this.ImgUrl
			}
		},
		methods: {
			nameChange(e) {
				this.nameValue = e.target.value
			},
			
			positionChange(e) {
				this.positionValue = e.target.value
			},
			
			phoneChange(e) {
				this.phoneValue = e.target.value
			},
			
			// 获取用户信息
			getUser(id) {
				let baseUrl = this.WebUrl
				let that = this
				uni.request({
					url: baseUrl + '/getUser',
					data: {
						u_id: id
					},
					success: (res) => {
						console.log(res)
						that.nickname = res.data.data.u_name || ''
						that.avatarUrl = res.data.data.head || ''
						that.position = res.data.data.position || ''
						that.phone = res.data.data.phone || 12345678910
						
						// 获取公司名字
						uni.request({
							url: baseUrl + '/getUser',
							data: {
								u_id: res.data.data.u_id
							},
							success: (resd) => {
								console.log(resd)
								that.firmName = resd.data.data.com_name || ''
							}
						})
					}
				})
			},
			
			updateUser() {
				let baseUrl = this.WebUrl
				let that = this
				let name = this.nameValue === '' ? this.nickname : this.nameValue
				let position = this.positionValue === '' ? this.position : this.positionValue
				let phone = this.phoneValue === 0 ? this.phone : this.phoneValue
				console.log(position)
				uni.request({
					url: baseUrl + '/updateUser',
					method: 'POST',
					data: {
						u_id: that.u_id,
						u_name: name,
						position: position,
						head: that.avatarUrl,
						phone: phone
					},
					success: (res) => {
						console.log(res)
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
					}
				})
			}
		},
		onLoad: function(option) {
			this.u_id = option.u_id
			
			this.getUser(option.u_id)
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
		
		.company {
			display: flex;
			color: #333333;
			font-size: 32rpx;
			letter-spacing: 4rpx;
			
			.companyTitle {
				width: 130rpx;
				
			}
		}
		
		.informationTitle {
			margin: 30rpx 0 20rpx;
			font-size: 32rpx;
			font-weight: bold;
		}
		
		.informationCentent {
			border-bottom: 1rpx solid #DFDFDF;
			padding-bottom: 18rpx;
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
</style>
