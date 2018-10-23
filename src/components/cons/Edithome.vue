<template>
  <!-- <h1>Edithome...</h1> -->
  <div class="homeManage">
    <Row type="flex" justify="start" class="code-row-bg">
      <Col span="12"  v-show = "show">
        <template>
          <Breadcrumb>
            <BreadcrumbItem >
              <Icon type="ios-home-outline"></Icon> 家列表
            </BreadcrumbItem>
          </Breadcrumb>
        </template>
      </Col>
      <Col span="12"  v-show = "menbers">
       <template>
        <Breadcrumb>
          <BreadcrumbItem to="/Home">
            <span @click="returnback()"><Icon type="ios-home-outline"></Icon>家列表</span>
          </BreadcrumbItem>
          <BreadcrumbItem to="/">
            <Icon type="ios-contact" /> 成员授权
          </BreadcrumbItem>
        </Breadcrumb>
      </template>
      </Col>
      <Col v-show = "show" span="12" class="TextAlignR PaddingR_16"><Button type="error" icon="md-add" @click="addHome">添加家</Button></Col>
      <Col v-show = "menbers" span="12" class="TextAlignR PaddingR_16">
        <Button type="primary" icon="ios-undo" @click="returnback" class="MarginR_10">返回上级</Button>
        <Button type="error" icon="md-add" @click="addmenbers">添加成员</Button>
      </Col>
    </Row>
    <div class="HomeList" v-if="homelist.length > 0">
      <Row  v-show = "show">
        <Col span="8" class="col" v-for="item in homelist" :key="item.home_id" >
            <div class="list" style="width: 90%;">
                <Col span="7">
                    <div class="icon"></div>
                </Col>
                <Col span="11">
                    <div class="nametext">
                        <p class="name"><b>{{item.home_name}}</b></p>
                        <p class="printroom" style="margin-top:5px;" @click="editroom(item.home_id)">房间&nbsp;{{item.houseListcount}}</p>
                        <p class="printroom" @click="editmenbers(item.home_id,item.register_id,item.ismanager)">成员&nbsp;{{item.menberListcount}}</p>
                    </div>
                </Col>
                <Col span="6">
                    <div class="buttonlist" style="">
                        <Button type="primary" class="button1"  @click="houseedit(item.home_id,item.isdefault)">编辑</Button>
                        <Button type="primary" ghost class="button1" @click="housedel(item.home_id,item.register_id)">删除</Button>
                    </div>
                </Col>
            </div>
        </Col>
      </Row>
    </div>
    <NoData v-if="homelist.length == 0"/>
    <!-- 列表结束 -->
    <!-- 添加家 -->
    <Modal v-model="ifAddHome" scrollable width="460">
      <p slot="header" style="color:#333;text-align:left">
          <!-- <Icon type="ios-information-circle"></Icon> -->
          <span>添加家</span>
      </p>
      <div style="text-align:left">
        <Form :model="homeinfo" label-position="left" :label-width="100">
          <FormItem label="家庭名称">
            <Input v-model="homeinfo.name" placeholder="请输入家的名称"></Input>
          </FormItem>
          <FormItem label="家庭地址">
              <Input v-model="homeinfo.address" placeholder="请输入家的地址"></Input>
          </FormItem>
          <Row class="tipsTit">
            <Col span="8">在哪些房间有智能设备</Col>
            <Col span="8" offset="8" class="TextAlignR CursorPointer"><span @click="addOtherRoom">添加其他房间</span></Col>
          </Row>
          <Row>
            <Col span="24">
              <CheckboxGroup v-model="choosedRoom">
                <Checkbox :label="Room.dhouse_name" v-for="(Room, idx) in defaultRoomList" :key="idx"></Checkbox>
              </CheckboxGroup>
            </Col>
          </Row>
        </Form>
      </div>
      <div slot="footer" class="TextAlignC">
          <Button type="error" size="large" :loading="btLoading" @click="createHome">
            <span v-if="!btLoading">确认添加</span>
            <span v-else>Loading...</span>
          </Button>
      </div>
    </Modal>
    <!-- home管理 -->
    <Row v-show = "cardshow" style="margin-top:30px">
      <Col span="24">
        <Card style="width:400px">
          <p slot="title">房间管理</p>
          <p class="p" v-for="item in roomlist" :key="item.id"><span style="margin-right:30px">{{item.house_name}}</span><span style="float:right"><img src="../../../static/img/icons/delete.png" style="width:20px;height:20px;vertical-align: middle;cursor:pointer;margin-left:5px;" @click="delhomenames(item.id)"></span>&nbsp;<span style="float:right"><img src="../../../static/img/icons/editor-line.png" style="width:20px;height:20px;vertical-align: middle;cursor:pointer" @click="edithomenames(item.id,item.house_name)"></span></p>
          <!-- <p class="p" v-for="item in roomlist" :key="item.id"><span style="margin-right:30px">{{item.house_name}}</span><span style="float:right"><Icon type="ios-trash-outline" style="font-size:25px;cursor:pointer" @click="delhomenames(item.id)"/></span>&nbsp;<span style="float:right"><Icon type="ios-create-outline" style="color:#2d8cf0;font-size:25px;cursor:pointer" @click="edithomenames(item.id,item.house_name)"/></span></p> -->
          <div style="text-align:right"><span><Button type="primary" class="butt1" ghost  @click="addnewrooms()">新增</Button></span><span><Button type="primary" class="butt"  @click="turnback()">返回</Button></span></div>
        </Card>
      </Col>
    </Row>
    <div v-show = "menbers">
        <Col span="8" class="col" v-for="item in fnamelist" :key="item.id">
            <div class="list" style="width: 90%;">
                <Col span="7">
                    <div class="icon"></div>
                </Col>
                <Col span="11">
                    <div class="nametext">
                        <p class="name"><b>{{item.wx_name}}</b></p>
                        <p class="printroom" style="margin-top:5px;">手机号&nbsp;{{item.ftelephone}}</p>
                        <p class="printroom">&nbsp;</p>
                    </div>
                </Col>
                <Col span="6">
                    <div class="buttonlist" style="">
                      <Button type="dashed" class="button1" v-if="item.ismanager == 1 ">管理员</Button>
                      <Button type="primary" class="button1"  @click="authorize1(item.id,item.ismanager)" v-if="item.ismanager == 0 ">授权</Button>
                      <Button type="primary" ghost class="button1" v-if="item.ismanager == 0 " @click="deletehousemember(item.id,item.ismanager)">删除</Button>
                    </div>
                </Col>
            </div>
        </Col>
    </div>
    <Modal
        v-model="modal3"
        title="删除房间"
        @on-ok="suredelete"
        @on-cancel="cancel">
        <p>删除该房间后，该房间下的所有设备都将删除！</p>
    </Modal>
    <Modal
        v-model="modal4"
        title="删除家"
        @on-ok="surehousedelall"
        @on-cancel="cancel">
        <p>改操作会将该家下面的房间、设备以及成员信息都删除，确认删除？</p>
    </Modal>
    <Modal
        v-model="modal8"
        title="删除家庭成员"
        @on-ok="surehousedel"
        @on-cancel="cancel">
        <p>确定将该成员移除？</p>
    </Modal>
    <Modal
        v-model="homename"
        title="家信息"
        @on-ok="sureedithouse"
        @on-cancel="cancel">
        <div>
            <Form ref="form" :model="form">
                <FormItem prop="fname" label="家名字">
                    <Input style="width:60%" type="text" v-model="form.fname" placeholder="家名"></Input>
                </FormItem>
                <FormItem prop="faddress" label="家地址">
                    <Input style="width:60%" type="text" v-model="form.faddress" placeholder="家地址"></Input>
                </FormItem>
            </Form>
        </div>
    </Modal>
    <Modal
        v-model="edithomename"
        title="厨房"
        @on-ok="surechange"
        @on-cancel="cancel">
        <div>
            <Form ref="formLogin" :model="formLogin">
                <FormItem prop="name" label="房间名">
                    <Input style="width:60%" type="text" v-model="formLogin.name" placeholder="房间名">
                    </Input>
                </FormItem>
            </Form>
        </div>
    </Modal>
    <Modal
        v-model="menbernames"
        title="成员"
        @on-ok="sureaddmenber"
        @on-cancel="cancel">
        <div>
            <Form ref="menbername" :model="menbername" :rules="mobilerule">
                <FormItem prop="mobile" label="成员手机号">
                    <Input style="width:60%" type="text" v-model="menbername.mobile" placeholder="成员手机号">
                    </Input>
                </FormItem>
            </Form>
        </div>
    </Modal>
    <Modal
        v-model="addnewroom"
        title="增加房间"
        @on-ok="sureaddroom"
        @on-cancel="cancel">
        <div>
            <Form ref="roomform" :model="roomform">
                <FormItem prop="roomname" label="房间名">
                    <Input style="width:60%" type="text" v-model="roomform.roomname" placeholder="房间名">
                    </Input>
                </FormItem>
            </Form>
        </div>
    </Modal>
    <Modal
        v-model="authorizeedit"
        title="成员授权"
        @on-ok="sureauthorize"
        @on-cancel="cancel">
        <div>
            <template>
              <div v-for="(item, idx) in temp" :key="item.name" v-if="item.houseList.length > 0">
                  <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                      <Checkbox
                          :indeterminate="indeterminate"
                          :value="item.choosedAll"
                          @click.prevent.native="handleCheckAll(idx)">{{item.name}}</Checkbox>
                      <CheckboxGroup style="margin-left: 20px;margin-top: 5px;" v-model="item.choosedEQ" @on-change="checkAllGroupChange(idx, item)">
                          <Checkbox :label="house.device_name" v-for="house in item.houseList" :key="house.id"></Checkbox>
                  </CheckboxGroup>
                  </div>
             </div>
            <p style="font-size: 12px;color:#999;margin-top:10px;">(注意：若房间下无任何设备，则该房间不在授权范围内。)</p>
          </template>
        </div>
    </Modal>
  </div>
