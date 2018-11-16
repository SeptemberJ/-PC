<template>
  <Menu :active-name="curMenu" theme="primary" width="auto" :class="menuitemClasses" @on-select="changeMenu">
    <!--  <MenuItem name="logo"><img class="logo" src="../../static/img/Logo.png"></MenuItem> -->
    <img class="logo" src="../../static/img/Logo.png">
   <!-- <h1 class="weightNormal">{{curTab == 0 ? '家管理' : (curTab == 1 ? '设备管理' : (curTab == 2 ? '好品' : (curTab == 3 ? '适玩' : '个人中心')))}}</h1> -->
    <h1 class="weightNormal">{{menuList[curTab].tit}}</h1>
    <MenuItem v-show="curTab != 0" :name="idx" v-for="(menu, idx) in menuList[curTab].menu" :key="idx">
      <Icon :type="menu.icon"></Icon>
      <span>{{menu.text}}</span>
    </MenuItem>
<!--     <MenuItem :name="0" v-show="curTab == 0">
      <Icon type="md-home"></Icon>
      <span>家管理</span>
    </MenuItem>
    <template slot="title">
      <Icon type="ios-paper" />
      所有设备
    </template>
    <MenuItem :name="1" v-show="curTab == 0">
      <Icon type="md-home"></Icon>
      <span>所有设备</span>
    </MenuItem>
    <MenuItem :name="2" v-show="curTab == 0">
      <Icon type="md-home"></Icon>
      <span>按房间分类</span>
    </MenuItem>
    <MenuItem :name="3" v-show="curTab == 0">
      <Icon type="md-home"></Icon>
      <span>按类别分类</span>
    </MenuItem> -->
    <MenuItem :name="0" v-show="curTab == 0">
      <Icon type="md-home"></Icon>
      <span>家管理</span>
    </MenuItem>
    <Submenu :name="11" v-show="curTab == 0">
      <template slot="title">
        <Icon type="logo-windows" />
        设备管理
      </template>
      <MenuItem :name="1">
        <Icon type="md-cube"></Icon>
        <span>所有设备</span>
      </MenuItem>
      <MenuItem :name="2">
        <Icon type="ios-grid"></Icon>
        <span>按房间分类</span>
      </MenuItem>
      <MenuItem :name="3">
        <Icon type="md-list"></Icon>
        <span>按类别分类</span>
      </MenuItem>
    </Submenu>
  </Menu>
</template>

<script>
import {mapState, mapActions} from 'vuex'
export default {
  name: 'Sider',
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      menuList: state => state.sider.menuList,
      curTab: state => state.sider.curTab,
      curMenu: state => state.sider.curMenu
    }),
    menuitemClasses () {
      return [
        'menu-item',
        this.isCollapsed ? 'collapsed-menu' : ''
      ]
    }
  },
  methods: {
    changeMenu (idx) {
      this.changeCurMenu(idx)
    },
    ...mapActions('sider', [
      'changeCurMenu'
    ])
  }
}
</script>
<style scoped>
.logo{
  height: 80px;
  width: 170px;
}
.weightNormal{
  font-size: 2.5em;
  font-weight: normal;
  margin: 5px 0 10px 0;
}
.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu){
  font-size: 18px;
  background: #fff;
}
.ivu-menu{
  text-align: center;
}
.ivu-menu-item{
  text-align: center;
  /*padding-right: 30px*/
}
.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu):after{
  background: transparent !important;
}
/*.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active[data-v-fcd3770a]:not(.ivu-menu-submenu){
  background: transparent !important;
}*/
</style>
