<template>
	<view class="page">
		<view class="applyImg" :style="'background-image: url(' + ImgUrl + 'static/temporary/applyImg.jpg);'">
			<view class="applyText">欢迎您的加入</view>
		</view>
		
		<view class="bigBox">
			<view class="boxTitle">申请入驻表</view>
			
			<view class="box">
				<view class="boxLeft">
					<view class="boxText">申请入驻区域</view>
					<picker class="boxInput" mode="selector" @change="areachange" :value="areaIndex" :range="area">
						<view>{{area[areaIndex]}}</view>
						<view class="ic-Return timeRight">
							<image :src="ImgUrl + 'static/mine/ic-Return.png'"></image>
						</view>
					</picker>
				</view>
			</view>
			
			<view class="box">
				<view class="boxLeft">
					<view class="boxText">单位名称</view>
					<input class="boxInput" type="text" @input="nameValue" placeholder="请输入">
				</view>
			</view>
			
			<view class="box">
				<view class="boxLeft">
					<view class="boxText">行业</view>
					<input class="boxInput" type="text" @input="industryValue" placeholder="请输入">
				</view>
			</view>
			
			<view class="box">
				<view class="boxLeft">
					<view class="boxText">团队规模</view>
					<picker class="boxInput" mode="selector" @change="scaleChange" :value="scaleIndex" :range="scale">
						<view>{{scale[scaleIndex]}}</view>
						<view class="ic-Return timeRight">
							<image :src="ImgUrl + '/static/mine/ic-Return.png'"></image>
						</view>
					</picker>
				</view>
			</view>
			
			<view class="box">
				<view class="boxLeft">
					<view class="boxText">对接人</view>
					<input class="boxInput" type="text" @input="buttValue" placeholder="请输入">
				</view>
			</view>
			
			<view class="box">
				<view class="boxLeft">
					<view class="boxText">手机</view>
					<input class="boxInput" type="number" @input="phoneValue" placeholder="请输入">
				</view>
			</view>
			
			<view class="box">
				<view class="boxLeft">
					<view class="boxText">职位</view>
					<input class="boxInput" type="text" @input="postValue" placeholder="请输入">
				</view>
			</view>
			
			<view class="box boxLast">
				<view class="boxLeft">
					<view class="boxText">公司目前所在地</view>
					<input class="boxInput" type="text" @input="newValue" placeholder="请输入">
				</view>
			</view>
		</view>
		
		<view class="introduce">
			<view>感谢您提交入驻申请，提交信息后，会有工作人员与您电话沟通。如您需了解详情，也可以直接致电咨询：</view>
			<view class="introduceTitle">独角兽牧场（南沙）</view>
			<view class="introduceContent">陈小姐：134 1618 9465</view>
			<view class="introduceContent">地址：广东省广州市南沙区金隆路37号香江国际科创中心1栋17-18楼</view>
			<view>----------------------------</view>
			<view class="introduceTitle">独角兽牧场（肇庆）</view>
			<view class="introduceContent">詹先生：135 7094 8731</view>
			<view class="introduceContent">地址：广东省肇庆市肇庆新区科技创新中心C1栋</view>
		</view>
		
		<button class="button" @click="addEnter">完成</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				time: "12:30",
				number: 0,
				u_id: 0,
				name: '',
				industry: '',
				butt: '',
				phone: 0,
				post: '',
				new: '',
				scale: [],
				scaleIndex: 0,
				scale_id: {},
				area: [],
				areaIndex: 0,
				area_id: {},
				ImgUrl: this.ImgUrl
			}
		},
		methods: {
			// 获取区域
			getArea() {
				let baseUrl = this.WebUrl
				let that = this
				uni.request({
					url: baseUrl + '/getArea',
					success: (res) => {
						res.data.data.forEach(function(item){
							that.area.push(item.dict_name)
							that.area_id[item.dict_name] = item.dict_id
						})
					}
				})
			},
			
			// 获取规模
			getScale() {
				let baseUrl = this.WebUrl
				let that = this
				uni.request({
					url: baseUrl + '/getScale',
					success: (res) => {
						console.log(res)
						res.data.data.forEach(function(item){
							that.scale.push(item.s_code)
							that.scale_id[item.s_code] = item.scale_id
						})
					}
				})
			},
			
			areachange(e) {
				this.areaIndex = e.target.value
			},
			
			nameValue(e) {
				this.name = e.target.value
			},
			
			industryValue(e) {
				this.industry = e.target.value
			},
			
			scaleChange(e) {
				this.scaleIndex = e.target.value
			},
			
			buttValue(e) {
				this.butt = e.target.value
			},
			
			phoneValue(e) {
				this.phone = e.target.value
			},
			
			postValue(e) {
				this.post = e.target.value
			},
			
			newValue(e) {
				this.new = e.target.value
			},
			
			addEnter() {
				let baseUrl = this.WebUrl
				let that = this
				let areaId = this.area_id[this.area[this.areaIndex]]
				let scale = this.scale_id[this.scale[this.scaleIndex]]
				if (this.name === ''){
					uni.showModal({
						title: "提示",
						content: "请输入单位名称",
						showCancel: false
					})
				}else if (this.industry === ''){
					uni.showModal({
						title: "提示",
						content: "请输入行业",
						showCancel: false
					})
				}else if (this.butt === ''){
					uni.showModal({
						title: "提示",
						content: "请输入对接人名字",
						showCancel: false
					})
				}else if (!(/^1[3456789]\d{9}$/.test(this.phone))){
					uni.showModal({
						title: "提示",
						content: "手机号码有误，请重新输入",
						showCancel: false
					})
				}else if (this.post === ''){
					uni.showModal({
						title: "提示",
						content: "请输入职业",
						showCancel: false
					})
				}else if (this.new === ''){
					uni.showModal({
						title: "提示",
						content: "请输入公司目前所在地",
						showCancel: false
					})
				}else {
					uni.getStorage({
						key: 'u_id',
						success:function(res) {
							let u_id = res.data
							
							uni.request({
								url: baseUrl + '/addEnter',
								method: 'POST',
								data: {
									area_id: areaId,
									u_id: u_id,
									name: that.name,
									industry_id: that.industry,
									scale_id: scale,
									butt_joint: that.butt,
									phone: that.phone,
									post: that.post,
									address: that.new
								},
								success: (res) => {
									console.log(res)
									uni.showModal({
										title: "提示",
										content: res.data.msg,
										showCancel: false,
										success: (resd) => {
											if (resd.confirm && res.data.msg === '请求成功!') {
												uni.navigateBack({
													delta: 1
												})
											}
										}
									})
								}
							})
						}
					})
					
				}
			}
		},
		onLoad: function(){
			this.getArea()
			
			this.getScale()
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FCFCFC;
	}
	
	.applyImg {
		width: 100%;
		height: 250rpx;
		background-repeat: no-repeat;
		background-size: 100%;
		text-align: center;
		display: flex;
		justify-content: center;
		flex-direction: column;
		
		.applyText {
			color: #FFFFFF;
			font-size: 38rpx;
		}
	}
	
	.bigBox {
		background-color: #FFFFFF;
		margin: 20rpx 30rpx;
		border-radius: 12rpx;
		
		.boxTitle {
			text-align: center;
			border-bottom: 1rpx solid #DFDFDF;
			font-size: 42rpx;
			padding: 18rpx 0 12rpx;
		}
		
		.box {
			border-bottom: 1rpx solid rgba(200,199,204,.6);
			line-height: 100rpx;
			display: flex;
			justify-content: space-between;
			padding-left: 12rpx;
			
			.boxLeft {
				font-size: 28rpx;
				display: flex;
				width: 100%;
				
				.boxText {
					width: 300rpx;
					color: #333333;
				}
			}
			
			.boxInput {
				height: 100rpx;
				width: 100%;
				position: relative;
				
				.boxReturn {
					margin-top: -30rpx;
					margin-right: 34rpx;
					width: 16rpx;
					height: 26rpx;
					float: right;
				}
			}
			
			.editor {
				width: 100%;
			}
			
			.ic-Return {
				margin-right: 34rpx;
				line-height: 100rpx;
			
				image {
					width: 16rpx;
					height: 26rpx;
				}
			}
			
			.timeRight {
				position: absolute;
				right: 0;
				top: 0;
			}
		}
		
		.boxLast {
			border-bottom: none;
			display: block;
		}
	}
	
	.introduce {
		margin: 0 30rpx;
		padding-top: 38rpx;
		background-color: #FFFFFF;
		padding: 18rpx 20rpx;
		line-height: 55rpx;
		border-radius: 12rpx;
		color: #666666;
		font-size: 30rpx;
		
		.introduceTitle {
			font-size: 36rpx;
		}
	}
	
	.button {
		margin: 30rpx auto 50rpx;
		width: 690rpx;
		background-color: #4E54C8;
		color: #FFFFFF;
	}
</style>
