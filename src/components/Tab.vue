<template>
<div class="footerTab">
  <Row style="height: 20px;overflow: hidden;" v-if="ifShowTabBar">
    <Col span="6"><div :class="[curTab == 0 ? 'triangle_active triangle_active_0' : 'triangle_normal']" style=""></div></Col>
    <Col span="6"><div :class="[curTab == 1 ? 'triangle_active triangle_active_1' : 'triangle_normal']" style=""></div></Col>
    <Col span="6"><div :class="[curTab == 2? 'triangle_active triangle_active_2' : 'triangle_normal']" style=""></div></Col>
    <Col span="6"><div :class="[curTab == 3? 'triangle_active triangle_active_3' : 'triangle_normal']" style=""></div></Col>
  </Row>
  <!-- <Row style="height: 20px;background: #2d8cf0;">
    <Col span="6"><div :class="[curTab == 0 ? 'triangle_active' : 'triangle_normal']" style=""></div></Col>
    <Col span="6"><div :class="[curTab == 1 ? 'triangle_active' : 'triangle_normal']" style=""></div></Col>
    <Col span="6"><div :class="[curTab == 2? 'triangle_active' : 'triangle_normal']" style=""></div></Col>
  </Row> -->
  <Row v-if="ifShowTabBar" style="height: 130px;">
    <Col span="6">
      <span @click="changeTab(0)">
        <Card class="tabCard" style="width:90%;margin: 0px auto 0px auto;background: #d2691e;color: #fff;cursor: pointer;">
          <div style="text-align:center">
            <img class="tabIcon" src="../../static/img/icons/tab_home.png">
            <h3>家管理</h3>
          </div>
        </Card>
      </span>
    </Col>
    <Col span="6">
      <span @click="changeTab(1)">
        <Card class="tabCard" style="width:90%;margin: 0px auto 0px auto;background: #8a2be2;color: #fff;cursor: pointer;">
          <div style="text-align:center">
            <img class="tabIcon" src="../../static/img/icons/tab_eq.png">
            <h3>设备管理</h3>
          </div>
        </Card>
      </span>
    </Col>
    <!-- <Col span="6">
      <span @click="changeTab(2)">
        <Card class="tabCard" style="width:90%;margin: 0px auto 0px auto;background: #deb887;color: #fff;cursor: pointer;">
          <div style="text-align:center">
            <img class="tabIcon" src="../../static/img/icons/ZKsetting.png">
            <h3>智能设定</h3>
          </div>
        </Card>
      </span>
    </Col> -->
    <Col span="6">
      <span @click="changeTab(3)">
        <Card class="tabCard" style="width:90%;margin: 0px auto 0px auto;background: #2b85e4;color: #fff;cursor: pointer;">
          <div style="text-align:center">
            <img class="tabIcon" src="../../static/img/icons/tab_set.png">
            <h3>个人中心</h3>
          </div>
        </Card>
      </span>
    </Col>
    <Col span="6">
      <Card :bordered="false" dis-hover style="width:90%;margin: 0px auto 0px auto;">
        <div style="text-align:center">
          <img class="weixinPic" src="../../static/img/weixin-icon.jpg">
          <h5>微信公众号</h5>
        </div>
      </Card>
    </Col>
  </Row>
  <Row style="height: 50px;text-align: center">
      <img class="togglePic toggle_close CursorPointer" v-if="ifShowTabBar" @click="toggleTabBar" src="../../static/img/icons/tabBarClose.png">
      <img class="togglePic toggle_open CursorPointer" v-if="!ifShowTabBar" @click="toggleTabBar" src="../../static/img/icons/tabBarOpen.png">
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
import * as $ from 'jquery'
export default {
  name: 'HelloWorld',
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      menuList: state => state.sider.menuList,
      curTab: state => state.sider.curTab,
      curMenu: state => state.sider.curMenu,
      ifShowTabBar: state => state.ifShowTabBar
    }),
    menuitemClasses () {
      return [
        'menu-item',
        this.isCollapsed ? 'collapsed-menu' : ''
      ]
    }
  },
  // watch: {
  //   ifShowTabBar: function (val) {
  //     document.body.style.height = val ? window.innerHeight + 200 +'px' : window.innerHeight + 'px'
  //   }
  // },
  methods: {
    ...mapActions('sider', [
      'changeCurTab'
    ]),
    ...mapActions([
      'changeTabStatus'
    ]),
    changeTab (idx) {
      this.changeCurTab(idx)
      $('html,body').animate({scrollTop: '0px'}, 800)
    },
    toggleTabBar () {
      this.changeTabStatus()
    }
    // closeTab () {
    //   this.ifShowTab = !this.ifShowTab
    // }
  }
}
</script>
<style lang='less' scoped>
.footerTab{
  width: 100%;
  height: 200px;
  background: #fff;
  position: relative;
  .weixinPic{
    width: 30%;
    height:30%;
  }
  .tabIcon{
    width: 50px;
    height: 50px;
  }
  .tabCard:hover{
    transform: scale(1.1);
  }
  .togglePic{
    width: 40px;
    height: 40px;
    margin: 5px auto;
  }
  .toggle_close{
    animation:Toggle_bigger 2s infinite forwards;
    -webkit-animation:Toggle_bigger 2s infinite forwards;
  }
  .toggle_open{
    animation:Toggle_down 1.5s infinite forwards;
    -webkit-animation:Toggle_down 1.5s infinite forwards;
  }
}
@keyframes Toggle_bigger
  {
    0%{
      width: 40px;
      height: 40px;
      opacity: 0.8;
    }
    50%{
      width: 36px;
      height: 36px;
      opacity: 0.3;
    }
    100%{
      width: 40px;
      height: 40px;
      opacity: 0.8;
    }
  }
@keyframes Toggle_down
  {
    0%{
      margin-top: 5px;
      opacity: 0.8;
    }
    50%{
      margin-top: 15px;
      opacity: 0.8;
    }
    100%{
      margin-top: 5px;
      opacity: 0.8;
    }
  }
.ll{
  position: absolute;
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
  z-index: 9;
  transform: rotate(45deg) translateY(-65%);
}
.triangle_active_0{
  background: #d17a3c;
}
.triangle_active_1{
  background: #8a2be2;
}
.triangle_active_2{
  background: #deb887;
}
.triangle_active_3{
  background: #2b85e4;
}
.triangle_normal{
  width: 10px;
  height: 10px;
  margin: 0 auto;
}
</style>
