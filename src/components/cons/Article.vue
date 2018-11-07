<template>
  <div class="article">
    <Row style="padding-right: 34px;">
      <Col span="12"><h1>适玩</h1></Col>
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
            <Icon type="md-paper"></Icon> {{article.play_title}}
          </BreadcrumbItem>
        </Breadcrumb>
      </Col>
      <Col span="12" v-if="locationIdex != -1" class="TextAlignR PaddingR_34">
        <Button v-if="locationIdex != -1" type="warning" icon="ios-undo" @click="back">返回上级</Button>
      </Col>
    </Row>
    <Row v-if="locationIdex == -1" style="padding-right: 34px;margin-top: 40px;">
      <NoData v-if="articleList.length == 0"/>
      <!-- <Table class="CursorPointer" v-if="articleList.length > 0" :data="articleList" :columns="columns" :show-header='false' @on-row-click="seeDetail"></Table> -->
      <Row type="flex" justify="start" class="code-row-bg" v-if="articleList.length > 0">
        <Col span="24" class="MarginB_20"  v-for="(item, idx) in articleList" :key="idx">
          <Card class="CursorPointer" style="width: 100%;height: 135px;">
            <div style="text-align:left" @click="seeDetail(item)">
              <Row>
                <Col span="8"><img style="width:90%;height: 100px;" :src="'http://www.smart-hox.com:8081/upFiles/' + item.play_pic"></Col>
                <Col span="16">
                  <h4 style="height: 20px;margin-bottom:5px;">{{item.play_title}}</h4>
                  <p class="introduceBlock">{{item.play_introduce}}</p>
                  <p style="height: 15px;font-size: 12px;"><span>发布时间：{{item.datetime}}</span><span class="PaddingL_16">标签： {{item.play_label}}</span></p>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>
      <div v-if="articleList.length > 0" style="margin: 10px;overflow: hidden">
        <div style="float: right; margin-top: 20px;">
           <Page :total="total" :current="curPage" @on-change="changePage" :page-size="pageSize" show-total></Page>
        </div>
      </div>
    </Row>
    <!-- detail -->
    <Row v-if="locationIdex != -1" style="background: #fff;margin-right: 34px;padding-top: 20px;padding-bottom: 20px;">
      <h1 class="TextAlignC MarginB_10" style="color: #444;">{{article.play_title}}</h1>
      <p class="TextAlignC MarginB_20">{{article.datetime}}</p>
      <Col span="24" class="PaddingL_16 contentBox PaddingR_16" v-html="article.play_content"></Col>
    </Row>
  </div>
</template>

<script>
// import {mapState} from 'vuex'
import NoData from '../NoData.vue'
import {send} from '../../util/send'
import {secondToFormat} from '../../util/util'
export default {
  name: 'Problem',
  data () {
    return {
      locationIdex: -1,
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
          title: 'Name',
          key: 'play_title'
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
  created () {
    this.getArticles()
  },
  methods: {
    back () {
      this.locationIdex = -1
    },
    seeDetail (article) {
      this.locationIdex = 1
      this.article = article
    },
    changePage (page) {
      let PageSize = this.pageSize
      this.articleList = this.allArticle.slice((page - 1) * PageSize, (page - 1) * PageSize + PageSize)
      this.curPage = page
    },
    // 所有常见问题
    getArticles () {
      send({
        name: '/playList',
        method: 'GET',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            let temp = _res.data.playList
            temp.map((item) => {
              item.datetime = secondToFormat(item.create_date.time)
            })
            this.allArticle = temp.slice(0)
            this.articleList = temp.slice(0, this.pageSize)
            this.total = this.allArticle.length
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
<style lang="less">
.article{
  margin: 10px 0;
  h1{
    color: #fff;
  }
  .introduceBlock{
    height: 60px;
    font-size: 13px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }
  .contentBox{
    overflow: hidden;
  }
}
</style>
