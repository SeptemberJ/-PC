<template>
  <div class="AllEquipment">
    <div class="ListBox" v-if="MasterControlList.length > 0">
      <Row type="flex" justify="start" class="code-row-bg">
        <Col span="8"  v-for="(MasterControl, idx) in MasterControlList" :key="idx">
          <Card style="width: 90%;margin:0 auto 30px auto;"><!-- background:bisque; -->
            <div style="text-align:left">
              <Row>
                <Col span="8"><img src="../../../static/img/icons/MasterControlNoraml.png"></Col>
                <Col span="16">
                  <h4>{{MasterControl.main_control_name}}</h4>
                  <Row class="MarginT_20">
                    <Col span="12"><img class="iconImg" src="../../../static/img/icons/editor-line.png"><span @click="editMasterInfo(MasterControl.id, MasterControl.main_control_name)">编辑</span></Col>
                    <Col span="12" class="TextAlignR"><img class="iconImg" src="../../../static/img/icons/delete.png"><span @click="deleteMaster(MasterControl)">删除</span></Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
    <NoData v-if="MasterControlList.length == 0"/>
    <!-- 添加主控 -->
    <Modal v-model="ifAddMaster" width="360">
      <p slot="header" style="color:#333;text-align:left">
          <!-- <Icon type="ios-information-circle"></Icon> -->
          <span>添加{{addName}}产品</span>
      </p>
      <div style="text-align:left">
          <Form :model="formMaster" ref="formMaster" :rules="ruleValidate" label-position="left" :label-width="100">
            <!-- <FormItem label="选择主控" prop="selectName">
              <Select v-model="formMaster.selectName">
                <Option v-for="item in addMasterList" :value="item.deviceDescibe" :key="item.id">{{ item.deviceDescibe }}</Option>
              </Select>
            </FormItem> -->
            <FormItem label="主控名称" prop="masterName">
              <Input v-model="formMaster.masterName" placeholder="请输入主控名称" style="" />
            </FormItem>
            <FormItem label="主控码" prop="masterCode">
              <Input v-model="formMaster.masterCode" placeholder="请输入主控码" style="" />
            </FormItem>
          </Form>
      </div>
      <div slot="footer" class="TextAlignC">
        <Button type="error" size="large" :loading="btLoading" @click="handleSubmit('formMaster')">
          <span v-if="!btLoading">确认添加</span>
          <span v-else>Loading...</span>
        </Button>
        <!-- <Button type="error" size="large" @click="handleSubmit('formMaster')">确认添加</Button> -->
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
      MasterControlList: [],
      newMasterControlName: '',
      addMasterList: [],
      formMaster: {
        masterCode: '',
        masterName: ''
        // selectName: ''
      },
      ruleValidate: {
        masterName: [
          { required: true, message: '请填写主控名称！', trigger: 'change' }
        ],
        masterCode: [
          { required: true, message: '主控码不能为空！', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      curHome: state => state.curHome
    }),
    ifAddMaster: {
      get: function () {
        return this.$store.state.ifAddMaster
      },
      set: function (newValue) {
        this.changeModalShow('Master')
      }
    }
  },
  watch: {
    curHomeId: function (val) {
      this.getMasterControl()
    }
  },
  components: {
    NoData
  },
  created () {
    this.getMasterControl()
    // this.filterMasterControl()
    this.formMaster.masterName = this.addName
  },
  methods: {
    ...mapActions([
      'toggleSpin',
      'changeModalShow'
    ]),
    editMasterInfo (MasterControlId, MasterControlName) {
      if (!this.curHome.isCreater) {
        this.$Message.warning('您不是管理员不能进行该操作！')
        return false
      }
      this.$Modal.confirm({
        onOk: () => {
          if (this.newMasterControlName.trim() === '') {
            this.$Message.error('主控名称不能为空!')
            return false
          }
          this.sureModify(MasterControlId)
        },
        render: (h) => {
          return h('Input', {
            props: {
              value: this.newMasterControlName === '' ? MasterControlName : this.newMasterControlName,
              autofocus: true,
              placeholder: '请输入新的主控名称...'
            },
            on: {
              input: (val) => {
                this.newMasterControlName = val
              }
            }
          })
        }
      })
    },
    // 更新主控名称
    sureModify (MasterControlId) {
      send({
        name: '/mainControl?main_control_name=' + this.newMasterControlName + '&id=' + MasterControlId,
        method: 'PUT',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.$Message.success('修改成功!')
            this.getMasterControl()
            this.newMasterControlName = ''
            break
          default:
            this.$Message.error(_res.data.message)
        }
      }).catch((_res) => {
        console.log(_res)
        this.$Message.error('Interface Error!')
      })
    },
    deleteMaster (MasterControl) {
      if (!this.curHome.isCreater) {
        this.$Message.warning('您不是管理员不能进行该操作！')
        return false
      }
      this.$Modal.confirm({
        title: '提示',
        content: '该操作会将' + MasterControl.main_control_name + '主控下面的从控以及设备全部删除，确定删除该主控?',
        onOk: () => {
          this.sureDel(MasterControl)
        },
        onCancel: () => {
        }
      })
    },
    // 删除设备
    sureDel (MasterControl) {
      this.toggleSpin(true)
      send({
        name: '/mainControl?id=' + MasterControl.id + '&main_control_code=' + MasterControl.main_control_code + '&home_id=' + this.curHomeId + '&register_id=' + this.$store.state.register_id,
        method: 'DELETE',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.getMasterControl()
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
    getMasterControl () {
      send({
        name: '/mainControlByType?home_id=' + this.curHomeId + '&mainControl_Type=' + this.addKind,
        method: 'GET',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.MasterControlList = _res.data.mainControlList
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
    getMasterControl2 () {
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
          this.addMaster()
        } else {
          this.$Message.warning('请将信息填写完成!')
        }
      })
    },
    // 添加主控
    addMaster () {
      if (this.btLoading) {
        return false
      }
      // this.toggleSpin(true)
      this.btLoading = true
      send({
        name: '/mainControl?home_id=' + this.curHomeId + '&main_control_name=' + this.formMaster.masterName + '&main_control_code=' + this.formMaster.masterCode + '&main_control_type=' + this.addKind,
        method: 'POST',
        data: {
          // home_id: this.curHomeId,
          // main_control_name: this.formMaster.masterName.trim() !== '' ? this.formMaster.masterName.trim() : this.formMaster.selectName,
          // main_control_code: this.formMaster.masterCode
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            // this.toggleSpin(false)
            this.changeModalShow('Master')
            this.$Message.success('添加成功！')
            this.getMasterControl()
            this.btLoading = false
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
<style lang="less">
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
