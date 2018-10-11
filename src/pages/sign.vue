<template>
<div class="Sign">
	<div class="SignStepBar">
		<Steps :current="curStep">
			<Step :title="curStep == 0 ? '进行中':'已完成'" content="手机号验证"></Step>
			<Step :title="curStep == 0 ? '待进行':(curStep == 1 ? '进行中' : '已完成')" :content="sourceType == 0 ? '设置密码' : '重置密码'"></Step>
			<Step :title="curStep == 2 ? '进行中':'待进行'" :content="sourceType == 0 ? '注册成功' : '重置成功'"></Step>
		</Steps>
	</div>
	<Row class="SignBox">
		<Col v-if="curStep == 0" span="24" class="ItemBar bgColorRed">
			<Row class="ItemBarInner code-row-bg" type="flex" justify="space-between">
				<Col span="4"><div class="CircleIcon"><Icon type="md-phone-portrait" size="28" style="margin-left:5px;"/></div></Col>
				<Col span="20"><Input class="bgColorRed" v-model="phone" placeholder="请输入手机号..." style="width: 200px;" /></Col>
			</Row>
		</Col>
		<Col v-if="curStep == 0" span="24" class="ItemBar bgColorYellow">
			<Row class="ItemBarInner code-row-bg" type="flex" justify="space-between">
				<Col span="4"><div class="CircleIcon"><Icon type="ios-keypad" size="28" style="margin-left:5px;"/></div></Col>
				<Col span="15"><Input class="bgColorYellow" v-model="code" placeholder="请输入验证码..." style="width: 200px" /></Col>
				<Col span="5" class="TextAlignC code"><span @click="toGetCode">{{haGetCode?CountDown + 's':'获取验证码'}}</span></Col>
			</Row>
		</Col>
		<!-- step 2 -->
		<Col v-if="curStep == 1" span="24" class="ItemBar bgColorPink">
			<Row class="ItemBarInner code-row-bg" type="flex" justify="space-between">
				<Col span="4"><div class="CircleIcon"><Icon type="md-lock" size="28" style="margin-left:5px;"/></div></Col>
				<Col span="20"><Input class="bgColorPink" v-model="psd" placeholder="请输入密码..." style="width: 200px;" /></Col>
			</Row>
		</Col>
		<Col v-if="curStep == 1" span="24" class="ItemBar bgColorBlue">
			<Row class="ItemBarInner code-row-bg" type="flex" justify="space-between">
				<Col span="4"><div class="CircleIcon"><Icon type="md-unlock" size="28" style="margin-left:5px;"/></div></Col>
				<Col span="20"><Input class="bgColorBlue" v-model="psdAgain" placeholder="请再次输入密码..." style="width: 200px" /></Col>
			</Row>
		</Col>
		<Col v-if="curStep == 2" span="24" class="ItemBar">
			<h1 class="ColorWhite">{{sourceType == 0 ? '注册成功！' : '重置成功！'}}</h1>
		</Col>
		<Col span="24" class="ItemBar" style="background: #00e7af;">
			<Row class="ItemBarInner code-row-bg" type="flex" justify="space-between">
				<Col span="24" class="sureBt TextAlignC"><p style="width: 100%;height: 100%;" @click="nextStep">{{curStep == 2 ? '去登陆':'确认'}}</p></Col>
			</Row>
		</Col>
	</Row>
</div>
</template>

