<template>
	<view>
		<view class="box">
			<view class="boxLeft">
				<view class="boxText">使用时间</view>
				<picker class="boxInput" mode="date" @change="changeTime" :start="start">
					<view>{{time}}</view>
					<view class="ic-Return timeRight">
						<image :src="ImgUrl + '/static/mine/ic-Return.png'"></image>
					</view>
				</picker>
			</view>
		</view>
		
		<view class="box">
			<view class="boxLeft">
				<view class="boxText">意向场地</view>
				<picker class="boxInput" mode="selector" @change="roomchange" :value="meetIndex" :range="meet">
					<view>{{meet[meetIndex]}}</view>
					<view class="ic-Return timeRight">
						<image :src="ImgUrl + '/static/mine/ic-Return.png'"></image>
					</view>
				</picker>
			</view>
		</view>
		
		<view class="box">
			<view class="boxLeft">
				<view class="boxText">人数</view>
				<input class="boxInput" type="number" @input="numberValue" placeholder="请输入">
			</view>
		</view>
		
		<view class="box">
			<view class="boxLeft">
				<view class="boxText">联系人</view>
				<input class="boxInput" type="text" @input="nameValue" placeholder="请输入">
			</view>
		</view>
		
		<view class="box">
			<view class="boxLeft">
				<view class="boxText">电话</view>
				<input class="boxInput" type="number" @input="phoneValue" placeholder="请输入">
			</view>
		</view>
		
		<button class="button" @click="addNeed">提交</button>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				time: "2020-03-25",
				start: "",
				room: {},
				meet: [],
				meetIndex: 0,
				number: -1,
				name: '',
				phone: -1,
				ImgUrl: this.ImgUrl
			}
		},
		methods: {
			changeTime(e) {
				this.time = e.target.value
			},
			
			roomchange(e) {
				this.meetIndex = e.target.value
			},
			
			numberValue(e){
				this.number = e.target.value
			},
			
			nameValue(e){
				this.name = e.target.value
			},
			
			phoneValue(e){
				this.phone = e.target.value
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
			
			// 获取区域
			getAres() {
				let baseUrl = this.WebUrl
				let that = this
				uni.request({
					url: baseUrl + '/getArea',
					success(res) {
						res.data.data.forEach(function(item){
							that.room[item.dict_name] = {id:item.dict_id}
						})
						
						that.getMeet()
					}
				})
			},
			
			// 获取场地
			getMeet() {
				let baseUrl = this.WebUrl
				let that = this
				for(let key in this.room){
					uni.request({
						url: baseUrl + '/getInfor',
						data: {
							area_id: that.room[key].id
						},
						success(res) {
							console.log(res)
							res.data.data.forEach(function(item){
								that.room[key][item.infor_id] = item.name
								that.meet.push(item.name)
							})
						}
					})
				}
			},
			
			// 提交需求
			addNeed() {
				let baseUrl = this.WebUrl
				let that = this
				let area_id = ''
				let infor_id = ''
				for(let key in this.room) {
					for(let item in this.room[key]){
						if(this.room[key][item] === this.meet[this.meetIndex]){
							infor_id = this.room[key].id
						}
					}
				}
				if (this.number <= 0){
					uni.showModal({
						title: "提示",
						content: "请输入人数",
						showCancel: false
					})
				}else if (this.name === ''){
					uni.showModal({
						title: "提示",
						content: "请输入联系人名字",
						showCancel: false
					})
				}else if (!(/^1[3456789]\d{9}$/.test(this.phone))){
					uni.showModal({
						title: "提示",
						content: "手机号码有误，请重新输入",
						showCancel: false
					})
				}else {
					uni.request({
						url:baseUrl + '/addNeed',
						method: 'POST',
						data: {
							area_id: area_id,
							cost_time: that.time,
							infor_id: infor_id,
							num: that.number,
							contacts: that.name,
							phone: that.phone
						},
						success: (res) => {
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
			}
		},
		onLoad: function(){
			this.getAres()
			
			this.getToday()
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
	
	.button {
		width: 690rpx;
		background-color: #4E54C8;
		margin: 50rpx auto;
		color: #FFFFFF;
		margin-bottom: 30rpx;
	}
</style>
