<template>
  <div class="problem">
    <Row style="padding-right: 34px;">
      <Col span="12" class=""><h1>常见问题</h1></Col>
      <!-- <Col span="12" class=""><Input v-model="keyWord" clearable search placeholder="输入关键字..."/></Col> -->
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
            <Icon type="md-paper"></Icon> {{problem.fname}}
          </BreadcrumbItem>
        </Breadcrumb>
      </Col>
      <Col span="12" v-if="locationIdex != -1" class="TextAlignR PaddingR_34">
        <Button v-if="locationIdex != -1" type="warning" icon="ios-undo" @click="back">返回上级</Button>
      </Col>
    </Row>
    <Row v-if="locationIdex == -1" style="padding-right: 34px;margin-top: 40px;">
      <NoData v-if="(!ifSearch && problemList.length == 0) || (ifSearch && resultList.length == 0)"/>
      <Table class="CursorPointer" v-if="!ifSearch && problemList.length > 0" :data="problemList" :columns="columns" :show-header='false' @on-row-click="seeDetail"></Table>
      <div v-if="!ifSearch && problemList.length > 0" style="margin: 10px;overflow: hidden">
        <div style="float: right; margin-top: 20px;">
          <Page :total="total" :current="curPage" @on-change="changePage" :page-size="pageSize" show-total></Page>
        </div>
      </div>
      <!-- 查询结果 -->
     <!--  <Table v-if="ifSearch && resultList.length > 0" :data="resultList" :columns="columns" :show-header='false' @on-row-click="seeDetail"></Table>
      <div v-if="ifSearch && resultList.length > 0" style="margin: 10px;overflow: hidden">
        <div style="float: right; margin-top: 20px;">
          <Page :total="total" :current="1" @on-change="changePage"></Page>
        </div>
      </div> -->
    </Row>
    <!-- detail -->
    <Row v-if="locationIdex != -1" style="background: #fff;margin-right: 34px;padding-top: 20px;padding-bottom: 20px;">
      <h2 class="TextAlignC MarginB_10">{{problem.fname}}</h2>
      <p class="TextAlignC MarginB_20">{{problem.createDate}}</p>
      <Col span="24" class="PaddingL_16" v-html="problem.fcontent"></Col>
    </Row>
    <!-- <div class="problemList PaddingL_16">
      <div v-if="!ifSearch && problemList.length > 0" class="problemItem" v-for="(problem, idx) in problemList" :key="idx">
        <Row type="flex" justify="start" class="code-row-bg">
          <Col span="8" class="tit"><h3><span>{{idx + 1}}. </span>{{problem.tit}}</h3></Col>
        </Row>
        <Divider />
      </div>
      <div v-if="resultList.length > 0" class="problemItem" v-for="(result, index) in resultList" :key="index">
        <Row type="flex" justify="start" class="code-row-bg">
          <Col span="8" class="tit"><h3><span>{{index + 1}}. </span>{{result.tit}}</h3></Col>
        </Row>
        <Divider />
      </div>
      <NoData v-if="ifSearch && resultList.length == 0 || problemList.length == 0"/>
    </div> -->
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {send} from '../../util/send'
import NoData from '../NoData.vue'
export default {
  name: 'Problem',
  data () {
    return {
      locationIdex: -1,
      keyWord: '',
      ifSearch: false,
      resultList: [],
      pageSize: 10,
      curPage: 1,
      total: 0,
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: 'title',
          key: 'fname'
        },
        {
          title: 'createDate',
          key: 'createDate',
          align: 'right'
        }
      ],
      allProblem: [],
      problemList: [],
      problem: ''
    }
  },
  computed: {
    ...mapState({
      curMenu: state => state.sider.curMenu
    })
  },
  watch: {
    keyWord: function (val) {
      console.log(val)
      if (val.trim() !== '') {
        this.ifSearch = true
        this.search()
      } else {
        this.ifSearch = false
        this.resultList = []
      }
    }
  },
  components: {
    NoData
  },
  created () {
    this.getProblems()
  },
  methods: {
    search () {
      var keyWord = this.keyWord
      var len = this.problemList.length
      var arr = []
      for (var i = 0; i < len; i++) {
        // 如果字符串中不包含目标字符会返回-1
        if (this.problemList[i].name.indexOf(keyWord) !== -1) {
          arr.push(this.problemList[i])
        }
      }
      console.log(arr)
      this.resultList = arr
    },
    back () {
      this.locationIdex = -1
    },
    seeDetail (article) {
      this.locationIdex = 1
      this.problem = article
    },
    changePage (page) {
      let PageSize = this.pageSize
      this.problemList = this.allProblem.slice((page - 1) * PageSize, (page - 1) * PageSize + PageSize)
      this.curPage = page
    },
    // 所有常见问题
    getProblems (type, eqItem, eqIdx) {
      send({
        name: '/commonQuestionList',
        method: 'GET',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.allProblem = _res.data.commonQuestionList.data.slice(0)
            this.problemList = _res.data.commonQuestionList.data.slice(0, this.pageSize)
            this.total = this.allProblem.length
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
.problem{
  margin: 10px 0;
  h1{
    color: #fff;
  }
  .problemList{
    margin-top: 40px;
    padding-right: 34px;
    color: #fff;
    .problemItem{
      img{
        width: 50px;
        height: 50px;
        margin-right: 10px;
        display: inline-block;
        border-radius: 50%;
      }
      .tit{
        height: 50px;
        line-height: 50px;
        h3{
          display: inline-block;
        }
        span{
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
