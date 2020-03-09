<template>
	<div>
    <Card>
      <Upload
        ref="upload"
        :headers="myHeader"
        action="http://47.115.162.174:8899/natCheck/batchImport1"
        name="file"
        :show-upload-list="true"
        :on-format-error="handleFormatError"
        :on-success="handleSuccess"
        :on-error="handleError"
        :format ="['xlsx','xls']">
        <Button type="info" icon="ios-cloud-upload-outline">批量导入</Button>
      </Upload>
      <Button type="warning" @click="sendAll" style="margin: 0 15px">批量发送所有未发送</Button>
      <Button type="error" @click="batchSend">选择发送</Button>
      <Card>
        <div>
          <Table :columns="columns" :data="tableData" border  @on-selection-change="batchSelect" disabled-hover
          ></Table>
        </div>
        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page show-total show-elevator :total="page.total" :current="page.currentPage"
                  @on-change="handlePageTurn"></Page>
          </div>
        </div>
      </Card>
    </Card>
<!--    <Card>-->
<!--      <Tabs>-->
<!--        <TabPane label="所有用户" >-->
<!--          <Card>-->
<!--            <div>-->
<!--              <Table :columns="columns2" :data="tableData2" border-->
<!--              ></Table>-->
<!--            </div>-->
<!--            <div style="margin: 10px;overflow: hidden">-->
<!--              <div style="float: right;">-->
<!--                <Page show-total show-elevator :total="page2.total" :current="page2.currentPage"-->
<!--                      @on-change="handlePageTurn2"></Page>-->
<!--              </div>-->
<!--            </div>-->
<!--          </Card>-->
<!--        </TabPane>-->
<!--        <TabPane label="未发送用户" >-->
<!--          <Card>-->
<!--            <Upload-->
<!--              ref="upload"-->
<!--              :headers="myHeader"-->
<!--              action="http://47.115.162.174:8899/natCheck/batchImport1"-->
<!--              name="file"-->
<!--              :show-upload-list="true"-->
<!--              :on-format-error="handleFormatError"-->
<!--              :on-success="handleSuccess"-->
<!--              :on-error="handleError"-->
<!--              :format ="['xlsx','xls']">-->
<!--              <Button type="info" icon="ios-cloud-upload-outline">批量导入</Button>-->
<!--            </Upload>-->
<!--            <Button type="warning" @click="sendAll" style="margin: 0 15px">批量发送所有未发送</Button>-->
<!--            <Button type="error" @click="batchSend">选择发送</Button>-->
<!--            <Card>-->
<!--              <div>-->
<!--                <Table :columns="columns" :data="tableData" border  @on-selection-change="batchSelect" disabled-hover-->
<!--                ></Table>-->
<!--              </div>-->
<!--              <div style="margin: 10px;overflow: hidden">-->
<!--                <div style="float: right;">-->
<!--                  <Page show-total show-elevator :total="page.total" :current="page.currentPage"-->
<!--                        @on-change="handlePageTurn"></Page>-->
<!--                </div>-->
<!--              </div>-->
<!--            </Card>-->
<!--          </Card>-->
<!--        </TabPane>-->
<!--      </Tabs>-->
<!--    </Card>-->
	</div>
</template>

<script>
import {getnakList,getnakList2,batchSend,sendChoice} from '../../api/wq'
import Config from '../../config/index'
import {doNursingServiceTypeDelMany} from "../../api/nursing";

