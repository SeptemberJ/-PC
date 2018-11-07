<template>
  <Row>
    <Col span="24" :style="{height: CurHeight + '%'}">
      <div class="home" style="height: 100%;overflow: hidden">
        <Row style="width: 100%;height: 100%;">
          <Col span="6" :style="{height: '100%',background:curTab == 0 ? '#d17a3c': (curTab == 1 ? '#9a4de2': (curTab == 2 ? '#dcbd96': '#469bf4')), borderRight:curTab == 0 ? '2px solid #d17a3c': (curTab == 1 ? '2px solid #9a4de2': curTab == 2 ? '2px solid #dcbd96': '2px solid #469bf4')}">
            <SIDER/>
          </Col>
          <Col span="18" :style="{height: '100%',background:curTab == 0 ? '#d2691e': (curTab == 1 ? '#8a2be2': (curTab == 2 ? '#deb887': '#2b85e4'))}">
            <Spin/>
            <div style="position:absolute;top:0;left:34px;padding-right: 0;width: 100%;height:100% !important;overflow-x:hidden;overflow-y:scroll">
              <Layout class="mainContent">
                <Content :style="{margin: '0', overflowX: 'hidden', overflowY: 'scroll',background:curTab == 0 ? '#d2691e': (curTab == 1 ? '#8a2be2': (curTab == 2 ? '#deb887': '#2b85e4'))}">
                  <p class='ColorWhite TextAlignR PaddingTB_10 PaddingR_16'>{{accountPhone}} | <span class="CursorPointer hoverColor" @click="ToLogout">退出</span></p>
                  <Row v-if="curTab == 1 || curTab == 2" type="flex" justify="start" class="code-row-bg" style="width: 100%;height: 60px;">
                    <Col span="4"><h1>当前家</h1></Col>
                    <Col span="8">
                      <Select :value="curHomeIdx" style="width:100%;height:50px;" @on-change="selectChangeCurHome">
                        <Option v-for="(home, idx) in homeList" :value="idx" :key="idx">{{home.home_name}}</Option>
                      </Select>
                    </Col>
                  </Row>
                  <Row v-if="curMenuText === '所有设备'" style="width: 100%;margin: 10px 0px;">
                    <Col span="24" offset="0" class="TextAlignR PaddingR_16"><Button type="error" :disabled="!curHome.isCreater" icon="md-add" @click="addEQ">添加设备</Button></Col>
                  </Row>
                  <Row v-if="curMenuText === '场景'" style="width: 100%;margin: 10px 0px;">
                    <Col span="24" offset="0" class="TextAlignR PaddingR_16"><Button type="error" :disabled="!curHome.isCreater" icon="md-add" @click="addScene">添加场景</Button></Col>
                  </Row>
                  <CONTENT :curHomeId="curHome.home_id" ref="content"/>
                </Content>
              </Layout>
            </div>
          </Col>
        </Row>
      </div>
    </Col>
    <Col span="24">
      <TAB/>
    </Col>
  </Row>
<!--   <Row>
    <Col span="24" style="height: 70%">
      <div class="home123" style="height: 100%;background: #2d8cf0;overflow: hidden">
        <Sider ref="side1" :style="{width: '25%', position: 'relative', left: 0, top: 0, height: '100%', zIndex: 999, borderRight: '2px solid #eee'}" hide-trigger collapsible collapsed-width="100%" v-model="isCollapsed">
          <SIDER/>
        </Sider>
        <div style="position:absolute;top:0;left:25%;padding-right: 25%;width: 100%;height:100% !important;overflow-y:scroll">
          <Layout class="mainContent">
            <Content :style="{margin: '0', background: '#2d8cf0', overflowX: 'hidden', overflowY: 'scroll'}">
              <p @click="ToLogout" class='ColorWhite CursorPointer TextAlignR PaddingTB_10 PaddingR_16'>{{accountPhone}} | 退出</p>
              <Row type="flex" justify="start" class="code-row-bg">
                <Col span="4"><h1 v-if="curTab == 1">当前家</h1></Col>
                <Col span="8">
                  <Select v-if="curTab == 1" :value="curHomeIdx" style="width:100%;height:50px;" @on-change="selectChangeCurHome">
                    <Option v-for="(home, idx) in homeList" :value="idx" :key="idx">{{home.home_name}}</Option>
                  </Select>
                </Col>
                <Col v-if="curMenuText === '所有设备'" span="12" offset="0" class="TextAlignR PaddingR_16"><Button type="error" :disabled="!curHome.isCreater" icon="md-add" @click="addEQ">添加设备12</Button></Col>
              </Row>
              <CONTENT :curHomeId="curHome.home_id" ref="content"/>
            </Content>
          </Layout>
        </div>
      </div>
    </Col>
    <Col span="24">
      <TAB/>
    </Col>
  </Row> -->
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {send, logout} from '../util/send'
import {clearCookie} from '../util/util'
import SIDER from '../components/Sider.vue'
import TAB from '../components/Tab.vue'
import CONTENT from '../components/Content.vue'
import Spin from '../components/Spin.vue'

