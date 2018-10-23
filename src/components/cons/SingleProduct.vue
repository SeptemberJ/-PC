<template>
  <div class="AllEquipment">
    <div class="ListBox" v-if="SingleProductList.length > 0">
      <Row type="flex" justify="start" class="code-row-bg">
        <Col span="8"  v-for="(SingleProduct, idx) in SingleProductList" :key="idx">
          <Card style="width: 90%;margin:0 auto 30px auto;"><!-- background:bisque; -->
            <div style="text-align:left">
              <Row>
                <Col span="8"><img src="../../../static/img/icons/MasterControlNoraml.png"></Col>
                <Col span="16">
                  <h4>{{SingleProduct.device_name}}</h4>
                  <Row class="MarginT_20">
                    <Col span="12"><img class="iconImg" src="../../../static/img/icons/editor-line.png"><span @click="editMasterInfo(SingleProduct.id, SingleProduct.device_name)">编辑</span></Col>
                    <Col span="12" class="TextAlignR"><img class="iconImg" src="../../../static/img/icons/delete.png"><span @click="deleteMaster(SingleProduct)">删除</span></Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
    <NoData v-if="SingleProductList.length == 0"/>
    <!-- 添加主控 -->
    <Modal v-model="ifAddEQ" width="460">
      <p slot="header" style="color:#333;text-align:left">
          <!-- <Icon type="ios-information-circle"></Icon> -->
          <span>添加{{addName}}产品</span>
      </p>
      <div style="text-align:left">
          <Form :model="formSingle" ref="formSingle" :rules="ruleValidate" label-position="left" :label-width="100">
            <FormItem label="选择房间" prop="selectRoomId" v-if="HouseList.length > 0">
              <Select v-model="formSingle.selectRoomId">
                <Option v-for="item in HouseList" :value="item.id" :key="item.id">{{ item.house_name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="选择房间" prop="selectRoomId" v-if="HouseList.length == 0">
              <Button class="ColorRed" size="small" type="text" @click="toAddRoom">还未添加房间，点击去添加</Button>
            </FormItem>
            <FormItem label="单品名称" prop="SingleName">
              <Input v-model="formSingle.SingleName" placeholder="请输入主控名称" style="" />
            </FormItem>
            <FormItem label="单品码" prop="SingleCode">
              <Input v-model="formSingle.SingleCode" placeholder="请输入主控码" style="" />
            </FormItem>
          </Form>
      </div>
      <div slot="footer" class="TextAlignC">
        <Button type="error" size="large" :loading="btLoading" @click="handleSubmit('formSingle')">
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
import NoData from '../NoData.vue'
export default {
  name: 'AllEquipment',
  props: ['curHomeId', 'addName', 'addKind'],
  data () {
    return {
      btLoading: false,
      SingleProductList: [],
      newEqName: '',
      // addMasterList: [],
      formSingle: {
        selectRoomId: '',
        SingleCode: '',
        SingleName: ''
        // selectName: ''
      },
      ruleValidate: {
        selectRoomId: [
          { required: true, message: '请选择所在房间！', trigger: 'change' }
        ],
        SingleName: [
          { required: true, message: '请输入单品名称！', trigger: 'change' }
        ],
        SingleCode: [
          { required: true, message: '单品码不能为空！', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      curHome: state => state.curHome,
      HouseList: state => state.roomList
    }),
    ifAddEQ: {
      get: function () {
        return this.$store.state.ifAddEQ
      },
      set: function (newValue) {
        this.changeModalShow('EQ')
      }
    }
  },
  watch: {
    curHomeId: function (val) {
      this.getSingleProduct()
    },
    HouseList: function (val) {
      console.log('new roomlist val-----------------')
      this.initialSelectRoom()
    }
  },
  components: {
    NoData
  },
  created () {
    this.getSingleProduct()
    this.initialSelectRoom()
    this.formSingle.SingleName = this.addName
  },
  methods: {
    ...mapActions([
      'toggleSpin',
      'changeModalShow'
    ]),
    ...mapActions('sider', [
      'changeCurMenu'
    ]),
    // 去添加房间
    toAddRoom () {
      this.changeModalShow('EQ')
      this.changeCurMenu(1)
    },
    // 初始化房间
    initialSelectRoom () {
      if (this.HouseList[0]) {
        this.formSingle.selectRoomId = this.HouseList[0].id
      }
    },
    editMasterInfo (SingleId, SingleName) {
      if (!this.curHome.isCreater) {
        this.$Message.warning('您不是管理员不能进行该操作！')
        return false
      }
      this.$Modal.confirm({
        onOk: () => {
          if (this.newEqName.trim() === '') {
            this.$Message.error('单品名称不能为空!')
            return false
          }
          this.sureModify(SingleId)
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
                value: this.newEqName === '' ? SingleName : this.newEqName,
                autofocus: true,
                placeholder: '请输入新的主控名称...'
              },
              on: {
                input: (val) => {
                  this.newEqName = val
                }
              }
            })
          ])
        }
      })
    },
    // 更新单品名称
    sureModify (EqId) {
      send({
        name: '/device?device_name=' + this.newEqName + '&id=' + EqId + '&house_id=' + this.curHomeId,
        method: 'PUT',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.$Message.success('修改成功!')
            this.getSingleProduct()
            this.newEqName = ''
            break
          default:
            this.$Message.error(_res.data.message)
        }
      }).catch((_res) => {
        console.log(_res)
        this.$Message.error('Interface Error!')
      })
    },
    deleteMaster (Single) {
      if (!this.curHome.isCreater) {
        this.$Message.warning('您不是管理员不能进行该操作！')
        return false
      }
      this.$Modal.confirm({
        title: '提示',
        content: '该操作会将' + Single.device_name + '主控下面的从控以及设备全部删除，确定删除该主控?',
        onOk: () => {
          this.sureDel(Single)
        },
        onCancel: () => {
        }
      })
    },
    // 删除设备
    sureDel (Single) {
      this.toggleSpin(true)
      send({
        name: '/device?id=' + Single.id + '&device_type=' + Single.deviceType + '&second_control_id=' + Single.second_control_id + '&home_id=' + this.curHomeId + '&register_id=' + this.$store.state.register_id,
        method: 'DELETE',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.getSingleProduct()
            setTimeout(() => {
              this.toggleSpin(false)
              this.$Message.success('删除成功!')
            }, 1000)
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
    // 分类下该类所有主控
    getSingleProduct () {
      send({
        name: '/deviceByType?home_id=' + this.curHomeId + '&device_type=' + this.addKind,
        method: 'GET',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.SingleProductList = _res.data.deviceList
            break
          default:
            this.$Message.error(_res.data.message)
        }
      }).catch((_res) => {
        console.log(_res)
        this.$Message.error('Interface Error!')
      })
    },
    // 主控添加列表 async
    filterMasterControl () {
      let MasterList = this.AddList.filter(master => {
        if (master.devcieType === '0') {
          return master
        }
      })
      this.addMasterList = MasterList
    },
    // 提交
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.addSingle()
        } else {
          this.$Message.warning('请将信息填写完成!')
        }
      })
    },
    // 添加单品
    addSingle () {
      if (this.btLoading) {
        return false
      }
      // this.toggleSpin(true)
      this.btLoading = true
      send({
        name: '/device',
        method: 'POST',
        data: {
          register_id: this.$store.state.register_id,
          home_id: this.curHomeId,
          house_id: this.formSingle.selectRoomId,
          main_control_code: '',
          main_control_id: '',
          second_control_id: '',
          second_contrl_code: '',
          device_name: this.formSingle.SingleName,
          device_code: this.formSingle.SingleCode,
          default_device_type: this.addKind,
          device_img: '',
          device_status: 0,
          deviceType: 2,
          device_config: 99
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            // this.toggleSpin(false)
            this.changeModalShow('EQ')
            this.$Message.success('添加成功！')
            this.getSingleProduct()
            this.btLoading = false
            this.$refs['formSingle'].resetFields()
            break
          default:
            // this.toggleSpin(false)
            this.btLoading = false
            this.$Message.error(_res.data.message)
        }
      }).catch((_res) => {
        // this.toggleSpin(false)
        this.btLoading = false
        console.log(_res)
        this.$Message.error('Interface Error!')
      })
    }
  }
}
</script>
<style scoped lang="less">
.ListBox{
  margin: 40px 0;
  img{
    width: 60px;
    height: 60px;
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
  .ivu-col-span-10{
    margin-bottom: 30px;
  }

  .ivu-input-large {
    border-top: 0px !important;
    order-left: 0px;
    order-right: 0px;
  }
}
</style>
