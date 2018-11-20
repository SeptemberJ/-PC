<template>
	<div class="Login" :style="{minHeight: windowHeight + 'px'}">
		<h1>SmarHox</h1>
		<div class="loginItem">
			<Input v-model="phone" placeholder="请输入手机号..." @on-blur="checkPhoneNumber" style="width: 300px" />
		</div>
		<div class="loginItem">
			<Input type="password" v-model="psd" placeholder="请输入密码..." style="width: 300px" />
		</div>
    <div class="loginItem">
      <div class="operationBar">
        <Button type="text" ghost @click="forgetPsd">忘记密码</Button>
        <Button type="text" ghost @click="goSign(0)">去注册</Button>
      </div>
    </div>
		<div class="loginItem" style="margin-top: 5px;">
			<div class="loginBt"><Button style="background: yellow;width: 100%; font-weight: bold;" shape="circle" @click="goLogin">登陆</Button></div>
		</div>
		<!-- <div class="loginItem">
      <div class="operationBar">
        <p class="">其他方式登陆</p>
        <p class="MarginT_10">
          <img class="ThirdIcon" src="../../static//img/icons/qq.png" @click="QQLogin">
          <img style="width:30px;height:30px;" src="../../static//img/icons/wechat.png">
        </p>
      </div>
		</div> -->
	</div>
</template>
<script type="text/javascript"  charset="utf-8" src="http://connect.qq.com/qc_jssdk.js" data-appid="101518980" data-redirecturi="http://btzoon.com/api/oauth/QQ/callback.php"></script>
<script>
import { mapState, mapActions } from 'vuex'
import {send, setRegisterId, setAccount, setNickName, setAvatar} from '../util/send'
import {setCookie, Encrypt} from '../util/util'

export default {
  name: 'Home',
  data () {
    return {
      phone: '',
      psd: ''
    }
  },
  created () {
    this.windowHeight = window.innerHeight
  },
  computed: {
    ...mapState({
      register_id: state => state.register_id
    })
  },
  methods: {
  	...mapActions([
      'changeCurRegisterId',
      'changeCurAccountPhone'
    ]),
  	// 检测用户注册状态
  	checkPhoneNumber () {
  		if (!/^1[34578]\d{9}$/.test(this.phone)) {
    		this.$Message.error('手机号格式不正确!')
    		return false
    	}
    	send({
	        name: '/checkUserPC?mobile=' + this.phone,
	        method: 'POST',
	        data: {
	        }
	      }).then(_res => {
	      	switch (_res.data.code) {
	      		case 0:
	      		this.goSign(0)
	      		break
	      		case 2:
	      			this.goSign(1)
	      		break
	      	}
	      }).catch((res) => {
	        this.$Message.error('Interface Error!')
	      })
  	},
  	forgetPsd () {
  		this.goSign(1)
  	},
    goSign (type) {
      this.$router.push({name: 'Sign', params: { type: type || 0 }})
    },
    goLogin () {
    	if (this.phone.trim() === '') {
    		this.$Message.error('请输入手机号!')
    		return false
    	}
    	if (!/^1[34578]\d{9}$/.test(this.phone)) {
    		this.$Message.error('手机号格式不正确!')
    		return false
    	}
    	if (this.psd.trim() === '') {
    		this.$Message.error('请输入密码!')
    		return false
    	}
    	send({
        name: '/userLoginPC?mobile=' + this.phone + '&fpassword=' + this.psd,
        method: 'POST',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.$Message.success('登陆成功！')
            let cookieStr = this.phone.toString() + this.psd.toString()
			      setCookie('btznkz', Encrypt(cookieStr), 2)
            localStorage['openCode'] = Encrypt(this.psd.toString())
			      this.changeCurRegisterId(_res.data.memberInfo.id)
            this.changeCurAccountPhone(_res.data.memberInfo.ftelephone)
			      this.checkIfHasHome(_res.data.memberInfo.id)
            setRegisterId(_res.data.memberInfo.id)
            setAccount(_res.data.memberInfo.ftelephone)
            setNickName(_res.data.memberInfo.fnickname ? _res.data.memberInfo.fnickname : '--')
            setAvatar(_res.data.memberInfo.head_pic ? _res.data.memberInfo.head_pic : 'https://i.loli.net/2017/08/21/599a521472424.jpg')
            break
          case 2:
            this.$Message.error(_res.data.message)
            break
          default:
          	this.$Message.error(_res.data.message)
        }
      }).catch((res) => {
        this.$Message.error('Interface Error!')
      })
    },
    checkIfHasHome (RegisterId) {
    	send({
        name: '/home?register_id=' + RegisterId,
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
    },
    // QQ登陆
    QQLogin () {
      const oOpts = {
        appId: '101518980',
        redirectURI: 'http://btzoon.com/dist/znkz'
      }
      QC.Login.showPopup(oOpts)
    }
  }
}
</script>

<style lang="less">
.Login{
	width: 100%;
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
    flex-direction: column;
		margin-top: 30px;
		.loginBt{
			width: 300px;
			margin-top:0px;
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
      p{
        color: #fff;
        text-align: left;
      }
      .ThirdIcon{
        width:30px;
        height:30px;
        cursor: pointer;
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
