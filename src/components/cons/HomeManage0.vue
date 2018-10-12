<template>
  <div class="homeManage">
    <Row type="flex" justify="start" class="code-row-bg">
      <Col span="12"><h1>家列表</h1></Col>
      <Col span="12" class="TextAlignR PaddingR_16"><Button type="error" icon="md-add" @click="addHome">添加家</Button></Col>
    </Row>
    <div class="HomeList" v-if="homeList.length > 0">
    </div>
    <NoData v-if="homeList.length == 0"/>
    <!-- 添加家 -->
    <Modal v-model="ifAddHome" scrollable width="460">
      <p slot="header" style="color:#333;text-align:left">
          <!-- <Icon type="ios-information-circle"></Icon> -->
          <span>添加家</span>
      </p>
      <div style="text-align:left">
        <Form :model="homeinfo" label-position="left" :label-width="100">
          <FormItem label="家庭名称">
            <Input v-model="homeinfo.name"></Input>
          </FormItem>
          <FormItem label="家庭地址">
              <Input v-model="homeinfo.address"></Input>
          </FormItem>
          <Row class="tipsTit">
            <Col span="8">在哪些房间有智能设备</Col>
            <Col span="8" offset="8" class="TextAlignR CursorPointer"><span @click="addOtherRoom">添加其他房间</span></Col>
          </Row>
          <Row>
            <Col span="24">
              <CheckboxGroup v-model="choosedRoom">
                <Checkbox :label="Room.dhouse_name" v-for="(Room, idx) in defaultRoomList" :key="idx"></Checkbox>
              </CheckboxGroup>
            </Col>
          </Row>
        </Form>
      </div>
      <div slot="footer" class="TextAlignC">
          <Button type="error" size="large" :loading="btLoading" @click="createHome">
            <span v-if="!btLoading">确认添加</span>
            <span v-else>Loading...</span>
          </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import {send} from '../../util/send'
// import {Encrypt, Decrypt} from '../../util/util'
import NoData from '../NoData.vue'
export default {
  name: 'HomeManage',
  data () {
    return {
      ifAddHome: false,
      btLoading: false,
      homeList: [],
      // add home
      homeinfo: {
        name: '',
        address: ''
      },
      newRommName: '',
      defaultRoomList: [],
      choosedRoom: [],
      roomsFormat: []
    }
  },
  computed: {
    ...mapState({
      curMenu: state => state.sider.curMenu
    })
  },
  watch: {
    choosedRoom (curVal, oldVal) {
      let temp = []
      curVal.map((name) => {
        temp.push({'house_name': name})
      })
      this.roomsFormat = temp
    }
  },
  created () {
    this.getDefaultRooms()
  },
  components: {
    NoData
  },
  methods: {
    addHome () {
      this.ifAddHome = true
    },
    ...mapActions([
      'changeCurHome',
      'changeHomeList'
    ]),
    getDefaultRooms () {
      send({
        name: '/house_default',
        method: 'GET',
        data: {
        }
      }).then(_res => {
        let temp = []
        _res.data.houseListDefault.map((item) => {
          temp.push(item.dhouse_name)
        })
        this.defaultRoomList = _res.data.houseListDefault
        this.choosedRoom = temp
      }).catch((res) => {
        this.$Message.error('Interface Error!')
      })
    },
    createHome () {
      if (!this.homeinfo.name || this.homeinfo.name.trim() === '') {
        this.$Message.error('家庭名称不能为空')
        return false
      }
      if (!this.homeinfo.address || this.homeinfo.address.trim() === '') {
        this.$Message.error('家庭地址不能为空')
        return false
      }
      if (this.roomsFormat.length === 0) {
        this.$Message.error('至少选择一个房间')
        return false
      }
      send({
        name: '/home',
        method: 'POST',
        data: {
          'home': [
            {
              'home_name': this.homeinfo.name.trim(),
              'faddress': this.homeinfo.address.trim(),
              'register_id': this.$store.state.register_id
            }
          ],
          'house_member': this.roomsFormat
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.getAllHome()
            this.ifAddHome = false
            // this.updateCurHome(_res.data.home_id)
            break
          default:
            this.$Message.error(_res.data.message)
        }
      }).catch((res) => {
        this.$Message.error('Interface Error!')
      })
    },
    updateCurHome (HomeId) {
      send({
        name: '/home?isdefault=1&id=' + HomeId + '&home_name=' + this.homeinfo.name.trim() + '&faddress=' + this.homeinfo.address.trim() + '&register_id=' + this.$store.state.register_id,
        method: 'PUT',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.$Message.success('设置成功!')
            // 更新当前家
            let CurHomeTemp = {
              home_name: this.homeinfo.name.trim(),
              faddress: this.homeinfo.address.trim(),
              home_id: HomeId,
              isCreater: true,
              isdefault: 1,
              register_id: this.$store.state.register_id
            }
            this.changeCurHome(CurHomeTemp)
            this.$router.push({name: 'Home'})
            break
          default:
            this.$Message.error(_res.data.message)
        }
      }).catch((res) => {
        this.$Message.error('Interface Error!')
      })
    },
    addOtherRoom () {
      this.$Modal.confirm({
        onOk: () => {
          this.defaultRoomList = [...this.defaultRoomList, {'dhouse_name': this.newRommName}]
          this.choosedRoom = [...this.choosedRoom, this.newRommName]
        },
        render: (h) => {
          return h('Input', {
            props: {
              value: this.newRommName,
              autofocus: true,
              placeholder: '请输入房间名称...'
            },
            on: {
              input: (val) => {
                this.newRommName = val
              }
            }
          })
        }
      })
    },
    getAllHome () {
      send({
        name: '/home?register_id=2f40a8dacb9711e88d1a00163e11716c',
        method: 'GET',
        data: {
        }
      }).then(_res => {
        this.changeHomeList(_res.data.homeList)
      }).catch((res) => {
        this.$Message.error('Interface Error111!')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.homeManage{
  margin: 20px 0;
  h1{
    color: #fff;
  }
}
</style>
