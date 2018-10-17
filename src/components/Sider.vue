<template>
  <Menu :active-name="curMenu" theme="primary" width="auto" :class="menuitemClasses" @on-select="changeMenu">
    <MenuItem name="logo"><img class="logo" src="../../static/img/Logo.png"></MenuItem>
    <MenuItem :name="idx" v-for="(menu, idx) in menuList[curTab].menu" :key="idx">
      <Icon :type="menu.icon"></Icon>
      <span>{{menu.text}}</span>
    </MenuItem>
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
  height: 50px;
  width: 106px;
}
.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu){
  font-size: 18px;
  background: #fff;
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
