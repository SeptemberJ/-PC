<template>
  <div class="feedBack">
    <Row>
      <Col span="12" class="PaddingL_16"><h1>反馈列表</h1></Col>
      <Col span="12" class="TextAlignR PaddingR_16"><Button type="error" icon="md-add">添加反馈</Button></Col>
    </Row>
    <div class="ListBox" v-if="MessageList.length > 0">
      <Row>
        <Col span="23" class="PaddingL_16" v-for="(Message, idx) in MessageList" :key="idx">
          <Alert :type="Message.status == 0 ? 'warning' : 'success'" show-icon>
            <Row>
              <Col span="12">{{Message.tit}}</Col>
              <Col span="12" class="TextAlignR"><span v-if="Message.status == 0">标记为已读 | </span><span>删除</span></Col>
            </Row>
            <span slot="desc">{{Message.time}}</span>
          </Alert>
        </Col>
      </Row>
    </div>
    <NoData v-if="MessageList.length == 0"/>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import NoData from '../NoData.vue'
export default {
  name: 'FeedBack',
  data () {
    return {
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