export default {
  computed: {
    access () {
      return this.$store.state.user.access
    },
    viewAdd () { // 该用户是否拥有用户添加权限
      // return hasOneOf(['role-add'], this.access)
      return true
    },
    viewEdit () { // 该用户是否拥有用户信息编辑权限
      // return hasOneOf(['role-edit'], this.access)
      return true
    },
    viewDel () { // 该用户是否拥有用户删除权限
      // return hasOneOf(['role-del'], this.access)
      return true
    },
    viewDelMany () { // 该用户是否拥有用户删除权限
      // return hasOneOf(['role-delMany'], this.access)
      return true
    },
    viewAccess () {
      // if (hasOneOf(['role-access-add'], this.access) && hasOneOf(['role-access-del'], this.access)) {
      //   return true
      // } else {
      //   return false
      // }
      return true
    }
  },
  data () {
    return {
      handle: false,
      isShow: false,
      myHeader: { authorization: localStorage.getItem(Config.tokenName) },
      isAdd: false,
      isEdit: false,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '登记时间',
          align: 'center',
          key: 'addTime'
        },
        {
          title: '姓名',
          align: 'center',
          key: 'name'
        },
        {
          title: '现住址',
          align: 'center',
          key: 'address'
        },
        {
          title: '手机',
          align: 'center',
          key: 'username'
        },
        {
          title: '性别',
          align: 'center',
          key: 'gender',
          render: (h, params) => {
            return h('span', [
              params.row.gender === 1 ? '男' : '女'
            ])
          }
        },
        {
          title: '出生年月',
          align: 'center',
          key: 'birthday'
        },
        {
          title: '身份证',
          align: 'center',
          key: 'idno'
        },
        {
          title: '初查结果',
          align: 'center',
          key: 'result',
          render: (h, params) => {
            return h('span', [
              params.row.result === 1 ? '待查证' : '正常'
            ])
          }
        },
        {
          title: '是否已发送通知',
          align: 'center',
          key: 'send',
          render: (h, params) => {
            return h('span', [
              params.row.send === 1 ? '已发送' : '未发送'
            ])
          }
        },
      ],
      columns2: [
        {
          title: '登记时间',
          align: 'center',
          key: 'addTime'
        },
        {
          title: '姓名',
          align: 'center',
          key: 'name'
        },
        {
          title: '现住址',
          align: 'center',
          key: 'address'
        },
        {
          title: '手机',
          align: 'center',
          key: 'username'
        },
        {
          title: '性别',
          align: 'center',
          key: 'gender',
          render: (h, params) => {
            return h('span', [
              params.row.gender === 1 ? '男' : '女'
            ])
          }
        },
        {
          title: '出生年月',
          align: 'center',
          key: 'birthday'
        },
        {
          title: '身份证',
          align: 'center',
          key: 'idno'
        },
        {
          title: '初查结果',
          align: 'center',
          key: 'result',
          render: (h, params) => {
            return h('span', [
              params.row.result === 1 ? '待查证' : '正常'
            ])
          }
        },
        {
          title: '是否已发送通知',
          align: 'center',
          key: 'send',
          render: (h, params) => {
            return h('span', [
              params.row.send === 1 ? '已发送' : '未发送'
            ])
          }
        },
      ],
      tableData: [],
      tableData2: [],
      accessData: [],
      // 批量选择的id对象
      delId: {
        ids: ''
      },
      page: {// 页面翻页对象
        total: 1, // 数据总数
        currentPage: 1// 当前页面
      },
      page2: {// 页面翻页对象
        total: 1, // 数据总数
        currentPage: 1// 当前页面
      },
      searchOption: {}, // 查询用参数
      desc:'',
    }
  },
  created () {
    this.hospital = localStorage.getItem('hospital')
    this.userId = localStorage.getItem('userId')
	  this.getnakList({hospital:this.hospital})
	  this.getnakList2({hospital:this.hospital}) //所有
  },
  mounted () {

  },
  methods: {
    // 批量发送
    batchSend() {
      if (this.delId.ids) {
        this.$Modal.confirm({ // 打开确认对话框
          title: '请确认发送',
          content: `<p>您是否确认给选择的用户发送消息？</p>`,
          okText: '确认',
          // 确认删除
          onOk: async () => {
            let res = await sendChoice(this.delId)
            if (res.code === 200) {
              this.$Message.success('发送成功')
              this.delId.ids = ''
              this.getnakList({hospital:this.hospital})
            } else {
              this.$Message.error(res.message)
            }
          },
          // 取消删除
          onCancel: () => {
            this.$Message.info('取消发送！')
          }
        })
      } else {
        this.$Message.info('请选择需要发送的用户！')
      }
    },
    async sendAll () {
      this.$Modal.confirm({ // 打开确认对话框
        title: '请确认发送',
        content: `<p>您是否确认给所有的用户发送消息？</p>`,
        okText: '确认',
        // 确认删除
        onOk: async () => {
          let res = await batchSend({
            hospital:this.hospital
          })
          if (res.code === 200) {
            this.$Message.success('发送成功')
            this.getnakList({hospital:this.hospital})
          } else {
            this.$Message.error(res.data)
          }
        },
        // 取消删除
        onCancel: () => {
          this.$Message.info('取消发送！')
        }
      })
    },
    time () {
      this.$Notice.open({
        title: '提示',
        desc: this.desc,
        duration: 0
      });
    },
    // 批量选择
    batchSelect(selection) {
      console.log(selection);
      this.delId.ids = ''
      selection.forEach(row => {
        if (this.delId.ids === '') {
          this.delId.ids = row.id
        } else {
          this.delId.ids = this.delId.ids + ',' + row.id
        }
      })
    },
    handleFormatError(file){
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: '文件 ' + file.name + ' 格式不正确，请上传.xls,.xlsx文件。'
      })
    },
    handleSuccess(res,file){
      console.log(res);
      if(res.code === 200){
        if(res.data.length>0){
          // let size = res.data.length
          res.data= Array.from(res.data, x => x + 1)
          this.desc = '第'+res.data+'条数据导入失败,请核实信息的正确'
          this.time()
          // let tip ='数据已导入,其中有'+size+'导入失败,请核实信息的正确'
          // this.$Message.warning(tip)
        }else {
          this.$Message.success("数据导入成功！")
        }
        this.getnakList({hospital:this.hospital})
        this.$refs.upload.clearFiles()
      }
    },
    handleError(error,file){
      this.$Message.error("数据导入失败！")
    },
    // 查询列表
    async getnakList (params) {
	    let res = await getnakList(params)
      if (res.code === 200) {
        this.tableData = res.data.list
        this.page = {
          total: res.data.total,
          currentPage: res.data.pageNum
        }
      } else {
        this.$Message.error(res.data)
      }
    },
    // 查询列表
    async getnakList2 (params) {
      let res = await getnakList2(params)
      if (res.code === 200) {
        this.tableData2 = res.data.list
        this.page2 = {
          total: res.data.total,
          currentPage: res.data.pageNum
        }
      } else {
        this.$Message.error(res.data)
      }
    },
    // 页面翻页
    handlePageTurn (page) {
      this.searchOption.page = page
      this.searchOption.hospital = this.hospital
      this.getnakList(this.searchOption)
    },
	  // 页面翻页2
    handlePageTurn2 (page) {
      this.searchOption.page2 = page
      this.searchOption.hospital = this.hospital
      this.getnakList2(this.searchOption)
    },
  }
}
</script>

<style lang="less" scoped>
  .ivu-upload{
    display: inline-block;
  }
	.tip{
		display: flex;
		align-items: center;
		span{
			margin-left: 30px;
		}
	}
</style>
