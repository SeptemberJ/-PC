<template>
  <div>
    <Row style="margin: 20px 0px;">
      <Col span="12">
        <Breadcrumb>
          <span @click="back">
            <BreadcrumbItem to="/Home">
              <Icon type="md-bookmark"></Icon> 房间列表
            </BreadcrumbItem>
          </span>
          <BreadcrumbItem v-if="locationIdex != -1">
            <Icon type="logo-buffer"></Icon>{{HouseList[locationIdex].house_name}}
            <!-- <span @click="back" class="CursorPointer" v-if="locationIdex != -1"><Icon type="ios-undo" /></span> -->
          </BreadcrumbItem>
        </Breadcrumb>
      </Col>
      <Col span="12" class="TextAlignR PaddingR_16">
        <Col span="24" v-if="locationIdex == -1" class="TextAlignR">
          <Button type="error" icon="md-add" :disabled="!curHome.isCreater" @click="addNewRoom">添加房间</Button>
        </Col>
        <Col span="24" v-if="locationIdex != -1" class="TextAlignR">
          <Button v-if="locationIdex != -1" type="primary" icon="ios-undo" @click="back" class="MarginR_10">返回上级</Button>
          <Button type="error" icon="md-add" @click="addEQ">添加设备</Button>
        </Col>
      </Col>
    </Row>
    <!-- <Row class="MarginB_10">
      <Col span="24" class="TextAlignR PaddingR_16"><Button type="primary" icon="md-add" @click="addNewRoom">添加房间</Button></Col>
    </Row> -->
    <div class="ListBox" v-show="locationIdex == -1 && HouseList.length > 0">
      <Row type="flex" justify="start" class="code-row-bg">
        <Col span="8"  v-for="(Room, idx) in HouseList" :key="idx">
          <Card class="houseCard" :title="Room.house_name" icon="ios-options" :padding="0"  style="width: 90%;margin-bottom:30px;">
            <CellGroup>
              <span @click="SeeEqList(idx, Room.id, Room.house_name)">
                <Cell title="设备" to="/Home" extra="查看">
                </Cell>
              </span>
            </CellGroup>
            <Row class="MarginT_10 Padding_16">
              <Col span="12"><Button type="primary" shape="circle" icon="md-create" @click="editRoomInfo(Room)"></Button></Col>
              <Col span="12" class="TextAlignR"><Button type="error" shape="circle" icon="md-trash" @click="deleteRoom(Room)"></Button></Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
    <NoData v-if="HouseList.length == 0"/>

    <HouseAllEquipment ref="content" :locationIdex="locationIdex" :choosedHouseName="choosedHouseName" :choosedHouseId="choosedHouseId" :AddList="AddList" :deviceTypeList="deviceTypeList" :MasterControlList="MasterControlList" :curHomeId="curHomeId" v-if="locationIdex != -1"/>
    <!-- <AllEquipment v-on:listenSpin="toggleSpin" :AddList="AddList" :deviceTypeList="deviceTypeList" :MasterControlList="MasterControlList" :curHomeId="curHomeId" v-if="curMenuText === '所有设备'"/> -->

    <!-- 添加房间 -->
    <Modal v-model="ifAdd" width="850">
      <p slot="header" style="color:#333;text-align:left">
          <!-- <Icon type="ios-information-circle"></Icon> -->
          <span>添加房间</span>
      </p>
      <div style="text-align:left">
          <Form label-position="left" :label-width="100">
            <FormItem label="房间名称" style="margin-bottom: 10px;">
              <Input v-model="addRoomName" placeholder="请输入房间名称"></Input>
            </FormItem>
            <FormItem label="推荐" style="margin-bottom: 10px;">
            </FormItem>
            <RadioGroup class="recommendRooms" v-model="addRoomName" type="button" @on-change="changeAddRoomName">
              <Radio :label="room.dhouse_name" v-for="(room, idx) in recommendRoomList" :key="idx"></Radio>
            </RadioGroup>
          </Form>

      </div>
      <div slot="footer" class="TextAlignC">
         <!--  <Button type="error" size="large" @click="sureAdd">确认添加</Button> -->
          <Button type="primary" :loading="btLoading" @click="sureAdd">
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
import {Decrypt} from '../../util/util'
import HouseAllEquipment from './HouseAllEquipment.vue'
import NoData from '../NoData.vue'
export default {
  name: 'EquipmentByRoom',
  props: ['curHomeId'],
  data () {
    return {
      choosedHouseId: '',
      choosedHouseName: '',
      locationIdex: -1,
      btDisable: false,
      btLoading: false,
      ifAdd: false,
      HouseList: [],
      newRoomName: '',
      recommendRoomList: [],
      addRoomName: '',
      AddList: [],
      MasterControlList: [],
      deviceTypeList: [],
      openCode: ''
    }
  },
  components: {
    HouseAllEquipment,
    NoData
  },
  computed: {
    ...mapState({
      curHome: state => state.curHome,
      curMenu: state => state.sider.curMenu
    })
  },
  watch: {
    curHomeId: function (val) {
      this.getAllRoom()
      this.locationIdex = -1
    }
  },
  created () {
    this.getAllRoom()
    this.getRecommendRoom()
    this.getAddList()
    this.getEQType()
  },
  methods: {
    ...mapActions([
      'toggleSpin',
      'changeRoomList',
      'changeModalShow'
    ]),
    back () {
      this.locationIdex = -1
      this.getAllRoom()
    },
    addEQ () {
      this.changeModalShow('EQ')
    },
    SeeEqList (Idx, HouseId, HouseName) {
      this.locationIdex = Idx
      this.choosedHouseId = HouseId
      this.choosedHouseName = HouseName
      this.getMasterControl()
    },
    editRoomInfo (Room) {
      if (!this.curHome.isCreater) {
        this.$Message.warning('您不是管理员不能进行该操作！')
        return false
      }
      this.$Modal.confirm({
        onOk: () => {
          this.sureModify(Room)
        },
        render: (h) => {
          return h('div', [
            h('h4', {
              style: {
                marginBottom: '10px'
              }

            }, '新名称'),
            h('Input', {
              props: {
                value: this.newRoomName === '' ? Room.house_name : this.newRoomName,
                autofocus: true,
                placeholder: '请输入新的房间名称...'
              },
              on: {
                input: (val) => {
                  this.newRoomName = val
                }
              }
            })
          ])
        }
      })
    },
    // 更新房间名称
    sureModify (Room) {
      this.toggleSpin(true)
      send({
        name: '/house?home_id=' + this.curHomeId + '&id=' + Room.id + '&house_name=' + this.newRoomName,
        method: 'PUT',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.toggleSpin(false)
            this.$Message.success('修改成功!')
            this.newRoomName = ''
            this.getAllRoom()
            break
          default:
            this.toggleSpin(false)
            this.$Message.error(_res.data.message)
        }
      }).catch((_res) => {
        console.log(_res)
        this.toggleSpin(false)
        this.$Message.error('Interface Error!')
      })
    },
    // 删除房间
    deleteRoom (Room) {
      if (!this.curHome.isCreater) {
        this.$Message.warning('您不是管理员不能进行该操作！')
        return false
      }
      this.$Modal.confirm({
        title: '提示',
        onOk: () => {
          if (Decrypt(localStorage['openCode']) === this.openCode) {
            this.sureDel(Room.id)
          } else {
            this.$Message.error('请输入账户密码予以删除！')
          }
        },
        onCancel: () => {
          this.openCode = ''
        },
        render: (h) => {
          return h('div', [
            h('p', {
              style: {
                marginBottom: '10px'
              }

            }, '该操作会将该房间下的设备也删除！'),
            h('h4', {
              style: {
                marginBottom: '10px'
              }

            }, ''),
            h('Input', {
              props: {
                type: 'password',
                autofocus: true,
                placeholder: '请输入账户密码予以删除...'
              },
              on: {
                input: (val) => {
                  this.openCode = val
                }
              }
            })
          ])
        }
      })
    },
    // 删除设备
    sureDel (ID) {
      this.toggleSpin(true)
      send({
        name: '/house?house_id=' + ID + '&register_id=' + this.$store.state.register_id,
        method: 'DELETE',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.openCode = ''
            this.getAllRoom()
            this.toggleSpin(false)
            this.$Message.success('删除成功!')
            break
          default:
            this.openCode = ''
            this.toggleSpin(false)
            this.$Message.error(_res.data.message)
        }
      }).catch((_res) => {
        console.log(_res)
        this.openCode = ''
        this.toggleSpin(false)
        this.$Message.error('Interface Error!')
      })
    },
    // 添加房间
    addNewRoom () {
      this.ifAdd = true
    },
    sureAdd () {
      if (this.btLoading) {
        return false
      }
      if (this.addRoomName.trim() === '') {
        this.$Message.warning('房间名称不能为空!')
        return false
      }
      // this.toggleSpin(true)
      this.btLoading = true
      send({
        name: '/house',
        method: 'POST',
        data: {
          home_id: this.curHomeId,
          register_id: this.$store.state.register_id,
          house_member: [{'house_name': this.addRoomName}]
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.getAllRoom()
            this.ifAdd = false
            this.btLoading = false
            this.$Message.success('添加成功!')
            break
          default:
            // this.toggleSpin(false)
            this.btLoading = false
            this.$Message.error(_res.data.message)
        }
      }).catch((_res) => {
        console.log(_res)
        // this.toggleSpin(false)
        this.btLoading = false
        this.$Message.error('Interface Error!')
      })
    },
    // 使用推荐名称
    changeAddRoomName (Name) {
      this.addRoomName = Name
    },
    // 所有房间
    getAllRoom () {
      send({
        name: '/house?home_id=' + this.curHomeId, // this.$store.state.curHome.home_id,
        method: 'GET',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.HouseList = _res.data.houseList
            this.changeRoomList(_res.data.houseList)
            break
          default:
            this.$Message.error(_res.data.message)
        }
      }).catch((_res) => {
        console.log(_res)
        this.$Message.error('Interface Error12!')
      })
    },
    // 房间推荐名称
    getRecommendRoom () {
      send({
        name: '/list_others',
        method: 'GET',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.recommendRoomList = _res.data.houseListAll
            break
          default:
            this.$Message.error(_res.data.message)
        }
      }).catch((_res) => {
        console.log(_res)
        this.$Message.error('Interface Error!')
      })
    },
    getAddList () {
      send({
        name: '/deviceType',
        method: 'GET',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.AddList = _res.data.deviceTypeList.data
            break
          default:
            this.$Message.error(_res.data.message)
        }
      }).catch((_res) => {
        console.log(_res)
        this.$Message.error('Interface Error!')
      })
    },
    // 设备类型
    getEQType () {
      send({
        name: '/deviceTypeScan',
        method: 'GET',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.deviceTypeList = _res.data.deviceTypeList
            console.log('deviceTypeList------------------')
            console.log(this.deviceTypeList)
            break
          default:
            this.$Message.error(_res.data.message)
        }
      }).catch((_res) => {
        console.log(_res)
        this.$Message.error('Interface Error!')
      })
    },
    // 所有主控
    getMasterControl () {
      send({
        name: '/mainControl?home_id=' + this.curHomeId + '&register_id=' + this.$store.state.register_id,
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
<style lang="less" scoped>
.ListBox{
  margin: 5px 0 40px 0;
  img{
    width: 80px;
    height: 80px;
  }
  p, span{
    color: #333;
  }
  span{
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;
  }
  .operationIcon{
    margin-top: 10px;
  }
  .iconImg{
    width: 20px;
    height: 20px;
    margin-right: 5px;
    display: inline-block;
    vertical-align: bottom;
    cursor: pointer;
  }
  .ivu-col-span-24{
  }
}
</style>
