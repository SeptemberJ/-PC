<template>
	<div class="automation">
		<NoData v-if="automationList.length == 0"/>
		<!-- 添加场景 -->
    <Modal v-model="ifAddAutomation" scrollable width="850">
      <p slot="header" style="color:#333;text-align:left">
          <!-- <Icon type="ios-information-circle"></Icon> -->
          <span>添加自动化</span>
      </p>
      <div style="text-align:left">
          <Form :model="formAutomation" ref="formAutomation" :rules="ruleValidateAutomation" label-position="left" :label-width="100">
            <FormItem label="场景名称" prop="AutomationName">
              <Input v-model="formAutomation.AutomationName" placeholder="输入自动化名称" style="" />
            </FormItem>
            <!-- condition -->
          	<FormItem label="如果">
          		<Button type="error" shape="circle" icon="md-add" size="small" style='float: right;'>添加</Button>
          	</FormItem>
          	<Button type="dashed" long class="Margin_20" icon="ios-add-circle-outline">添加自动化条件</Button>
          	<!-- action -->
          	<FormItem label="就">
          		<Button type="error" shape="circle" icon="md-add" size="small" style='float: right;'>添加</Button>
          	</FormItem>
          	<Button type="dashed" long class="Margin_20" icon="ios-add-circle-outline">添加自动化动作</Button>
          </Form>
      </div>
      <div slot="footer" class="TextAlignC">
          <!-- <Button v-if="EqType == '单品'"  type="error" size="large" :loading="btLoading" @click="handleSubmitSingle('formSingle')">
            <span v-if="!btLoading">确认添加</span>
            <span v-else>Loading...</span>
          </Button>
          <Button v-if="EqType == '无线设备'"  type="error" size="large" :loading="btLoading" @click="handleSubmitEQ('formEQNormal')">
            <span v-if="!btLoading">确认添加</span>
            <span v-else>Loading...</span>
          </Button> -->
      </div>
    </Modal>
	</div>
</template>
<script>
import {mapState} from 'vuex' // mapActions
import {send} from '../../util/send'
import NoData from '../NoData.vue'
export default {
  name: 'Problem',
  props: ['curHomeId'],
  data () {
    return {
    	automationList: [],
    	formAutomation: {
    		AutomationName: ''
    	}
    }
  },
  computed: {
    ...mapState({
      curMenu: state => state.sider.curMenu,
      curHome: state => state.curHome
    }),
    ifAddAutomation: {
      get: function () {
        return this.$store.state.ifAddAutomation
      },
      set: function (newValue) {
        this.changeModalShow('Automation')
      }
    }
  },
  watch: {
    curHomeId: function (val) {
      this.getAllScene()
    }
  },
  reated () {
    // this.getAllAutomation()
  },
  components: {
    NoData
  },
  methods: {
  	// 所有自动化
    getAllAutomation () {
      send({
        name: '/selecteqlist?home_id=' + this.curHomeId,
        method: 'GET',
        data: {
        }
      }).then(_res => {
        switch (_res.data.code) {
          case 1:
            this.EqList = _res.data.deviceHomeList
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
.automation{

}
</style>
