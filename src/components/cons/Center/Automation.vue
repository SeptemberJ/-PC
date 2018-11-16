<template>
  <div class="Automation">
    <!-- <Row style="padding-right: 34px;">
      <Col span="10"><h1>自动化</h1></Col>
    </Row> -->
    <!-- 自动化列表 -->
    <div v-if="automationList.length > 0" class="ListBox">
      <Row type="flex" justify="start" class="code-row-bg">
        <Col span="8"  v-for="(Automation, idx) in automationList" :key="idx">
          <Card style="width: 90%;margin-bottom:30px;">
            <div style="text-align:left">
              <Row>
                <Col span="8" class="eqIcon">
                  <img :src="Automation.img ? Automation.img : '../../../static/img/icons/eqNormalIcon.png'">
                </Col>
                <Col span="12">
                  <h4>{{Automation.auto_name}}</h4>
                  <Row class="operationIcon">
                    <Col span="24">
                      <i-switch title="设备开关" style="float:left;margin-top:0px;" :value="Automation.status == 1? true: false">
                        <span slot="open">ON</span>
                        <span slot="close">OFF</span>
                      </i-switch>
                    </Col>
                  </Row>
                </Col>
                <Col span="4" class="eqIcon">
                  <Row type="flex">
                    <Col span="24" class="eqIcon">
                      <Button type="success" size="small" @click="EditAutomation(Automation.id)">编辑</Button>
                    </Col>
                    <Col span="24" class="eqIcon MarginT_10">
                      <Button type="error" size="small" @click="deleteAutomation(Automation.id)">删除</Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
    <NoData v-if="automationList.length == 0"/>
    <!-- 添加自动化 -->
    <Modal v-model="ifAddAutomation" scrollable width="850" :mask-closable="false">
      <p slot="header" style="color:#333;text-align:left">
          <!-- <Icon type="ios-information-circle"></Icon> -->
          <span>{{isEdit?'编辑自动化' : '添加自动化'}}</span>
      </p>
      <div style="text-align:left">
          <Form :model="formAutomation" ref="formAutomation" :rules="ruleValidateAutomation" label-position="left" :label-width="100">
            <FormItem label="自动化名称" prop="AutomationName">
              <Input v-model="formAutomation.AutomationName" placeholder="输入自动化名称" style="" />
            </FormItem>

            <!-- timing -->
            <FormItem label="定时">
              <TimePicker v-model="formAutomation.SceneTime.start" type="time" placeholder="开始时间" style="width: 168px"></TimePicker>
              ——
              <TimePicker v-model="formAutomation.SceneTime.end" type="time" placeholder="结束时间" style="width: 168px"></TimePicker>
            </FormItem>
            <FormItem label="" prop="SceneWeek">
              <span :class="formAutomation.SceneWeek.SingleTime?'weekBoxActive':'weekBox'" @click="chooseWeek(0)">单</span>
              <span :class="formAutomation.SceneWeek.Monday?'weekBoxActive':'weekBox'" @click="chooseWeek(1)">一</span>
              <span :class="formAutomation.SceneWeek.Tuesday?'weekBoxActive':'weekBox'" @click="chooseWeek(2)">二</span>
              <span :class="formAutomation.SceneWeek.Wednesday?'weekBoxActive':'weekBox'" @click="chooseWeek(3)">三</span>
              <span :class="formAutomation.SceneWeek.Thursday?'weekBoxActive':'weekBox'" @click="chooseWeek(4)">四</span>
              <span :class="formAutomation.SceneWeek.Friday?'weekBoxActive':'weekBox'" @click="chooseWeek(5)">五</span>
              <span :class="formAutomation.SceneWeek.Saturday?'weekBoxActive':'weekBox'" @click="chooseWeek(6)">六</span>
              <span :class="formAutomation.SceneWeek.Sunday?'weekBoxActive':'weekBox'" @click="chooseWeek(7)">日</span>
            </FormItem>

            <!-- condition -->
            <FormItem label="满足">
              <RadioGroup v-model="formAutomation.conditionKind">
                <Radio label="0">
                    <span>所有条件时</span>
                </Radio>
                <Radio label="1">
                    <span>任一条件时</span>
                </Radio>
              </RadioGroup>
              <!-- <Button v-if="formAutomation.condition.sensor.length != 0" type="error" shape="circle" icon="md-add" size="small" style='float: right;' @click="addCondition">添加</Button> -->
            </FormItem>
            <FormItem label="">
              <Row v-for="(sensor, sensorIdx) in formAutomation.condition.sensor" :key="sensorIdx" class="MarginB_10">
                <Col span="6">{{sensor.name}}</Col>
                <Col span="6">
                  <Select v-model="sensor.measuringPoint" style="width:150px">
                    <Option v-for="(item, idx) in measuringPointArray" :value="item.lab" :key="idx">{{ item.lab }}</Option>
                  </Select>
                </Col>
                <Col span="4">
                  <Select v-model="sensor.compare" style="width:100px">
                    <Option v-for="(item, idx) in compareArray" :value="item.lab" :key="idx">{{ item.lab }}</Option>
                  </Select>
                </Col>
                <Col span="4">
                  <Input v-model="sensor.limitNumber" placeholder="" style="width: 100px" />
                </Col>
                <Col span="3"><Icon type="ios-trash" size="18" class="CursorPointer hoverColor MarginL_10 MarginT_10" @click="removerCondition(sensorIdx, sensor.id)"/></Col>
              </Row>
            </FormItem>
            <Button type="dashed" long class="MarginB_10" icon="ios-add-circle-outline" @click="addCondition">添加自动化条件</Button>

            <!-- action -->
            <FormItem label="就执行">
              <!-- <Button v-if="formAutomation.implements.length != 0" type="error" shape="circle" icon="md-add" size="small" style='float: right;' @click="addImplement">添加</Button> -->
            </FormItem>
            <FormItem>
              <!-- 执行设备列表 -->
              <Row v-for="(implement, implementIdx) in formAutomation.implements.eqList" :key="implementIdx" class="MarginB_10">
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
                    <Option v-for="(item, idx) in settingObj[implement.deviceType].valueArray" :value="item.val" :key="idx">{{ item.lab }}</Option>
                  </Select>
                </Col>
                <!-- <Col span="4">
                  <Select v-model="implement.delay" style="width:150px">
                    <Option v-for="(item, idx) in delayArray" :value="item.lab" :key="idx">{{ item.lab }}</Option>
                  </Select>
                </Col> -->
                <Col span="3"><Icon type="ios-trash" size="18" class="CursorPointer hoverColor MarginL_10" @click="removerImplementEq(implementIdx, implement.id)"/></Col>
              </Row>
              <!-- 执行场景列表 -->
              <Row v-for="(scene, sceneIdx) in formAutomation.implements.sceneList" :key="formAutomation.implements.sceneList.length + sceneIdx" class="MarginB_10">
                <Col span="6">{{scene.sceneName}}</Col>
                <Col span="4">
                  <Select v-model="scene.scene_status" style="width:100px">
                    <Option :value="0">关闭</Option>
                    <Option :value="1">打开</Option>
                  </Select>
                </Col>
                <Col span="3"><Icon type="ios-trash" size="18" class="CursorPointer hoverColor MarginL_10" @click="removerImplementScene(sceneIdx, scene.id)"/></Col>
              </Row>
            </FormItem>
            <Button type="dashed" long class="MarginB_10" icon="ios-add-circle-outline" @click="addImplement">添加自动化动作</Button>
          </Form>
      </div>
      <div slot="footer" class="TextAlignC">
          <Button type="error" size="large" :loading="btLoading" @click="handleEditAutomation('formAutomation')">
            <span v-if="!btLoading">确认添加</span>
            <span v-else>Loading...</span>
          </Button>
      </div>
    </Modal>
    <!-- choose condition -->
    <Modal v-model="ifChooseCondition" scrollable width="350" :mask-closable="false">
      <p slot="header" style="color:#333;text-align:left">
        <span>选择启动条件</span>
      </p>
      <div style="text-align:left">
        <Row>
          <p v-if="sensorList.length == 0" class="ColorRed">您还没有添加过传感器，请先去添加</p>
          <RadioGroup v-model="conditionItemId">
            <Radio :label="sensor.id" v-for="(sensor, idx) in sensorList" :key="idx" style="display: block;">
              <span>{{sensor.device_name}}</span>
            </Radio>
          </RadioGroup>
        </Row>
      </div>
      <div slot="footer" class="TextAlignC">
          <Button type="error" size="large" @click="updateCondition">确认添加</Button>
      </div>
    </Modal>
    <!--  -->
    <Modal v-model="ifChooseAction" scrollable width="350" :mask-closable="false">
      <p slot="header" style="color:#333;text-align:left">
        <span>选择设备活场景</span>
      </p>
      <div style="text-align:left">
        <!-- 设备 -->
        <Row>
          <CheckboxGroup v-model="choosedEqList" @on-change="changeEqList">
            <Checkbox style="display: block;margin-bottom:10px;" v-for="(item, idx) in NotSensorEqList" :key="idx" :label="item.id">{{item.device_name}}</Checkbox>
          </CheckboxGroup>
        </Row>
        <!-- 场景 -->
        <Row>
          <CheckboxGroup v-model="choosedSceneList" @on-change="changeSceneList">
            <Checkbox style="display: block;margin-bottom:10px;" v-for="(item, idx) in sceneList" :key="idx" :label="item.id">{{item.scene_name}}</Checkbox>
          </CheckboxGroup>
        </Row>
      </div>
      <div slot="footer" class="TextAlignC">
          <Button type="error" size="large" @click="updateChoosedImplements">确认添加</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import {send, sendscene } from '../../../util/send'
