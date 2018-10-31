<template>
  <div class="problem">
    <Row style="padding-left: 16px;padding-right: 34px;">
      <Col span="12" class=""><h1>常见问题</h1></Col>
      <Col span="12" class=""><Input v-model="keyWord" clearable search placeholder="输入关键字..."/></Col>
    </Row>
    <Row style="padding-left: 16px;padding-right: 34px;margin-top: 40px;">
      <NoData v-if="(!ifSearch && problemList.length == 0) || (ifSearch && resultList.length == 0)"/>
      <Table v-if="!ifSearch && problemList.length > 0" :data="problemList" :columns="columns1" :show-header='false' @on-row-click="seeDetail"></Table>
      <div v-if="!ifSearch && problemList.length > 0" style="margin: 10px;overflow: hidden">
        <div style="float: right; margin-top: 20px;">
          <Page :total="100" :current="1" @on-change="changePage"></Page>
        </div>
      </div>
      <!-- 查询结果 -->
      <Table v-if="ifSearch && resultList.length > 0" :data="resultList" :columns="columns1" :show-header='false' @on-row-click="seeDetail"></Table>
      <div v-if="ifSearch && resultList.length > 0" style="margin: 10px;overflow: hidden">
        <div style="float: right; margin-top: 20px;">
          <Page :total="100" :current="1" @on-change="changePage"></Page>
        </div>
      </div>
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
import NoData from '../NoData.vue'
export default {
  name: 'Problem',
  data () {
    return {
      keyWord: '',
      ifSearch: false,
      resultList: [],
      problemList2: [{tit: '主控问题'}, {tit: '从控问题'}, {tit: '设备问题'}],
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
      problemList: [
        {
          name: '主控问题',
          age: 18,
          address: 'New York No. 1 Lake Park',
          date: '2016-10-03'
        },
        {
          name: '从控问题',
          age: 18,
          address: 'New York No. 1 Lake Park',
          date: '2016-10-03'
        },
        {
          name: '设备问题',
          age: 18,
          address: 'New York No. 1 Lake Park',
          date: '2016-10-03'
        }
      ]
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
    seeDetail () {
    },
    changePage () {
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
