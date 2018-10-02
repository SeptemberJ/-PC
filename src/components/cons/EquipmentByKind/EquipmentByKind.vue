<template>
  <div class="eqByKind">
    <Row style="margin: 20px 20px;">
      <Col span="12" class="">
        <Breadcrumb>
          <span @click="back">
            <BreadcrumbItem to="/Home">
              <Icon type="md-bookmark"></Icon> 类别
            </BreadcrumbItem>
          </span>
          <BreadcrumbItem v-if="locationIdex != -1">
              <Icon type="logo-buffer"></Icon>{{modules[locationIdex].name}}
          </BreadcrumbItem>
        </Breadcrumb>
      </Col>
      <Col span="12" class="TextAlignR PaddingR_16">
        <Button v-if="locationIdex == 0" type="primary" icon="md-add" @click="addMasterControl">添加主控</Button>
        <Button v-if="locationIdex == 1" type="primary" icon="md-add" @click="addSecondControl">添加从控</Button>
        <Button v-if="locationIdex == 2" type="primary" icon="md-add" @click="addEQ">添加设备</Button>
      </Col>
    </Row>
    <div class="modules">
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
    </div>
    <!-- 列表 -->
    <MasterControl :AddList="AddList" :curHomeId="curHomeId" v-if="locationIdex == 0"/>
    <SecondControl :AddList="AddList" :MasterControlList="MasterControlList" :curHomeId="curHomeId" v-if="locationIdex == 1"/>
    <AllEquipment :AddList="AddList" :deviceTypeList="deviceTypeList" :MasterControlList="MasterControlList" :curHomeId="curHomeId" v-if="locationIdex == 2"/>

  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import {send} from '../../../util/send'
import MasterControl from '../MasterControl.vue'
import SecondControl from '../SecondControl.vue'
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
      AddList: [],
      MasterControlList: [],
      deviceTypeList: []
    }
  },
  computed: {
    ...mapState({
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
    AllEquipment
  },
  created () {
    this.getAddList()
    this.getEQType()
  },
  methods: {
    ...mapActions([
      'changeModalShow'
    ]),
    toModule (Idx) {
      this.locationIdex = Idx
    },
    back () {
      this.locationIdex = -1
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
