<template>
  <div>
    <HomeManage v-if="curMenuText === '家管理'"/>
    <AllEquipment v-on:listenSpin="toggleSpin" :AddList="AddList" :deviceTypeList="deviceTypeList" :MasterControlList="MasterControlList" :curHomeId="curHomeId" v-if="curMenuText === '所有设备'"/>
    <EquipmentByRoom :curHomeId="curHomeId" v-if="curMenuText === '按房间分类'"/>
    <EquipmentByKind :curHomeId="curHomeId" v-if="curMenuText === '按类别分类'"/>
    <Setting v-if="curMenuText === '个人设置'"/>
    <Automation v-if="curMenuText === '自动化'" :curHomeId="curHomeId"/>
    <Scene v-if="curMenuText === '场景'" :curHomeId="curHomeId"/>
    <FeedBack v-if="curMenuText === '意见反馈'"/>
    <Problem v-if="curMenuText === '常见问题'"/>
    <!-- <Automation v-if="curMenuText === '自动化'" :curHomeId="curHomeId"/>
    <Scene v-if="curMenuText === '场景'" :curHomeId="curHomeId"/> -->
    <Article v-if="curMenuText === '适玩'"/>
    <HaoPin v-if="curMenuText === '好品'"/>
    <Message v-if="curMenuText === '我的消息'" :curHomeId="curHomeId"/>
    <SPIN v-if="ifSpin"/>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {send} from '../util/send'
import HomeManage from './cons/HomeManage.vue'
import AllEquipment from './cons/AllEquipment.vue'
import EquipmentByRoom from './cons/EquipmentByRoom.vue'
import EquipmentByKind from './cons/EquipmentByKind/EquipmentByKind.vue'
import FeedBack from './cons/FeedBack.vue'
import Problem from './cons/Problem.vue'
// import Automation from './cons/Automation.vue'
// import Scene from './cons/Scene.vue'
import Article from './cons/Article.vue'
import HaoPin from './cons/HaoPin.vue'
import Setting from './cons/Center/Setting.vue'
import Automation from './cons/Center/Automation.vue'
import Scene from './cons/Center/Scene.vue'
import Message from './cons/Center/Message.vue'
import SPIN from './Spin.vue'
export default {
  name: 'Content',
  props: ['curHomeId'],
  data () {
    return {
      AddList: [],
      MasterControlList: [],
      deviceTypeList: []
    }
  },
  computed: {
    ...mapState({
      curHome: state => state.curHome,
      ifSpin: state => state.ifSpin,
      curTab: state => state.sider.curTab,
      curMenu: state => state.sider.curMenu,
      curMenuText: state => state.sider.curMenuText
    })
  },
  watch: {
    curHome: function (val) {
      this.getMasterControl()
    }
  },
  components: {
    HomeManage,
    AllEquipment,
    EquipmentByRoom,
    EquipmentByKind,
    FeedBack,
    Problem,
    Article,
    HaoPin,
    Setting,
    Automation,
    Scene,
    Message,
    SPIN
  },
  created () {
    this.getAddList()
    this.getEQType()
    this.getMasterControl()
  },
  methods: {
    toggleSpin () {
      console.log('par---')
      this.ifSpin = !this.ifSpin
    },
    getAddList () {
      send({
        name: '/deviceType',
        method: 'GET',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.AddList = _res.data.deviceTypeList.data
            break
          default:
            this.$Message.error(_res.data.message)
        }
      }).catch((_res) => {
        console.log(_res)
        this.$Message.error('Interface Error!')
      })
    },
    // 所有主控
    getMasterControl () {
      send({
        name: '/mainControl?home_id=' + this.$store.state.curHome.home_id + '&register_id=' + this.$store.state.register_id,
        method: 'GET',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.MasterControlList = _res.data.homeList
            break
          default:
            this.$Message.error(_res.data.message)
        }
      }).catch((_res) => {
        console.log(_res)
        this.$Message.error('Interface Error!')
      })
    },
    // 设备类型
    getEQType () {
      send({
        name: '/deviceTypeScan',
        method: 'GET',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.deviceTypeList = _res.data.deviceTypeList
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
<style scoped>
</style>
