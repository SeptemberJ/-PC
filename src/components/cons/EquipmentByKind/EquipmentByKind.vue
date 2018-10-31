<template>
  <div class="eqByKind">
    <Row style="margin: 20px 0px;">
      <Col span="12" class="">
        <Breadcrumb>
          <span @click="back">
            <BreadcrumbItem to="/Home">
              <Icon type="md-bookmark"></Icon> 所有类别
            </BreadcrumbItem>
          </span>
          <BreadcrumbItem v-if="addType != -1">
              <Icon type="logo-buffer"></Icon>{{addName}}
          </BreadcrumbItem>
        </Breadcrumb>
      </Col>
      <Col span="12" class="TextAlignR PaddingR_16">
        <Button v-if="addType != -1" type="primary" icon="ios-undo" @click="back" class="MarginR_10">返回上级</Button>
        <Button v-if="addType == 0" type="error" :disabled="!curHome.isCreater" icon="md-add" @click="addMasterControl">添加</Button>
        <Button v-if="addType == 1 || addType == 3" type="error" :disabled="!curHome.isCreater" icon="md-add" @click="addSecondControl">添加</Button>
        <Button v-if="addType == 2" type="error" :disabled="!curHome.isCreater" icon="md-add" @click="addEQ">添加</Button>
      </Col>
    </Row>
    <Row type="flex" justify="start" class="code-row-bg" v-if="addType == -1">
      <Col span="8"  v-for="(item, idx) in kindList" :key="idx">
        <Card class="CursorPointer" style="width: 90%;margin-bottom: 30;">
            <div style="text-align:left" @click="toKindList(item.devcieType, item.deviceTypeName, item.deviceDescibe, item.id)">
              <Row>
                <Col span="8"><img :src="item.devcieTypePic ? 'http://112.90.178.68:8083/upFiles/' + item.devcieTypePic : '../../../static/img/icons/eqNormalIcon.png'"></Col>
                <Col span="16">
                  <h4 style="padding-top:2px;">{{item.deviceDescibe}}</h4>
                  <p style="padding-top:5px;">类型: {{item.devcieType == 0 ? '主控' : (item.devcieType == 2 ? '单品' : (item.devcieType == 4 ? '三级设备' : '从控'))}}</p>
                </Col>
              </Row>
            </div>
          </Card>
      </Col>
    </Row>
   <!--  <div class="modules">
      <Row type="flex" justify="start" class="code-row-bg" v-if="locationIdex == -1">
        <Col span="8" v-for="(Module, idx) in modules" :key="idx">
          <Card :style="{width: '80%', margin: '0 auto 30px 0', background: Module.bgColor, cursor: 'pointer'}">
            <div style="text-align:center" @click="toModule(idx)">
              <img class="moduleImg" :src="'../../../../static/img/icons/' + Module.iocn + '.png'">
              <h3>{{Module.name}}</h3>
            </div>
          </Card>
        </Col>
      </Row>
    </div> -->

    <MasterControl :addName="addName" :addKind="addKind" :addKindId="addKindId" :curHomeId="curHomeId" v-if="addType == 0"/>
    <SecondControl @watchBack="back" :addName="addName" :addKind="addKind" :addKindId="addKindId" :addType="addType" :MasterControlList="MasterControlList" :curHomeId="curHomeId" v-if="addType == 1 || addType == 3"/>
    <SingleProduct @watchBack="back" :addName="addName" :addKind="addKind" :addKindId="addKindId" :curHomeId="curHomeId" v-if="addType == 2"/>
    <!-- <AllEquipment :AddList="AddList" :deviceTypeList="deviceTypeList" :MasterControlList="MasterControlList" :curHomeId="curHomeId" v-if="locationIdex == 2"/> -->

  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import {send} from '../../../util/send'
import MasterControl from '../MasterControl.vue'
import SecondControl from '../SecondControl.vue'
import SingleProduct from '../SingleProduct.vue'
import AllEquipment from '../AllEquipment.vue'
export default {
  name: 'EquipmentByKind',
  props: ['curHomeId'],
  data () {
    return {
      locationIdex: -1,
      modules: [
        {
          name: '主控',
          iocn: 'masterControl',
          bgColor: 'burlywood'
        },
        {
          name: '从控',
          iocn: 'secondControl',
          bgColor: 'steelblue'
        },
        {
          name: '设备',
          iocn: 'eq',
          bgColor: 'olivedrab'
        }
      ],
      kindList: [],
      addType: -1,
      addName: '',
      addKind: '',
      addKindId: '',
      AddList: [],
      MasterControlList: [],
      deviceTypeList: []
    }
  },
  computed: {
    ...mapState({
      curHome: state => state.curHome,
      curMenu: state => state.sider.curMenu
    }),
    ifAddMaster: {
      get: function () {
        return this.$store.state.ifAddMaster
      },
      set: function (newValue) {
        this.changeModalShow()
      }
    }
  },
  components: {
    MasterControl,
    SecondControl,
    SingleProduct,
    AllEquipment
  },
  created () {
    this.getKindList()
    this.getEQType()
  },
  methods: {
    ...mapActions([
      'changeModalShow'
    ]),
    getKindList () {
      send({
        name: '/deviceType',
        method: 'GET',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.kindList = _res.data.deviceTypeList.data
            break
          default:
            this.$Message.error(_res.data.message)
        }
      }).catch((_res) => {
        console.log(_res)
        this.$Message.error('Interface Error!')
      })
    },
    toKindList (type, deviceTypeName, deviceDescibe, id) {
      this.addType = type
      this.addKind = deviceTypeName
      this.addName = deviceDescibe
      this.addKindId = id
    },
    toModule (Idx) {
      this.locationIdex = Idx
    },
    back () {
      this.addType = -1
    },
    addMasterControl () {
      this.changeModalShow('Master')
    },
    addSecondControl () {
      this.getMasterControl()
      this.changeModalShow('Second')
    },
    addEQ () {
      this.getMasterControl()
      this.changeModalShow('EQ')
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
    }
  }
}
</script>
<style lang="less" scoped>
.eqByKind{
  margin: 40px 0px;
  img{
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
  .modules{
    margin: 40px 20px;
    color: #fff;
    h3{
      margin-top: 10px;
    }
  }
  .moduleImg{
    width: 80px;
    height: 80px;
  }

}
</style>
