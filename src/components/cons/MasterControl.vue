<template>
  <div class="AllEquipment">
    <div class="ListBox" v-if="MasterControlList.length > 0">
      <Row type="flex" justify="start" class="code-row-bg">
        <Col span="12"  v-for="(MasterControl, idx) in MasterControlList" :key="idx">
          <Card style="width: 96%;margin:0 auto 30px auto;"><!-- background:bisque; -->
            <div style="text-align:left">
              <Row>
                <Col span="6"><img src="../../../static/img/icons/MasterControlNoraml.png"></Col>
                <Col span="18">
                  <h4>{{MasterControl.main_control_name}}</h4>
                  <Row class="MarginT_10">
                    <Col :lg="{span: 4}"  :md="{span: 6}" :xs="{span: 6}">
                      <p class="Bold smallSize ColorLightBlack">设备码：</p>
                    </Col>
                    <Col :lg="{span: 20}" :md="{span: 18}" :xs="{span: 18}">
                      <p class="ColorLightBlack" style="word-wrap:break-word;font-size: 12px;">{{MasterControl.main_control_code}}</p>
                    </Col>
                  </Row>
                  <!-- <p>设备码：{{MasterControl.main_control_code}}F8AC786A1E694BA893CDB5CEDF1AB308</p> -->
                  <Row class="MarginT_20">
                    <Col span="6">
                      <span class="hoverColor">
                        <img class="iconImg" src="../../../static/img/icons/genghuan.png" @click="changeCode(MasterControl.id, MasterControl.main_control_code)">
                        <span @click="changeCode(MasterControl.id, MasterControl.main_control_code)">更换</span>
                      </span>
                    </Col>
                    <Col span="6">
                      <span class="hoverColor">
                        <img class="iconImg" src="../../../static/img/icons/zengsong.png" @click="deleteMaster(MasterControl)">
                        <span @click="deleteMaster(MasterControl)">赠送</span>
                      </span>
                    </Col>
                    <Col span="6"><img @click="editMasterInfo(MasterControl.id, MasterControl.main_control_name)" class="iconImg" src="../../../static/img/icons/editor-line.png"><span @click="editMasterInfo(MasterControl.id, MasterControl.main_control_name)">编辑</span></Col>
                    <Col span="6" class="TextAlignR"><img @click="deleteMaster(MasterControl)" class="iconImg" src="../../../static/img/icons/delete.png"><span @click="deleteMaster(MasterControl)">删除</span></Col>
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
    <Modal v-model="ifAddMaster" width="850" :mask-closable="false">
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
            <FormItem label="验证码" prop="randomCode">
              <Input v-model="formMaster.randomCode" placeholder="请输入验证码" style="" />
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
import {Decrypt} from '../../util/util'
import NoData from '../NoData.vue'
export default {
  name: 'AllEquipment',
  props: ['curHomeId', 'addName', 'addKind', 'addKindId'],
  data () {
    return {
      btLoading: false,
      MasterControlList: [],
      newMasterControlName: '',
      newMasterControlCode: '',
      addMasterList: [],
      formMaster: {
        masterCode: '',
        masterName: '',
        randomCode: ''
        // selectName: ''
      },
      ruleValidate: {
        masterName: [
          { required: true, message: '请填写主控名称！', trigger: 'change' }
        ],
        masterCode: [
          { required: true, message: '主控码不能为空！', trigger: 'change' }
        ],
        randomCode: [
          { required: true, message: '验证码不能为空！', trigger: 'change' }
        ]
      },
      openCode: ''
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
    ifAddMaster: function (val) {
      if (!val) {
        this.btLoading = false
      }
    },
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
          return h('div', [
            h('h4', {
              style: {
                marginBottom: '10px'
              }

            }, '新名称'),
            h('Input', {
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
          ])
        }
      })
    },
    changeCode (MasterControlId, MasterControlCode) {
      if (!this.curHome.isCreater) {
        this.$Message.warning('您不是管理员不能进行该操作！')
        return false
      }
      this.$Modal.confirm({
        onOk: () => {
          if (this.newMasterControlCode.trim() === '') {
            this.$Message.error('新的主控码不能为空!')
            return false
          }
          this.sureModifyCode(MasterControlId, MasterControlCode)
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
                value: this.newMasterControlCode === '' ? MasterControlCode : this.newMasterControlCode,
                autofocus: true,
                placeholder: '请输入新的主控名称...'
              },
              on: {
                input: (val) => {
                  this.newMasterControlCode = val
                }
              }
            })
          ])
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
    // 更新主控code
    sureModifyCode (MasterControlId, MasterControlCode) {
      send({
        name: '/mainControlCode?main_control_code_old=' + MasterControlCode + '&main_control_code=' + this.newMasterControlCode + '&id=' + MasterControlId,
        method: 'PUT',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.$Message.success('修改成功!')
            this.getMasterControl()
            this.newMasterControlCode = ''
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
        onOk: () => {
          if (Decrypt(localStorage['openCode']) === this.openCode) {
            this.sureDel(MasterControl)
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

            }, '该操作会将' + MasterControl.main_control_name + '主控下面的从控以及设备全部删除，确定删除该主控?'),
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
      // this.$Modal.confirm({
      //   title: '提示',
      //   content: '该操作会将' + MasterControl.main_control_name + '主控下面的从控以及设备全部删除，确定删除该主控?',
      //   onOk: () => {
      //     this.sureDel(MasterControl)
      //   },
      //   onCancel: () => {
      //   }
      // })
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
            this.openCode = ''
            setTimeout(() => {
              this.toggleSpin(false)
              this.$Message.success('删除成功!')
            }, 1000)
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
      this.btLoading = true
      send({
        name: '/mainControl?home_id=' + this.curHomeId + '&main_control_name=' + this.formMaster.masterName + '&main_control_code=' + this.formMaster.masterCode + '&main_control_type=' + this.addKind + '&device_type_id=' + this.addKindId + '&randomCode=' + this.formMaster.randomCode,
        method: 'POST',
        data: {
        }
      }, this).then(_res => {
        switch (_res.data.code) {
          case 1:
            // this.toggleSpin(false)
            this.changeModalShow('Master')
            this.$Message.success('添加成功！')
            this.getMasterControl()
            this.btLoading = false
            break
          case 0:
            this.btLoading = false
            this.$Message.error(_res.data.message)
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
