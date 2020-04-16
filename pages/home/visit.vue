<template>
	<view class="page">
		<view class="bigBox">
			<view class="box">
				<view class="boxLeft">
					<view class="boxText">参观时间</view>
					<picker class="boxInput" mode="date" @change="changeTime" :start="start">
						<view>{{time}}</view>
						<view class="ic-Return timeRight">
							<image :src="ImgUrl + 'static/mine/ic-Return.png'"></image>
						</view>
					</picker>
				</view>
			</view>
			
			<view class="box">
				<view class="boxLeft">
					<view class="boxText">意向区域</view>
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
					<input class="boxInput" type="text" @input="comValue" placeholder="请输入">
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
					<view class="boxText">联系电话</view>
					<input class="boxInput" type="number" @input="phoneValue" placeholder="请输入">
				</view>
			</view>
			
			<view class="box">
				<view class="boxLeft">
					<view class="boxText">参观人数</view>
					<input class="boxInput" type="number" @input="numValue" placeholder="请输入">
				</view>
			</view>
			
			<view class="box">
				<view class="boxLeft">
					<view class="boxText">工位需求</view>
					<input class="boxInput" type="number" @input="stationValue" placeholder="请输入">
				</view>
			</view>
			
			<view class="box boxLast">
				<view class="boxLeft">
					<view class="boxText">来访目的</view>
				</view>
				<editor class="editor" type="text" @input="purposeValue" placeholder="会议室租需求、工位需求、合作意向"></editor>
			</view>
		</view>
		
		<view class="buttonView"></view>
		<button class="button" @click="visit">完成</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				time: "2020-03-28",
				number: 0,
				com: '',
				butt: '',
				phone: -1,
				num: -1,
				station: -1,
				purpose: '',
				area: [],
				areaIndex: 0,
				area_id: {},
				ImgUrl: this.ImgUrl,
				start: ""
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
			
			// 获取当前日期
			getToday(){
				let now = new Date()
				let year = now.getFullYear()
				let month = now.getMonth() + 1
				let day = now.getDate()
				if (month < 10) {
					month = '0' + month
				}
				if (day < 10) {
					day = '0' + day
				}
				this.time = year + '-' + month + '-' + day
				this.start = year + '-' + month + '-' + day
			},
			
			changeTime(e) {
				this.time = e.target.value
			},
			
			areachange(e) {
				this.areaIndex = e.target.value
			},
			
			comValue(e) {
				this.com = e.target.value
			},
			
			buttValue(e) {
				this.butt = e.target.value
			},
			
			phoneValue(e) {
				this.phone = e.target.value
			},
			
			numValue(e) {
				this.num = e.target.value
			},
			
			stationValue(e) {
				this.station = e.target.value
			},
			
			purposeValue(e) {
				this.purpose = e.target.text
			},
			
			// 发送申请
			visit() {
				let baseUrl = this.WebUrl
				let that = this
				let areaId = this.area_id[this.area[this.areaIndex]]
				if (this.com === ''){
					uni.showModal({
						title: "提示",
						content: "请输入单位名称",
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
				}else if (this.num <= 0 ){
					uni.showModal({
						title: "提示",
						content: "请输入参观人数",
						showCancel: false
					})
				}else if (this.station <= 0){
					uni.showModal({
						title: "提示",
						content: "请输入工作需求",
						showCancel: false
					})
				}else if (this.purpose === ''){
					uni.showModal({
						title: "提示",
						content: "请输入来访目的",
						showCancel: false
					})
				}else {
					uni.getStorage({
						key: 'u_id',
						success:function(res){
							let u_id = res.data
							
							uni.request({
								url: baseUrl + '/addVisit',
								method: 'POST',
								data: {
									area_id: areaId,
									u_id: u_id,
									visit_time: that.time,
									com_name: that.com,
									butt_joint: that.butt,
									phone: that.phone,
									num: that.num,
									station: that.station,
									purpose: that.purpose
								},
								success: (res) => {
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
		onLoad: function() {
			this.getArea()
			
			this.getToday()
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FCFCFC;
	}
	
	.bigBox {
		background-color: #FFFFFF;
		
		.box {
			margin-left: 30rpx;
			border-bottom: 1rpx solid rgba(200,199,204,.6);
			line-height: 100rpx;
			display: flex;
			justify-content: space-between;
			
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
	
	.buttonView {
		height: 90rpx;
		width: 100%;
	}
	
	.button {
		height: 90rpx;
		width: 690rpx;
		background-color: #4E54C8;
		color: #FFFFFF;
		position: fixed;
		bottom: 30rpx;
		left: 50%;
		transform: translateX(-50%);
	}
</style>
