<template>
	<div class="Login" :style="{minHeight: windowHeight + 'px'}">
		<h1>SmarHox</h1>
		<div class="loginItem">
			<Input v-model="phone" placeholder="请输入手机号..." style="width: 300px" />
		</div>
		<div class="loginItem">
			<Input v-model="psd" placeholder="请输入密码..." style="width: 300px" />
		</div>
		<div class="loginItem">
			<div class="loginBt"><Button style="background: yellow;width: 100%; font-weight: bold;" shape="circle" @click="goLogin">登陆</Button></div>
		</div>
		<div class="loginItem">
			<div class="operationBar">
				<Button type="text" ghost>忘记密码</Button>
				<Button type="text" ghost @click="goSign">去注册</Button>
			</div>
		</div>
	</div>
</template>

<script>
// import CryptoJS from 'crypto-js'
import {send} from '../util/send'
// import {setCookie, getCookie, Encrypt, Decrypt} from '../util/util'
import {setCookie, Encrypt} from '../util/util'

export default {
  name: 'Home',
  data () {
    return {
    	cityList: [
        {
          value: 'New York',
          label: 'New York'
        },
        {
          value: 'London',
          label: 'London'
        },
        {
          value: 'Sydney',
          label: 'Sydney'
        }
      ],
      model1: '',
      phone: '18234567890',
      psd: '111'
    }
  },
  created () {
    this.windowHeight = window.innerHeight
  },
  methods: {
    goSign () {
      this.$router.push({name: 'Sign'})
    },
    goLogin () {
      let cookieStr = this.phone.toString() + this.psd.toString()
      setCookie('btznkz', Encrypt(cookieStr), 6)
      this.checkIfHasHome()

      // let EncryptionName = CryptoJS.AES.encrypt('留白', this.$store.state.PlainText).toString()
      // let EncryptionId = CryptoJS.AES.encrypt('123', this.$store.state.PlainText).toString()
      // let EncryptionType = CryptoJS.AES.encrypt('0', this.$store.state.PlainText).toString()
      // localStorage.setItem('BT_name', EncryptionName)
      // localStorage.setItem('BT_id', EncryptionId)
      // localStorage.setItem('BT_type', EncryptionType)
      // this.$router.push({name: 'Home'})
    },
    checkIfHasHome () {
    	send({
        name: '/home?register_id=4dd928bab4a811e88d1a00163e11716c',
        method: 'GET',
        data: {
        }
      }).then(_res => {
        if (_res.data.homeList.length > 0) {
          this.$router.push({name: 'Home'})
        } else {
          this.$router.push({name: 'Guide'})
        }
      }).catch((res) => {
        this.$Message.error('Interface Error!')
      })
    }
  }
}
</script>

<style lang="less">
.Login{
	width: 100vw;
	height: 100vh;
	min-width: 1024px;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
  align-items: center;
	background: #2d8cf0;
	text-align: center;
	.loginItem{
		display: flex;
		justify-content: center;
		margin-top: 30px;
		.loginBt{
			width: 300px;
			margin-top:20px;
			margin: 0 auto;
		}
		.operationBar{
			width: 300px;
			margin: 0 auto;
			button{
				width: 150px;
				display: inline-block;
				&:nth-of-type(1){
					float: left;
					text-align: left;
				}
				&:nth-of-type(2){
					float: right;
					text-align: right;
					span{
						width: 100%;
						text-align: right;
					}
				}
			}
		}
	}
	h1{
		margin-top: 30px;
		color: #fff;
		font-size: 72px;
		font-family: "myfont" !important;
	}
}
</style>
