<template>
  <div>
    <HomeManage v-if="curMenuText === '家列表'"/>
    <AllEquipment v-if="curMenuText === '所有设备'"/>
    <EquipmentByRoom v-if="curMenuText === '房间'"/>
    <EquipmentByKind v-if="curMenuText === '类别'"/>
    <FeedBack v-if="curMenuText === '意见反馈'"/>
    <Problem v-if="curMenuText === '常见问题'"/>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import HomeManage from './cons/HomeManage.vue'
import AllEquipment from './cons/AllEquipment.vue'
import EquipmentByRoom from './cons/EquipmentByRoom.vue'
import EquipmentByKind from './cons/EquipmentByKind.vue'
import FeedBack from './cons/FeedBack.vue'
import Problem from './cons/Problem.vue'
export default {
  name: 'Content',
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      curMenu: state => state.sider.curMenu,
      curMenuText: state => state.sider.curMenuText
    })
  },
  components: {
    HomeManage,
    AllEquipment,
    EquipmentByRoom,
    EquipmentByKind,
    FeedBack,
    Problem
  },
  methods: {
  }
}
</script>
<style scoped>
</style>
