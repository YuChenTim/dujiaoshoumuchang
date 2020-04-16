<template>
	<view>
		<view class="box">
			<view class="boxLeft">
				<view class="boxText">单位</view>
				<input class="boxInput" type="text" @input="comValue" placeholder="请输入">
			</view>
		</view>
		
		<view class="box">
			<view class="boxLeft">
				<view class="boxText">姓名</view>
				<input class="boxInput" type="text" @input="nameValue" placeholder="请输入">
			</view>
		</view>
		
		<view class="box">
			<view class="boxLeft">
				<view class="boxText">职位</view>
				<input class="boxInput" type="text" @input="positionValue" placeholder="请输入">
			</view>
		</view>
		
		<view class="box">
			<view class="boxLeft">
				<view class="boxText">联系方式</view>
				<input class="boxInput" type="text" @input="phoneValue" placeholder="请输入">
			</view>
		</view>
		
		<view class="box">
			<view class="boxLeft">
				<view class="boxText">邮箱</view>
				<input class="boxInput" type="text" @input="mailboxValue" placeholder="请输入">
			</view>
		</view>
		
		<button @click="apply" class="button">提交</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activity_id: 0,
				com: '',
				name: '',
				position: '',
				phone: '',
				mailbox: ''
			}
		},
		methods: {
			apply() {
				let baseUrl = this.WebUrl
				let that = this
				if (that.com === '') {
					uni.showModal({
						title: '单位名不能为空',
						showCancel: false
					})
				}else if (that.name === '') {
					uni.showModal({
						title: '姓名不能为空',
						showCancel: false
					})
				}else if (that.position === '') {
					uni.showModal({
						title: '职位不能为空',
						showCancel: false
					})
				}else if (!(/^1[3456789]\d{9}$/.test(this.phone))) {
					uni.showModal({
						title: '联系方式输入错误',
						showCancel: false
					})
				}else if (that.mailbox === '') {
					uni.showModal({
						title: '邮箱不能为空',
						showCancel: false
					})
				}
				uni.getStorage({
					key: 'u_id',
					success(res) {
						uni.request({
							url: baseUrl + '/apply',
							method: 'POST',
							data: {
								u_id: res.data,
								activity_id: that.activity_id,
								com_name: that.com,
								name: that.name,
								position: that.position,
								phone: that.phone,
								mailbox: that.mailbox
							},
							success(res) {
								if(res.data.msg === "请求成功!") {
									uni.showModal({
										title: '报名成功',
										showCancel:false,
										success(resd) {
											if(resd.confirm){
												uni.navigateBack({
													delta: 1
												})
											}
										}
									})
								}
							}
						})
					}
				})
			},
			
			comValue(e) {
				this.com = e.target.value
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
			
			mailboxValue(e) {
				this.mailbox = e.target.value
			},
		},
		onLoad:function(option) {
			this.activity_id = option.activity_id
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FCFCFC;
	}
	
	.box {
		background-color: #FFFFFF;
		padding-left: 30rpx;
		border-bottom: 1rpx solid rgba(200,199,204,.6);
		line-height: 100rpx;
		
		.boxLeft {
			font-size: 28rpx;
			
			.boxText {
				width: 200rpx;
				color: #333333;
			}
		}
		
		.boxInput {
			margin-bottom: 10rpx;
		}
		
		.editor {
			width: 100%;
		}
	}
	
	.boxLast {
		border-bottom: none;
		display: block;
	}
	
	.button {
		width: 690rpx;
		background-color: #4E54C8;
		margin: 50rpx auto;
		color: #FFFFFF;
	}
</style>
