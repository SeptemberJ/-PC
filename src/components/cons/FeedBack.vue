<template>
  <div class="feedBack">
    <Row>
      <Col span="12" class="PaddingL_16"><h1>反馈列表</h1></Col>
      <Col span="12" class="TextAlignR PaddingR_16"><Button type="error" icon="md-add" @click="addFeedBack">添加反馈</Button></Col>
    </Row>
    <div class="ListBox" v-if="MessageList.length > 0">
      <Row>
        <Col span="23" class="PaddingL_16" v-for="(Message, idx) in MessageList" :key="idx">
          <Alert :type="Message.status == 0 ? 'warning' : 'success'" show-icon class="CursorPointer">
            <Row>
              <Col span="12">{{Message.tit}}</Col>
              <Col span="12" class="TextAlignR"><span v-if="Message.status == 0" class="smallSize Bold CursorPointer hoverColor">标记为已读 | </span><span class="smallSize Bold CursorPointer hoverColor">删除</span></Col>
            </Row>
            <span slot="desc">{{Message.time}}</span>
          </Alert>
        </Col>
      </Row>
    </div>
    <NoData v-if="MessageList.length == 0"/>
    <!-- 添加反馈 -->
    <Modal v-model="ifAddFeedBack" width="360">
      <p slot="header" style="color:#333;text-align:left">
          <!-- <Icon type="ios-information-circle"></Icon> -->
          <span>添加反馈</span>
      </p>
      <div style="text-align:left">
        <Input v-model="feedback" type="textarea" :autosize="{minRows: 5,maxRows: 8}" placeholder="请输入您的反馈..."></Input>
      </div>
      <div slot="footer" class="TextAlignC">
        <Button type="error" size="large" :loading="btLoading" @click="handleSubmit">
          <span v-if="!btLoading">确认提交</span>
          <span v-else>Loading...</span>
        </Button>
        <!-- <Button type="error" size="large" @click="handleSubmit('formMaster')">确认添加</Button> -->
      </div>
    </Modal>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import NoData from '../NoData.vue'
export default {
  name: 'FeedBack',
  data () {
    return {
      ifAddFeedBack: false,
      btLoading: false,
      feedback: '',
      MessageList: [
        {
          tit: '标题',
          time: '2018-10-10',
          status: 0, // 0-未读 1-已读
          qs: '反馈内容',
          as: '回答内容'
        },
        {
          tit: '标题',
          time: '2018-10-10',
          status: 1, // 0-未读 1-已读
          qs: '反馈内容',
          as: '回答内容'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      curMenu: state => state.sider.curMenu
    })
  },
  components: {
    NoData
  },
  methods: {
    addFeedBack () {
      this.ifAddFeedBack = true
    },
    handleSubmit () {
      if (this.feedback.trim() === '') {
        this.$Message.error('反馈内容不能为空!')
        return false
      }
    }
  }
}
</script>
<style lang="less" scoped>
.feedBack{
  margin: 10px 0;
  h1{
    color: #fff;
  }
  .ListBox{
    margin-top: 40px;
  }
}
</style>
