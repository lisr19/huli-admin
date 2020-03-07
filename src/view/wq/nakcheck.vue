<template>
	<div>
		<!--按钮部分-->
		<Card>
      <Upload
        ref="upload"
        :headers="myHeader"
        action="http://47.115.162.174:8899/natCheck/batchImport"
        name="file"
        :show-upload-list="true"
        :on-format-error="handleFormatError"
        :on-success="handleSuccess"
        :on-error="handleError"
        :format ="['xlsx','xls']">
        <Button type="info" icon="ios-cloud-upload-outline">批量导入</Button>
      </Upload>
      <Card>
        <div>
          <Table :columns="columns" :data="tableData" border
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
	</div>
</template>

<script>
import {getnakList} from '../../api/wq'
import Config from '../../config/index'

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
      accessData: [],
      // 批量选择的id对象
      delId: {
        ids: ''
      },
      page: {// 页面翻页对象
        total: 1, // 数据总数
        currentPage: 1// 当前页面
      },
      searchOption: {} // 查询用参数
    }
  },
  created () {
    this.hospital = localStorage.getItem('hospital')
    this.userId = localStorage.getItem('userId')
	  this.getnakList({hospital:this.hospital})
  },
  mounted () {

  },
  methods: {
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
          let size = res.data.length
          let tip ='数据已导入,其中有'+size+'导入失败,请核实信息的正确'
          this.$Message.warning(tip)
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
    // 页面翻页
    handlePageTurn (page) {
      this.searchOption.page = page
      this.searchOption.hospital = this.hospital
      this.getnakList(this.searchOption)
    },
	  // 页面翻页
  }
}
</script>

<style lang="less" scoped>
	.tip{
		display: flex;
		align-items: center;
		span{
			margin-left: 30px;
		}
	}
</style>
