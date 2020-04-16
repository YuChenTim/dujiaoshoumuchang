<template>
	<view class="page">
		<view class="companyName">{{com_name}}</view>
		
		<view class="group">
			<view class="groupTitle">管理员</view>
			
			<view class="groupCentent" v-for="item in admin" :key="item">
				<image :src="item.head"></image>
				{{item.u_name}}
			</view>
		</view>
		
		<view class="group">
			<view class="groupTitle">成员</view>
			
			<view class="groupCentent" v-for="item in member" :key="item">
				<image :src="item.head"></image>
				{{item.u_name}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				admin: {},
				member: {},
				com_name: ''
			}
		},
		methods: {
			// 获取用户信息
			getUser() {
				let baseUrl = this.WebUrl
				let that = this
				uni.getStorage({
					key: 'u_id',
					success: (id) => {
						uni.request({
							url: baseUrl + '/getUser',
							data: {
								u_id: id.data
							},
							success: (res) => {
								that.getTeam(res.data.data.firm_id)
								that.com_name = res.data.data.com_name
							}
						})
					}
				})
			},
			
			// 获取团队
			getTeam(firm_id) {
				let baseUrl = this.WebUrl
				let that = this
				uni.request({
					url: baseUrl + '/getTeam',
					data: {
						firm_id: firm_id
					},
					success: (res) => {
						that.admin = res.data.data.admin
						that.member = res.data.data.member
						console.log(that.admin)
					}
				})
			},
		},
		onLoad() {
			this.getUser()
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FCFCFC;
	}
	
	.companyName {
		background: #FFFFFF;
		padding: 34rpx 3%;
		font-size: 32rpx;
		color: #333333;
		font-weight: 600;
	}
	
	.groupTitle {
		margin: 10rpx 3% 12rpx;
		font-size: 26rpx;
		color: #999999;
	}
	
	.groupCentent {
		background: #FFFFFF;
		font-size: 28rpx;
		color: #333333;
		font-weight: 600;
		
		image {
			border-radius: 50%;
			width: 130rpx;
			height: 130rpx;
			vertical-align: middle;
			margin: 26rpx 28rpx 26rpx 3%;
		}
	}
	
</style>
