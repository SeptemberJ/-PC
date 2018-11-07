<template>
  <div class="article">
    <Row>
      <Col span="12" class="PaddingL_16"><h1>文章列表</h1></Col>
    </Row>
    <Row style="margin: 20px 0px;">
      <Col span="12">
        <Breadcrumb>
          <span @click="back">
            <BreadcrumbItem to="/Home">
              <Icon type="md-bookmark"></Icon> 列表
            </BreadcrumbItem>
          </span>
          <BreadcrumbItem v-if="locationIdex != -1">
            <Icon type="logo-buffer"></Icon>titlt
          </BreadcrumbItem>
        </Breadcrumb>
      </Col>
      <Col span="24" v-if="locationIdex != -1" class="TextAlignR">
        <Button v-if="locationIdex != -1" type="warning" icon="ios-undo" @click="back" class="MarginR_10">返回上级</Button>
      </Col>
    </Row>
    <Row v-if="locationIdex == -1" style="padding-right: 34px;margin-top: 40px;">
      <NoData v-if="articleList.length == 0"/>
      <Table v-if="articleList.length > 0" :data="articleList" :columns="columns" :show-header='false' @on-row-click="seeDetail"></Table>
      <div v-if="articleList.length > 0" style="margin: 10px;overflow: hidden">
        <div style="float: right; margin-top: 20px;">
          <Page :total="total" :current="1" @on-change="changePage"></Page>
        </div>
      </div>
    </Row>
    <!-- <Row style="padding-left: 16px;padding-right: 34px;margin-top: 40px;">
      <NoData v-if="data1.length == 0"/>
      <Table v-if="data1.length > 0" :data="data1" :columns="columns1" :show-header='false' @on-row-click="seeDetail"></Table>
      <div v-if="data1.length > 0" style="margin: 10px;overflow: hidden">
        <div style="float: right; margin-top: 20px;">
          <Page :total="100" :current="1" @on-change="changePage"></Page>
        </div>
      </div>
    </Row> -->
  </div>
</template>

<script>
// import {mapState} from 'vuex'
import NoData from '../../NoData.vue'
export default {
  name: 'Problem',
  data () {
    return {
      columns: [
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
      allArticle: [],
      articleList: [],
      article: ''
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
