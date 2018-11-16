<template>
  <div class="scene">
    <div v-if="sceneList.length > 0" class="ListBox">
      <Row type="flex" justify="start" class="code-row-bg">
        <Col span="8"  v-for="(Scene, idx) in sceneList" :key="idx">
          <Card style="width: 90%;margin-bottom:30px;">
            <div style="text-align:left">
              <Row>
                <Col span="8" class="eqIcon">
                  <img :src="Scene.img ? Scene.img : '../../../static/img/icons/eqNormalIcon.png'">
                </Col>
                <Col span="12">
                  <h4>{{Scene.name}}</h4>
                  <Row class="operationIcon">
                    <Col span="24">
                      <i-switch title="设备开关" style="float:left;margin-top:0px;" :value="Scene.status == 1? true: false">
                        <span slot="open">ON</span>
                        <span slot="close">OFF</span>
                      </i-switch>
                    </Col>
                  </Row>
                </Col>
                <Col span="4" class="eqIcon">
                  <Row type="flex">
                    <Col span="24" class="eqIcon">
                      <Button type="success" size="small">编辑</Button>
                    </Col>
                    <Col span="24" class="eqIcon MarginT_10">
                      <Button type="error" size="small">删除</Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <!-- <Row class="MarginT_10 PaddingT_16 BorderT_gray">
                <Col span="12"><span class="hoverColor">
<img class="iconImg" src="../../../static/img/icons/editor-line.png" @click="editEqInfo(EQ.id, EQ.device_name)"><span @click="editEqInfo(EQ.id, EQ.device_name)">编辑</span></span></Col>
                <Col span="12" class="TextAlignR"><span class="hoverColor"><img @click="deleteEq(EQ)" class="iconImg" src="../../../static/img/icons/delete.png"><span @click="deleteEq(EQ)">删除</span></span></Col>
              </Row> -->
            </div>
          </Card>
        </Col>
      </Row>
    </div>
    <NoData v-if="sceneList.length == 0"/>
    <!-- 添加场景 -->
    <Modal v-model="ifAddScene" scrollable width="850">
      <p slot="header" style="color:#333;text-align:left">
          <!-- <Icon type="ios-information-circle"></Icon> -->
          <span>添加场景</span>
      </p>
      <div style="text-align:left">
          <Form :model="formScene" ref="formScene" :rules="ruleValidateScene" label-position="left" :label-width="100">
            <FormItem label="场景名称" prop="SceneName">
              <Input v-model="formScene.SceneName" placeholder="输入场景名称" style="" />
            </FormItem>
            <FormItem label="时间" prop="SceneTime">
              <TimePicker type="time" placeholder="开始时间" style="width: 168px"></TimePicker>
              ——
              <TimePicker type="time" placeholder="结束时间" style="width: 168px"></TimePicker>
            </FormItem>
            <FormItem label="" prop="SceneWeek">
              <CheckboxGroup v-model="SceneWeek">
                <Checkbox label="单"></Checkbox>
                <Checkbox label="一"></Checkbox>
                <Checkbox label="二"></Checkbox>
                <Checkbox label="三"></Checkbox>
                <Checkbox label="四"></Checkbox>
                <Checkbox label="五"></Checkbox>
                <Checkbox label="六"></Checkbox>
                <Checkbox label="日"></Checkbox>
              </CheckboxGroup>
            </FormItem>
            <FormItem label="设备列表" prop="">
              <Row>
                <Col span="24" class="MarginB_10">
                  <span>空气哨兵</span>
                  <Select @on-change="changeOperation(index)" style="width: 150px;">
                    <Option v-for="(item, idxOperation) in operationArray" :value="item.val" :key="idxOperation">{{ item.lab }}</Option>
                  </Select>
                  <Select @on-change="changeOperation(index)" style="width: 150px;">
                    <Option v-for="(item, idxOperation) in operationArray" :value="item.val" :key="idxOperation">{{ item.lab }}</Option>
                  </Select>
                </Col>
                <Col span="24" class="MarginB_10">
                  <span>空气哨兵</span>
                  <Select @on-change="changeOperation(index)" style="width: 150px;">
                    <Option v-for="(item, idxOperation) in operationArray" :value="item.val" :key="idxOperation">{{ item.lab }}</Option>
                  </Select>
                  <Select @on-change="changeOperation(index)" style="width: 150px;">
                    <Option v-for="(item, idxOperation) in operationArray" :value="item.val" :key="idxOperation">{{ item.lab }}</Option>
                  </Select>
                </Col>
                <Col span="4">
                  <Button type="dashed" long @click="handleAdd" icon="md-add">添加设备</Button>
                </Col>
              </Row>
            </FormItem>
          </Form>
      </div>
      <div slot="footer" class="TextAlignC">
          <!-- <Button v-if="EqType == '单品'"  type="error" size="large" :loading="btLoading" @click="handleSubmitSingle('formSingle')">
            <span v-if="!btLoading">确认添加</span>
            <span v-else>Loading...</span>
          </Button>
          <Button v-if="EqType == '无线设备'"  type="error" size="large" :loading="btLoading" @click="handleSubmitEQ('formEQNormal')">
            <span v-if="!btLoading">确认添加</span>
            <span v-else>Loading...</span>
          </Button> -->
      </div>
    </Modal>
    <Modal v-model="ifChoose" scrollable width="350">
      <p slot="header" style="color:#333;text-align:left">
          <span>选择设备</span>
      </p>
      <div style="text-align:left">
        <!-- <CheckboxGroup v-model="formScene.Scene_EQList" @on-change="changeEqList"> -->
        <Checkbox v-for="(item, idx) in EqList" :key="idx" @on-change="changeEqList">{{item.device_name}}</Checkbox>
        <!-- <Checkbox v-for="(item, idx) in EqList" :key="idx" :label="item.device_name" @on-change="changeEqList"></Checkbox> -->
        <!-- </CheckboxGroup> -->
      </div>
      <div slot="footer" class="TextAlignC">
          <Button type="error" size="large">确认添加</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import {send} from '../../util/send'
