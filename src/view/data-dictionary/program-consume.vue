<template>
  <div>
    <!--按钮部分-->
    <Card>
      <p slot="title">子服务管理</p>
      <Row>
        <Col span="3">
          <Button type="primary" class="my-btn" v-if="viewAdd" @click="isAdd = true">添加</Button>
        </Col>
        <Col span="3">
          <Button type="error" class="my-btn" v-if="viewDelMany" @click="batchDel">批量删除</Button>
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
    <Modal v-model="isAdd" :mask-closable="false" :closable="false" title="耗材添加：" width="600">
      <Form :model="addForm" ref="addForm" :label-width="100" :rules="rules">
        <FormItem label="耗材名称：" prop="name">
          <Input clearable v-model="addForm.name" placeholder="耗材名称"/>
        </FormItem>
        <FormItem label="耗材内容：" prop="content">
          <Input type="textarea" v-model="addForm.content" :autosize="{minRows: 5,maxRows: 10}" placeholder="请填写耗材内容"/>
        </FormItem>
        <FormItem label="总价：" prop="amount">
          <Input v-model="addForm.amount" placeholder="总价">
          <span slot="append">元</span>
          </Input>
        </FormItem>
        <FormItem label="费用详情：" prop="feeDetails">
          <Input type="textarea" v-model="addForm.feeDetails" :autosize="{minRows: 5,maxRows: 10}"
                 placeholder="请填写费用详情"/>
        </FormItem>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelAddModal">取消</Button>
        <Button type="primary" @click="doServiceConsumeAdd">确认</Button>
      </div>
    </Modal>

    <!--编辑Modal-->
    <Modal v-model="isEdit" :mask-closable="false" :closable="false" title="耗材编辑：" width="600">
      <Form :model="editForm" ref="editForm" :label-width="100" :rules="rules">
        <FormItem label="耗材名称：" prop="name">
          <Input clearable v-model="editForm.name" placeholder="耗材名称"/>
        </FormItem>
        <FormItem label="耗材内容：" prop="content">
          <Input type="textarea" v-model="editForm.content" :autosize="{minRows: 5,maxRows: 10}" placeholder="请填写耗材内容"/>
        </FormItem>
        <FormItem label="总价：" prop="amount">
          <Input v-model="editForm.amount" placeholder="总价">
          <span slot="append">元</span>
          </Input>
        </FormItem>
        <FormItem label="费用详情：" prop="feeDetails">
          <Input type="textarea" v-model="editForm.feeDetails" :autosize="{minRows: 5,maxRows: 10}"
                 placeholder="请填写费用详情"/>
        </FormItem>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelEditModal">取消</Button>
        <Button type="primary" @click="doServiceConsumeEdit">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {
    findServiceConsume,
    doServiceConsumeAdd,
    doServiceConsumeEdit,
    doServiceConsumeDel,
    doServiceConsumeDelMany
  } from "../../api/nursing";
  import {serviceConsumeColumns} from "../../libs/table";
  import {hasOneOf, array4tree, tools4Del, ObjectContrast} from '@/libs/tools'

  export default {
    name: "program-consume",
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
    data() {
      return {
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
                        params.row.amount = params.row.amount.toString()
                        let data = Object.assign({}, params.row)
                        this.formCopy = Object.assign({}, data)
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
                            this.doServiceConsumeDel(id)
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
        serviceId: '',
        addForm: {},
        editForm: {},
        rules: {
          name: [{required: true, message: '名称不能为空', trigger: 'blur'},
            {max: 50, message: '请输入50个以内字符', trigger: 'blur'}],
          amount: [{required: true, message: '总价不能为空', trigger: 'blur'},
            {pattern: /^([1-9][0-9]*)+(.[0-9]{1,2})?$/, message: '请填写数字', trigger: 'blur'}

          ],
          content: [{max: 200, message: '请输入200个以内字符', trigger: 'blur'}],
          feeDetails: [{max: 200, message: '请输入200个以内字符', trigger: 'blur'}]
        },
        // 批量选择的id对象
        delId: {
          ids: ''
        },
        page: {// 页面翻页对象
          total: 1, // 数据总数
          currentPage: 1// 当前页面
        },
        formCopy: {},
        searchOption: {}, // 查询用参数
      }
    },
    created() {
      this.columns = serviceConsumeColumns.concat(this.columns)
    },
    methods: {
      //查询
      async findServiceConsume(params) {
        params.serviceId = this.serviceId
        let res = await findServiceConsume(params)
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
      //添加
      async doServiceConsumeAdd() {
        this.$refs.addForm.validate(async (valid) => { // 表单校验
          if (valid) { // 表单验证成功
            let form = this.addForm
            form.serviceId = this.serviceId
            let res = await doServiceConsumeAdd(form)
            if (res.code === 200) { // 添加成功
              this.$Message.success('添加成功')
              this.findServiceConsume(this.searchOption)
              this.cancelAddModal()
            } else { // 添加失败
              this.$Message.error(res.message)
            }
          } else {
            this.$Message.error('请正确填写表单')
          }
        })
      },
      //编辑
      async doServiceConsumeEdit() {
        this.$refs.editForm.validate(async (valid) => { // 表单校验
          if (valid) { // 表单验证成功
            let form = this.editForm
            let array = []
            array = ObjectContrast(form, this.formCopy)
            // console.log(array)
            if (array.length > 0) {
              let data = {}
              array.forEach(v => {
                data[v] = form[v]
              })
              // console.log(data)
              data.serviceId = this.serviceId
              data.id = form.id
              let res = await doServiceConsumeEdit(data)
              if (res.code === 200) {
                this.$Message.success('编辑成功')
                this.findServiceConsume(this.searchOption)
                this.cancelEditModal()
              } else {
                this.$Message.error(res.data)
              }
            } else {
              this.$Message.error('表单没有修改')
            }
          } else {
            this.$Message.error('请正确填写表单')
          }
        })
      },
      // 删除
      async doServiceConsumeDel(params) {
        let res = await doServiceConsumeDel(params)
        if (res.code === 200) {
          this.$Message.success('删除成功')
          this.findServiceConsume(this.searchOption)
        } else {
          this.$Message.error(res.message)
        }
      },
      // 批量删除
      batchDel() {
        if (this.delId.ids) {
          this.$Modal.confirm({ // 打开确认对话框
            title: '请确认删除',
            content: `<p>删除数据后无法恢复,确认删除?</p>`,
            okText: '确认',
            // 确认删除
            onOk: async () => {
              let res = await doServiceConsumeDelMany(this.delId)
              if (res.code === 200) {
                this.$Message.success('删除成功')
                this.delId.ids = ''
                this.findServiceConsume(this.searchOption)
              } else {
                this.$Message.error(res.message)
              }
            },
            // 取消删除
            onCancel: () => {
              this.$Message.info('取消删除！')
            }
          })
        } else {
          this.$Message.info('请选择需要删除的数据！')
        }
      },
      cancelAddModal() {
        this.$refs.addForm.resetFields()// 重置表单
        this.addForm = {}
        this.isAdd = false
      },
      // 编辑modal打开
      openEditModal(params) {
        this.editForm = params
        this.isEdit = true
      },
      cancelEditModal() {
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
        this.findServiceConsume(this.searchOption)
      },
    }
  }
</script>

<style scoped>

</style>