</template>
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script>
import {mapState, mapActions} from 'vuex'
import Vue from 'vue'
import axios from 'axios'
import {send} from '../../util/send'
import NoData from '../NoData.vue'
export default {
  name: 'Edithome',
  data () {
    return {
      ismanager: '',
      modal9: false,
      modal8: false,
      authorizationlist: [],
      newregister_id: '',
      memberid: [],
      newchecked: [],
      orderdata: '',
      roomname: '',
      temp: [],
      name: '',
      checkdevice: '',
      showdevice: false,
      edithouseList: '',
      indeterminate: false,
      checkAll: false,
      checkAllGroup: [],
      show: true,
      cardshow: false,
      modal4: false,
      modal3: false,
      modal2: false,
      modal_loading: false,
      menbers: false,
      value: '',
      homename: false,
      addhome: false,
      addnewroom: false,
      edithomename: false,
      menbernames: false,
      authorizeedit: false,
      homelist: '',
      homeid: '',
      roomlist: '',
      inputname: '',
      id: '',
      formLogin: {
        name: ''
      },
      form: {
        name: '',
        faddress: ''
      },
      fnamelist: '',
      menbername: {
        mobile: ''
      },
      roomform: {
        roomname: ''
      },
      isdefault: '',
      adminid: '',
      mobilerule: {
        mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            {pattern:/^0{0,1}(13[0-9]|15[0-9]|17[0-9]|14[0-9]|18[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/,message:'手机号格式不对',trigger:'blur'},
        ],
      },
      // -----------------
      ifAddHome: false,
      btLoading: false,
      // add home
      homeinfo: {
        name: '',
        address: ''
      },
      newRommName: '',
      defaultRoomList: [],
      choosedRoom: [],
      roomsFormat: []
    }
  },
  computed: {
    ...mapState({
      register_id: state => state.register_id,
      homeshowtype: state => state.home.homeshowtype,
      app_URL: state => state.home.app_URL
    })
  },
  created: function () {
    this.gethomelistinfo()
    this.getDefaultRooms()
  },
  watch: {
    choosedRoom (curVal, oldVal) {
      let temp = []
      curVal.map((name) => {
        temp.push({'house_name': name})
      })
      this.roomsFormat = temp
    }
  },
  components: {
    NoData
  },
  methods: {
    ...mapActions([
      'changeCurHome',
      'changeHomeList'
    ]),
    returnback () {
        this.menbers = false
        this.show = true
        this.gethomelistinfo()
    },
    handleCheckAll (idx) {
        if (this.temp[idx].choosedAll) {
            this.temp[idx].choosedAll = false
            this.temp[idx].choosedEQ = []
        } else {
            this.temp[idx].choosedAll = true
            this.temp[idx].houseList.map(item => {
                this.temp[idx].choosedEQ.push(item.device_name)
            })
        }
        console.log('输出id')
        console.log(this.temp)
    },
    checkAllGroupChange (idx, item) {
        if (item.choosedEQ.length !== item.houseList.length) {
            this.temp[idx].choosedAll = false
        } else {
            this.temp[idx].choosedAll = true
        }
    },
    //   成员授权
    authorize1 (id,ismanager) {
      this.authorizeedit = true
      this.memberid = {id}.id
      //加载授权情况
      axios.get(encodeURI(this.$store.state.home.app_URL + 'authorizationEdit?home_id=' + this.homeid + '&register_id=' + this.newregister_id + '&member_id=' + id + '&timestamp=' + Date.now())
      ).then((res) => {
        if (res.data.code == 1){
          let tempArray = []
          res.data.houseList.map((house, idx) => {
            let obj = {
              name: house.house_name,
              choosedAll: false,
              choosedEQ: [],
              houseList: house.deviceList
            }
            if (house.ifCheck === 1) {
              obj.choosedAll = true
              house.deviceList.map((device, idx) => {
                if (device.ifCheck) {
                  obj.choosedEQ.push(device.device_name)
                } else{
                  obj.choosedAll = false
                }
              })
            }
            tempArray.push(obj)
          })
          this.temp = tempArray
        }
      })
    },
    sureauthorize () {
      let ifHasDevice = false
        // 组一下home的数组 全选的 把temp里面的checkdevice全给， 不是全选的循环出选择的
        var tempArray = []
        var obja = {}
        for (let i = 0, lenI = this.temp.length; i < lenI; ++i) {
            let obj_item = {
                'home_id':'',
                'house_id':'',
                'register_id':this.register_id,
                'device_member':[]
            }
            let obj_device = {}
            if (this.temp[i].houseList.length != 0){
              ifHasDevice = true
              if (this.temp[i].choosedAll == true){
                for (let j = 0, lenJ = this.temp[i].houseList.length; j < lenJ; ++j) {
                    obj_item.home_id = this.temp[i].houseList[j].home_id
                    obj_item.house_id = this.temp[i].houseList[j].house_id
                    obj_device = {
                        'second_control_id':this.temp[i].houseList[j].second_control_id,
                        'main_control_code':this.temp[i].houseList[j].main_control_code,
                        'register_id':this.register_id,
                        'second_control_device_id':this.temp[i].houseList[j].id,
                        'home_id':this.temp[i].houseList[j].home_id,
                        'house_id':this.temp[i].houseList[j].house_id
                    }
                    obj_item.device_member.push(obj_device)
                }
                tempArray.push(obj_item)
              }else if (this.temp[i].choosedAll == false){
                  this.temp[i].choosedEQ.map((item) => {
                      this.temp[i].houseList.map((EQ, idx) => {
                          if (item === EQ.device_name) {
                              obj_item.home_id = this.temp[i].houseList[idx].home_id
                              obj_item.house_id = this.temp[i].houseList[idx].house_id
                              obj_device = {
                                  'second_control_id':this.temp[i].houseList[idx].second_control_id,
                                  'main_control_code':this.temp[i].houseList[idx].main_control_code,
                                  'register_id':this.register_id,
                                  'second_control_device_id':this.temp[i].houseList[idx].id,
                                  'home_id':this.temp[i].houseList[idx].home_id,
                                  'house_id':this.temp[i].houseList[idx].house_id
                              }
                              obj_item.device_member.push(obj_device)
                          }
                      })
                  })
                  if (this.temp[i].choosedEQ.length > 0) {
                      tempArray.push(obj_item)
                  }
              }
            }
        }
        if (!ifHasDevice) {
          console.log('无任何数据---')
          return false
        }
        // 调用授权的接口
        // var objData = {'home':tempArray}
        let DATA = {'home':tempArray}
        console.log(DATA)
        console.log(tempArray)
        axios.post(encodeURI(this.$store.state.home.app_URL + 'authorization?home_id_member=' + this.homeid +'&register_id_member=' + this.memberid + '&timestamp=' + Date.now()),DATA
            ).then((res)=> {
            if (res.data.code == 1){
                this.$Message.success('授权成功!')
            }else{
                this.$Message.success(res.data.message)
            }
        }).catch((error)=> {
            console.log(error)
            this.$Message.error('系统繁忙!')
        })
    },
    houseedit (home_id,isdefault) {
      this.homename = true
      this.home_id = {home_id}.home_id
      this.isdefault = {isdefault}.isdefault
      console.log(this.isdefault)
      console.log('输出this.isdefault')
      axios.get(encodeURI(this.$store.state.home.app_URL + 'homeDetail?id=' + this.home_id + '&timestamp=' + Date.now())
            ).then((res) => {
              console.log(res)
              this.form.fname = res.data.home.home_name;
              this.form.faddress = res.data.home.faddress;
            })
    },
    // xiugai jia xinxi
    sureedithouse () {
      axios.put(encodeURI(this.$store.state.home.app_URL + 'home?id=' + this.home_id + '&home_name=' + this.form.fname + '&faddress=' + this.form.faddress + '&isdefault=' + this.isdefault + '&register_id=' + this.register_id + '&timestamp=' + Date.now())
      ).then((res) => {
        if (res.data.code == 1){
          this.$Message.success('修改成功!')
          axios.get(encodeURI(this.$store.state.home.app_URL + 'home?register_id=' + this.register_id + '&timestamp=' + Date.now())
          ).then((res) => {
              if (res.data.code ==1 ){
                  this.homelist = res.data.homeList
                  this.gethomelistinfo()
              }
          })
        }
      })
    },
    // gethomedetail () {
    //   axios.delete(this.$store.state.home.app_URL + 'homeDetail?id=' + this.home_id
    //   ).then((res) => {
    //     console.log(res)
    //   })
    // },
    housedel (home_id,register_id) {
      this.modal4 = true
      this.home_id = {home_id}.home_id
      this.register_id = {register_id}.register_id
      // console.log(this.home_id)
    },
    deletehousemember (id,ismanager) {
      this.memberid = {id}.id
      this.ismanager = {ismanager}.ismanager
      this.modal8 = true
    },
    surehousedelall () {
      axios.delete(encodeURI(this.$store.state.home.app_URL + 'home?register_id=' + this.register_id + '&home_id=' + this.home_id + '&timestamp=' + Date.now())
      ).then((res) => {
        axios.get(encodeURI(this.$store.state.home.app_URL + 'homeMember?home_id=' + this.homeid + '&timestamp=' + Date.now())
      ).then((res) => {
          if (res.data.code ==1 ){
              if (res.data.homeList.length == 0){
                  this.$Message.warning('暂无数据!')//here
              }else{
                  this.fnamelist = res.data.homeList
                  this.adminid = this.fnamelist[0].id
                  // this.$Message.success('加载成功!')
              }
          }else{
          this.$Message.error('加载失败!')
          }
      })
      })
    },
    // 删除家或家庭成员
    surehousedel () {
      axios.delete(encodeURI(this.$store.state.home.app_URL + 'home?register_id=' + this.memberid + '&home_id=' + this.home_id + '&timestamp=' + Date.now())
      ).then((res) => {
        console.log(res)
        axios.get(encodeURI(this.$store.state.home.app_URL + 'homeMember?home_id=' + this.homeid + '&timestamp=' + Date.now())
      ).then((res) => {
          if (res.data.code ==1 ){
              if (res.data.homeList.length == 0){
                  this.$Message.warning('暂无数据!')//here
              }else{
                  this.fnamelist = res.data.homeList
                  this.adminid = this.fnamelist[0].id
                  this.$Message.success('加载成功!')
              }
          }else{
          this.$Message.error('加载失败!')
          }
      })
      })
    },
    setDataFomatM () {
      return new Promise((resolve, reject) => {
        axios.get(encodeURI(this.$store.state.home.app_URL + 'home?register_id=' + this.register_id + '&timestamp=' + Date.now())
        ).then((res) => {
        let temp = []
        if (res.data.code ==1 ){
          if (res.data.homeList == 0){
            this.$Message.warning('暂无数据!')
          }else{
            temp = res.data.homeList.slice(0)
            // this.$Message.success('加载成功!')
            // 循环Homelist 取id ，
            for (let j = 0, lenJ = temp.length; j < lenJ; ++j) {
              axios.get(encodeURI(this.$store.state.home.app_URL + 'homeMember?home_id=' + temp[j].home_id + '&timestamp=' + Date.now())
              ).then((_res) => {
                  if (res.data.code ==1 ){
                      temp[j].menberListcount = _res.data.homeList.length
                      if (j === lenJ - 1) {
                          resolve(temp)
                      }
                  }else{
                  this.$Message.error('加载成员失败!')
                  }
              })
            }
          }
        }else{
          this.$Message.error('加载失败!')
        }
        })
      })
    },
    setDataFomatR () {
         return new Promise((resolve, reject) => {
            axios.get(encodeURI(this.$store.state.home.app_URL + 'home?register_id=' + this.register_id + '&timestamp=' + Date.now())
                ).then((res) => {
                let temp = []
                if (res.data.code ==1 ){
                    if (res.data.homeList == 0){
                        this.$Message.warning('暂无数据!')
                    }else{
                        temp = res.data.homeList.slice(0)
                        // this.$Message.success('加载成功!')
                        // 循环Homelist 取id
                        for (let j = 0, lenJ = temp.length; j < lenJ; ++j) {
                            axios.get(encodeURI(this.$store.state.home.app_URL + 'house?home_id=' + temp[j].home_id + '&timestamp=' + Date.now())
                            ).then((res) => {
                                if (res.data.code ==1 ){
                                    temp[j].houseListcount = res.data.houseList.length
                                    if (j === lenJ - 1) {
                                        resolve(temp)
                                    }
                                }else{
                                this.$Message.error('加载房间失败!')
                                }
                            })
                        }
                    }
                }else{
                    this.$Message.error('加载失败!')
                }
                })
            } )
    },
    async gethomelistinfo () {
      const dataM = await this.setDataFomatM()
      const dataR = await this.setDataFomatR()
      dataM.map((item, idx) => {
          dataR[idx].menberListcount = item.menberListcount
      })
      console.log('dataR------------------')
      console.log(dataR)
      this.homelist = dataR
    },
    edit () {
      console.log(2222111)
      console.log(this.$store.state.home.CurType)
      this.changehomeshowtype(5)
      console.log(this.$store.state.home.CurType)
      console.log(1111)
      this.show = false
      this.cardshow = true
    },
    // 成员列表
    editmenbers (home_id,register_id) {
      this.show = false
      this.menbers = true
      this.homeid = {home_id}.home_id
      this.newregister_id = {register_id}.register_id
      console.log(this.newregister_id)
      console.log('this.newregister_id=====')
      console.log(this.homeid)
      axios.get(encodeURI(this.$store.state.home.app_URL + 'homeMember?home_id=' + this.homeid + '&timestamp=' + Date.now())
            ).then((res) => {
                if (res.data.code ==1 ){
                    if (res.data.homeList.length == 0){
                        this.$Message.warning('暂无数据!')
                    }else{
                        this.fnamelist = res.data.homeList
                        this.adminid = this.fnamelist[0].id
                        // this.$Message.success('加载成功!')
                    }
                }else{
                this.$Message.error('加载失败!')
                }
            })
    },
    // 添加家庭成员
    addmenbers () {
      this.menbernames = true
    },
    sureaddmenber (menbername) {
        this.$refs.menbername.validate((valid) => {
            if (valid) {
                axios.post(encodeURI(this.$store.state.home.app_URL + 'homeMember?mobile=' + this.menbername.mobile + '&home_id=' + this.homeid + '&timestamp=' + Date.now())
                ).then((res) => {
                    console.log(res)
                    if (res.data.code ==1 ){
                        this.$Message.success('添加成功!')
                        axios.get(encodeURI(this.$store.state.home.app_URL + 'homeMember?home_id=' + this.homeid + '&timestamp=' + Date.now())
                        ).then((res) => {
                            if (res.data.code ==1 ){
                                if (res.data.homeList.length == 0){
                                    this.$Message.warning('暂无数据!')//here
                                }else{
                                    this.fnamelist = res.data.homeList
                                    this.adminid = this.fnamelist[0].id
                                }
                            }else{
                            this.$Message.error('加载失败!')
                            }
                        })
                    }else if (res.data.code == 0 ){
                        this.$Message.error('该成员还未注册或已经添加！')
                    }else {
                        this.$Message.error('添加失败！')
                    }
                })
            }
        })
    },
    // 获取房间列表
    editroom (home_id) {
      this.show = false
      this.cardshow = true
      console.log({home_id})
      this.homeid = {home_id}.home_id
      console.log(this.homeid)
      axios.get(encodeURI(this.$store.state.home.app_URL + 'house?home_id=' + this.homeid + '&timestamp=' + Date.now())
            ).then((res) => {
                if (res.data.code ==1 ){
                    if (res.data.houseList.length == 0){
                        this.$Message.warning('暂无数据!')
                    }else{
                        this.roomlist = res.data.houseList
                        // this.$Message.success('加载成功!')
                    }
                }else{
                this.$Message.error('加载失败!')
                }
            })
    },
    // 删除房间
    delhomenames (id) {
      this.modal3 = true
      console.log({id})
      console.log({id}.id)
      this.id = {id}.id//点击删除
      console.log(this.id)
    },
    suredelete () {
      axios.delete(encodeURI(this.$store.state.home.app_URL + 'house?register_id=' + this.register_id + '&house_id=' + this.id + '&timestamp=' + Date.now())
            ).then((res) => {
                if (res.data.code ==1 ){
                this.$Message.success('删除成功!')//删除成功重新加载房间列表
                axios.get(encodeURI(this.$store.state.home.app_URL + 'house?home_id=' + this.homeid + '&timestamp=' + Date.now())
                    ).then((res) => {
                        if (res.data.code ==1 ){
                            if (res.data.houseList.length == 0){
                                this.$Message.warning('暂无数据!')
                            }else{
                                // this.$Message.success('加载成功!')
                                this.roomlist = res.data.houseList
                                console.log(this.roomlist)
                            }
                        }
                    })
                }else{
                this.$Message.error('删除失败!')
                }
            })
    },
    // 修改房间名字
    edithomenames (id,house_name) {
      this.edithomename = true
      this.id = {id}.id
      this.formLogin.name = {house_name}.house_name
    },
    surechange () {
        axios.put(encodeURI(this.$store.state.home.app_URL + 'house?id=' + this.id + '&house_name=' + this.formLogin.name + '&home_id=' + this.homeid + '&timestamp=' + Date.now())
        ).then((res) => {
            if (res.data.code ==1 ){//删除成功重新加载数据
                axios.get(encodeURI(this.$store.state.home.app_URL + 'house?home_id=' + this.homeid + '&timestamp=' + Date.now())
                    ).then((res) => {
                        if (res.data.code ==1 ){
                            if (res.data.houseList.length == 0){
                                this.$Message.warning('暂无数据!')
                            }else{
                                this.roomlist = res.data.houseList
                                console.log(this.roomlist)
                            }
                        }
                    })
            this.$Message.success('修改成功!') // 成功重新加载房间列表
            }else{
            this.$Message.error('修改失败!')
            }
        })
    },
    // 增加房间
    sureaddroom (roomform) {
      var house_member = []
      var obj = {}
      obj.house_name = this.roomform.roomname
      house_member.push(obj)
      let DATA = {'home_id':this.homeid,'register_id':this.register_id,'house_member':house_member}
      axios.post(encodeURI(this.$store.state.home.app_URL + 'house' + '?timestamp=' + Date.now()),DATA
        ).then((res)=> {
           console.log(res)
           if (res.data.code == 1){
                this.$Message.success('增加成功!')
                axios.get(encodeURI(this.$store.state.home.app_URL + 'house?home_id=' + this.homeid + '&timestamp=' + Date.now())
                    ).then((res) => {
                        if (res.data.code ==1 ){
                            this.roomlist = res.data.houseList
                            console.log(this.roomlist)
                        }
                    })
            }else{
                // this.$Message.success('加载成功!')
                this.roomlist = res.data.houseList
                console.log(this.roomlist)
            }
        }).catch((error)=> {
            console.log(error)
            this.$Message.error('系统繁忙!')
        })
    },
    addnewrooms () {
      this.addnewroom = true
    },
    turnback1 () {
      this.show = true
      this.menbers = false
    },
    turnback () {
      this.show = true
      this.cardshow = false
    },
    ok () {
      // this.$Message.info('点击了确定')
    },
    cancel () {
      // this.$Message.info('已取消')
    },
    del () {
    //   this.$store.state.homeshowtype = 2 // 删除
    },
    ...mapActions('home', [
      'changehomeshowtype'
    ]),
    // add home
    addHome () {
      this.ifAddHome = true
    },
    getDefaultRooms () {
      send({
        name: '/house_default',
        method: 'GET',
        data: {
        }
      }).then(_res => {
        let temp = []
        _res.data.houseListDefault.map((item) => {
          temp.push(item.dhouse_name)
        })
        this.defaultRoomList = _res.data.houseListDefault
        this.choosedRoom = temp
      }).catch((res) => {
        this.$Message.error('Interface Error!')
      })
    },
    createHome () {
      if (!this.homeinfo.name || this.homeinfo.name.trim() === '') {
        this.$Message.error('家庭名称不能为空')
        return false
      }
      if (!this.homeinfo.address || this.homeinfo.address.trim() === '') {
        this.$Message.error('家庭地址不能为空')
        return false
      }
      if (this.roomsFormat.length === 0) {
        this.$Message.error('至少选择一个房间')
        return false
      }
      send({
        name: '/home',
        method: 'POST',
        data: {
          'home': [
            {
              'home_name': this.homeinfo.name.trim(),
              'faddress': this.homeinfo.address.trim(),
              'register_id': this.$store.state.register_id
            }
          ],
          'house_member': this.roomsFormat
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.gethomelistinfo()
            this.ifAddHome = false
            // this.updateCurHome(_res.data.home_id)
            break
          default:
            this.$Message.error(_res.data.message)
        }
      }).catch((res) => {
        this.$Message.error('Interface Error!')
      })
    },
    updateCurHome (HomeId) {
      send({
        name: '/home?isdefault=1&id=' + HomeId + '&home_name=' + this.homeinfo.name.trim() + '&faddress=' + this.homeinfo.address.trim() + '&register_id=' + this.$store.state.register_id,
        method: 'PUT',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.$Message.success('设置成功!')
            // 更新当前家
            let CurHomeTemp = {
              home_name: this.homeinfo.name.trim(),
              faddress: this.homeinfo.address.trim(),
              home_id: HomeId,
              isCreater: true,
              isdefault: 1,
              register_id: this.$store.state.register_id
            }
            this.changeCurHome(CurHomeTemp)
            this.$router.push({name: 'Home'})
            break
          default:
            this.$Message.error(_res.data.message)
        }
      }).catch((res) => {
        this.$Message.error('Interface Error!')
      })
    },
    addOtherRoom () {
      this.$Modal.confirm({
        onOk: () => {
          this.defaultRoomList = [...this.defaultRoomList, {'dhouse_name': this.newRommName}]
          this.choosedRoom = [...this.choosedRoom, this.newRommName]
        },
        render: (h) => {
          return h('Input', {
            props: {
              value: this.newRommName,
              autofocus: true,
              placeholder: '请输入房间名称...'
            },
            on: {
              input: (val) => {
                this.newRommName = val
              }
            }
          })
        }
      })
    }
  }
}
</script>
<style scoped>
.homeManage{
  margin: 20px 0;
}
.homeManage h1{
  color: #fff;
}
.tipsTit{
  margin-bottom: 15px;
}
.list{
    width: 100%;
    height: 120px;
    background-color: white;
    border-radius: 8px;
    margin-top: 30px;
    margin-right:0px;
    box-shadow: rgb(212, 211, 211) 0px 0px 5px 1px ;
}
.icon{
    background-color: rgb(209, 207, 207);
    width: 60px;
    height:60px;
    margin: auto;
    margin-top:15px;
    border-radius: 40px;
    background: radial-gradient(#7bbafa,#faf7f7)
}
.nametext{
    height:65px;
    margin-top:20px;
    background-color: #fff
}
.name{
    line-height: 25px;
    font-size: 14px
}
.name:hover{
    font-size: 15px
}
p{
    font-size: 16px
}
.button1{
    height: 25px;
    width: 50px;
    padding:0;
    font-size: 12px;
    margin-top:8px
}
.butt{
    height: 25px;
    width: 50px;
    padding:0;
    font-size: 12px;
    margin-top:30px;
}
.butt1{
    height: 25px;
    width: 50px;
    padding:0;
    font-size: 12px;
    margin-top:30px;
    margin-right:10px
}
.buttonlist{
    margin-left:25px;
    height: 60px;
    margin-top:20px;
    position:absolute;
    right:10px
}
.p{
  font-size: 14px;
  line-height: 30px
}
.edithome{
  height: 40px;
  line-height: 40px;
  margin:5px;
  font-size: 14px;
}
.printroom{
  font-size:13px;
  cursor:pointer
}
.printroom:hover{
  color:  #2d8cf0;
  font-weight:bold
}
.printroom:active{
  color: #7bbafa;
  font-weight:bold
}
ul li{
list-style-type:none;
}
</style>
