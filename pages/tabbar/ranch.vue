<template>
	<view class="page">
		<view class="dynamicEvery">
			<view class="dynamic">
				<view class="dynamicOne" :class="[ dynamic1 === true ? 'dynamicClass1' : '' ]" @tap="tapInformation(1)">
					资源预定
				</view>
				<!-- <view class="dynamicOne" :class="[ dynamic2 === true ? 'dynamicClass1' : '' ]" @tap="tapInformation(2)">
					云打印
				</view>
				<view class="dynamicOne" :class="[ dynamic3 === true ? 'dynamicClass1' : '' ]" @tap="tapInformation(3)">
					增值服务
				</view> -->
			</view>
			
			<view>
				<image class="dynamicImg" :class="dynamicImgChange" :src="ImgUrl + 'static/ranch/selection.png'"></image>
			</view>
		</view>
		
		<!-- 资源预定 -->
		<view v-if="type === 'a'">
			<view class="screen">
				<view class="screenOne">
					全部
				</view>
				<view class="screenOne">
					<picker class="screenOnePicker" mode="selector" @change="floorChange" :value="floorIndex" :range="floor">
						<view>{{floor[floorIndex]}}</view>
					</picker>
					<image :src="ImgUrl + 'static/ranch/down.png'"></image>
				</view>
				<view class="screenOne">
					<picker class="screenOnePicker" mode="selector" @change="numChange" :value="numIndex" :range="num">
						<view>{{num[numIndex]}}</view>
					</picker>
					<image :src="ImgUrl + 'static/ranch/down.png'"></image>
				</view>
			</view>
			
			<view>
				<view class="box" v-for="item in room" :key="item" @tap="toRoom(item)">
					<view class="imgBox">
						<image class="img" :src="item.file_url"></image>
					</view>
					<view class="txtBox">
						<view class="txtTitle">{{item.meet_name}}</view>
						<view class="txtLabel">
							<view class="txtLabelText">{{item.floor}}楼</view>
							<view class="txtLabelText">{{item.num}}人</view>
						</view>
						<view class="txtUse">{{item.status}}</view>
						<view class="txtIntegral">{{item.integral}}积分</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 云打印 -->
		<view v-if="type === 'b'">
			<view class="printing" @click="scanCode">
				<image :src="ImgUrl + 'static/ranch/printing1.png'"></image>
				打印
			</view>
			<view class="printing">
				<image :src="ImgUrl + 'static/ranch/printing2.png'"></image>
				复印
			</view>
			<view class="printing">
				<image :src="ImgUrl + 'static/ranch/printing3.png'"></image>
				扫描
			</view>
		</view>
		
		<!-- 增值服务 -->
		<view v-if="type === 'c'">
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dynamic1: true,
				dynamic2: false,
				dynamic3: false,
				type: "a",
				dynamicImgChange: "dynamicImg1",
				room: [],
				floor: [],
				floorIndex: 0,
				floorId: {},
				newFloorId: '',
				num: [],
				numIndex: 0,
				numId: {},
				newNumId: '',
				ImgUrl: this.ImgUrl
			}
		},
		methods: {
			//切换内容
			tapInformation(e) {
				if (e == 1) {
					this.dynamic1 = true;
					this.dynamic2 = false;
					this.dynamic3 = false;
					this.type = "a";
					this.dynamicImgChange = "dynamicImg1"
				} else if (e == 2) {
					this.dynamic1 = false;
					this.dynamic2 = true;
					this.dynamic3 = false;
					this.type = "b";
					this.dynamicImgChange = "dynamicImg2"
				}
				else if (e == 3) {
					this.dynamic1 = false;
					this.dynamic2 = false;
					this.dynamic3 = true;
					this.type = "c";
					this.dynamicImgChange = "dynamicImg3"
				}
			},
			
			// 获取会议室
			getMeet() {
				let baseUrl = this.WebUrl
				let that = this
				this.room = []
				uni.getStorage({
					key: "area_id",
					success:(res) => {
						console.log(res.data)
						uni.request({
							url: baseUrl + '/getData',
							data: {
								area_id: res.data,
								floor_id: that.newFloorId || '',
								num_id: that.newNumId || ''
							},
							success(res) {
								console.log(res)
								console.log('会议室')
								if(res.data.msg === '请求成功!') {
									res.data.data.forEach(function(item,index){
										that.room.push(item)
										console.log(item)
										that.room[index].file_url = that.ImgUrl + item.file_url[0]
									})
								}
							}
						})
					}
				})
			},
			
			// 获取楼层
			getFloor() {
				let baseUrl = this.WebUrl
				let that = this
				this.floor = ["区域"]
				uni.getStorage({
					key: "area_id",
					success:(res) => {
						console.log(res.data)
						uni.request({
							url: baseUrl + '/getFloor',
							data: {
								area_id: res.data
							},
							success(res) {
								console.log(res)
								if(res.data.msg === '请求成功!') {
									res.data.data.forEach(function(item){
										let name = item.dict_name
										that.floor.push(name + "楼")
										that.floorId[name + "楼"] = {id: item.dict_id}
									})
								}
							}
						})
					}
				})
			},
			
			// 获取人数
			getNum() {
				let baseUrl = this.WebUrl
				let that = this
				this.num = ["人数"]
				uni.getStorage({
					key: "area_id",
					success:(res) => {
						console.log(res.data)
						uni.request({
							url: baseUrl + '/getNum',
							data: {
								area_id: res.data
							},
							success(res) {
								console.log(res)
								console.log(33333)
								if(res.data.msg === '请求成功!') {
									res.data.data.forEach(function(item){
										let num = item.dict_name
										that.num.push(num + "人")
										that.numId[num + "人"] = {id: item.dict_id}
									})
								}
							}
						})
					}
				})
			},
			
			// 跳转到会议室
			toRoom(e) {
				let meet_name = e.meet_name
				uni.navigateTo({
					url: '../ranch/room?meet_name=' + meet_name
				});
			},
			
			// 切换楼层
			floorChange(e) {
				this.floorIndex = e.target.value
				let newFloorId = ''
				for(let key in this.floorId){
					if(key === this.floor[this.floorIndex]) {
						newFloorId = this.floorId[key].id
					}
				}
				this.newFloorId = newFloorId
				this.getMeet()
			},
			
			// 切换人数
			numChange(e) {
				this.numIndex = e.target.value
				let newNumId = ''
				for(let key in this.numId){
					if(key === this.num[this.numIndex]) {
						newNumId = this.numId[key].id
					}
				}
				this.newNumId = newNumId
				this.getMeet()
			},
			
			// 扫码
			scanCode() {
				wx.scanCode({
					onlyFromCamera: true,
					success (res) {
						console.log(res)
					},
					fail (err) {
						console.log(err)
					}
				})
			}
		},
		onShow() {
			this.getMeet()
			
			this.getFloor()
			
			this.getNum()
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FCFCFC;
	}
	
	.dynamicEvery {
		width: 100%;
		background-color: #FFFFFF;
		
		.dynamic {
			padding-top: 20rpx;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			position: relative;
			
			.dynamicOne {
				font-size: 36upx;
				margin-left: 50upx;
			}
			
			.dynamicClass1 {
				font-weight: bold;
			}
		}
		
		.dynamicImg {
			width: 86rpx;
			height: 22rpx;
		}
		
		.dynamicImg1 {
			margin-left: 70upx;
		}
		
		.dynamicImg2 {
			margin-left: 250upx;
		}
		
		.dynamicImg3 {
			margin-left: 425upx;
		}
	}
	
	.screen {
		display: flex;
		justify-content: space-around;
		height: 80rpx;
		background-color: #FFFFFF;
		
		.screenOne {
			line-height: 96rpx;
			
			.screenOnePicker {
				display: inline-block;
			}
			
			image {
				width: 30rpx;
				height: 15rpx;
				margin-left: 20rpx;
				line-height: 100%;
			}
		}
	}
	
	.box {
		width: 86%;
		margin: 30rpx auto;
		background-color: #FFFFFF;
		padding: 30rpx;
		display: flex;
		box-shadow:0rpx 0rpx 4rpx 4rpx rgba(79,82,139,.1);
		
		.imgBox {
			width: 196rpx;
			height: 140rpx;
			
			.img {
				width: 100%;
				height: 100%;
				background-color: #000000;
			}
		}
		
		.txtBox {
			width: 60%;
			margin-left: 32rpx;
			
			.txtTitle {
				font-size: 32rpx;
				font-weight: bold;
				line-height: 55rpx;
				color: #333333;
			}
			
			.txtLabel {
				width: 100%;
				display: flex;
				flex-wrap: wrap;
				margin-left: -15rpx;
				margin-bottom: 10rpx;
				
				.txtLabelText {
					font-size: 22rpx;
					border-radius: 20rpx;
					border: 1rpx solid #4E54C8;
					color: #4E54C8;
					padding: 0 18rpx;
					margin: 13rpx 15rpx;
				}
			}
			
			.txtUse{
				float: left;
				font-size: 26rpx;
				color: #999999;
			}
			
			.txtIntegral {
				float: right;
				font-size: 26rpx;
				color: #4E54C8;
			}
		}
	}
	
	.printing {
		width: 460rpx;
		height: 160rpx;
		margin: 48rpx auto;
		background-color: #FFFFFF;
		border-radius: 15rpx;
		box-shadow:0rpx 0rpx 4rpx 4rpx rgba(79,82,139,.1);
		text-align: center;
		line-height: 160rpx;
		
		image {
			width: 62rpx;
			height: 66rpx;
			vertical-align: middle;
		}
	}
</style>
