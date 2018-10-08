<template>
<div class="footerTab">
  <Row style="height: 20px;background: #2d8cf0;">
    <Col span="6"><div :class="[curTab == 0 ? 'triangle_active' : 'triangle_normal']" style=""></div></Col>
    <Col span="6"><div :class="[curTab == 1 ? 'triangle_active' : 'triangle_normal']" style=""></div></Col>
    <Col span="6"><div :class="[curTab == 2? 'triangle_active' : 'triangle_normal']" style=""></div></Col>
  </Row>
  <Row>
    <Col span="6">
      <Card style="width:90%;margin-top: 10px;background: chocolate;color: #fff;cursor: pointer;">
        <div style="text-align:center" @click="changeTab(0)">
          <img style="height: 50px;" src="../../static/img/icons/tab_home.png">
          <h3>家管理</h3>
        </div>
      </Card>
    </Col>
    <Col span="6">
      <Card style="width:90%;margin-top: 10px;background: blueviolet;color: #fff;cursor: pointer;">
        <div style="text-align:center" @click="changeTab(1)">
          <img style="height: 50px;" src="../../static/img/icons/tab_eq.png">
          <h3>设备管理</h3>
        </div>
      </Card>
    </Col>
    <Col span="6">
      <Card style="width:90%;margin-top: 10px;background: cadetblue;color: #fff;cursor: pointer;">
        <div style="text-align:center" @click="changeTab(2)">
          <img style="height: 50px;" src="../../static/img/icons/tab_set.png">
          <h3>设置</h3>
        </div>
      </Card>
    </Col>
    <Col span="6">col-8</Col>
  </Row>
</div>
<!--   <div>
    <div :class="[ifShowTab ? 'footer_Toggle_show' : 'footer_Toggle_close']">
      <Row>
        <Col span="6" :class="[curTab == 0 ? 'activeTab' : 'tabItem']" style="background:#debdc6"><span @click="changeTab(0)"><Icon type="md-home"></Icon>家管理</span></Col>
        <Col span="6" :class="[curTab == 1 ? 'activeTab' : 'tabItem']" style="background:#b4d2d4"><span @click="changeTab(1)"><Icon type="md-cube"></Icon>设备管理</span></Col>
        <Col span="6" :class="[curTab == 2 ? 'activeTab' : 'tabItem']" style="background:#9abae3"><span @click="changeTab(2)"><Icon type="md-settings"></Icon>设置</span></Col>
        <Col span="2" class="tabToggleBox"><span @click="toggleTabBar"><img src="../../static/img/close.png"></img></span></Col>
      </Row>
    </div>
    <div class="footer" v-if="!ifShowTab" :class="[!ifShowTab ? 'open_show' : 'open_close']"><Col span="2"><span @click="toggleTabBar"><img src="../../static/img/open.png"></img></span></Col></div>
  </div> -->
</template>

<script>
import {mapState, mapActions} from 'vuex'
export default {
  name: 'HelloWorld',
  data () {
    return {
      ifShowTab: true
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
    changeTab (idx) {
      this.changeCurTab(idx)
    },
    toggleTabBar () {
      this.ifShowTab = !this.ifShowTab
    },
    ...mapActions('sider', [
      'changeCurTab'
    ])
  }
}
</script>
<style lang='less' scoped>
.footerTab{
  width: 100%;
  height: 150px;
  background: #fff;
  position: relative;
  left: 0;
  bottom: 0;
  z-index: 999;
}
.footer{
  width: 100%;
  height: 60px;
  font-size: 18px;
  position: fixed;
  left:0;
  bottom:0px;
  z-index: 999;
  img{
    width: 40px;
    height: 40px;
    cursor: pointer;
  }
}
.tabItem{
  height: 40px;
  font-size: 18px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  span{
    width: 100%;
    text-align: center;
  }
}
.activeTab{
  height: 60px;
  font-size: 22px;
  color: #2d8cf0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-top: -10px;
}
.tabToggleBox img{
  width: 40px;
  height: 40px;
  cursor: pointer;
}
.footer_Toggle_close{
  height: 60px;
  font-size: 18px;
  position: fixed;
  left:0;bottom:0px;
  z-index: 999;
  animation:Toggle_close 2s  forwards;
  -webkit-animation:Toggle_close 2s  forwards;
}
@keyframes Toggle_close
  {
    from {width: 100%;opacity: 1;}
    to {width: 100px;opacity: 0;}
  }
.footer_Toggle_show{
  min-width: 600px;
  height: 60px;
  font-size: 18px;
  position: fixed;
  left:0;bottom:0px;
  z-index: 999;
  animation:Toggle_show 2s  forwards;
  -webkit-animation:Toggle_show 2s  forwards;
}
@keyframes Toggle_show
  {
    from {width: 100px;opacity: 0;}
    to {width: 100%;opacity: 1;}
  }
.open_show{
  animation-delay: 4s;
  -webkit-animation-delay: 4s;
  animation:Open_show 2s  forwards;
  -webkit-animation:Open_show 2s  forwards;
}
@keyframes Open_show
  {
    from {opacity: 0;}
    to {opacity: 1;}
  }
.open_close{
  animation:Open_close 2s  forwards;
  -webkit-animation:Open_close 2s  forwards;
}
@keyframes Open_close
  {
    from {opacity: 1;}
    to {opacity: 0;}
  }
.triangle_active{
  width: 20px;
  height: 20px;
  margin: 0 auto;
  background: #2d8cf0;
  transform:rotate(45deg) translateY(50%);
}
.triangle_normal{
  width: 10px;
  height: 10px;
  margin: 0 auto;
  background: #2d8cf0;
}
</style>
