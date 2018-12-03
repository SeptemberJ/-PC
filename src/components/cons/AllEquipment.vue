<template>
  <div class="AllEquipment">
    <div v-if="EqList.length > 0" class="ListBox">
      <Row type="flex" justify="start" class="code-row-bg">
        <Col span="12"  v-for="(EQ, idx) in EqList" :key="idx">
          <Card style="width: 96%;margin-bottom:30px;">
            <!-- <p style="font-size: 12px;" slot="title" v-if="EQ.default_device_type == '031'" @click="showCharts(EQ)">
              {{EQ.device_name}}
            </p> -->
            <p slot="title">
              {{EQ.device_name}}
            </p>
            <!-- <p slot="extra" @click.prevent="changeLimit">
              <Icon type="ios-loop-strong"></Icon>
              {{EQ.type == 0 ? '离线' : '在线'}}
            </p> -->
            <i-switch slot="extra" title="设备开关" v-if="EQ.default_device_type== '021' || EQ.default_device_type == '022'" style="float:right;margin-top:0px;" v-model="EQ.device_status" @on-change="OperationToggle(EQ, idx)">
              <span slot="open">ON</span>
              <span slot="close">OFF</span>
            </i-switch>
            <!-- <i-switch slot="extra" title="设备开关" v-if="EQ.default_device_type== '021' || EQ.default_device_type == '022'" style="float:right;margin-top:0px;" :disabled="EQ.type == 0 && EQ.device_config == '1'" v-model="EQ.device_status" @on-change="OperationToggle(EQ, idx)">
              <span slot="open">ON</span>
              <span slot="close">OFF</span>
            </i-switch> -->
            <div style="text-align:left">
              <Row>
                <Col span="6" class="eqIcon">
                  <img v-if="EQ.default_device_type != '031' && EQ.default_device_type != '032' && EQ.default_device_type != '021' && EQ.default_device_type != '022'" :src="EQ.device_img ? EQ.device_img : '../../../static/img/icons/eqNormalIcon.png'">
                  <img v-if="EQ.default_device_type == '031' || EQ.default_device_type == '032' || EQ.default_device_type == '021' || EQ.default_device_type == '022'" class="CursorPointer"  @click="showCharts(EQ)" :src="EQ.device_img ? EQ.device_img : '../../../static/img/icons/eqNormalIcon.png'">
                  <!-- <p style="word-wrap:break-word;font-size: 12px;">位置: {{EQ.house_name}}</p> -->
                </Col>
                <Col span="18">
                  <Row>
                    <Col :lg="{span: 6}"  :md="{span: 8}" :xs="{span: 8}">
                      <p class="Bold smallSize ColorLightBlack">设备状态: </p>
                    </Col>
                    <Col :lg="{span: 18}" :md="{span: 16}" :xs="{span: 16}">
                      <p style="word-wrap:break-word;font-size: 12px;">{{EQ.type == 0 ? '离线' : '在线'}}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col :lg="{span: 6}"  :md="{span: 8}" :xs="{span: 8}">
                      <p class="Bold smallSize ColorLightBlack">所属房间: </p>
                    </Col>
                    <Col :lg="{span: 18}" :md="{span: 16}" :xs="{span: 16}">
                      <p style="word-wrap:break-word;font-size: 12px;">{{EQ.house_name}}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col :lg="{span: 6}"  :md="{span: 8}" :xs="{span: 8}">
                      <p class="Bold smallSize ColorLightBlack">设备码: </p>
                    </Col>
                    <Col :lg="{span: 18}" :md="{span: 16}" :xs="{span: 16}">
                      <p style="word-wrap:break-word;font-size: 12px;">{{EQ.device_code}}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col :lg="{span: 6}"  :md="{span: 8}" :xs="{span: 8}">
                      <p class="Bold smallSize ColorLightBlack">所属主控: </p>
                    </Col>
                    <Col :lg="{span: 18}" :md="{span: 16}" :xs="{span: 16}">
                      <p style="word-wrap:break-word;font-size: 12px;">{{EQ.main_control_name}}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col :lg="{span: 6}"  :md="{span: 8}" :xs="{span: 8}">
                      <p class="Bold smallSize ColorLightBlack">所属从控: </p>
                    </Col>
                    <Col :lg="{span: 18}" :md="{span: 16}" :xs="{span: 16}">
                      <p style="word-wrap:break-word;font-size: 12px;">{{EQ.second_control_name}}</p>
                    </Col>
                  </Row>
                  <!-- <p class="smallP">位置: {{EQ.house_name}}</p>
                  <p class="smallP">主控: {{EQ.main_control_name}}</p>
                  <p class="smallP">从控: {{EQ.second_control_name}}</p> -->
                </Col>
              </Row>
              <Row class="operationIcon">
                <Col span="24" class="TextAlignR">
                  <img title="移动设备" class="iconImg scaleAnimation" src="../../../static/img/icons/move-up.png" @click="moveEq(EQ)">
                  <img title="查看数据" v-if="EQ.default_device_type == '031' || EQ.default_device_type == '032' || EQ.default_device_type == '021' || EQ.default_device_type == '022'" class="iconImg scaleAnimation" src="../../../static/img/icons/AnalysisBlue.png" @click="showCharts(EQ)">
                  <!-- <img title="控制面板" v-if="EQ.default_device_type == '022' || EQ.default_device_type == '051' || EQ.default_device_type == '052'" class="iconImg scaleAnimation" src="../../../static/img/icons/yaokongqi.png" @click="showControlPanel(EQ, idx)"> -->
                </Col>
              </Row>
              <Row class="MarginT_10 PaddingT_16 BorderT_gray">
                <Col span="6">
                  <span class="hoverColor">
                    <img class="iconImg" src="../../../static/img/icons/genghuan.png" @click="changeCode(EQ, EQ.id, EQ.device_code)">
                    <span @click="changeCode(EQ, EQ.id, EQ.device_code)">更换</span>
                  </span>
                </Col>
                <Col span="6">
                  <span class="hoverColor">
                    <img class="iconImg" src="../../../static/img/icons/zengsong.png" @click="deleteEq(EQ)">
                    <span @click="deleteEq(EQ)">赠送</span>
                  </span>
                </Col>
                <Col span="6" class="TextAlignR">
                  <span class="hoverColor">
                    <img class="iconImg" src="../../../static/img/icons/editor-line.png" @click="editEqInfo(EQ, EQ.id, EQ.device_name)">
                    <span @click="editEqInfo(EQ, EQ.id, EQ.device_name)">编辑</span>
                  </span>
                </Col>
                <Col span="6" class="TextAlignR">
                  <span class="hoverColor">
                    <img @click="deleteEq(EQ)" class="iconImg" src="../../../static/img/icons/delete.png">
                    <span @click="deleteEq(EQ)">删除</span>
                  </span>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
    <NoData v-if="EqList.length == 0"/>
    <!-- 移动 -->
    <Modal v-model="ifMove" width="850">
      <p slot="header" style="color:#333;text-align:left">
          <span>设备移动</span>
      </p>
      <div style="text-align:left">
        <Form label-position="left" :label-width="100">
          <FormItem label="设备名称" style="margin-bottom: 10px;">
            <p>{{curEQName}}</p>
          </FormItem>
          <FormItem label="当前房间" style="margin-bottom: 10px;">
            <p>{{curEQRoom}}</p>
          </FormItem>
          <FormItem label="移动至" style="margin-bottom: 10px;">
            <p>{{moveDestination}}</p>
          </FormItem>
          <RadioGroup v-model="moveDestination" vertical @on-change="changeDestinationRoom">
            <Radio :label="House.house_name" v-for="(House, idx) in HouseList" :key="idx">
                <Icon type="social-apple"></Icon>
                <span>{{House.house_name}}</span>
            </Radio>
          </RadioGroup>
        </Form>
      </div>
      <div slot="footer">
          <!-- <Button type="error" size="large" long  @click="sureMove">确认移动</Button> -->
          <Button type="primary" :loading="btLoading" @click="sureMove">
            <span v-if="!btLoading">确认移动</span>
            <span v-else>Loading...</span>
          </Button>
      </div>
    </Modal>
    <!-- 添加设备 -->
    <Modal v-model="ifAddEQ" scrollable width="850">
      <p slot="header" style="color:#333;text-align:left">
          <!-- <Icon type="ios-information-circle"></Icon> -->
          <span>添加设备</span>
      </p>
      <div style="text-align:left">
         <Row  class="MarginB_20">
          <Col span="24">
            <RadioGroup v-model="EqType">
              <Radio label="无线设备"></Radio>
              <Radio label="红外设备" disabled></Radio>
              <Radio label="单品"></Radio>
            </RadioGroup>
          </Col>
         </Row>
         <!-- 单品 -->
          <Form v-show="EqType == '单品'" :model="formSingle" ref="formSingle" :rules="ruleValidateSingle" label-position="left" :label-width="100">
            <FormItem label="选择单品类型" prop="SingleSelectName">
              <!-- <Select v-model="formSingle.SingleSelectName" @on-change="changeSingle"> -->
              <Select v-model="formSingle.SingleSelectName" @on-change="changeSingle">
                <Option v-for="item in SingleList" :value="item.id" :key="item.id">{{ item.deviceDescibe }}</Option>
              </Select>
            </FormItem>
            <FormItem label="选择房间" prop="selectRoomId" v-if="HouseList.length > 0">
              <Select v-model="formSingle.selectRoomId">
                <Option v-for="item in HouseList" :value="item.id" :key="item.id">{{ item.house_name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="选择房间" prop="selectRoomId" v-if="HouseList.length == 0">
              <Button class="ColorRed" size="small" type="text" @click="toAddRoom">还未添加房间，点击去添加</Button>
            </FormItem>
            <FormItem label="单品名称" prop="SingleName">
              <Input v-model="formSingle.SingleName" placeholder="可输入自定义名称" style="" />
            </FormItem>
            <FormItem label="单品码" prop="SingleCode">
              <Input v-model="formSingle.SingleCode" placeholder="请输入主控码" style="" />
            </FormItem>
          </Form>
          <!-- 无线设备 一般三级设备 -->
          <Form v-show="EqType == '无线设备'" :model="formEQNormal" ref="formEQNormal" :rules="ruleValidateEQ" label-position="left" :label-width="100">
            <FormItem label="选择主控" prop="selectMasterId" v-if="MasterControlList.length > 0">
              <Select v-model="formEQNormal.selectMasterId" @on-change="selectChangeMaster">
                <Option v-for="item in MasterControlList" :value="item.id" :key="item.id">{{ item.main_control_name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="选择主控" prop="selectMasterId" v-if="MasterControlList.length == 0">
              <Button class="ColorRed" size="small" type="text" @click="toAddMS">还未添加主控，点击去添加</Button>
            </FormItem>
            <FormItem label="选择从控" prop="selectSecondId" v-if="SecondControlList.length > 0">
              <Select v-model="formEQNormal.selectSecondId" @on-change="selectChangeSecond">
                <Option v-for="item in SecondControlList" :value="item.id" :key="item.id">{{ item.second_control_name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="选择从控" prop="selectSecondId" v-if="SecondControlList.length == 0">
              <Button class="ColorRed" size="small" type="text" @click="toAddMS">该主控下还未添加从控，点击去添加</Button>
            </FormItem>
            <FormItem label="选择房间" prop="selectRoomId" v-if="HouseList.length > 0">
              <Select v-model="formEQNormal.selectRoomId">
                <Option v-for="item in HouseList" :value="item.id" :key="item.id">{{ item.house_name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="选择房间" prop="selectRoomId" v-if="HouseList.length == 0">
              <Button class="ColorRed" size="small" type="text" @click="toAddRoom">还未添加房间，点击去添加</Button>
            </FormItem>
            <FormItem label="选择设备类型" prop="eqType">
              <Select v-model="formEQNormal.eqType">
                <Option v-for="item in deviceTypeList" :value="item.device_type_code" :key="item.id">{{ item.device_type_name }}</Option>
              </Select>
            </FormItem>
            <!-- <FormItem label="选择设备图标" prop="eqType">
              <Button style="margin-top: -30px;" size="small" icon="ios-arrow-back" shape="circle"></Button>
              <img style="width: 40px;height: 40px;margin: auto 10px;" src="https://i.loli.net/2017/08/21/599a521472424.jpg">
              <Button style="margin-top: -30px;" size="small" icon="ios-arrow-forward" shape="circle"></Button>
            </FormItem> -->
            <FormItem label="设备名称" prop="EQName">
              <Input v-model="formEQNormal.EQName" placeholder="可输入自定义名称" style="" />
            </FormItem>
            <FormItem label="设备码" prop="EQCode">
              <Input v-model="formEQNormal.EQCode" placeholder="请输入设备码" style="" />
            </FormItem>
          </Form>
      </div>
      <div slot="footer" class="TextAlignC">
          <Button v-if="EqType == '单品'"  type="error" size="large" :loading="btLoading" @click="handleSubmitSingle('formSingle')">
            <span v-if="!btLoading">确认添加</span>
            <span v-else>Loading...</span>
          </Button>
          <Button v-if="EqType == '无线设备'"  type="error" size="large" :loading="btLoading" @click="handleSubmitEQ('formEQNormal')">
            <span v-if="!btLoading">确认添加</span>
            <span v-else>Loading...</span>
          </Button>
          <!-- <Button v-if="EqType == '单品'" type="error" size="large" @click="handleSubmitSingle('formSingle')">确认添加</Button>
          <Button v-if="EqType == '无线设备'" type="error" size="large" @click="handleSubmitEQ('formEQNormal')">确认添加</Button> -->
      </div>
    </Modal>
    <!-- chart -->
    <Modal v-model="ifShowChart" fullscreen title="数据详情" footer-hide cancel-text="关闭">
      <Tabs v-show="curEqType == '031' || curEqType == '032'" @on-click="getCurSensorData">
        <TabPane label="当前数据">
          <!-- 当前数据 -->
          <div class="curDataBlock">
            <Row>
              <Col span="12" class="listenKindBlock">
                <h2 class="TextAlignC MarginB_10">PM2.5</h2>
                <!-- 彩条 -->
                <div class="levelBlock">
                  <Row type="flex" justify="start" class="code-row-bg">
                    <Col span="4" :class="'level level' + (idx+1)" v-for="(item, idx) in 6" :key="idx">{{idx+1}}</Col>
                  </Row>
                </div>
                <!-- 三角 -->
                <div class="trangleBlock">
                  <Row type="flex" justify="start" class="code-row-bg">
                    <Col span="4" :offset="(curDatas.PM25.level - 1) * 4" :class="'trangleBox trangleBox' + curDatas.PM25.level"></Col>
                  </Row>
                </div>
                <!-- 数值 -->
                <div class="dataBlock">
                  <Row type="flex" justify="start" class="code-row-bg">
                    <Col span="24" :class="curDatas.PM25.level>3?'TextAlignR':(curDatas.PM25.level>1?'TextAlignC':'TextAlignL')">
                      <h3 :class="'MarginT_10 color' + curDatas.PM25.level">{{curDatas.PM25.data}} μg/m3</h3>
                    </Col>
                  </Row>
                </div>
                <!-- 污染程度 -->
                <h3 :class="'MarginT_10 color' + curDatas.PM25.level">{{curDatas.PM25.quantity}}</h3>
              </Col>

              <Col span="12" class="listenKindBlock">
                <h2 class="TextAlignC MarginB_10">HCHO</h2>
                <!-- 彩条 -->
                <div class="levelBlock">
                  <Row type="flex" justify="start" class="code-row-bg">
                    <Col span="4" :class="'level level' + (idx+1)" v-for="(item, idx) in 6" :key="idx">{{idx+1}}</Col>
                  </Row>
                </div>
                <!-- 三角 -->
                <div class="trangleBlock">
                  <Row type="flex" justify="start" class="code-row-bg">
                    <Col span="4" :offset="(curDatas.HCHO.level - 1) * 4" :class="'trangleBox trangleBox' + curDatas.HCHO.level"></Col>
                  </Row>
                </div>
                <!-- 数值 -->
                <div class="dataBlock">
                  <Row type="flex" justify="start" class="code-row-bg">
                    <Col span="24" :class="curDatas.HCHO.level>3?'TextAlignR':(curDatas.HCHO.level>1?'TextAlignC':'TextAlignL')">
                      <h3 :class="'MarginT_10 color' + curDatas.HCHO.level">{{curDatas.HCHO.data}} μg/m3</h3>
                    </Col>
                  </Row>
                </div>
                <!-- 污染程度 -->
                <h3 :class="'MarginT_10 color' + curDatas.HCHO.level">{{curDatas.HCHO.quantity}}</h3>
              </Col>

              <Col span="12" class="listenKindBlock">
                <h2 class="TextAlignC MarginB_10">CO</h2>
                <!-- 彩条 -->
                <div class="levelBlock">
                  <Row type="flex" justify="start" class="code-row-bg">
                    <Col span="4" :class="'level level' + (idx+1)" v-for="(item, idx) in 6" :key="idx">{{idx+1}}</Col>
                  </Row>
                </div>
                <!-- 三角 -->
                <div class="trangleBlock">
                  <Row type="flex" justify="start" class="code-row-bg">
                    <Col span="4" :offset="(curDatas.CO.level - 1) * 4" :class="'trangleBox trangleBox' + curDatas.CO.level"></Col>
                  </Row>
                </div>
                <!-- 数值 -->
                <div class="dataBlock">
                  <Row type="flex" justify="start" class="code-row-bg">
                    <Col span="24" :class="curDatas.CO.level>3?'TextAlignR':(curDatas.CO.level>1?'TextAlignC':'TextAlignL')">
                      <h3 :class="'MarginT_10 color' + curDatas.CO.level">{{curDatas.CO.data}} μg/m3</h3>
                    </Col>
                  </Row>
                </div>
                <!-- 污染程度 -->
                <h3 :class="'MarginT_10 color' + curDatas.CO.level">{{curDatas.CO.quantity}}</h3>
              </Col>

              <Col span="12" class="listenKindBlock">
                <h2 class="TextAlignC MarginB_10">CO2</h2>
                <!-- 彩条 -->
                <div class="levelBlock">
                  <Row type="flex" justify="start" class="code-row-bg">
                    <Col span="4" :class="'level level' + (idx+1)" v-for="(item, idx) in 6" :key="idx">{{idx+1}}</Col>
                  </Row>
                </div>
                <!-- 三角 -->
                <div class="trangleBlock">
                  <Row type="flex" justify="start" class="code-row-bg">
                    <Col span="4" :offset="(curDatas.CO2.level - 1) * 4" :class="'trangleBox trangleBox' + curDatas.CO2.level"></Col>
                  </Row>
                </div>
                <!-- 数值 -->
                <div class="dataBlock">
                  <Row type="flex" justify="start" class="code-row-bg">
                    <Col span="24" :class="curDatas.CO2.level>3?'TextAlignR':(curDatas.CO2.level>1?'TextAlignC':'TextAlignL')">
                      <h3 :class="'MarginT_10 color' + curDatas.CO2.level">{{curDatas.CO2.data}} μg/m3</h3>
                    </Col>
                  </Row>
                </div>
                <!-- 污染程度 -->
                <h3 :class="'MarginT_10 color' + curDatas.CO2.level">{{curDatas.CO2.quantity}}</h3>
              </Col>

              <Col span="12" class="listenKindBlock">
                <h2 class="TextAlignC MarginB_10">温度/湿度</h2>
                <h3 class="TextAlignC color1 MarginT_30 MarginB_40">{{curDatas.Temperature.data}} / {{curDatas.Humidity.data}}%</h3>
                <!-- 污染程度 -->
                <div class="MarginT_40 color1">
                  <span style="float:left">
                    <h3>{{curDatas.Temperature.quantity}}</h3>
                  </span>
                  <span style="float:right">
                    <h3>{{curDatas.Humidity.quantity}}</h3>
                  </span>
                </div>
              </Col>

              <Col span="12" class="listenKindBlock">
                <h2 class="TextAlignC MarginB_10">VOC</h2>
                <!-- 彩条 -->
                <div class="levelBlock">
                  <Row type="flex" justify="start" class="code-row-bg">
                    <Col span="4" :class="'level level' + (idx+1)" v-for="(item, idx) in 6" :key="idx">{{idx+1}}</Col>
                  </Row>
                </div>
                <!-- 三角 -->
                <div class="trangleBlock">
                  <Row type="flex" justify="start" class="code-row-bg">
                    <Col span="4" :offset="(curDatas.VOC.level - 1) * 4" :class="'trangleBox trangleBox' + curDatas.VOC.level"></Col>
                  </Row>
                </div>
                <!-- 数值 -->
                <div class="dataBlock">
                  <Row type="flex" justify="start" class="code-row-bg">
                    <Col span="24" :class="curDatas.VOC.level>3?'TextAlignR':(curDatas.VOC.level>1?'TextAlignC':'TextAlignL')">
                      <h3 :class="'MarginT_10 color' + curDatas.VOC.level">{{curDatas.VOC.data}} μg/m3</h3>
                    </Col>
                  </Row>
                </div>
                <!-- 污染程度 -->
                <h3 :class="'MarginT_10 color' + curDatas.VOC.level">{{curDatas.VOC.quantity}}</h3>
              </Col>

              <!-- <Col span="24" style="height: 40px;background:#000;padding:10px;color: rgb(112,173,71);">
                <h4>温馨提示： 空气质量良好</h4>
              </Col> -->
            </Row>
          </div>
        </TabPane>
        <TabPane label="历史数据">
          <!-- <div class="MarginB_10">选择类型</div> -->
          <div class="kindBar" style="text-align:left;">
            <Row>
              <Col span="4">选择类型</Col>
              <Col span="20" v-if="curEqType == '031' || curEqType == '032'">
                <RadioGroup v-model="curKind" @on-change="changeKind">
                  <Radio v-for="(item, idx) in kind" :key="idx" :label="item"></Radio>
                </RadioGroup>
              </Col>
              <Col span="20" v-if="curEqType == '021' || curEqType == '022'">
                <RadioGroup v-model="curKind" @on-change="changeKindLight">
                  <Radio v-for="(item, idx) in kind_light" :key="idx" :label="item"></Radio>
                </RadioGroup>
              </Col>
            </Row>
            <Row class="MarginB_10">
              <Col span="4">选择时间间隔</Col>
              <Col span="20">
                <RadioGroup v-model="time" @on-change="changeTime">
                  <Radio label="6"></Radio>
                  <Radio label="12"></Radio>
                  <Radio label="24"></Radio>
                </RadioGroup>
              </Col>
            </Row>
          </div>
          <div v-show="hasData" id="myChart" :style="{width: '1024px !important', height: '450px', margin: '0 auto'}"></div>
          <div class="TextAlignC MarginT_30" v-show="!hasData && !ifSpin">
            <img style="width:100px;height:100px;margin:30px auto;" src="../../../static/img/icons/nodata.png">
            <p>暂无数据</p>
          </div>
        </TabPane>
      </Tabs>
      <div v-show="curEqType != '031' && curEqType != '032'">
        <div class="MarginB_10">选择类型</div>
        <div class="kindBar" style="text-align:left;">
          <Row>
            <Col span="4">选择类型</Col>
            <Col span="20" v-if="curEqType == '031' || curEqType == '032'">
              <RadioGroup v-model="curKind" @on-change="changeKind">
                <Radio v-for="(item, idx) in kind" :key="idx" :label="item"></Radio>
              </RadioGroup>
            </Col>
            <Col span="20" v-if="curEqType == '021' || curEqType == '022'">
              <RadioGroup v-model="curKind" @on-change="changeKindLight">
                <Radio v-for="(item, idx) in kind_light" :key="idx" :label="item"></Radio>
              </RadioGroup>
            </Col>
          </Row>
          <Row class="MarginB_10">
            <Col span="4">选择时间间隔</Col>
            <Col span="20">
              <RadioGroup v-model="time" @on-change="changeTime">
                <Radio label="6"></Radio>
                <Radio label="12"></Radio>
                <Radio label="24"></Radio>
              </RadioGroup>
            </Col>
          </Row>
        </div>
        <div v-show="hasData" id="myChart2" :style="{width: '1024px !important', height: '450px', margin: '0 auto'}"></div>
        <div class="TextAlignC MarginT_30" v-show="!hasData && !ifSpin">
          <img style="width:100px;height:100px;margin:30px auto;" src="../../../static/img/icons/nodata.png">
          <p>暂无数据</p>
        </div>
      </div>
    </Modal>
    <!-- 控制面板 -->
    <Modal v-model="ifShowPanel" width="460" :mask-closable="false">
        <p slot="header" style="color:#000;text-align:left">
          <!-- <Icon type="ios-information-circle"></Icon> -->
          <span>控制面板</span>
        </p>
        <div style="text-align:center">
            <Control :curEqType="curEqType" :curEqIndex="curEqIndex" :curEq="curEq"/>
        </div>
        <div slot="footer">
        </div>
    </Modal>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import {send} from '../../util/send'
import {Decrypt} from '../../util/util'
import NoData from '../NoData.vue'
import Control from './Control/Control.vue'
export default {
  name: 'AllEquipment',
  props: ['curHomeId', 'AddList', 'MasterControlList', 'deviceTypeList'],
  data () {
    return {
      timer: '',
      playRoadCounter: 0,
      btLoading: false,
      moveDestination: '',
      moveDestinationId: '',
      ifMove: false,
      EqList: [],
      // HouseList: [],
      newEqName: '',
      newEqCode: '',
      curEQName: '',
      curEQRoom: '',
      curEQId: '',
      curEqCode: '',
      curEqType: '',
      curEqIndex: '', // 当前设备index
      curEq: '', // 当前设备
      // add
      EqType: '无线设备',
      MasterList: [],
      SingleList: [],
      formSingle: {
        SingleName: '',
        SingleCode: '',
        SingleType: '',
        SingleSelectName: '',
        selectRoomId: '',
        selectMasterId: ''
      },
      ruleValidateSingle: {
        SingleSelectName: [
          { required: true, message: '请选择单品！', trigger: 'change' }
        ],
        SingleCode: [
          { required: true, message: '单品码不能为空！', trigger: 'change' }
        ],
        selectRoomId: [
          { required: true, message: '请选择所在房间！', trigger: 'change' }
        ]
      },
      // 一般三级设备
      loading: false,
      SecondControlList: [],
      choosedMaster: {},
      choosedSecond: {},
      formEQNormal: {
        EQName: '',
        EQCode: '',
        eqType: '',
        selectRoomId: '',
        selectMasterId: '',
        selectSecondId: ''
      },
      ruleValidateEQ: {
        selectMasterId: [
          { required: true, message: '请选择主控！', trigger: 'change' }
        ],
        selectSecondId: [
          { required: true, message: '请选择从控！', trigger: 'change' }
        ],
        EQName: [
          { required: true, message: '设备名称不能为空！', trigger: 'change' }
        ],
        EQCode: [
          { required: true, message: '设备码不能为空！', trigger: 'change' }
        ],
        selectRoomId: [
          { required: true, message: '请选择所在房间！', trigger: 'change' }
        ],
        eqType: [
          { required: true, message: '请选择设备类型！', trigger: 'change' }
        ]
      },
      // chhart
      curKind: '',
      curKindI: '',
      time: '6',
      kindI: ['pm25', 'temperature', 'humidity', 'pm100', 'formaldehyde', 'voc', 'co2', 'co'],
      kind: ['PM2.5', '温度', '湿度', 'PM10', '甲醛', 'VOCs', 'CO2', 'CO'],
      kindI_light: ['power', 'electric_quantity', 'voltage'],
      kind_light: ['功率', '电量', '电压'],
      hasData: false,
      openCode: '',
      // 当前数据
      curDatas: {
        PM25: {data: 0, quantity: '0', level: 1},
        HCHO: {data: 0, quantity: '0', level: 1},
        CO: {data: 0, quantity: '0', level: 1},
        CO2: {data: 0, quantity: '0', level: 1},
        Temperature: {data: 0, quantity: ''},
        Humidity: {data: 0, quantity: ''},
        VOC: {data: 0, quantity: '0', level: 1}
      }
    }
  },
  computed: {
    ...mapState({
      curHome: state => state.curHome,
      ifSpin: state => state.ifSpin,
      HouseList: state => state.roomList
    }),
    ifAddEQ: {
      get: function () {
        return this.$store.state.ifAddEQ
      },
      set: function (newValue) {
        this.changeModalShow('EQ')
      }
    },
    ifShowChart: {
      get: function () {
        return this.$store.state.ifShowChart
      },
      set: function (newValue) {
        this.changeModalShow('Chart')
      }
    },
    ifShowPanel: {
      get: function () {
        return this.$store.state.ifShowPanel
      },
      set: function (newValue) {
        this.changeModalShow('Panel')
      }
    }
  },
  watch: {
    curHomeId: function (val) {
      this.getAllEq()
    },
    curKind: function (val) {
      this.drawLine()
    },
    time: function (val) {
      this.drawLine()
    },
    MasterControlList: function (val) {
      this.initialSelect(val)
    },
    ifAddEQ: function (val) {
      if (!val) {
        this.$refs['formEQNormal'].resetFields()
        this.$refs['formSingle'].resetFields()
        // this.btLoading =  false
      }
    },
    EqType: function (val) {
      switch (val) {
        case '无线设备':
          this.$refs['formEQNormal'].resetFields()
          this.initialSelect(this.MasterControlList)
          break
        case '红外设备':
          break
        case '单品':
          this.$refs['formSingle'].resetFields()
          break
      }
    },
    HouseList: function (val) {
      this.initialSelectRoom()
    }
  },
  components: {
    NoData,
    Control
  },
  created () {
    this.getAllEq()
    this.filterSingle()
    this.initialSelectRoom()
    this.initialSelect(this.MasterControlList)
  },
  methods: {
    ...mapActions([
      'toggleSpin',
      'changeModalShow'
    ]),
    ...mapActions('sider', [
      'changeCurMenu'
    ]),
    // 去添加主控或从控
    toAddMS () {
      this.changeModalShow('EQ')
      this.changeCurMenu(2)
    },
    // 去添加房间
    toAddRoom () {
      this.changeModalShow('EQ')
      this.changeCurMenu(1)
    },
    // 初始化房间
    initialSelectRoom () {
      if (this.HouseList[0]) {
        this.formSingle.selectRoomId = this.HouseList[0].id
        this.formEQNormal.selectRoomId = this.HouseList[0].id
      }
    },
    // 初始化select选项
    initialSelect (Master) {
      if (Master[0]) {
        this.formEQNormal.selectMasterId = Master[0].id
        this.choosedMaster = Master[0]
        this.getSecondControlList(Master[0].main_control_code)
      } else {
        this.formEQNormal.selectMasterId = ''
        this.choosedMaster = {}
        this.SecondControlList = []
        this.formEQNormal.selectSecondId = ''
        this.choosedSecond = {}
      }
    },
    editEqInfo (EQ, EqId, EqName) {
      this.curEq = EQ
      if (!this.curHome.isCreater) {
        this.$Message.warning('您不是管理员不能进行该操作！')
        return false
      }
      this.$Modal.confirm({
        onOk: () => {
          if (this.newEqName.trim() === '') {
            this.$Message.error('新的设备名称不能为空!')
            return false
          }
          this.sureModify(EqId, 'name')
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
                value: this.newEqName === '' ? EqName : this.newEqName,
                autofocus: true,
                placeholder: '请输入新的设备名称...'
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
    changeCode (EQ, EqId, DeviceCode) {
      this.curEq = EQ
      if (!this.curHome.isCreater) {
        this.$Message.warning('您不是管理员不能进行该操作！')
        return false
      }
      this.$Modal.confirm({
        onOk: () => {
          if (this.newEqCode.trim() === '') {
            this.$Message.error('新的设备码不能为空!')
            return false
          }
          this.sureModify(EqId, 'code')
        },
        render: (h) => {
          return h('div', [
            h('h4', {
              style: {
                marginBottom: '10px'
              }

            }, '新的设备码'),
            h('Input', {
              props: {
                value: this.newEqCode === '' ? DeviceCode : this.newEqCode,
                autofocus: true,
                placeholder: '请输入新的设备码...'
              },
              on: {
                input: (val) => {
                  this.newEqCode = val
                }
              }
            })
          ])
        }
      })
    },
    deleteEq (EQ) {
      if (!this.curHome.isCreater) {
        this.$Message.warning('您不是管理员不能进行该操作！')
        return false
      }
      this.$Modal.confirm({
        title: '提示',
        onOk: () => {
          if (Decrypt(localStorage['openCode']) === this.openCode) {
            this.sureDel(EQ)
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

            }, '该操作会将设备彻底删除！'),
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
    // 输入验证码
    // checkCode () {
    //   this.$Modal.confirm({
    //     onOk: () => {
    //       if (Decrypt(localStorage['openCode']) == this.openCode) {
    //         this.sureDel(this.deleteEQ)
    //       } else {
    //         this.$Message.error('密码不一致！')
    //       }
    //     },
    //     render: (h) => {
    //       return h('div', [
    //         h('h4', {
    //           style: {
    //             marginBottom: '10px'
    //           }

    //         }, '账户密码'),
    //         h('Input', {
    //           props: {
    //             autofocus: true,
    //             placeholder: '请输入账户密码...'
    //           },
    //           on: {
    //             input: (val) => {
    //               this.openCode = val
    //             }
    //           }
    //         })
    //       ])
    //     }
    //   })
    // },
    // 删除设备
    sureDel (EQ) {
      this.toggleSpin(true)
      send({
        name: '/device?id=' + EQ.id + '&device_type=' + EQ.deviceType + '&second_control_id=' + EQ.second_control_id + '&home_id=' + this.curHomeId + '&register_id=' + this.$store.state.register_id + '&device_code=' + EQ.device_code,
        method: 'DELETE',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.openCode = ''
            this.getAllEq()
            // this.$Message.success('删除成功!')
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
    // 设备移动Moadl
    moveEq (item) {
      if (!this.curHome.isCreater) {
        this.$Message.warning('您不是管理员不能进行该操作！')
        return false
      }
      this.curEQName = item.device_name
      this.curEQRoom = item.house_name
      this.moveDestination = item.house_name
      this.curEQId = item.id
      this.ifMove = true
    },
    // 查看chart
    showCharts (EQ) {
      this.curEqCode = EQ.device_code
      this.curEqType = EQ.default_device_type
      this.curEq = EQ
      if (EQ.default_device_type === '031' || EQ.default_device_type === '032') {
        this.curKind = 'PM2.5'
        this.curKindI = 'pm25'
      }
      if (EQ.default_device_type === '021' || EQ.default_device_type === '022') {
        this.curKind = '功率'
        this.curKindI = 'power'
      }
      // 没配置过先配置
      if (EQ.device_config !== '1') {
        this.setConfig('chart', EQ)
      } else {
        this.getCurSensorData()
        this.changeModalShow('Chart')
        this.drawLine()
      }
    },
    changeKind (val) {
      this.kind.map((item, idx) => {
        if (item === val) {
          this.curKindI = this.kindI[idx]
        }
      })
    },
    changeKindLight (val) {
      this.kind_light.map((item, idx) => {
        if (item === val) {
          this.curKindI = this.kindI_light[idx]
        }
      })
    },
    changeTime (val) {
      this.time = val
      console.log(val)
    },
    // 获取传感器当前7个数值
    getCurSensorData () {
      send({
        name: '/hair_current?device_id=' + this.curEq.device_code,
        method: 'GET',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            let HairData = _res.data.hair
            this.curDatas = {
              PM25: {data: HairData.pm25, quantity: HairData.pm25Type + 1 === 1 ? '优' : (HairData.pm25Type + 1 === 2 ? '良' : (HairData.pm25Type + 1 === 3 ? '轻度污染' : (HairData.pm25Type + 1 === 4 ? '中度污染' : (HairData.pm25Type + 1 === 5 ? '中度污染' : (HairData.pm25Type + 1 === 6 ? '重度污染' : '严重污染'))))), level: HairData.pm25Type + 1},
              HCHO: {data: HairData.formaldehyde, quantity: HairData.formaldehydeType + 1 === 1 ? '优' : (HairData.formaldehydeType + 1 === 2 ? '良' : (HairData.formaldehydeType + 1 === 3 ? '轻度污染' : (HairData.formaldehydeType + 1 === 4 ? '中度污染' : (HairData.formaldehydeType + 1 === 5 ? '中度污染' : (HairData.formaldehydeType + 1 === 6 ? '重度污染' : '严重污染'))))), level: HairData.formaldehydeType + 1},
              CO: {data: HairData.co, quantity: HairData.coType + 1 === 1 ? '优' : (HairData.coType + 1 === 2 ? '良' : (HairData.pm25Type + 1 === 3 ? '轻度中毒' : (HairData.coType + 1 === 4 ? '中度中毒' : (HairData.coType + 1 === 5 ? '中度中毒' : (HairData.coType + 1 === 6 ? '重度中毒' : '严重中毒'))))), level: HairData.coType + 1},
              CO2: {data: HairData.co2, quantity: HairData.co2Type + 1 === 1 ? '优' : (HairData.co2Type + 1 === 2 ? '良' : (HairData.co2Type + 1 === 3 ? '轻度缺氧' : (HairData.co2Type + 1 === 4 ? '中度缺氧' : (HairData.co2Type + 1 === 5 ? '中度缺氧' : (HairData.co2Type + 1 === 6 ? '重度缺氧' : '严重缺氧'))))), level: HairData.co2Type + 1},
              Temperature: {data: HairData.temperature, quantity: HairData.temperatureType + 1 === 1 ? '寒冷' : (HairData.temperatureType + 1 === 6 ? '炎热' : '舒适'), level: HairData.temperatureType + 1},
              Humidity: {data: HairData.humidity, quantity: HairData.humidityType + 1 === 1 ? '干燥' : (HairData.humidityType + 1 === 6 ? '潮湿' : '舒适'), level: HairData.humidityType + 1},
              VOC: {data: HairData.voc, quantity: HairData.vocType + 1 === 1 ? '优' : (HairData.vocType + 1 === 2 ? '良' : (HairData.vocType + 1 === 3 ? '轻度异味' : (HairData.vocType + 1 === 4 ? '中度异味' : (HairData.vocType + 1 === 5 ? '中度异味' : (HairData.vocType + 1 === 6 ? '重度异味' : '严重异味'))))), level: HairData.vocType + 1}
            }
            break
          case 0:
            this.$Message.error(_res.data.message)
            break
          default:
            this.$Message.error(_res.data.message)
        }
      }).catch((_res) => {
        console.log(_res)
        this.$Message.error('Interface Error!')
      })
    },
    drawLine () {
      this.toggleSpin(true)
      let _THIS = this
      // 初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      let myChart2 = this.$echarts.init(document.getElementById('myChart2'))
      let urlKind = ''
      let backDataProperty = ''
      if (this.curEqType === '031' || this.curEqType === '032') {
        urlKind = '/hair'
        backDataProperty = 'hairList'
      }
      if (this.curEqType === '021' || this.curEqType === '022') {
        urlKind = '/energy'
        backDataProperty = 'energyList'
      }
      send({
        name: urlKind + '?device_id=' + this.curEqCode + '&type=' + _THIS.curKindI + '&hh=' + _THIS.time,
        method: 'GET',
        data: {
        }
      }).then(_res => {
        if (_res.data[backDataProperty].length === 0) {
          _THIS.hasData = false
          this.toggleSpin(false)
          return false
        } else {
          _THIS.hasData = true
        }
        switch (_res.data.code) {
          case 1:
            let tempData = _res.data[backDataProperty].reverse()
            let option = {
              title: {
                text: ''
              },
              tooltip: {
                trigger: 'axis'
              },
              xAxis: {
                data: tempData.map(function (item) {
                  return item.faddtime || ''
                })
              },
              yAxis: {
                splitLine: {
                  show: false
                }
              },
              toolbox: {
                left: 'center',
                feature: {
                  dataZoom: {
                    yAxisIndex: 'none'
                  },
                  restore: {},
                  saveAsImage: {}
                }
              },
              dataZoom: [{
                startValue: '2018-09-01'
              }, {
                type: 'inside'
              }],
              visualMap: {
                top: 10,
                right: 10,
                pieces: _THIS.$store.state.LimitRange[_THIS.curKind],
                outOfRange: {
                  color: '#999'
                }
              },
              series: {
                name: _THIS.curKind + '数值',
                type: 'line',
                data: tempData.map(function (item) {
                  return item[_THIS.curKindI]
                }),
                markLine: {
                  silent: true
                  // data: [{
                  //   yAxis: 50
                  // }, {
                  //   yAxis: 100
                  // }, {
                  //   yAxis: 150
                  // }, {
                  //   yAxis: 200
                  // }, {
                  //   yAxis: 300
                  // }]
                }
              }
            }
            myChart.setOption(option)
            myChart2.setOption(option)
            this.toggleSpin(false)
            break
          default:
            this.$Message.error(_res.data.message)
        }
      }).catch((_res) => {
        console.log(_res)
        this.toggleSpin(false)
        this.$Message.error('Interface Error!')
      })
    },
    // 命令序号
    getCurCNS (MasterCode) {
      return new Promise((resolve, reject) => {
        send({
          name: '/deviceSequence?main_control_code=' + MasterCode,
          method: 'GET',
          data: {
          }
        }).then(_res => {
          switch (_res.data.code) {
            case 1:
              resolve(_res.data.sequence_number)
              break
            case 0:
              this.$Message.error(_res.data.message)
              break
            default:
              this.$Message.error(_res.data.message)
          }
        }).catch((_res) => {
          console.log(_res)
          this.$Message.error('Interface Error!')
        })
      })
    },
    setConfig (type, EQ) {
      this.EqConfig(type, EQ)
    },
    // 开关
    OperationToggle (eqItem, eqIdx) {
      if (eqItem.device_config === '1') {
        // if (eqItem.type.toString() === '0') {
        //   this.$Message.error('您的设备处于离线状态!')
        //   this.getAllEq()
        //   return false
        // }
        this.toggleSpin(true)
        this.SwitchConfig(eqItem, eqIdx)
      } else {
        this.EqConfig('switch', eqItem, eqIdx)
      }
    },
    async EqConfig (type, eqItem, eqIdx) {
      this.toggleSpin(true)
      var sendCurCns = await this.getCurCNS(eqItem.master_control)
      send({
        name: '/deviceConfig?main_control_id=' + eqItem.master_control + '&sequence_number=' + sendCurCns + '&home_id=' + this.curHomeId,
        // name: '/deviceConfig?main_control_id=' + eqItem.master_control + '&second_control_id=00123456' + '&sequence_number=' + sendCurCns + '&measure_point=08&control_point=00&qty=01',
        method: 'GET',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.timer = setInterval(() => {
              this.playRoadCounter++
              this.EqPlay(type, eqItem, sendCurCns, 'ConfigAck', '', eqIdx)
            }, 1000)
            // setTimeout(() => { this.EqPlay(type, eqItem, sendCurCns, 'ConfigAck', '', eqIdx) }, 1000)
            break
          case 0:
            this.$Message.error(_res.data.message)
            break
          default:
            this.$Message.error(_res.data.message)
        }
      }).catch((_res) => {
        console.log(_res)
        this.$Message.error('Interface Error!')
      })
    },
    async EqPlay (type, eqItem, sendCurCns, topic, switchStatus, eqIdx) {
      send({
        name: '/payload?topic=' + eqItem.master_control + '/' + topic + '&sequence_number=' + sendCurCns + '&device_status=' + switchStatus + '&id=' + eqItem.id,
        method: 'GET',
        data: {
        }
      }).then(_res => {
        switch (_res.data.result.code) {
          case 1:
            if (switchStatus === '' && _res.data.result.payload === '00') { // 配置完去更新
              this.UpdateConfigStatus(type, eqItem, eqIdx)
              clearInterval(this.timer)
            } else { // 开关操作
              // 页面上更新开关状态
              if (_res.data.result.payload === '00') {
                clearInterval(this.timer)
                this.playRoadCounter = 0
                this.getAllEq('', eqItem, eqIdx)
              } else if (_res.data.result.payload === '01') {
                clearInterval(this.timer)
                this.$Message.error('设备不存在')
                this.getAllEq('', eqItem, eqIdx)
              } else if (_res.data.result.payload === '02') {
                clearInterval(this.timer)
                this.$Message.error('控制点不存在')
                this.getAllEq('', eqItem, eqIdx)
              } else if (_res.data.result.payload === '03') {
                clearInterval(this.timer)
                this.$Message.error('控制类型不存在')
                this.getAllEq('', eqItem, eqIdx)
              } else if (_res.data.result.payload === '04') {
                clearInterval(this.timer)
                this.$Message.error('控制数据错误')
                this.getAllEq('', eqItem, eqIdx)
              } else if (_res.data.result.payload === '255') {
                clearInterval(this.timer)
                this.$Message.error('数据包太短')
                this.getAllEq('', eqItem, eqIdx)
              } else {
                this.$Message.error(_res.data.result.result)
              }
              this.toggleSpin(false)
            }
            // if (switchStatus === '') { // 配置完去更新
            //   this.UpdateConfigStatus(type, eqItem, eqIdx)
            //   clearInterval(this.timer)
            // } else { // 开关操作
            //   // 页面上更新开关状态
            //   if (_res.data.result.payload === '00') {
            //     clearInterval(this.timer)
            //     this.getAllEq('', eqItem, eqIdx)
            //   } else if (_res.data.result.payload === '01') {
            //     clearInterval(this.timer)
            //     this.$Message.error('设备不存在')
            //     this.getAllEq('', eqItem, eqIdx)
            //   } else if (_res.data.result.payload === '02') {
            //     clearInterval(this.timer)
            //     this.$Message.error('控制点不存在')
            //     this.getAllEq('', eqItem, eqIdx)
            //   } else if (_res.data.result.payload === '03') {
            //     clearInterval(this.timer)
            //     this.$Message.error('控制类型不存在')
            //     this.getAllEq('', eqItem, eqIdx)
            //   } else if (_res.data.result.payload === '04') {
            //     clearInterval(this.timer)
            //     this.$Message.error('控制数据错误')
            //     this.getAllEq('', eqItem, eqIdx)
            //   } else if (_res.data.result.payload === '255') {
            //     clearInterval(this.timer)
            //     this.$Message.error('数据包太短')
            //     this.getAllEq('', eqItem, eqIdx)
            //   } else {
            //     this.$Message.error(_res.data.result.result)
            //   }
            //   this.toggleSpin(false)
            // }
            break
          case 0:
            this.getAllEq('', eqItem, eqIdx)
            this.toggleSpin(false)
            this.$Message.error(_res.data.result.result)
            break
          default:
            this.$Message.error(_res.data.result.result)
        }
      }).catch((_res) => {
        console.log(_res)
        this.$Message.error('Interface Error payload!')
        clearInterval(this.timer)
        this.toggleSpin(false)
      })
    },
    UpdateConfigStatus (type, eqItem, eqIdx) {
      send({
        name: '/deviceConfig?id=' + eqItem.id + '&device_config=1' + '&main_control_code=' + eqItem.master_control,
        method: 'PUT',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            // 图表类配置成功跳转图表
            if (type === 'chart') {
              this.getCurSensorData()
              this.changeModalShow('Chart')
              this.drawLine()
              this.getAllEq('chart', eqItem, eqIdx)
            }
            if (type === 'switch') {
              this.getAllEq('switch', eqItem, eqIdx)
            }
            break
          case 0:
            this.$Message.error('Interface Error!')
            break
          default:
            this.$Message.error('Interface Error!')
        }
      }).catch((_res) => {
        console.log(_res)
        this.$Message.error('Interface Error!')
      })
    },
    // 开关
    async SwitchConfig (eqItem, eqIdx) {
      var sendCurCns = await this.getCurCNS(eqItem.master_control)
      send({
        name: '/deviceControl?main_control_code=' + eqItem.master_control + '&sequence_number=' + sendCurCns + '&device_code=' + eqItem.device_code + '&control_type=01' + '&control_number=01' + '&control_data=' + (eqItem.device_status ? '00000000' : '447a0000'),
        method: 'GET',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.timer = setInterval(() => {
              this.EqPlay('switch', eqItem, sendCurCns, 'ControlAck', eqItem.device_status ? 1 : 0, eqIdx)
            }, 1000)
            // setTimeout(() => { this.EqPlay('switch', eqItem, sendCurCns, 'ControlAck', eqItem.device_status === '0' ? 1 : 0, eqIdx) }, 3000)
            break
          case 0:
            this.$Message.error('Interface Error1!')
            break
          default:
            this.$Message.error('Interface Error!')
        }
      }).catch((_res) => {
        console.log(_res)
        this.$Message.error('Interface Error3!')
      })
    },
    // 获取目标房间ID
    changeDestinationRoom (RommName) {
      this.HouseList.map((room, idx) => {
        if (room.house_name === RommName) {
          this.moveDestinationId = room.id
        }
      })
    },
    // 确认移动
    sureMove () {
      // this.toggleSpin(true)
      if (this.btLoading) {
        return false
      }
      this.btLoading = true
      send({
        name: '/deviceHouse?id=' + this.curEQId + '&house_id=' + this.moveDestinationId,
        method: 'PUT',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.getAllEq()
            this.ifMove = false
            this.btLoading = false
            this.$Message.success('移动成功!')
            break
          default:
            // this.toggleSpin(false)
            this.btLoading = false
            this.$Message.error(_res.data.message)
        }
      }).catch((_res) => {
        console.log(_res)
        // this.toggleSpin(false)
        this.$Message.error('Interface Error!')
      })
    },
    // 更新设备名称
    sureModify (EqId, Type) {
      console.log(EqId)
      send({
        name: '/device?id=' + EqId + '&house_id=' + this.curHomeId + '&second_control_id=' + this.curEq.second_control_id + (Type === 'name' ? '&device_name=' + this.newEqName : '&device_code=' + this.newEqCode),
        // name: '/device?device_name=' + this.newEqName + '&id=' + EqId + '&house_id=' + this.curHomeId,
        method: 'PUT',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.$Message.success('修改成功!')
            this.getAllEq()
            this.newEqName = ''
            this.newEqCode = ''
            break
          default:
            this.$Message.error(_res.data.message)
        }
      }).catch((_res) => {
        console.log(_res)
        this.$Message.error('Interface Error!')
      })
    },
    // 所有设备
    getAllEq (type, eqItem, eqIdx) {
      this.toggleSpin(true)
      send({
        name: '/selecteqlist?home_id=' + this.curHomeId,
        method: 'GET',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            _res.data.deviceHomeList.map((item) => {
              item.device_status = item.device_status === '1'
              // item.device_status = item.device_status === '1' ? true : false
            })
            this.EqList = _res.data.deviceHomeList
            if (type === 'switch') {
              this.SwitchConfig(eqItem, eqIdx)
            }
            this.toggleSpin(false)
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
    // 当前家下房间
    getAllRoom () {
      this.toggleSpin(true)
      send({
        name: '/house?home_id=' + this.curHomeId,
        method: 'GET',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.HouseList = _res.data.houseList
            this.toggleSpin(false)
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
    // 单品添加列表
    filterSingle () {
      let SingleList = this.AddList.filter(master => {
        if (master.devcieType === '2') {
          return master
        }
      })
      this.SingleList = SingleList
    },
    // 提交
    handleSubmitSingle (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.addSingleProduct()
        } else {
          this.$Message.warning('请将信息填写完成!')
        }
      })
    },
    handleSubmitEQ (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.addEQProduct()
        } else {
          this.$Message.warning('请将信息填写完整!')
        }
      })
    },
    // 选择单品
    changeSingle (SingleId) {
      this.SingleList.map((item, idx) => {
        if (item.id === SingleId) {
          this.formSingle.SingleName = item.deviceDescibe
          this.formSingle.SingleType = item.deviceTypeName
        }
      })
    },
    // 添加单品
    addSingleProduct () {
      // this.toggleSpin(true)
      if (this.btLoading) {
        return false
      }
      // if (!this.formSingle.selectRoomId) {
      //   this.$Message.warning('请先添加房间!')
      //   return false
      // }
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
          default_device_type: this.formSingle.SingleType,
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
            this.$Message.success('添加成功!')
            this.getAllEq()
            this.btLoading = false
            // 清空之前输入
            // this.formSingle.SingleSelectName = ''
            this.formSingle.SingleName = ''
            this.formSingle.SingleCode = ''
            // 清除输入
            this.EqType = '无线设备'
            this.formSingle = {
              SingleName: '',
              SingleCode: '',
              SingleSelectName: '',
              selectRoomId: ''
            }
            break
          default:
            // this.toggleSpin(false)
            this.btLoading = false
            this.$Message.error(_res.data.message)
        }
      }).catch((_res) => {
        console.log(_res)
        // this.toggleSpin(false)
        this.btLoading = false
        this.$Message.error('Interface Error!')
      })
    },
    // 切换主控
    selectChangeMaster (MasterId) {
      // let temp = this.formEQNormal
      let Master = this.MasterControlList.filter(master => {
        if (master.id === MasterId) {
          return master
        }
      })
      this.initialSelect(Master)
    },
    // 获取该主控下所有从控
    getSecondControlList (MasterCode) {
      send({
        name: '/secondControl?home_id=' + this.curHomeId + '&main_control_code=' + MasterCode,
        method: 'GET',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            if (_res.data.secondControlList.length > 0) {
              this.SecondControlList = _res.data.secondControlList
              this.formEQNormal.selectSecondId = _res.data.secondControlList[0].id
              this.choosedSecond = _res.data.secondControlList[0]
            } else {
              this.SecondControlList = []
              this.formEQNormal.selectSecondId = ''
              this.choosedSecond = {}
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
    // 切换从控
    selectChangeSecond (SecondId) {
      let Second = this.SecondControlList.filter(second => {
        if (second.id === SecondId) {
          return second
        }
      })
      this.choosedSecond = Second[0]
    },
    // 添加设备
    addEQProduct () {
      // this.toggleSpin(true)
      if (this.btLoading) {
        return false
      }
      // if (!this.choosedMaster.id) {
      //   this.$Message.warning('请先添加主控!')
      //   return false
      // }
      // if (!this.choosedSecond.id) {
      //   this.$Message.warning('请先添加从控!')
      //   return false
      // }
      // if (!this.formEQNormal.selectRoomId) {
      //   this.$Message.warning('请先添加房间!')
      //   return false
      // }
      this.btLoading = true
      send({
        name: '/device',
        method: 'POST',
        data: {
          register_id: this.$store.state.register_id,
          home_id: this.curHomeId,
          house_id: this.formEQNormal.selectRoomId,
          main_control_code: this.choosedMaster.main_control_code,
          main_control_id: this.choosedMaster.id,
          second_control_id: this.choosedSecond.id,
          second_contrl_code: this.choosedSecond.secondControl_Code,
          device_name: this.formEQNormal.EQName.trim(),
          device_code: this.formEQNormal.EQCode,
          default_device_type: this.formEQNormal.eqType,
          device_img: '',
          device_status: 0,
          deviceType: 4,
          device_config: 99
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            // this.toggleSpin(false)
            this.changeModalShow('EQ')
            this.$Message.success('添加成功!')
            this.getAllEq()
            this.btLoading = false
            // 清空之前输入
            this.formEQNormal.EQName = ''
            this.formEQNormal.EQCode = ''
            // 清除输入
            this.EqType = '无线设备'
            this.formSingle = {
              SingleName: '',
              SingleCode: '',
              SingleSelectName: '',
              selectRoomId: ''
            }
            break
          default:
            // this.toggleSpin(false)
            this.btLoading = false
            this.$Message.error(_res.data.message)
        }
      }).catch((_res) => {
        console.log(_res)
        // this.toggleSpin(false)
        this.btLoading = false
        this.$Message.error('Interface Error!')
      })
    },
    // 所有主控
    remoteMethod (query) {
      let that = this
      if (query !== '') {
        that.loading = true
        setTimeout(() => {
          that.loading = false
          that.getMasterControl()
        }, 200)
      } else {
        that.MasterControlList = []
      }
    },
    // 控制面板
    showControlPanel (EQ, idx) {
      this.curEq = EQ // 用于子组件触发父组件事件
      this.curEqIndex = idx // 用于子组件触发父组件事件
      this.curEqType = EQ.default_device_type
      this.changeModalShow('Panel')
    },
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
    }
  }
}
</script>
<style scoped lang="less">
.ListBox{
  margin: 0 0 40px 0;
  h4{
  }
  .eqIcon img{
    width: 60px;
    height: 60px;
  }
  span{
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;
  }
  .smallP{
    color: #333;
    font-size: 12px;
    span{
      font-weight: normal;
    }
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
    margin-bottom: 0px;
  }

  .ivu-input-large {
    border-top: 0px !important;
    order-left: 0px;
    order-right: 0px;
  }
}
.curDataBlock{
  width: 300px;
  height: 450px;
  background: #000;
  margin: 20px auto;
  .listenKindBlock{
    height: 150px;
    padding: 10px;
    border-bottom: 1px solid rgb(112,173,71);
    &:nth-of-type(odd){
      border-right: 1px solid rgb(112,173,71);
    }
    h2{
      color: rgb(112,173,71);
    }
    .levelBlock{
      width: 130px;
      height: 20px;
    }
    .level{
      flex: 1;
      height: 100%;
    }
    .level1{
      background: rgb(112,173,71);
      color: rgb(112,173,71);
    }
    .level2{
      background: rgb(255,217,102);
      color: rgb(255,217,102);
    }
    .level3{
      background: rgb(237,125,49);
      color: rgb(237,125,49);
    }
    .level4{
      background: rgb(255,0,0);
      color: rgb(255,0,0);
    }
    .level5{
      background: rgb(192,0,0);
      color: rgb(192,0,0);
    }
    .level6{
      background: rgb(102,51,0);
      color: rgb(102,51,0);
    }
    .trangleBox{
      width:20px;
      height:20px;
    }
    .trangleBox::before{
      content: '';
      position: absolute;
      border-left: 10px solid transparent;
      border-top: 10px solid transparent;
      border-right: 10px solid transparent;
      margin-top: -5px;
    }
    .trangleBox1::before{
      border-bottom: 10px solid rgb(112,173,71);
    }
    .trangleBox2::before{
      border-bottom: 10px solid rgb(255,217,102);
    }
    .trangleBox3::before{
      border-bottom: 10px solid rgb(237,125,49);
    }
    .trangleBox4::before{
      border-bottom: 10px solid rgb(255,0,0);
    }
    .trangleBox5::before{
      border-bottom: 10px solid rgb(192,0,0);
    }
    .trangleBox6::before{
      border-bottom: 10px solid rgb(102,51,0);
    }
    .color1{
      color: rgb(112,173,71);
    }
    .color2{
      color: rgb(255,217,102);
    }
    .color3{
      color: rgb(237,125,49);
    }
    .color4{
      color: rgb(255,0,0);
    }
    .color5{
      color: rgb(192,0,0);
    }
    .color6{
      color: rgb(102,51,0);
    }
  }
}
@keyframes ScaleToggle
{
  0%{
    transform: scale(1.1);
  }
  100%{
    transform: scale(1);
  }
}
</style>
