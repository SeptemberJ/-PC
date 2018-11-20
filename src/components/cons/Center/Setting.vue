<template>
  <div class="setting">
    <Row style="padding-right: 34px;">
      <Col span="10"><h1>个人设置</h1></Col>
    </Row>
    <Row style="margin: 40px 0px;">
      <Col span="12" style="background: #fff;padding: 20px 0;">
        <Row>
          <Col span="9">
            <img class="Avatar CursorPointer" :src="Avatar" @click="changeAvatar">
            <p class="TextAlignC MarginT_10 CursorPointer" @click="changeAvatar">点击修改</p>
          </Col>
          <Col span="15">
            <h3 class="CursorPointer">昵称：{{NickName}} <span class="ColorRed MarginL_10" @click="changeNickName">编辑</span></h3>
            <h3>账户：{{accountPhone}}</h3>
            <Button icon="ios-create-outline" type="primary" class="MarginT_20" @click="changePsd">修改密码</Button>
          </Col>
        </Row>
      </Col>
    </Row>
    <!-- 修改头像 -->
    <Modal v-model="ifChangeAvatar" scrollable width="450">
      <p slot="header" style="color:#333;text-align:left">
        <span>修改头像</span>
      </p>
      <div style="text-align:left">
        <Row>
          <Col span="24" class="TextAlignC">
            <div v-if="newAvatarBase64 != ''" >
              <img :src="newAvatarBase64" style="width: 100px;height: 100px;">
            </div>
          </Col>
          <Col span="24" class="TextAlignC">
            <Upload
              ref="upload"
              :show-upload-list="false"
              :on-success="handleSuccess"
              :format="['jpg','jpeg','png']"
              :max-size="2048"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :before-upload="handleBeforeUpload"
              action=""
              style="display: inline-block;">
              <div style="padding: 20px 0" v-if="newAvatarBase64 == ''">
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                <p>选择上传的图片</p>
              </div>
              <Button icon="ios-cloud-upload-outline" size="small" style="margin-top: 25px !important" v-if="newAvatarBase64 != ''">选择上传的图片</Button>
            </Upload>
          </Col>
        </Row>
      </div>
      <div slot="footer" class="TextAlignC">
          <Button type="error" size="large" :loading="btLoading" @click="saveAvatar">
            <span v-if="!btLoading">确认添加</span>
            <span v-else>Loading...</span>
          </Button>
      </div>
    </Modal>
    <!-- 修改密码 -->
    <Modal v-model="ifChangePsd" scrollable width="450">
      <p slot="header" style="color:#333;text-align:left">
        <span>修改密码</span>
      </p>
      <div style="text-align:left">
        <Row>
          <Form :label-width="80">
            <FormItem label="原密码">
              <Input type="password" v-model="oldPsd" placeholder="请输入原密码..." />
            </FormItem>
            <FormItem label="新密码">
              <Input type="password" v-model="newPsd" placeholder="请输入新密码..." />
            </FormItem>
            <FormItem label="确认密码">
              <Input type="password" v-model="newPsdAgain" placeholder="请再次输入新密码..." />
            </FormItem>
          </Form>
        </Row>
      </div>
      <div slot="footer" class="TextAlignC">
          <Button type="error" size="large" :loading="btLoading" @click="savePsd">
            <span v-if="!btLoading">保存</span>
            <span v-else>Loading...</span>
          </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {Decrypt, Encrypt} from '../../../util/util'
