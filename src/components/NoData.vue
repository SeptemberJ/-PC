<template>
  <Row class="TextAlignC NoData">
    <Col class="demo-spin-col" span="24">
      <img src="../../static/img/icons/noData1.png">
      <p>暂无数据</p>
    </Col>
  </Row>
</template>

<script>
export default {
  name: 'NoData',
  data () {
    return {
    }
  },
  computed: {
  },
  created () {
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
.NoData{
  margin-top: 100px;
  margin-left: -34px;
  img{
    width: 80px;
  }
  p{
    font-size: 22px;
    color: #fff;
  }
}
</style>
