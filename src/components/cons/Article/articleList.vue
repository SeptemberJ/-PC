<template>
  <div class="article">
    <Row>
      <Col span="12" class="PaddingL_16"><h1>文章列表</h1></Col>
    </Row>
    <Row style="padding-left: 16px;padding-right: 34px;margin-top: 40px;">
      <NoData v-if="data1.length == 0"/>
      <Table v-if="data1.length > 0" :data="data1" :columns="columns1" :show-header='false' @on-row-click="seeDetail"></Table>
      <div v-if="data1.length > 0" style="margin: 10px;overflow: hidden">
        <div style="float: right; margin-top: 20px;">
          <Page :total="100" :current="1" @on-change="changePage"></Page>
        </div>
      </div>
    </Row>
  </div>
</template>

<script>
// import {mapState} from 'vuex'
import NoData from '../../NoData.vue'
export default {
  name: 'Problem',
  data () {
    return {
      columns1: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: 'Name',
          key: 'name'
        },
        {
          title: 'Address',
          key: 'date',
          align: 'right'
        }
      ],
      data1: [
        {
          name: 'New York No. 1 Lake Park',
          age: 18,
          address: 'New York No. 1 Lake Park',
          date: '2016-10-03'
        },
        {
          name: '文章一',
          age: 18,
          address: 'New York No. 1 Lake Park',
          date: '2016-10-03'
        }
      ]
    }
  },
  computed: {
  },
  watch: {
  },
  components: {
    NoData
  },
  methods: {
    changePage () {

    },
    seeDetail (item) {
      console.log(item)
    }
  }
}
</script>
<style lang="less" scoped>
.article{
  margin: 10px 0;
  h1{
    color: #fff;
  }
}
</style>
