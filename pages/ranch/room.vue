<template>
	<view>
		<view>
			<!-- 轮播 -->
			<swiper indicator-dots="true" indicator-color="#FFFFFF" indicator-active-color="#4E54C8" autoplay="true" circular="true">
				<swiper-item v-for="item in roomImg" :key="item">
					<view class="roomItem" :style="'background-image: url('+ ImgUrl + item +')'"></view>
				</swiper-item>
			</swiper>
			
			<view class="box">
				<view class="boxTitle">日期</view>
				<view class="boxRight">					
					<picker class="boxPicker" mode="date" :value="date" @change="bindDateChange" :start="start">
						<view>{{date}}</view>
					</picker>
					<view class="ic-Return">
						<image :src="ImgUrl + '/static/mine/ic-Return.png'"></image>
					</view>
				</view>
			</view>
			
			<view class="box">
				<view class="boxTitle">会议室</view>
				<view class="boxRight">
					<picker class="boxPicker" mode="selector" :value="roomIndex" :range="room" @change="bindRoomChange">
						<view>{{room[roomIndex]}}</view>
					</picker>
					<view class="ic-Return">
						<image :src="ImgUrl + '/static/mine/ic-Return.png'"></image>
					</view>
				</view>
			</view>
			
			<view class="chengeBox">
				<view class="chengeTitle">选择时段</view>
				<scroll-view class="chengeTimeScroll" scroll-x="true">
					<view class="chengeTime">
						<view class="chengeTimeBox" :class="[item === 1 ? 'color':'']" :id="[item === 2 ? 'booked' : '']"
						v-for="(item,index) in chenge" :key="index" @tap="clickTime(index)"
						></view>
					</view>
					<view class="thisTime">
						<view class="thisTimeBox" v-for="item in time" :key="item">{{item}}</view>
					</view>
				</scroll-view>
			</view>
			
			<view class="theme" v-if="showTheme">
				<view class="themeTitle">会议主题</view>
				<input class="themeInput" placeholder-class="themePlaceholder" @input="themeValue" type="text" placeholder="填写会议主题" />
			</view>
			
			<button class="button" @click="reserve">预定</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				roomImg: [],
				date: "2020-04-02",
				start: "",
				room: [],
				roomIndex: 0,
				roomId: {},
				theme: '',
				time: ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30',
				'13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30',
				'17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00'],
				chenge: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				ImgUrl: this.ImgUrl,
				showTheme: true,
				pass: 0
			}
		},
		methods: {
			bindDateChange: function(e) {
				this.date = e.target.value
				this.record()
			},
			
			bindRoomChange: function(e) {
				this.roomIndex = e.target.value
				this.record()
				this.getRoomImg()
			},
			
			// 获取轮播图
			getRoomImg() {
				let baseUrl = this.WebUrl
				let that = this
				let newRoomId = ''
				
				for(let key in this.roomId){
					if(key === this.room[this.roomIndex]) {
						newRoomId = this.roomId[key].id
					}
				}
				
				uni.getStorage({
					key: "area_id",
					success:(res) => {
						console.log(res.data)
						uni.request({
							url: baseUrl + '/getData',
							data: {
								area_id: res.data
							},
							success(res) {
								console.log(res)
								console.log('会议室')
								if(res.data.msg === '请求成功!') {
									res.data.data.forEach(function(item,index){
										if(item.meet_id === newRoomId) {
											that.roomImg = item.file_url
											that.pass = item.pass
										}
									})
								}
							}
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
				this.date = year + '-' + month + '-' + day
				this.start = year + '-' + month + '-' + day
			},
			
			// 获取会议室
			getMeet(name) {
				let baseUrl = this.WebUrl
				let that = this
				let i = 0
				uni.getStorage({
					key: "area_id",
					success:(res) => {
						console.log(res.data)
						uni.request({
							url: baseUrl + '/getMeet',
							data: {
								area_id: res.data
							},
							success(res) {
								console.log(res)
								res.data.data.forEach(function(item){
									that.room.push(item.meet_name)
									that.roomId[item.meet_name] = {id: item.meet_id}
									if(name !== item.meet_name) {
										i++
									}else {
										that.roomIndex = i
									}
								})
								
								that.record()
								that.getRoomImg()
							}
						})
					}
				})
			},
			
			// 获取预约记录
			record() {
				let baseUrl = this.WebUrl
				let that = this
				let newRoomId = ''
				let begin_id = -1
				let end_id = -1
				this.chenge = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
				for(let key in this.roomId){
					if(key === this.room[this.roomIndex]) {
						newRoomId = this.roomId[key].id
					}
				}
				let arr = that.room[that.roomIndex].split('')
				if (arr[0] === '睡' && arr[1] === '眠' && arr[2] === '舱'){
					that.showTheme = false
				}else {
					that.showTheme = true
				}
				uni.request({
					url: baseUrl + '/record',
					method: 'POST',
					data: {
						meet_id: newRoomId,
						date: that.date
					},
					success(res) {
						console.log(res)
						if(res.data.msg === "请求成功!") {
							res.data.data.forEach(function(item){
								for(let i = 0; i < that.time.length; i++){
									if (that.time[i] === item.begin_time) {
										begin_id = i
									}
									if (that.time[i] === item.end_time) {
										end_id = i
									}
								}
								for(let j = 0; j < that.chenge.length; j++){
									if (j >= begin_id && j < end_id){
										that.$set(that.chenge,j,that.chenge[j]?0:2)
									}
								}
							})
						}
					}
				})
			},
			
			// 提交数据
			reserve() {
				let baseUrl = this.WebUrl
				let that = this
				let newRoomId = ''
				let begin_id = -1
				let end_id = -1
				for(let key in this.roomId){
					if(key === this.room[this.roomIndex]) {
						newRoomId = this.roomId[key].id
					}
				}
				for(let time in this.chenge){
					console.log(this.chenge[time])
					if(this.chenge[time] === 1 && begin_id === -1) {
						begin_id = time
					}
					if(begin_id !== -1 && this.chenge[time] !== 1) {
						end_id = time
						break
					}
					if (time == 23 && this.chenge[time] === 1){
						end_id = 24
						break
					}
				}
				if(begin_id === -1) {
					uni.showModal({
						title: "提示",
						content: "请选择预定时间",
						showCancel: false
					})
				}else{
					uni.getStorage({
						key: 'u_id',
						success:(res) => {
							uni.request({
								url: baseUrl + '/reserve',
								method: 'POST',
								data: {
									meet_id: newRoomId,
									date: that.date,
									begin_time: this.time[begin_id],
									end_time: this.time[end_id],
									theme: that.theme,
									u_id: res.data
								},
								success(res) {
									console.log(res)
									if(res.data.msg === '请求成功!') {
										res.data.msg = '预约成功'
									}
									uni.showModal({
										title: "提示",
										content: res.data.msg + ',门禁密码:' + that.pass,
										showCancel: false,
										success(resd) {
											if(resd.confirm) {
												if (res.data.msg === '预约成功'){
													uni.navigateBack({
														delta: 1
													})
												}
											}
										}
									})
								}
							})
						}
					})
				}
			},
			
			// 点击时间
			clickTime(i){
				let begin = false
				let thisTrue = 0
				if(this.chenge[i] === 0){
					for (let item = 0 ; item < this.chenge.length; item++){
						if(this.chenge[item] === 1){
							if (item === i){
								this.$set(this.chenge,i,1)
								break
							}else if(item > i){
								for (let j = i ; j < item; j++){
									if(this.chenge[j] === 2){
										uni.showModal({
											title: "提示",
											content: "不可以",
											showCancel: false
										})
										break
									}else{
										thisTrue++
									}
								}
								for(thisTrue; thisTrue >= 0; thisTrue--){
									this.$set(this.chenge,item-thisTrue,1)
								}
							}else {
								for (let j = item ; j < i; j++){
									if(this.chenge[j] === 2){
										uni.showModal({
											title: "提示",
											content: "不可以",
											showCancel: false
										})
										break
									}else{
										thisTrue++
									}
								}
								for(thisTrue; thisTrue >= 0; thisTrue--){
									console.log(this.chenge[i])
									this.$set(this.chenge,i-thisTrue,1)
								}
							}
							begin = false
							break
						}else {
							begin = true
						}
					}
				}else if (this.chenge[i] === 1){
					for (let item = 0 ; item < this.chenge.length; item++){
						if(this.chenge[item] === 1){
							if (item === i){
								this.$set(this.chenge,i,0)
								begin = false
								break
							}else if(item > i){
								for (let j = i ; j < item; j++){
									if(this.chenge[j] === 2){
										uni.showModal({
											title: "提示",
											content: "不可以",
											showCancel: false
										})
										break
									}else{
										thisTrue++
									}
								}
								for(thisTrue; thisTrue >= 0; thisTrue--){
									this.$set(this.chenge,item-thisTrue,0)
								}
							}else {
								for (let j = item ; j < i; j++){
									if(this.chenge[j] === 2){
										uni.showModal({
											title: "提示",
											content: "不可以",
											showCancel: false
										})
										break
									}else{
										thisTrue++
									}
								}
								for(thisTrue; thisTrue >= 0; thisTrue--){
									console.log(this.chenge[i])
									this.$set(this.chenge,i-thisTrue,0)
								}
							}
							begin = false
							break
						}else {
							begin = true
						}
					}
				}else {
					uni.showModal({
						title: "提示",
						content: "该段时间已被预订,请您预约其他时间",
						showCancel: false
					})
				}
				if(begin){
					this.$set(this.chenge,i,this.chenge[i]?0:1)
				}
				console.log(this.chenge)
			},
			
			// 获取主题
			themeValue(e){
				this.theme = e.target.value
			},
		},
		onLoad(options) {
			this.getMeet(options.meet_name)
			
			this.getToday()
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FCFCFC;
	}
	
	.roomItem {
		height: 100%;
		background-size:100%;
		background-repeat: no-repeat;
		background-position:center;
	}
	
	.box {
		background: #FFFFFF;
		height: 100rpx;
		margin-bottom: 4rpx;
		display: flex;
		justify-content: space-between;
		font-size: 24rpx;
		color: #333333;
		
		.boxTitle {
			margin-left: 30rpx;
			line-height: 100rpx;
		}
		
		.boxRight {
			display: flex;
			margin-right: 30rpx;
			
			.boxPicker {
				height: 100rpx;
				line-height: 100rpx;
				margin-right: 15rpx;
			}
			
			.ic-Return {
				line-height: 100rpx;
			
				image {
					width: 16rpx;
					height: 26rpx;
				}
			}
		}
	}
	
	.chengeBox {
		background: #FFFFFF;
		margin-bottom: 4rpx;
		padding: 30rpx;
		
		.chengeTitle {
			margin-bottom: 17rpx;
			font-size: 24rpx;
			color: #333333;
		}
		
		.chengeTimeScroll {
			height: 160rpx;
			
			.chengeTime {
				display: flex;
				margin: 30rpx 0 0 50rpx;
				border-bottom: none;
				width: 2880rpx;
				
				.chengeTimeBox {
					height: 80rpx;
					width: 120rpx;
					background-color: #DFDFDF;
				}
				
				.color {
					background-color: #191970;
				}
				
				#booked {
					background-color: #4E54C8;
				}
			}
			
			.thisTime {
				display: flex;
				border-top: 1rpx solid #000000;
				padding-top: 10rpx;
				width: 3000rpx;
				
				.thisTimeBox {
					width: 100rpx;
					margin-right: 20rpx;
					font-size: 24rpx;
					color: #333333;
					text-align: center;
				}
			}
		}
	}
	
	.theme {
		background: #FFFFFF;
		height: 100rpx;
		margin-bottom: 4rpx;
		padding: 30rpx;
		
		.themeTitle {
			margin-bottom: 17rpx;
			font-size: 24rpx;
			color: #333333;
		}
		
		.themePlaceholder {
			font-size: 24rpx;
		}
	}
	
	.people {
		background: #FFFFFF;
		height: 100rpx;
		margin-bottom: 4rpx;
		display: flex;
		font-size: 24rpx;
		color: #333333;
		
		.peopleTitle {
			margin-left: 30rpx;
			line-height: 100rpx;
		}
		
		.peopleRight {
			
			.peoplePicker {
				height: 100rpx;
				line-height: 100rpx;
				margin-left: 15rpx;
			}
		}
	}
	
	.button {
		width: 700rpx;
		height: 100rpx;
		line-height: 100rpx;
		background-color: #4E54C8;
		font-size: 36rpx;
		color: #FFFFFF;
		margin-top: 15rpx;
	}
</style>
