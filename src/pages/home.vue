<template>
  <Row>
    <Col span="24">
      <div style="height: 550px;background: #2d8cf0;overflow: hidden">
        <Sider ref="side1" :style="{position: 'relative', left: 0, top: 0, height: '550px', zIndex: 999, borderRight: '2px solid #eee'}" hide-trigger collapsible collapsed-width="100%" v-model="isCollapsed">
          <SIDER/>
        </Sider>
        <div style="position:absolute;top:0;left:200px;padding-right: 200px;width: 100%;height: 550px !important;overflow-y:scroll">
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
                <!-- add button -->
                <!-- <Col v-if="curMenuText === '家列表'" span="12" offset="0" class="TextAlignR PaddingR_16"><Button type="error" icon="md-add" @click="addHome">添加家</Button></Col> -->
                <Col v-if="curMenuText === '所有设备'" span="12" offset="0" class="TextAlignR PaddingR_16"><Button type="error" :disabled="!curHome.isCreater" icon="md-add" @click="addEQ">添加设备</Button></Col>
              </Row>
              <CONTENT :curHomeId="curHome.home_id"/>
            </Content>
          </Layout>
        </div>
      </div>
    </Col>
    <Col span="24">
      <TAB/>
    </Col>
  </Row>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {send, logout} from '../util/send'
import {clearCookie} from '../util/util'
import SIDER from '../components/Sider.vue'
import TAB from '../components/Tab.vue'
import CONTENT from '../components/Content.vue'

export default {
  name: 'Home',
  data () {
    return {
      isCollapsed: false,
      windowHeight: 0
    }
  },
  created () {
    this.windowHeight = window.innerHeight
    this.checkIfHasHome()
    console.log('this.curHome----------------')
    console.log(this.curHome)
  },
  computed: {
    ...mapState({
      accountPhone: state => state.accountPhone,
      curHome: state => state.curHome,
      curTab: state => state.sider.curTab,
      curMenuText: state => state.sider.curMenuText,
      homeList: state => state.homeList
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
  components: {
    SIDER,
    TAB,
    CONTENT
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
      console.log(HomeInfo)
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
              console.log(item)
              this.getAllRoom(item.home_id)
            }
          })
          this.$router.push({name: 'Home'})
        } else {
          this.$router.push({name: 'Guide'})
        }
      }).catch((res) => {
        this.$Message.error('Interface Error111!')
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
      console.log('this.curHome=======================')
      console.log(this.curHome)
      // this.getMasterControl()
      this.changeModalShow('EQ')
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
  background: #2d8cf0 !important;
  margin-left: 34px;
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
