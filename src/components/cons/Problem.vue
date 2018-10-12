<template>
  <div class="problem">
    <Row>
      <Col span="12" class="PaddingL_16"><h1>常见问题</h1></Col>
      <Col span="12" class="PaddingR_16"><Input v-model="keyWord" clearable search placeholder="输入关键字..."/></Col>
    </Row>
    <div class="problemList PaddingL_16">
      <div v-if="!ifSearch && problemList.length > 0" class="problemItem" v-for="(problem, idx) in problemList" :key="idx">
        <Row type="flex" justify="start" class="code-row-bg">
          <Col span="8" class="tit"><h3><span>{{idx + 1}}. </span>{{problem.tit}}</h3></Col>
        </Row>
        <Divider />
      </div>
      <!-- 搜索结果 -->
      <div v-if="resultList.length > 0" class="problemItem" v-for="(result, index) in resultList" :key="index">
        <Row type="flex" justify="start" class="code-row-bg">
          <!-- <img src="https://i.loli.net/2017/08/21/599a521472424.jpg"> -->
          <Col span="8" class="tit"><h3><span>{{index + 1}}. </span>{{result.tit}}</h3></Col>
        </Row>
        <Divider />
      </div>
      <NoData v-if="ifSearch && resultList.length == 0 || problemList.length == 0"/>
    </div>
    <!-- 文章详情 -->
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
      problemList: [{tit: '主控问题'}, {tit: '从控问题'}, {tit: '设备问题'}]
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
        if (this.problemList[i].tit.indexOf(keyWord) !== -1) {
          arr.push(this.problemList[i])
        }
      }
      this.resultList = arr
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