<script>
import {send} from '../util/send'
export default {
  name: 'Sign',
  data () {
    return {
    	sourceType: 0, // 0-常规注册 1-重置密码
      curStep: 0,
      phone: '',
      psd: '',
      psdAgain: '',
      haGetCode: false,
      code_R: '',
      code: '',
      CountDown: 60
    }
  },
  created () {
  	this.sourceType = this.$route.params.type
  },
  methods: {
    nextStep () {
    	switch (this.curStep) {
        case 0:
          // 验证码
          if (this.code_R.trim() === this.code.trim() && this.code_R.trim() !== '' && this.code.trim() !== '') {
          	this.curStep += 1
          } else {
          	this.$Message.error('验证码不正确！')
          }
          break
        case 1:
          // 设置密码
          if (this.psd.trim() === this.psdAgain.trim() && this.psd.trim() !== '' && this.psdAgain.trim() !== '') {
          	this.setPsd()
          } else {
          	this.$Message.error('两次输入的密码不一致！')
          }
          break
        case 2:
          this.$router.push({name: 'Login'})
          break
      }

      // if (this.curStep === 2) {
      //   this.$router.push({name: 'Login'})
      // } else {
      //   this.curStep += 1
      // }
    },
    toGetCode () {
      if (this.phone.trim() === '') {
      	this.$Message.error('请输入手机号！')
        return false
      }
      if (!(/^1[34578]\d{9}$/.test(this.phone))) {
      	this.$Message.error('手机号格式不正确！')
        return false
      }
      if (!this.haGetCode) {
        this.CountDownFN()
        this.getCode()
      }
    },
    CountDownFN () {
      let Timer = setTimeout(() => {
        this.CountDownFN()
      }, 1000)
      let num = this.CountDown
      if (num === 0) {
        clearTimeout(Timer)
        this.CountDown = 60
        this.haGetCode = false
        return false
      } else {
        this.CountDown -= 1
        this.haGetCode = true
      }
    },
    getCode () {
      send({
        name: '/checkMessage?mobile=' + this.phone,
        method: 'GET',
        data: {
        }
      }).then(_res => {
      	switch (_res.data.code) {
          case 1:
            this.code_R = _res.data.validateCode
            break
          default:
          	this.$Message.error(_res.data.message)
        }
      }).catch((res) => {
        this.$Message.error('Interface Error!')
      })
    },
    // 设置密码
    setPsd () {
      send({
        name: this.sourceType === 0 ? '/userInsertPC' : '/backFpassword' + '?mobile=' + this.phone + '&fpassword=' + this.psd,
        method: 'POST',
        data: {
        }
      }).then(_res => {
      	switch (_res.data.code) {
          case 1:
            this.curStep += 1
            break
          default:
          	this.$Message.error(_res.data.message)
        }
      }).catch((res) => {
        this.$Message.error('Interface Error!')
      })
    }
  }
}
</script>

<style lang="less">
@BoxWidth: 458px;
@BoxHeight: 300px;
@imgW: 38px;
@imgH: 38px;
@barH: 50px;
@barInnerH: @barH - 2 * 4px;
@bgColorRed: #ff818c;
@bgColorYellow: #f8e01c;
@bgColorGreen: #00e7af;
@bgColorPink: rgb(222, 189, 198);
@bgColorBlue: rgb(154, 186, 227);

.bgColorRed{
	background: @bgColorRed;
}
.bgColorYellow{
	background: @bgColorYellow;
}
.bgColorPink{
	background: @bgColorPink;
}
.bgColorBlue{
	background: @bgColorBlue;
}
.Sign{
	.SignStepBar{
		width: 800px;
		height: 80px;
		margin: 20px auto;
		transform: translateX(15%);
	}
	.SignBox{
		width: @BoxWidth;
		height: @BoxHeight;
		margin: 0 auto;
		background: #2d8cf0;
		border-radius: 12px;
		.ItemBar{
			width: 358px;
			height: @barH;
			border-radius: @barH / 2;
			margin: 25px 45px;
			padding: 4px;
		}
		.ItemBarInner{
			width: 350px;
			height: @barInnerH;
			border-radius: @barInnerH / 2;
			.code{
				cursor: pointer;
			}
			.sureBt{
				font-size: 18px;
				font-weight: bold;
				color: #fff;
				text-align: center;
				cursor: pointer;
			}
			.ivu-col{
				height: 100% !important;
				line-height: @barInnerH !important;
			}
			.CircleIcon{
				width: @imgW;
				height: @imgH;
				border-radius: 50%;
				background: #fff;
				margin-top: 2px;
				margin-left: 2px;
				overflow: hidden;
				img{
					width: @imgW;
					height: @imgH;
				}
			}
			input{
				height: @barInnerH;
				color: #fff;
				border: 0px !important;
				background: transparent;
			}
			input::-webkit-input-placeholder {
				color: #934040;
			}
		}
	}
}
.ivu-steps-item{
	width: 32% !important;
}
.ivu-input:focus{
	border: 2px solid #fff !important;
}
</style>
