<template>
  <div class="Message">
    <Row style="margin: 40px 0px;padding-right: 34px;">
      <Col span="10"><h1>我的消息</h1></Col>
    </Row>
    <NoData v-if="messageList.length == 0"/>
    <Row  v-if="messageList.length > 0" style="padding-right: 34px;">
      <Col span="24" style="background: #fff;padding: 20px 10px;">
        <Row>
          <Col span="24" v-for="(Message, idx) in messageList" :key="idx" class="MarginB_10">
            <Alert type="warning" show-icon>
              {{Message.time}}
              <template slot="desc">
                设备“{{Message.deviceName}}”在{{Message.time}}的操作失败,原因为{{Message.tip}}
              </template>
            </Alert>
          </Col>
        </Row>
      </Col>
    </Row>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {send} from '../../../util/send'
import NoData from '../../NoData.vue'
export default {
  name: 'Message',
  props: ['curHomeId'],
  data () {
    return {
      messageList: []
    }
  },
  computed: {
    ...mapState({
      register_id: state => state.register_id
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
    NoData
  },
  created () {
    this.getMessage()
  },
  methods: {
    getMessage () {
      send({
        name: '/myMessage?home_id=' + this.curHomeId,
        method: 'GET',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            _res.data.devList.map((item) => {
              item.devStatus.map((message) => {
                if (message.fdevicestatus !== '00') {
                  let obj = {
                    time: message.faddtime,
                    deviceName: message.device_name,
                    tip: message.fdevicestatus === '01' ? '未连接' : (message.fdevicestatus === '02' ? '连接中断' : '测量点配置不符，控制点类型不符或控制点不存在')
                  }
                  this.messageList.push(obj)
                }
              })
            })
            break
          default:
            this.$Message.error(_res.data.message)
        }
      }).catch((_res) => {
        console.log(_res)
        this.$Message.error('Interface Error!')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.Message{
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