import {send} from '../../../util/send'
// import NoData from '../../NoData.vue'
export default {
  name: 'Setting',
  data () {
    return {
      btLoading: false,
      ifChangeAvatar: false,
      ifChangePsd: false,
      newAvatar: '',
      newAvatarBase64: '',
      newNickName: '',
      oldPsd: '',
      newPsd: '',
      newPsdAgain: '',
      NickName: '',
      Avatar: ''
      // hasNewAvatar: false,
      // hasNewNickName: false
    }
  },
  computed: {
    ...mapState({
      accountPhone: state => state.accountPhone,
      register_id: state => state.register_id,
      urlPre_upload: state => state.urlPre_upload
    })
    // NickName: function () {
    //   return localStorage['NickName']
    // },
    // Avatar: function () {
    //   return localStorage['Avatar']
    // }
  },
  watch: {
    // NickName: function (val) {
    //   console.log('NickName----------')
    //   debugger
    //   console.log(val)
    //   debugger
    // }
  },
  components: {
  },
  created () {
    this.getAccountInfo()
  },
  methods: {
    changeNickName () {
      this.$Modal.confirm({
        onOk: () => {
          this.updateNickName()
        },
        render: (h) => {
          return h('div', [
            h('h4', {
              style: {
                marginBottom: '10px'
              }
            }, '新昵称'),
            h('Input', {
              props: {
                // value: this.newNickName === '' ? Room.house_name : this.newRoomName,
                autofocus: true,
                placeholder: '请输入新的昵称...'
              },
              on: {
                input: (val) => {
                  this.newNickName = val
                }
              }
            })
          ])
        }
      })
    },
    updateNickName () {
      send({
        name: '/updatePC?mobile=' + this.accountPhone + '&head_pic=' + this.Avatar + '&fnickname=' + this.newNickName,
        method: 'POST',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            // setNickName(this.newNickName)
            // this.hasNewNickName = true
            this.getAccountInfo()
            this.$Message.success('昵称修改成功!')
            break
          default:
            this.$Message.error(_res.data.message)
        }
      }).catch((res) => {
        this.$Message.error('Interface Error!')
      })
    },
    changePsd () {
      this.ifChangePsd = true
    },
    changeAvatar () {
      this.ifChangeAvatar = true
    },
    handleBeforeUpload (event) {
      var _this = this
      var file = event
      var reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function (e) {
        _this.newAvatarBase64 = this.result
        let reg = /^data:image\/(jpeg|png|gif);base64,/
        let jiequ = this.result.replace(reg, '')
        send({
          // name: '/uploadBase64?imgStr=' + encodeURIComponent(jiequ),
          name: '/uploadBase64',
          method: 'POST',
          data: {
            'imgStr': encodeURIComponent(jiequ)
          }
        }).then(_res => {
          switch (_res.data.result) {
            case 1:
              _this.newAvatar = _this.urlPre_upload + _res.data.fileName
              break
            default:
              _this.$Message.error(_res.data.message)
          }
        }).catch((res) => {
          _this.$Message.error('Interface Error!')
        })
      }
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: '图片格式警告',
        desc: '您上传的图片文件格式不支持!'
      })
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '图片大小警告',
        desc: '您上传的图片太大了, 请不要超过2M!'
      })
    },
    handleView (name) {
    },
    handleRemove (file) {
      this.homePicture = ''
    },
    handleSuccess (res, file) {
    },
    saveAvatar () {
      send({
        name: '/updatePC?mobile=' + this.accountPhone + '&head_pic=' + this.newAvatar + '&fnickname=' + this.NickName,
        method: 'POST',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            // setAvatar(this.newAvatar)
            // this.hasNewAvatar = true
            this.getAccountInfo()
            this.ifChangeAvatar = false
            this.$Message.success('头像修改成功!')
            break
          default:
            this.$Message.error(_res.data.message)
        }
      }).catch((res) => {
        this.$Message.error('Interface Error!')
      })
    },
    savePsd () {
      if (Decrypt(localStorage['openCode']) !== this.oldPsd) {
        this.$Message.error('原密码不正确！')
        return false
      }
      if (this.newPsd !== this.newPsdAgain) {
        this.$Message.error('两次输入的密码不一致！')
        return false
      }
      send({
        name: '/backFpassword?mobile=' + this.accountPhone + '&fpasswordOld=' + this.oldPsd + '&fpasswordNew=' + this.newPsd,
        method: 'POST',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            localStorage['openCode'] = Encrypt(this.newPsd.toString())
            this.ifChangePsd = false
            this.$Message.success('密码修改成功!')
            break
          default:
            this.$Message.error(_res.data.message)
        }
      }).catch((res) => {
        this.$Message.error('Interface Error!')
      })
    },
    getAccountInfo () {
      send({
        name: '/registerInfo?registerid=' + this.register_id,
        method: 'GET',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.Avatar = _res.data.registerInfo.head_pic
            this.NickName = _res.data.registerInfo.fnickname
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
<style lang="less" scoped>
.setting{
  margin: 10px 0;
  h1, h3{
    color: #fff;
  }
  h3{
    color: #000;
    height: 30px;
  }
  .Avatar{
    width: 100px;
    height: 100px;
    margin: 0 auto;
    display: block;
    border-radius: 50%;
  }
}
</style>
