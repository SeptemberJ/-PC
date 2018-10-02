<template>
  <div class="layout">
    <Layout>
      <Sider ref="side1" :style="{position: 'fixed', left: 0, top: 0, height: '100%', zIndex: 999}" hide-trigger collapsible collapsed-width="100%" v-model="isCollapsed">
        <SIDER/>
      </Sider>
      <Layout class="mainContent" style="position:absolute;top:0;left:200px;padding-right: 200px;">
        <Content :style="{margin: '20px 0', background: '#fff', minHeight: windowHeight + 'px'}">
          <!-- <Row v-if="curTab == 1" style="position:fixed;top:0;width: 100%;background:#fff;zIndex:999;border-bottom: 1px solid #fff;box-shadow: 0px 10px 0px 0px #fff;"> -->
          <Row v-if="curTab == 1">
            <Col span="4" class="PaddingL_16"><h1>当前家</h1></Col>
            <Col span="8" offset="0">
              <Select :value="curHomeIdx" style="width:100%;height:50px;" @on-change="selectChangeCurHome">
                <Option v-for="(home, idx) in homeList" :value="idx" :key="idx">{{home.home_name}}</Option>
              </Select>
            </Col>
            <!-- add button -->
            <Col v-if="curMenuText === '家列表'" span="12" offset="0" class="TextAlignR"><Button type="primary" icon="md-add">添加家</Button></Col>
            <Col v-if="curMenuText === '所有设备'" span="12" offset="0" class="TextAlignR"><Button type="primary" icon="md-add" @click="addEQ">添加设备</Button></Col>
          </Row>
          <CONTENT :curHomeId="curHome.home_id"/>
        </Content>
      </Layout>
    </Layout>
      <TAB/>
      <!-- <BackTop :height="10" :bottom="300">
        <div class="top">返回顶端</div>
      </BackTop> -->
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {send} from '../util/send'
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
  },
  computed: {
    ...mapState({
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
      'changeCurHome',
      'changeRoomList',
      'changeModalShow'
    ]),
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
              isCreater: true,
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
        name: '/home?register_id=4dd928bab4a811e88d1a00163e11716c',
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
      this.changeModalShow('EQ')
    }
  }
}
</script>

<style lang="css" scoped>
.layout{
  border: 0px solid #d7dde4;
  background: #2d8cf0;
  position: relative;
  overflow: hidden;
  /*height: 600px*/
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
}
.top{
  padding: 10px;
  background: rgba(0, 153, 229, .7);
  color: #fff;
  text-align: center;
  border-radius: 2px;
}
</style>
