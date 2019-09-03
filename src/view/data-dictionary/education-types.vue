<template>
  <div>
    <!--按钮部分-->
    <Card>
      <p slot="title">宣传教育-相关类型管理</p>
      <Row>
        <Col span="2">
          <Button type="primary" class="my-btn" v-if="viewAdd" @click="isAdd = true">添加</Button>
        </Col>
      </Row>
    </Card>

    <!--表格部分-->
    <Card>
      <div>
        <Table :columns="columns" :data="tableData" border @on-selection-change="batchSelect"
               disabled-hover></Table>
      </div>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page show-total show-elevator :total="page.total" :current="page.currentPage"
                @on-change="handlePageTurn"></Page>
        </div>
      </div>
    </Card>

    <!--添加Modal-->
    <Modal v-model="isAdd" :mask-closable="false" :closable="false" title="类型添加：" width="500">
      <Form :model="addForm" ref="addForm" :label-width="100" :rules="rules">
        <FormItem label="类型名称：" prop="name">
          <Input clearable v-model="addForm.name" placeholder="类型名称"/>
        </FormItem>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelAddModal">取消</Button>
        <!--<Button type="primary" @click="doRoleAdd">确认</Button>-->
      </div>
    </Modal>

    <!--编辑Modal-->
    <Modal v-model="isEdit" :mask-closable="false" :closable="false" title="类型编辑：" width="500">
      <Form :model="editForm" ref="editForm" :label-width="100" :rules="rules">
        <FormItem label="类型名称：" prop="name">
          <Input clearable v-model="editForm.name" placeholder="类型名称"/>
        </FormItem>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelEditModal">取消</Button>
        <!--<Button type="primary" @click="doRoleAdd">确认</Button>-->
      </div>
    </Modal>
  </div>
</template>

<script>
  import {educationTypesColumns} from '../../libs/table'
  export default {
    name: "education-types",
    computed: {
      access() {
        return this.$store.state.user.access
      },
      viewAdd() {
        // return hasOneOf(['label-add'], this.access)
        return true
      },
      viewEdit() {
        // return hasOneOf(['label-edit'], this.access)
        return true
      },
      viewDel() {
        // return hasOneOf(['label-del'], this.access)
        return true
      },
      viewDelMany() {
        // return hasOneOf(['label-delMany'], this.access)
        return true
      },
    },
    data(){
      return{
        isAdd: false,
        isEdit: false,
        columns: [
          {
            title: '操作',
            align: 'center',
            key: 'handle',
            render: (h, params) => {
              if (this.viewEdit || this.viewDel) {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary'
                    },
                    style: {
                      marginRight: '5px',
                      display: this.viewEdit ? 'inline-block' : 'none'
                    },
                    on: {
                      click: () => {
                        let data = Object.assign({}, params.row)
                        // this.formCopy = Object.assign({}, data)
                        this.openEditModal(data)
                      }
                    }
                  }, '编辑'),
                  h('Button', {
                    props: {
                      type: 'error'
                    },
                    style: {
                      display: this.viewDel ? 'inline-block' : 'none'
                    },
                    on: {
                      click: () => {
                        this.$Modal.confirm({
                          title: '请确认删除',
                          content: `<p>删除数据: ${params.row.name} 后无法恢复,确认删除?</p>`,
                          okText: '确认',
                          onOk: () => {
                            let id = {id: params.row.id}
                            // this.doAdminDel(id)
                          },
                          // 取消删除
                          onCancel: () => {
                            this.$Message.info('取消删除！')
                          }
                        })
                      }
                    }
                  }, '删除')
                ])
              } else {
                return h('span', '您没有操作该数据的权限')
              }
            }
          }
        ],
        tableData: [],
        addForm: {},
        editForm: {},
        rules: {
          name: [
            {required: true, message: '类型名不能为空', trigger: 'blur'},
            {max: 15, message: '请输入15个以内字符', trigger: 'blur'},
          ]
        },
        typesCas: [],
        // 批量选择的id对象
        delId: {
          ids: ''
        },
        page: {// 页面翻页对象
          total: 1, // 数据总数
          currentPage: 1// 当前页面
        },
        searchOption: {}, // 查询用参数
      }
    },
    created(){
      this.columns = educationTypesColumns.concat(this.columns)
    },
    methods:{
      cancelAddModal(){
        this.$refs.addForm.resetFields()// 重置表单
        this.addForm = {}
        this.isAdd = false
      },
      // 编辑modal打开
      openEditModal (params) {
        this.editForm = params
        this.isEdit = true
      },
      cancelEditModal(){
        this.$refs.editForm.resetFields()// 重置表单
        this.editForm = {}
        this.isEdit = false
      },
      // 批量选择
      batchSelect(selection) {
        this.delId.ids = ''
        selection.forEach(row => {
          if (this.delId.ids === '') {
            this.delId.ids = row.id
          } else {
            this.delId.ids = this.delId.ids + ',' + row.id
          }
        })
      },
      // 页面翻页
      handlePageTurn(page) {
        this.searchOption.page = page
        // this.findAdminData(this.searchOption)
      },
    }
  }
</script>

<style scoped>

</style>