import {Decrypt} from '../../../util/util'
import NoData from '../../NoData.vue'
export default {
  name: 'Automation',
  props: ['curHomeId'],
  data () {
    return {
      btLoading: false,
      isEdit: false,
      ifChooseCondition: false,
      ifChooseAction: false,
      actionArray: [{val: 0, lab: '关闭'}, {val: 0, lab: '打开'}],
      measuringPointArray: [{val: 'PM2.5', lab: 'PM2.5'}, {val: '温度', lab: '温度'}, {val: '湿度', lab: '湿度'}, {val: 'PM10', lab: 'PM10'}, {val: '甲醛', lab: '甲醛'}, {val: 'VOCs', lab: 'VOCs'}, {val: 'CO2', lab: 'CO2'}, {val: 'CO', lab: 'CO'}],
      compareArray: [{val: '大于', lab: '大于'}, {val: '小于', lab: '小于'}, {val: '等于', lab: '等于'}],
      delayArray: [{val: 0, lab: '立即'}, {val: 0, lab: '1'}, {val: 0, lab: '2'}],
      settingObj: {
        '021': {
          'switchArray': [{val: 0, lab: '关闭'}, {val: 1, lab: '打开'}],
          'actionArray': [{val: 0, lab: '亮度'}, {val: 1, lab: '柔度'}],
          'valueArray': [{val: 0, lab: '强'}, {val: 1, lab: '中'}, {val: 2, lab: '弱'}]
        }
      },
      automationList: [], // 自动化列表
      conditionItemId: '', // 单次选择的启动条件（传感器）
      sensorList: [{'name': '哨兵1', 'id': 'b842d2edccbc4eb698b9c23a962ea30d'}], // 用户传感器列表
      NotSensorEqList: [], // 所有可执行动作的设备
      sceneList: [], // 所有可执行动作的场景
      choosedEqList: [], // 所选择的要执行动作的设备
      choosedSceneList: [], // 所选择的要执行动作的场景
      formAutomation: {
        AutomationName: '',
        SceneTime: {
          start: '',
          end: ''
        },
        conditionKind: '0', // 0满足所有条件 1满足一个即可
        SceneWeek: {
          SingleTime: true,
          Monday: false,
          Tuesday: false,
          Wednesday: false,
          Thursday: false,
          Friday: false,
          Saturday: false,
          Sunday: false
        },
        condition: {
          timing: {},
          sensor: []
        },
        implements: {
          eqList: [],
          sceneList: []
        }
        // Automation: []
      },
      ruleValidateAutomation: {
        AutomationName: [
          { required: true, message: '请输入自动化名称！', trigger: 'change' }
        ]
      },
      openCode: ''
    }
  },
  computed: {
    ...mapState({
      curMenu: state => state.sider.curMenu,
      curHome: state => state.curHome
    }),
    ifAddAutomation: {
      get: function () {
        return this.$store.state.ifAddAutomation
      },
      set: function (newValue) {
        this.changeModalShow('Automation')
      }
    }
  },
  created () {
    this.getAllAutomation()
    this.getNotSensorEq()
    this.getSensorEq()
    this.getAllScene()
  },
  watch: {
    curHomeId: function (val) {
      this.getAllAutomation()
      this.getNotSensorEq()
      this.getSensorEq()
    }
  },
  components: {
    NoData
  },
  methods: {
    ...mapActions([
      'changeModalShow'
    ]),
    chooseWeek (week) {
      switch (week) {
        case 0:
          this.formAutomation.SceneWeek.SingleTime = true
          this.formAutomation.SceneWeek.Monday = false
          this.formAutomation.SceneWeek.Tuesday = false
          this.formAutomation.SceneWeek.Wednesday = false
          this.formAutomation.SceneWeek.Thursday = false
          this.formAutomation.SceneWeek.Friday = false
          this.formAutomation.SceneWeek.Saturday = false
          this.formAutomation.SceneWeek.Sunday = false
          break
        case 1:
          this.formAutomation.SceneWeek.SingleTime = false
          this.formAutomation.SceneWeek.Monday = !this.formAutomation.SceneWeek.Monday
          break
        case 2:
          this.formAutomation.SceneWeek.SingleTime = false
          this.formAutomation.SceneWeek.Tuesday = !this.formAutomation.SceneWeek.Tuesday
          break
        case 3:
          this.formAutomation.SceneWeek.SingleTime = false
          this.formAutomation.SceneWeek.Wednesday = !this.formAutomation.SceneWeek.Wednesday
          break
        case 4:
          this.formAutomation.SceneWeek.SingleTime = false
          this.formAutomation.SceneWeek.Thursday = !this.formAutomation.SceneWeek.Thursday
          break
        case 5:
          this.formAutomation.SceneWeek.SingleTime = false
          this.formAutomation.SceneWeek.Friday = !this.formAutomation.SceneWeek.Friday
          break
        case 6:
          this.formAutomation.SceneWeek.SingleTime = false
          this.formAutomation.SceneWeek.Saturday = !this.formAutomation.SceneWeek.Saturday
          break
        case 7:
          this.formAutomation.SceneWeek.SingleTime = false
          this.formAutomation.SceneWeek.Sunday = !this.formAutomation.SceneWeek.Sunday
          break
      }
    },
    addCondition () {
      this.ifChooseCondition = true
    },
    addImplement () {
      this.ifChooseAction = true
    },
    changeEqList () {
      console.log(this.choosedEqList)
    },
    changeSceneList () {
      console.log(this.choosedSceneList)
    },
    // 更新执行设备和场景列表
    updateChoosedImplements () {
      let newEqListArray = []
      let newSceneListArray = []
      this.choosedEqList.map((ID, idx) => {
        // 是否已添加
        if (this.filterEq(ID, 'eqList').length === 0) {
          let newObj = this.NotSensorEqList.filter(EQ => {
            return EQ.id === ID
          })
          let tempObj = {
            'eqName': newObj[0].device_name,
            'device_id': newObj[0].id,
            'deviceType': newObj[0].default_device_type,
            'device_status': 0,
            'action': 0,
            'device_value': 1,
            'delay': '立即'
          }
          newEqListArray.push(tempObj)
        } else {
          newEqListArray.push(this.filterEq(ID, 'eqList')[0])
        }
      })
      this.choosedSceneList.map((ID, idx) => {
        // 是否已添加
        if (this.filterEq(ID, 'sceneList').length === 0) {
          let newObj = this.sceneList.filter(EQ => {
            return EQ.id === ID
          })
          let tempObj = {
            'sceneName': newObj[0].scene_name,
            'scene_id': newObj[0].id,
            'scene_status': 0
          }
          newSceneListArray.push(tempObj)
        } else {
          newSceneListArray.push(this.filterEq(ID, 'sceneList')[0])
        }
      })
      this.formAutomation.implements.eqList = newEqListArray
      this.formAutomation.implements.sceneList = newSceneListArray
      this.ifChooseAction = false
    },
    filterEq (ID, PROPERTY) {
      function checkHas (implement) {
        return implement.id === ID
      }
      return (this.formAutomation.implements[PROPERTY].filter(checkHas))
    },
    // 移除执行设备
    removerImplementEq (IDX, ID) {
      this.formAutomation.implements.eqList.splice(IDX, 1)
      this.choosedEqList.filter((id, idx) => {
        if (ID === id) {
          this.choosedEqList.splice(idx, 1)
        }
      })
    },
    // 移除执行场景
    removerImplementScene (IDX, ID) {
      this.formAutomation.implements.sceneList.splice(IDX, 1)
      this.choosedsSceneList.filter((id, idx) => {
        if (ID === id) {
          this.choosedsSceneList.splice(idx, 1)
        }
      })
    },
    updateCondition () {
      let temp = this.sensorList.slice(0)
      let choosedItem = temp.filter((sensor) => {
        return (sensor.id === this.conditionItemId)
      })
      if (choosedItem[0]) {
        let newObj = {
          if_type: '1', // 0-时间 1-设备
          name: choosedItem[0].device_name,
          id: choosedItem[0].id,
          measuringPoint: '',
          compare: '',
          limitNumber: ''
        }
        this.ifChooseCondition = false
        this.formAutomation.condition.sensor.push(newObj)
      } else {
        this.$Message.warning('请选择一个启动条件!')
      }
    },
    removerCondition (IDX, ID) {
      this.formAutomation.condition.sensor.splice(IDX, 1)
    },
    // 添加自动化
    handleEditAutomation (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let formAutomation = this.formAutomation
          let sensorList = formAutomation.condition.sensor
          let len = sensorList.length
          if (len > 0) {
            // 有条件可以不定时 判断条件是否填写完整
            for (let i = 0; i < len; i++) {
              for (let key in sensorList[i]) {
                console.log(sensorList[i][key])
                if (sensorList[i][key].trim() === '') {
                  this.$Message.warning('请将条件信息填写完整!')
                  return false
                }
              }
            }
            console.log('1----------------------------')
            this.postAumation(this.formAutomation)
          } else {
            if (this.formAutomation.SceneTime.start === '' || this.formAutomation.SceneTime.end === '') {
              this.$Message.warning('如果为定时任务，请将开始与结束时间填写完整!')
              return false
            }
            console.log('2----------------------------')
            this.postAumation(this.formAutomation)
          }
        } else {
          this.$Message.warning('请将信息填写完整!')
        }
      })
    },
    postAumation (formAutomation) {
      let conditionArray = []
      let weekArray = []
      for (var key in formAutomation.SceneWeek){
        if (formAutomation.SceneWeek[key]) {
          switch (key) {
            case 'SingleTime':
              weekArray.push({'ftime': 0})
              break
            case 'Monday':
              weekArray.push({'ftime': 1})
              break
            case 'Tuesday':
              weekArray.push({'ftime': 2})
              break
            case 'Wednesday':
              weekArray.push({'ftime': 3})
              break
            case 'Thursday':
              weekArray.push({'ftime': 4})
              break
            case 'Friday':
              weekArray.push({'ftime': 5})
              break
            case 'Saturday':
              weekArray.push({'ftime': 6})
              break
            case 'Sunday':
              weekArray.push({'ftime': 7})
              break
          }
        }
      }
      formAutomation.condition.sensor.map((implement) => {
        let obj = {
          'if_type': 1,
          'if_ha3_id': implement.name,
          'if_value': implement.limitNumber,
          'if_select': implement.compare
        }
        conditionArray.push(obj)
      })
      conditionArray.push({'if_type': 0, 'if_begin_time': formAutomation.SceneTime.start, 'if_end_time': formAutomation.SceneTime.end})
      let automation = {
        home_id: this.curHomeId,
        auto_name: formAutomation.AutomationName,
        auto_type: formAutomation.conditionKind,
        auto_if_list: conditionArray,
        auto_time_list: weekArray,
        auto_execute_device: formAutomation.implements.eqList,
        auto_execute_scene: formAutomation.implements.sceneList
      }
      console.log('automation-------')
      console.log(automation)
      sendscene({
        name: '/insertauto',
        method: 'POST',
        data: {
          auto: automation
        }
      }).then(_res => {
        switch (_res.data.result) {
          case 1:
            this.getAllAutomation()
            this.changeModalShow('Automation')
            break
          default:
            this.$Message.error(_res.data.message)
        }
      }).catch((_res) => {
        console.log(_res)
        this.$Message.error('Interface Error!')
      })
    },
    // 删除场景
    deleteAutomation (AutomationId) {
      if (!this.curHome.isCreater) {
        this.$Message.warning('您不是管理员不能进行该操作！')
        return false
      }
      this.$Modal.confirm({
        title: '提示',
        onOk: () => {
          if (Decrypt(localStorage['openCode']) === this.openCode) {
            this.sureDel(AutomationId)
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
    sureDel (AutomationId) {
      sendscene({
        name: '/deleteAuto?id=' + AutomationId,
        method: 'DELETE',
        data: {
        }
      }).then(_res => {
        switch (_res.data.result) {
          case 1:
            this.getAllAutomation()
            break
          default:
            this.$Message.error(_res.data.message)
        }
      }).catch((_res) => {
        console.log(_res)
        this.$Message.error('Interface Error!')
      })
    },
    // 编辑自动化
    EditAutomation (AutomationId) {
      this.isEdit = true
      sendscene({
        name: '/queryAutoDetial?id=' + AutomationId,
        method: 'GET',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            // week
            let SceneWeek = {
              SingleTime: true,
              Monday: false,
              Tuesday: false,
              Wednesday: false,
              Thursday: false,
              Friday: false,
              Saturday: false,
              Sunday: false
            }
            _res.data.auto_time_list.map((item) => {
              switch (item.fval) {
                case '0':
                  SceneWeek.SingleTime = true
                  break
                case '1':
                  SceneWeek.SingleTime = false
                  SceneWeek.Monday = true
                  break
                case '2':
                  SceneWeek.SingleTime = false
                  SceneWeek.Tuesday = true
                  break
                case '3':
                  SceneWeek.SingleTime = false
                  SceneWeek.Wednesday = true
                  break
                case '4':
                  SceneWeek.SingleTime = false
                  SceneWeek.Thursday = true
                  break
                case '5':
                  SceneWeek.SingleTime = false
                  SceneWeek.Friday = true
                  break
                case '6':
                  SceneWeek.SingleTime = false
                  SceneWeek.Saturday = true
                  break
                case '7':
                  SceneWeek.SingleTime = false
                  SceneWeek.Sunday = true
                  break
              }
            })
            // condition
            let  condition = {
              timing: {},
              sensor: []
            }
            let SceneTime = {
              start: '',
              end: ''
            }
            _res.data.auto_if_list.map((item) => {
              if (item.if_type === '0') {
                // 时间条件
                SceneTime.start = item.if_begin_time
                SceneTime.start = item.if_end_time
              } else {
                // 传感器条件
              }
            })
            // 执行的设备列表
            let eqList = []
            _res.data.auto_execute_device_list.map((item) => {
              let obj = {
                eqName: '--',
                device_status: item.device_status,
                device_value: item.device_value
              }
              eqList.push(sceneList)
            })
            
            // 执行的场景列表
            let sceneList = []
            _res.data.auto_execute_device_list.map((item) => {
              let obj = {
                sceneName: '--',
                scene_status: item.scene_status
              }
              sceneList.push(sceneList)
            })
            this.formAutomation = {
              AutomationName: _res.data.autodetail[0].auto_name,
              SceneTime: SceneTime,
              conditionKind: _res.data.autodetail[0].auto_type, // 0满足所有条件 1满足一个即可
              SceneWeek: SceneWeek,
              condition: {
                timing: {},
                sensor: []
              },
              implements: {
                eqList: eqList,
                sceneList: sceneList
              }
              // Automation: []
            }
            this.changeModalShow('Automation')
            break
          default:
            this.$Message.error(_res.data.message)
        }
      }).catch((_res) => {
        console.log(_res)
        this.$Message.error('Interface Error!')
      })
    },
    // 所有传感器
    getSensorEq () {
      sendscene({
        name: '/queryHA3List?home_id=' + this.curHomeId,
        method: 'GET',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.sensorList = _res.data.HA3list
            break
          default:
            this.$Message.error(_res.data.message)
        }
      }).catch((_res) => {
        console.log(_res)
        this.$Message.error('Interface Error!')
      })
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
    // 所有自动化
    getAllAutomation () {
      sendscene({
        name: '/queryAutoList?home_id=' + this.curHomeId,
        method: 'GET',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.automationList = _res.data.autolist
            break
          default:
            this.$Message.error(_res.data.message)
        }
      }).catch((_res) => {
        console.log(_res)
        this.$Message.error('Interface Error!')
      })
    },
    getAllScene () {
      sendscene({
        name: '/querySceneList?home_id=' + this.curHomeId,
        method: 'GET',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            // _res.data.scenelist.map((item) => {
            //   item.scene_status = item.scene_status === '1' ? true : false
            // })
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
  }
}
</script>
<style lang="less" scoped>
.Automation{
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
.weekBox{
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  background: #ccc;
  display: inline-block;
  cursor: pointer;
}
.weekBoxActive{
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  background: #2d8cf0;
  display: inline-block;
  color: #fff;
  cursor: pointer;
}
.weekBox2not(:last-child){
  border-right: 1px solid #2d8cf0;
}
.CheckboxIcon{
  width: 20px;
  height: 20px;
}
</style>
