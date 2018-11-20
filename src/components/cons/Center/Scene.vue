<template>
  <div class="Scene">
    <!-- <Row style="padding-right: 34px;">
      <Col span="10"><h1>场景</h1></Col>
    </Row> -->
    <!-- 场景列表 -->
    <div v-if="sceneList.length > 0" class="ListBox">
      <Row type="flex" justify="start" class="code-row-bg">
        <Col span="8"  v-for="(Scene, idx) in sceneList" :key="idx">
          <Card style="width: 90%;margin-bottom:30px;">
            <div style="text-align:left">
              <Row>
                <Col span="8" class="eqIcon">
                  <img :src="Scene.scene_pic ? Scene.scene_pic : '../../../static/img/icons/eqNormalIcon.png'">
                </Col>
                <Col span="12">
                  <h4>{{Scene.scene_name}}</h4>
                  <Row class="operationIcon">
                    <Col span="24">
                      <!-- <Button size="small" :loading="stillLoading" shape="circle" type="primary" @click="OperationToggle(Scene, Scene.scene_status, idx)"><span>{{Scene.scene_status == 1? 'ON': 'OFF'}}</span></Button> -->
                      <i-switch title="设备开关" style="float:left;margin-top:0px;" v-model="Scene.scene_status" @on-change="OperationToggle(Scene, Scene.scene_status, idx)">
                        <span slot="open">ON</span>
                        <span slot="close">OFF</span>
                      </i-switch>
                    </Col>
                  </Row>
                </Col>
                <Col span="4" class="eqIcon">
                  <Row type="flex">
                    <Col span="24" class="eqIcon">
                      <Button type="success" size="small" @click="editScene(Scene.id)">编辑</Button>
                    </Col>
                    <Col span="24" class="eqIcon MarginT_10">
                      <Button type="error" size="small" @click="deleteScene(Scene.id)">删除</Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
    <NoData v-if="sceneList.length == 0"/>
    <!-- 添加场景 -->
    <Modal v-model="ifAddScene" scrollable width="850" :mask-closable="false">
      <p slot="header" style="color:#333;text-align:left">
          <!-- <Icon type="ios-information-circle"></Icon> -->
          <span>{{isEdit?'编辑场景':'添加场景'}}</span>
      </p>
      <div style="text-align:left">
          <Form :model="formScene" ref="formScene" :rules="ruleValidateScene" label-position="left" :label-width="100">
            <FormItem label="场景名称" prop="SceneName">
              <Input v-model="formScene.SceneName" placeholder="输入场景名称" style="" />
            </FormItem>
            <FormItem label="选择场景图标" prop="eqType" v-if="iconList.length > 0">
              <Button style="margin-top: -30px;" size="small" icon="ios-arrow-back" shape="circle" @click="preIcon"></Button>
              <img style="width: 40px;height: 40px;margin: auto 10px;" :src="urlPre_scene + iconList[iconIndex].fpic">
              <Button style="margin-top: -30px;" size="small" icon="ios-arrow-forward" shape="circle" @click="nextIcon"></Button>
            </FormItem>
            <FormItem label="执行任务" prop="SceneTime">
              <Row v-for="(implement, implementIdx) in formScene.implements" :key="implementIdx" class="MarginB_10">
                <Col span="6">{{implement.eqName}}</Col>
                <Col span="4">
                  <Select v-model="implement.device_status" style="width:100px">
                    <Option v-for="(item, idx) in settingObj[implement.deviceType].switchArray" :value="item.val" :key="idx">{{ item.lab }}</Option>
                  </Select>
                </Col>
                <Col span="2">
                  <p v-if="implement.deviceType == '022'">亮度</p>
                </Col>
                <!-- <Col span="4">
                  <Select v-model="implement.action" style="width:100px">
                    <Option v-for="(item, idx) in settingObj[implement.deviceType].actionArray" :value="item.val" :key="idx">{{ item.lab }}</Option>
                  </Select>
                </Col> -->
                <Col span="4" v-if="implement.deviceType == '022'">
                  <Select v-model="implement.device_value" style="width:100px">
                    <Option v-for="(item, idx) in settingObj[implement.deviceType].valueArray" :value="item.fval" :key="idx">{{ item.fname }}</Option>
                  </Select>
                </Col>
                <!-- <Col span="4">
                  <Select v-model="implement.delay" style="width:150px">
                    <Option v-for="(item, idx) in delayArray" :value="item.lab" :key="idx">{{ item.lab }}</Option>
                  </Select>
                </Col> -->
                <Col span="3"><Icon type="ios-trash" size="18" class="CursorPointer hoverColor MarginL_10" @click="removerImplement(implementIdx, implement.id)"/></Col>
              </Row>
            </FormItem>
            <Row>
              <Col span="24" class="TextAlignR">
                <Button class="MarginB_20" type="dashed" long icon="ios-add-circle-outline" size="small" @click="chooseEqList">添加执行任务</Button>
              </Col>
            </Row>
          </Form>
      </div>
      <div slot="footer" class="TextAlignC">
          <Button type="error" size="large" :loading="btLoading" @click="handleEditScene('formScene')">
            <span v-if="!btLoading">确认添加</span>
            <span v-else>Loading...</span>
          </Button>
      </div>
    </Modal>
    <Modal v-model="ifChoose" scrollable width="350" :mask-closable="false">
      <p slot="header" style="color:#333;text-align:left">
          <span>选择设备</span>
      </p>
      <div style="text-align:left">
        <Row>
          <CheckboxGroup v-model="choosedEqList" @on-change="changeEqList">
            <Checkbox style="display: block;margin-bottom:10px;" v-for="(item, idx) in NotSensorEqList" :key="idx" :label="item.id">{{item.device_name}}</Checkbox>
          </CheckboxGroup>
        </Row>
      </div>
      <div slot="footer" class="TextAlignC">
        <Button type="error" size="large" @click="updateChoosedEqList">确认选择</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import {sendscene} from '../../../util/send'