import NoData from '../NoData.vue'
export default {
  name: 'Problem',
  props: ['curHomeId'],
  data () {
    return {
      ifChoose: false,
      index: 1,
      operationArray: [{val: 0, lab: '关闭'}, {val: 0, lab: '打开'}],
      EqList: [],
      sceneList: [{name: '回家模式', status: 0}],
      SceneWeek: [],
      formScene: {
        SceneName: '',
        SceneTime: '',
        SceneWeek: [],
        items: [
          {
            value: '',
            index: 1,
            status: 1,
            when: 0
          }
        ],
        Scene_EQList: []
      },
      ruleValidateScene: {
        SingleSelectName: [
          { required: true, message: '请输入场景名称！', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      curMenu: state => state.sider.curMenu,
      curHome: state => state.curHome
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
    this.getAllEq()
  },
  components: {
    NoData
  },
  methods: {
    ...mapActions([
      'changeModalShow'
    ]),
    editEqInfo () {

    },
    deleteEq () {

    },
    getAllScene () {

    },
    handleAdd () {
      this.ifChoose = true
    },
    handleRemove (index) {
      this.formScene.items[index].status = 0
    },
    changeEqList (item) {
      console.log(item)
    },
    changeEq (idx) {
      this.EqList[idx].choosed = true
      console.log(this.EqList[idx])
      console.log(this.formScene.items)
    },
    changeOperation (idx, val) {
      console.log(idx)
      console.log(val)
    },
    // 所有场景
    getAllEq () {
      send({
        name: '/selecteqlist?home_id=' + this.curHomeId,
        method: 'GET',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.EqList = _res.data.deviceHomeList
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
  margin: 0 0 40px 0;
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
.CheckboxIcon{
  width: 20px;
  height: 20px;
}
</style>
