<template>
  <div class="com-app">
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
/*.layout{
  border: 0px solid #d7dde4;
  background: #2d8cf0;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  height: 600px
}
.layout-header-bar{
  background: #fff;
  box-shadow: 0 1px 1px rgba(0,0,0,.1);
}
.layout-logo-left{
  width: 90%;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  margin: 15px auto;
}
.menu-icon{
  transition: all .3s;
}
.rotate-icon{
  transform: rotate(-90deg);
}
.menu-item span{
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width .2s ease .2s;
}
.menu-item i{
  transform: translateX(0px);
  transition: font-size .2s ease, transform .2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span{
  width: 0px;
  transition: width .2s ease;
}
.collapsed-menu i{
  transform: translateX(5px);
  transition: font-size .2s ease .2s, transform .2s ease .2s;
  vertical-align: middle;
  font-size: 22px;
}
.mainContent{
  background: #fff !important;
}*/
</style>