export default {
  name: 'Home',
  data () {
    return {
      isCollapsed: false,
      windowHeight: 0,
      CurHeight: 75
    }
  },
  created () {
    this.windowHeight = window.innerHeight
    this.checkIfHasHome()
    // console.log('this.curHome----------------')
    // console.log(this.curHome)
  },
  computed: {
    ...mapState({
      accountPhone: state => state.accountPhone,
      curHome: state => state.curHome,
      curTab: state => state.sider.curTab,
      curMenuText: state => state.sider.curMenuText,
      homeList: state => state.homeList,
      ifShowTabBar: state => state.ifShowTabBar
    }),
    curHomeIdx () {
      let curIdx = null
      this.$store.state.homeList.map((item, idx) => {
        if (item.home_id === this.$store.state.curHome.home_id) {
          curIdx = idx
        }
      })
      return curIdx
    }
  },
  watch: {
    ifShowTabBar: function (val) {
      this.CurHeight = val ? 75 : 90
      document.body.style.height = val ? window.innerHeight + 280 + 'px' : window.innerHeight + 80 + 'px'
    }
  },
  components: {
    SIDER,
    TAB,
    CONTENT,
    Spin
  },
  methods: {
    ...mapActions([
      'changeHomeList',
      'changeCurHome',
      'changeRoomList',
      'changeModalShow'
    ]),
    ToLogout () {
      logout()
      clearCookie('btznkz')
      this.$router.push({name: 'Login'})
    },
    selectChangeCurHome (IDX) {
      this.updateCurHome(this.homeList[IDX])
    },
    updateCurHome (HomeInfo) {
      // console.log(HomeInfo)
      send({
        name: '/home?isdefault=1&id=' + HomeInfo.home_id + '&home_name=' + HomeInfo.home_name + '&faddress=' + HomeInfo.faddress + '&register_id=' + this.$store.state.register_id,
        method: 'PUT',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            // this.$Message.success('设置成功!')
            // 更新当前家
            let CurHomeTemp = {
              home_name: HomeInfo.home_name,
              faddress: HomeInfo.faddress,
              home_id: HomeInfo.home_id,
              isCreater: HomeInfo.register_id === this.$store.state.register_id,
              isdefault: 1,
              register_id: this.$store.state.register_id
            }
            this.changeCurHome(CurHomeTemp)
            this.getAllRoom(this.curHome.home_id)
            break
          default:
            this.$Message.error(_res.data.message)
        }
      }).catch((res) => {
        this.$Message.error('Interface Error!')
      })
    },
    checkIfHasHome () {
      send({
        name: '/home?register_id=' + this.$store.state.register_id,
        method: 'GET',
        data: {
        }
      }).then(_res => {
        if (_res.data.homeList.length > 0) {
          this.changeHomeList(_res.data.homeList)
          _res.data.homeList.map((item, idx) => {
            item.isCreater = item.register_id === this.$store.state.register_id
            if (item.isdefault === '1') {
              this.changeCurHome(item)
              this.getAllRoom(item.home_id)
            }
          })
          this.$router.push({name: 'Home'})
        } else {
          this.$router.push({name: 'Guide'})
        }
      }).catch((res) => {
        this.$Message.error('Interface Error!')
      })
    },
    // 当前家下房间
    getAllRoom (HomeID) {
      send({
        name: '/house?home_id=' + HomeID,
        method: 'GET',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.changeRoomList(_res.data.houseList)
            break
          default:
            this.$Message.error(_res.data.message)
        }
      }).catch((_res) => {
        console.log(_res)
        this.$Message.error('Interface Error!')
      })
    },
    addEQ () {
      // console.log('this.curHome=======================')
      // console.log(this.curHome)
      this.getMasterControl()
      this.changeModalShow('EQ')
      this.$refs.content.getMasterControl()
    },
    addScene () {
      this.changeModalShow('Scene')
    },
    addHome () {
      this.$router.push({name: 'CreateHome'})
    },
    getMasterControl () {
      send({
        name: '/mainControl?home_id=' + this.curHome.home_id + '&register_id=' + this.$store.state.register_id,
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
    }
  }
}
</script>

<style lang="css" scoped>
.home{
  position: relative;
}
.layout{
  border: 0px solid #d7dde4;
  background: transparent !important;
  /*background: #2d8cf0;*/
  position: relative;
  overflow: hidden;
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
  /*background: #2d8cf0 !important;*/
  /*margin-left: 34px;*/
}
.mainContent h1 {
  color: #fff;
}
.mainContent1::-webkit-scrollbar {/*滚动条整体样式*/
    width: 10px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
}
.mainContent1::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 10px;
     -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: #535353;
}
.mainContent1::-webkit-scrollbar-track {/*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 10px;
    background: #EDEDED;
}
.top{
  padding: 10px;
  background: rgba(0, 153, 229, .7);
  color: #fff;
  text-align: center;
  border-radius: 2px;
}
</style>
