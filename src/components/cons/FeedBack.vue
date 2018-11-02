<template>
  <div class="feedBack">
    <Row>
      <Col span="12"><h1>意见反馈</h1></Col>
    </Row>
    <Row style="background: #fff;margin-top: 20px;margin-right: 34px;padding-top: 40px;padding-bottom: 20px;padding-right: 16px;">
      <Form ref="formFeedBack" :model="formFeedBack" :rules="ruleFeedBack" :label-width="90">
        <FormItem label="联系电话" prop="phone">
            <Input v-model="formFeedBack.phone" placeholder="请输入您的联系电话"></Input>
        </FormItem>
        <FormItem label="反馈内容" prop="suggestion">
          <Input v-model="formFeedBack.suggestion" type="textarea" :autosize="{minRows: 5}" placeholder="请输入您的反馈..."></Input>
        </FormItem>
        <p class="PaddingL_16 TextAlignR">对于您的反馈我们会及时处理，请保持电话畅通我们会与您联系！</p>
        <FormItem class="TextAlignR MarginT_40">
          <Button type="primary" :loading="btLoading" @click="handleSubmit('formFeedBack')">提交</Button>
          <!-- <Button @click="handleReset('formFeedBack')" style="margin-left: 8px">Reset</Button> -->
        </FormItem>
      </Form>
    </Row>
    <!-- <Row>
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
    <NoData v-if="MessageList.length == 0"/> -->
    <!-- 添加反馈 -->
    <!-- <Modal v-model="ifAddFeedBack" width="360">
      <p slot="header" style="color:#333;text-align:left">
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
      </div>
    </Modal> -->
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {send} from '../../util/send'
import NoData from '../NoData.vue'
export default {
  name: 'FeedBack',
  data () {
    return {
      ifAddFeedBack: false,
      btLoading: false,
      feedback: '',
      formFeedBack: {
        phone: '',
        suggestion: ''
      },
      ruleFeedBack: {
        phone: [
          { required: true, message: '请输入您的联系电话', trigger: 'blur' },
          { pattern: /^1[34578]\d{9}$/, message: '手机号格式不正确！', trigger: 'blur' }
        ],
        suggestion: [
          { required: true, message: '请输入您给我们的反馈', trigger: 'blur' }
        ]

      },
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
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.btLoading = true
          this.submitFeedBack(this.formFeedBack.phone, this.formFeedBack.suggestion)
        } else {
          this.$Message.error('请将信息填写完整!')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    submitFeedBack (mobile, complaint) {
      send({
        name: '/complaintFeedback?mobile=' + mobile + '&complaint=' + complaint,
        method: 'POST',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.$Message.success(_res.data.message)
            this.handleReset('formFeedBack')
            this.btLoading = false
            break
          default:
            this.$Message.error(_res.data.message)
            this.btLoading = false
        }
      }).catch((_res) => {
        console.log(_res)
        this.$Message.error('Interface Error!')
        this.btLoading = false
      })
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
