<template>
	<!-- 充值 -->
	<view>
		<view style="height: 900upx; width: 100%;  ">
			<text style="font-size: 36upx; color:#333333 ; margin-left: 28upx; display: block; margin-top: 60upx; margin-bottom: 28upx;">充值金额
				<text>( 元 )</text> </text>

			<view style="width: 94%; margin:82upx auto; border-bottom: 1upx solid #666666; color:#333333; display: flex; flex-direction: row; align-items: flex-end; padding-bottom: 24upx;">
				<text style="font-size: 48upx; line-height: 1.4;">￥</text>
				<input placeholder="请输入金额" v-model="amount" type="number" placeholder-style="color: #999999; font-size:48upx !important;"
				 style=" height: 70upx; padding-left: 20upx;" />
			</view>
			<view class="priceList">
				<view class="priceItem" v-for="(item,index) in Re_price_arr" :key='index' @tap="selectPrice(item)">
					<text class="priceText">{{item}}</text>
				</view>
			</view>
			<button style="height: 98upx; width: 94%; background-color: #4dbeff; color: #FFFFFF; margin: 60upx auto 0;" @tap="btnRecharge">充
				值</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				amount: '',
				Re_price_arr: ['198', '500', '1000', '3000', '5000', '10000', '20000', '30000', '49998'],
				uid: 0,
				type: '' ,//商品或金额渠道
				firm_id: ''
			}
		},
		onLoad(payload) {
			this.firm_id = payload.firm_id
			console.log(this.firm_id)
		},
		methods: {
			//发起支付
			btnRecharge() {
				let baseUrl = this.WebUrl
				let that = this
				if (Math.floor(that.amount) !== that.amount * 1) {
					uni.showModal({
						title: '请填写整数',
						showCancel: false
					})
				}else {
					uni.getStorage({
						key: 'openid',
						success(res) {
							console.log(res)
							uni.getStorage({
								key: 'u_id',
								success(resId) {
									console.log(resId)
									uni.request({
										url: baseUrl + '/wxPay',
										method: 'POST',
										data: {
											openid: res.data,
											money: that.amount,
											uid: resId.data,
											firmid: that.firm_id
										},
										success(res) {
											wx.requestPayment({
												timeStamp: res.data.timeStamp,
												nonceStr: res.data.nonceStr,
												package: res.data.package,
												signType: res.data.signType,
												paySign: res.data.paySign,
												success(resPay) {
													if(resPay.errMsg === "requestPayment:ok"){
														uni.showModal({
															title: '充值成功',
															showCancel:false,
															success(res) {
																if(res.confirm) {
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
								}
							})
						}
					})
				}
			},

			selectPrice(item) {
				this.amount = item
			},
		}
	}
</script>

<style lang="scss">
	page {

		input {
			font-size: 48upx;
		}

		.priceList {
			width: 94%;
			margin: 60upx auto 0;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;

			.priceItem {
				width: 220upx;
				height: 96upx;
				line-height: 96upx;
				text-align: center;
				border: 1upx solid #4dbeff;
				border-radius: 8upx;
				color: #4dbeff;
				margin-bottom: 20upx;

				.priceText {
					letter-spacing: 4upx;
					font-size: 36upx;
				}

				.priceIcon {
					font-size: 20upx;
				}
			}

		}
	}
</style>
