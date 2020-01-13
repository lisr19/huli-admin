<template>
  <div>
    <!--按钮部分-->
    <Card>
      <p slot="title">标签管理</p>
      <Row>
        <Col span="2">
          <Button type="primary" class="my-btn" v-if="viewAdd" @click="isAdd = true">添加</Button>
        </Col>
      </Row>
    </Card>

    <!--表格部分-->
    <Card>
      <div>
        <tree-table
          :is-fold="false"
          border
          expand-key="content"
          :expand-type="false"
          :selectable="false"
          :columns="columns"
          :data="tableData"
        >
          <template slot="action" slot-scope="{row}">
            <Button type="primary" style="width: 80px;marginRight: 20px;" v-if="viewEdit" @click="openEditModal(row)">
              编辑
            </Button>
            <Button type="error" style="width: 80px;" v-if="viewDel" @click="doLabelDel(row)">删除</Button>
          </template>
        </tree-table>
      </div>
    </Card>

    <!--添加Modal-->
    <Modal v-model="isAdd" :mask-closable="false" :closable="false" title="标签添加：" width="500">
      <Form :model="addForm" ref="addForm" :label-width="100" :rules="rules">
        <FormItem label="标签名称：" prop="content">
          <Input clearable v-model="addForm.content" placeholder="标签名称"/>
        </FormItem>
        <FormItem label="父级标签：">
          <Cascader :data="labelCas" v-model="addForm.labelCas" change-on-select placeholder="角色的父级标签"></Cascader>
        </FormItem>
        <FormItem label="标签说明：" prop="comment">
          <Input clearable v-model="addForm.comment" placeholder="标签说明"/>
        </FormItem>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelAddModal">取消</Button>
        <Button type="primary" @click="doLabelAdd">确认</Button>
      </div>
    </Modal>

    <!--编辑Modal-->
    <Modal v-model="isEdit" :mask-closable="false" :closable="false" title="标签编辑：" width="500">
      <Form :model="editForm" ref="editForm" :label-width="100" :rules="rules">
        <FormItem label="标签名称：" prop="content">
          <Input clearable v-model="editForm.content" placeholder="标签名称"/>
        </FormItem>
        <FormItem label="父级标签：">
          <Cascader :data="labelCas" v-model="editForm.labelCas" change-on-select placeholder="角色的父级标签"></Cascader>
        </FormItem>
        <FormItem label="标签说明：" prop="comment">
          <Input clearable v-model="editForm.comment" placeholder="标签说明"/>
        </FormItem>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelEditModal">取消</Button>
        <Button type="primary" @click="doLabelEdit">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {labelsColumns} from "../../libs/table";
  import {hasOneOf, array4tree,tools4Del,ObjectContrast,tools4Cas} from '@/libs/tools'
  import {findLabel,doLabelAdd,doLabelDel,doLabelEdit,doLabelDelMany} from "../../api/labels";

  export default {
    name: "labels",
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
        columns: [],
        tableData: [],
        addForm: {},
        editForm: {},
        rules: {
          content: [
            {required: true, message: '标签名不能为空', trigger: 'blur'},
            {max: 15, message: '请输入15个以内字符', trigger: 'blur'},
          ]
        },
        resArray:[],//原始数据
        labelCas: [],
        formCopy:{},
        searchOption: {
          size:100
        }, // 查询用参数
      }
    },
    created(){
      this.columns = labelsColumns
    },
    mounted(){
      this.findLabel(this.searchOption)
    },
    methods:{
      //查询
      async findLabel(params){
        let res = await findLabel(params)
        if (res.code === 200) {
          this.resArray = JSON.parse(JSON.stringify(res.data.list))
          this.tableData = array4tree(v=>{
            v.label = v.content
            v.value = v.id
          },res.data.list)
          // console.log(this.tableData)
          this.labelCas = JSON.parse(JSON.stringify(this.tableData))
          this.labelCas.unshift({name: '无', id: '0', pid: '0', label: '无', value: '0'})
        } else {
          this.$Message.error(res.data)
        }
      },
      //添加
      async doLabelAdd(){
        this.$refs.addForm.validate(async (valid) => { // 表单校验
          if (valid) { // 表单验证成功
            let form = this.addForm
            if(form[`labelCas`]&&form.labelCas.length>0){
              form.pid = form.labelCas[form.labelCas.length-1]
              form.level = form.labelCas.length
            }else{
              form.pid = 0
              form.level = 0
            }
            let res = await doLabelAdd(form)
            if (res.code === 200) { // 添加成功
              this.$Message.success('添加成功')
              this.findLabel(this.searchOption)
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
      async doLabelEdit(){
        this.$refs.editForm.validate(async (valid) => { // 表单校验
          if (valid) { // 表单验证成功
            let form = this.editForm
            if(form[`labelCas`]&&form.labelCas.length>0){
              form.pid = form.labelCas[form.labelCas.length-1]
            }else{
              form.pid = 0
            }
            let array = []
            array = ObjectContrast(form,this.formCopy)
            // console.log(array)
            if(array.length > 0){
              let data = {}
              array.forEach(v=>{
                data[v] = form[v]
              })
              data.id = form.id
              let res = await doLabelEdit(data)
              if (res.code === 200) {
                this.$Message.success('编辑成功')
                this.findLabel(this.searchOption)
                this.cancelEditModal()
              } else { // 添加失败
                this.$Message.error(res.message)
              }
            }else{
              this.$Message.error('表单没有修改')
            }
          } else {
            this.$Message.error('请正确填写表单')
          }
        })
      },
      //标签删除
      doLabelDel(row){
        this.$Modal.confirm({
          title: '请确认删除',
          content: `<p>删除数据: ${row.content}(包括其所有子类)后无法恢复,确认删除?</p>`,
          okText: '确认',
          onOk: async () => {
            if (row[`children`]) { // 若是该数据有子类
              let ids = ''
              ids = row.id
              let idArray = []
              tools4Del(row.children, idArray)
              ids = ids + ',' + idArray.join(',')
              let res = await doLabelDelMany({ids:ids})
              if (res.code === 200) {
                this.$Message.success('删除成功')
                this.findLabel(this.searchOption)
              } else {
                this.$Message.error(res.message)
              }
              // console.log(ids)
            } else { // 若没有则删除单个
              let id = { id: row.id }
              let res = await doLabelDel(id)
              if (res.code === 200) {
                this.$Message.success('删除成功')
                this.findLabel(this.searchOption)
              } else {
                this.$Message.error(res.message)
              }
            }
          },
          // 取消删除
          onCancel: () => {
            this.$Message.info('取消删除！')
          }
        })
      },
      cancelAddModal() {
        this.$refs.addForm.resetFields()// 重置表单
        this.addForm = {}
        this.isAdd = false
      },
      // 编辑modal打开
      openEditModal(params) {
        let cas = []
        tools4Cas(this.resArray,parseInt(params.id),cas)
        params.labelCas = cas
        this.formCopy = Object.assign({},params)
        this.editForm = params
        this.isEdit = true
      },
      cancelEditModal() {
        this.$refs.editForm.resetFields()// 重置表单
        this.editForm = {}
        this.isEdit = false
      },
    }
  }
</script>

<style scoped>

</style>