import {Decrypt} from '../../../util/util'
import NoData from '../../NoData.vue'
export default {
  name: 'Problem',
  props: ['curHomeId'],
  data () {
    return {
      ifChoose: false,
      btLoading: false,
      // index: 1,
      // stillLoading: false,
      isEdit: false,
      switchValue: true,
      iconIndex: 0,
      iconList: [],
      settingObj: {},
      settingObj2: {
        '021': {
          'switchArray': [{val: '0', lab: '关闭'}, {val: '1', lab: '打开'}],
          'actionArray': [{val: '0', lab: '亮度'}, {val: '1', lab: '柔度'}],
          'valueArray': [{val: '0', lab: '强'}, {val: '1', lab: '中'}, {val: '2', lab: '弱'}]
        }
      },
      NotSensorEqList: [],
      choosedEqList: [],
      sceneList: [],
      SceneWeek: [],
      formScene: {
        SceneName: '',
        SceneIcon: '',
        implements: []
      },
      ruleValidateScene: {
        SceneName: [
          { required: true, message: '请输入场景名称！', trigger: 'change' }
        ]
      },
      openCode: ''
    }
  },
  computed: {
    ...mapState({
      curMenu: state => state.sider.curMenu,
      curHome: state => state.curHome,
      urlPre_scene: state => state.urlPre_scene
    }),
    ifAddScene: {
      get: function () {
        return this.$store.state.ifAddScene
      },
      set: function (newValue) {
        this.changeModalShow('Scene')
      }
    }
  },
  watch: {
    curHomeId: function (val) {
      this.getAllScene()
      this.getNotSensorEq()
    },
    ifAddScene: function (val) {
      if (!val) {
        this.formScene = {
          SceneName: '',
          SceneIcon: '',
          implements: []
        }
        this.isEdit = false
      }
    }
    // keyWord: function (val) {
    //   console.log(val)
    //   if (val.trim() !== '') {
    //     this.ifSearch = true
    //     this.search()
    //   } else {
    //     this.ifSearch = false
    //     this.resultList = []
    //   }
    // }
  },
  created () {
    this.getAllScene()
    this.getNotSensorEq()
    this.getSceneIcon()
    this.getActionValue()
  },
  components: {
    NoData
  },
  methods: {
    ...mapActions([
      'changeModalShow'
    ]),
    preIcon () {
      if (this.iconIndex === 0) {
        this.iconIndex = this.iconList.length - 1
      } else {
        this.iconIndex--
      }
    },
    nextIcon () {
      if (this.iconIndex === (this.iconList.length - 1)) {
        this.iconIndex = 0
      } else {
        this.iconIndex++
      }
    },
    // 移除执行设备
    removerImplement (IDX, ID) {
      this.formScene.implements.splice(IDX, 1)
      this.choosedEqList.filter((id, idx) => {
        if (ID === id) {
          this.choosedEqList.splice(idx, 1)
        }
      })
    },
    // 添加场景
    handleEditScene (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.formScene.implements.length === 0) {
            this.$Message.warning('请添加执行任务!')
            return false
          }
          let scene = {
            id: this.formScene.SceneId ? this.formScene.SceneId : '',
            scene_name: this.formScene.SceneName,
            scene_pic: this.urlPre_scene + this.iconList[this.iconIndex].fpic,
            home_id: this.curHomeId,
            devicelist: this.formScene.implements
          }
          this.btLoading = true
          sendscene({
            name: this.isEdit ? '/updatescene' : '/insertscene',
            method: 'POST',
            data: {
              scene: scene
            }
          }).then(_res => {
            switch (_res.data.result) {
              case 1:
                this.getAllScene()
                this.changeModalShow('Scene')
                this.formScene = {
                  SceneName: '',
                  SceneIcon: '',
                  implements: []
                }
                this.iconIndex = 0
                this.isEdit = false
                // 清空输入框
                break
              default:
                this.$Message.error(_res.data.message)
            }
          }).catch((_res) => {
            console.log(_res)
            this.$Message.error('Interface Error!')
          })
          this.btLoading = false
        } else {
          this.$Message.warning('请将信息填写完整!')
        }
      })
    },
    // 删除场景
    deleteScene (SceneId) {
      if (!this.curHome.isCreater) {
        this.$Message.warning('您不是管理员不能进行该操作！')
        return false
      }
      this.$Modal.confirm({
        title: '提示',
        onOk: () => {
          if (Decrypt(localStorage['openCode']) === this.openCode) {
            this.sureDel(SceneId)
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

            }, '该操作会场景删除！'),
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
    sureDel (SceneId) {
      sendscene({
        name: '/deleteScene?id=' + SceneId,
        method: 'DELETE',
        data: {
        }
      }).then(_res => {
        switch (_res.data.result) {
          case 1:
            this.getAllScene()
            break
          default:
            this.$Message.error(_res.data.message)
        }
      }).catch((_res) => {
        console.log(_res)
        this.$Message.error('Interface Error!')
      })
    },
    // 修改场景
    editScene (SceneId) {
      this.isEdit = true
      sendscene({
        name: '/querySceneDetail?id=' + SceneId,
        method: 'GET',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            _res.data.sceneDeviceDetail.map((item) => {
              item.eqName = item.device_name
              // item.device_id = item.device_name
              item.deviceType = item.default_device_type
              item.device_status = item.device_status
              item.device_value = item.device_value
            })
            this.iconList.filter((icon, idx) => {
              if (_res.data.sceneDetail[0].scene_pic.indexOf(icon.fpic) !== -1) {
                this.iconIndex = idx
              }
            })
            this.formScene = {
              SceneId: SceneId,
              SceneName: _res.data.sceneDetail[0].scene_name,
              SceneIcon: _res.data.sceneDetail[0].scene_pic,
              implements: _res.data.sceneDeviceDetail
            }
            this.changeModalShow('Scene')
            break
          default:
            this.$Message.error(_res.data.message)
        }
      }).catch((_res) => {
        console.log(_res)
        this.$Message.error('Interface Error!')
      })
    },
    // 场景开关
    OperationToggle (Scene, status, idx) {
      sendscene({
        name: '/updateStatus?id=' + Scene.id + '&status=' + (status ? '1' : '0'),
        method: 'PUT',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.getAllScene()
            break
          default:
            this.$Message.error(_res.data.message)
        }
      }).catch((_res) => {
        console.log(_res)
        this.$Message.error('Interface Error!')
      })
    },
    chooseEqList () {
      this.ifChoose = true
    },
    changeEqList () {
      console.log(this.choosedEqList)
    },
    // 更新执行设备列表
    updateChoosedEqList () {
      let newArray = []
      // let oldArray = this.formScene.implements.slice(0)
      this.choosedEqList.map((ID, idx) => {
        // 是否已添加
        if (this.filterEq(ID).length === 0) {
          let newObj = this.NotSensorEqList.filter(EQ => {
            return EQ.id === ID
          })
          let tempObj = {
            'eqName': newObj[0].device_name,
            'device_id': newObj[0].id,
            'deviceType': newObj[0].default_device_type,
            'device_status': '1',
            // 'action': 0,
            'device_value': this.settingObj[newObj[0].default_device_type].valueArray[0].fval
            // 'delay': '立即'
          }
          newArray.push(tempObj)
        } else {
          newArray.push(this.filterEq(ID)[0])
        }
      })
      this.formScene.implements = newArray
      this.ifChoose = false
    },
    filterEq (ID) {
      function checkHas (implement) {
        return implement.id === ID
      }
      return (this.formScene.implements.filter(checkHas))
    },
    // 除传感器外的所有设备
    getNotSensorEq () {
      sendscene({
        name: '/queryNotHA3List?home_id=' + this.curHomeId,
        method: 'GET',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.NotSensorEqList = _res.data.notHA3list
            break
          default:
            this.$Message.error(_res.data.message)
        }
      }).catch((_res) => {
        console.log(_res)
        this.$Message.error('Interface Error!')
      })
    },
    // 所有场景
    getAllScene () {
      sendscene({
        name: '/querySceneList?home_id=' + this.curHomeId,
        method: 'GET',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            _res.data.scenelist.map((item) => {
              item.scene_status = item.scene_status === '1'
              // item.scene_status = item.scene_status === '1' ? true : false
            })
            this.sceneList = _res.data.scenelist
            break
          default:
            this.$Message.error(_res.data.message)
        }
      }).catch((_res) => {
        console.log(_res)
        this.$Message.error('Interface Error!')
      })
    },
    // 所有场景图标
    getSceneIcon () {
      sendscene({
        name: '/queryDefaultPic',
        method: 'GET',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.iconList = _res.data.scenePiclist
            break
          default:
            this.$Message.error(_res.data.message)
        }
      }).catch((_res) => {
        console.log(_res)
        this.$Message.error('Interface Error!')
      })
    },
    // 所有执行操作值
    getActionValue () {
      sendscene({
        name: '/deviceTypeValue',
        method: 'GET',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            let tempActionArray = {}
            _res.data.deviceTypeValueList.typeList.map((item) => {
              tempActionArray[item.device_code] = {
                'switchArray': [{val: '0', lab: '关闭'}, {val: '1', lab: '打开'}],
                'valueArray': item.typeValueList
              }
            })
            console.log(tempActionArray)
            this.settingObj = tempActionArray
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
.Scene{
  margin: 10px 0;
  h1{
    color: #fff;
  }
  .ListBox{
    margin: 40px 0 40px 0;
    .shortSelect{
      width: 100px;
    }
    h4{
    }
    .eqIcon img{
      width: 60px;
      height: 60px;
    }
    p{
      height: 25px;
      line-height: 25px;
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
      width: 25px;
      height: 25px;
      margin-right: 5px;
      display: inline-block;
      vertical-align: bottom;
      cursor: pointer;
    }
    .scaleAnimation{
      box-shadow: 0px 0px 4px #888888;
      padding: 4px;
      animation:ScaleToggle2 2s infinite ease-in-out forwards;
      -webkit-animation:ScaleToggle2 2s infinite ease-in-out forwards;
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
}
.CheckboxIcon{
  width: 20px;
  height: 20px;
}
</style>
