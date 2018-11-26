<template>
  <div class="eqByKind">
    <Row style="margin: 20px 0px;">
      <Col span="16" class="">
        <Breadcrumb>
          <span @click="back(0)">
            <BreadcrumbItem to="/Home">
              <Icon type="md-bookmark"></Icon> 所有类别
            </BreadcrumbItem>
          </span>
          <span @click="back(1)">
            <BreadcrumbItem v-if="locationIdex != 0" class="ColorWhite CursorPointer">
              <Icon type="logo-buffer"></Icon>{{kindName}}
            </BreadcrumbItem>
          </span>
          <BreadcrumbItem v-if="locationIdex == 2">
            <Icon type="logo-buffer"></Icon>{{addName}}
          </BreadcrumbItem>
        </Breadcrumb>
      </Col>
      <Col span="8" class="TextAlignR PaddingR_16">
        <!-- <Tooltip max-width="200" placement="left" v-if="locationIdex != 2">
          <img class="helpIcon" src="../../../../static/img/icons/helpWhite.png">
          <div slot="content">
            <p>添加说明</p>
            <p>请在下面列表中选择你要添加的产品，进入下一步后填入相关设备编码后实现添加。</p>
          </div>
        </Tooltip> -->
        <Button v-if="locationIdex == 1 || locationIdex == 2" type="primary" icon="ios-undo" @click="back('step')" class="MarginR_10">返回上级</Button>
        <Button v-if="locationIdex == 2 && addType == 0" type="error" :disabled="!curHome.isCreater" icon="md-add" @click="addMasterControl">添加</Button>
        <Button v-if="locationIdex == 2 && (addType == 1 || addType == 3)" type="error" :disabled="!curHome.isCreater" icon="md-add" @click="addSecondControl">添加</Button>
        <Button v-if="locationIdex == 2 && addType == 2" type="error" :disabled="!curHome.isCreater" icon="md-add" @click="addSingleTip">添加</Button>
      </Col>
    </Row>
    <!-- 一级目录 -->
    <Row type="flex" justify="start" class="code-row-bg" v-if="locationIdex == 0">
      <Col span="8">
        <Card class="CursorPointer" style="width: 90%;margin-bottom: 30px;">
          <div style="text-align:center"  @click="toSecondCatalog(0)">
            <Row>
              <Col span="24"><img style="border-radius: 0;" src="../../../../static/img/icons/kzq.png"></Col>
              <Col span="24">
                <h4 style="padding-top:2px;">中央控制器</h4>
              </Col>
            </Row>
          </div>
        </Card>
      </Col>
      <Col span="8">
        <Card class="CursorPointer" style="width: 90%;margin-bottom: 30px;">
          <div style="text-align:center" @click="toSecondCatalog(1)">
            <Row>
              <Col span="24"><img style="border-radius: 0;" src="../../../../static/img/icons/MasterControlNoraml.png"></Col>
              <Col span="24">
                <h4 style="padding-top:2px;">无线设备</h4>
              </Col>
            </Row>
          </div>
        </Card>
      </Col>
      <Col span="8">
        <Card class="CursorPointer" style="width: 90%;margin-bottom: 30px;">
          <div style="text-align:center" @click="toSecondCatalog(2)">
            <Row>
              <Col span="24"><img style="border-radius: 0;" src="../../../../static/img/icons/secondControl.png"></Col>
              <Col span="24">
                <h4 style="padding-top:2px;">所有设备</h4>
              </Col>
            </Row>
          </div>
        </Card>
      </Col>
    </Row>
    <!-- 二级目录 -->
    <Row type="flex" justify="start" class="code-row-bg" v-if="locationIdex == 1">
      <Col span="8"  v-for="(item, idx) in kindList" :key="idx">
        <Card class="CursorPointer" style="width: 90%;margin-bottom: 30px;">
          <div style="text-align:left" @click="toKindList(item.devcieType, item.deviceTypeName, item.deviceDescibe, item.id)">
            <Row>
              <Col span="8"><img :src="item.devcieTypePic ? 'http://112.90.178.68:8083/upFiles/' + item.devcieTypePic : '../../../../static/img/icons/eqNormalIcon.png'"></Col>
              <Col span="16">
                <h4 style="padding-top:2px;">{{item.deviceDescibe}}</h4>
                <p style="padding-top:5px;">类型: {{item.devcieType == 0 ? '主控' : (item.devcieType == 2 ? '单品' : (item.devcieType == 4 ? '三级设备' : '从控'))}}</p>
              </Col>
            </Row>
          </div>
        </Card>
      </Col>
    </Row>

    <MasterControl :addName="addName" :addKind="addKind" :addKindId="addKindId" :curHomeId="curHomeId" v-if="locationIdex == 2 && addType == 0"/>
    <SecondControl @watchBack="back(0)" :addName="addName" :addKind="addKind" :addKindId="addKindId" :addType="addType" :MasterControlList="MasterControlList" :curHomeId="curHomeId" v-if="locationIdex == 2 && (addType == 1 || addType == 3)"/>
    <SingleProduct @watchBack="back(0)" :addName="addName" :addKind="addKind" :addKindId="addKindId" :curHomeId="curHomeId" v-if=" locationIdex == 2 && addType == 2"/>
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
      locationIdex: 0, // 0-一级目录 1-对应类别列表 2-设备列表
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
      addType: -1, // 1-中央控制器 1-无线 2-所有
      kindName: '', // 中央控制器 无线 所有
      addName: '', // 具体设备名称
      addKind: '', // 类型码
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
  watch: {
    curHomeId: function (val) {
      this.locationIdex = 0
      // switch (this.locationIdex) {
      //   case 1:
      //     if (this.kindName === '中央控制器') {
      //       this.toSecondCatalog(0)
      //     }
      //     if (this.kindName === '无线设备') {
      //       this.toSecondCatalog(1)
      //     }
      //     if (this.kindName === '所有设备') {
      //       this.toSecondCatalog(2)
      //     }
      //     this.toSecondCatalog()
      //   break
      // }
    }
  },
  created () {
    // this.getKindList()
    // this.getEQType()
  },
  components: {
    MasterControl,
    SecondControl,
    SingleProduct,
    AllEquipment
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
      this.locationIdex = 2
      this.addType = type
      this.addKind = deviceTypeName
      this.addName = deviceDescibe
      this.addKindId = id
    },
    toModule (Idx) {
      this.locationIdex = Idx
    },
    back (IDX) {
      switch (IDX) {
        case 'step':
          this.locationIdex--
          break
        default:
          this.locationIdex = IDX
      }
    },
    showHelpInfo (addType) {
    },
    toSecondCatalog (addType) {
      this.locationIdex = 1
      switch (addType) {
        case 0:
          this.kindName = '中央控制器'
          break
        case 1:
          this.kindName = '无线设备'
          break
        case 2:
          this.kindName = '所有设备'
          break
      }
      this.getCurTypeEq(addType)
    },
    // 对应类型设备列表
    getCurTypeEq (TYPE) {
      send({
        name: '/deviceTypeNew?flag=' + TYPE,
        method: 'GET',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            if (TYPE === 2) {
              this.kindList = _res.data.deviceTypeList.data
            } else {
              this.kindList = _res.data.deviceTypeList
            }
            break
          default:
            this.$Message.error(_res.data.message)
        }
      }).catch((_res) => {
        console.log(_res)
        this.$Message.error('Interface Error!')
      })
    },
    addMasterControl () {
      this.changeModalShow('Master')
    },
    addSecondControl () {
      this.getMasterControl()
      this.changeModalShow('Second')
    },
    addSingleTip () {
      this.$Modal.info({
        title: '提示',
        okText: '知道了',
        content: '请在APP上添加无线设备'
      })
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
  .helpIcon{
    width: 65px;
    height: 25px;
    padding: 0 20px 0 20px;
    cursor: pointer;
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
