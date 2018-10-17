<template>
  <div class="com-app" style="height: 100%;">
    <transition>
        <router-view class="child-view"></router-view>
    </transition>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {getRegisterId, getAccount} from './util/send'

export default {
  name: 'App',
  data () {
    return {
      isCollapsed: false,
      windowHeight: 0
    }
  },
  created () {
    this.windowHeight = window.innerHeight
    this.changeCurRegisterId(getRegisterId())
    this.changeCurAccountPhone(getAccount())
  },
  computed: {
    ...mapState({
      curTab: state => state.sider.curTab
    })
  },
  components: {
  },
  methods: {
    ...mapActions([
      'changeCurRegisterId',
      'changeCurAccountPhone'
    ])
  }
}
</script>

<style lang="css" scoped>
.child-view{
  height: 100%;
  overflow: hidden;
}
</style>
