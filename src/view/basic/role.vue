<template>
  <div>
    <!--按钮部分-->
    <Card>
      <p slot="title">角色管理</p>
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
          expand-key="name"
          :expand-type="false"
          :selectable="false"
          :columns="columns"
          :data="tableData"
        >
          <template slot="action" slot-scope="{row}">
            <Button type="success" style="width: 80px;marginRight: 20px;" v-if="viewAccess">权限</Button>
            <Button type="primary" style="width: 80px;marginRight: 20px;" v-if="viewEdit" @click="openEditModal(row)">
              编辑
            </Button>
            <Button type="error" style="width: 80px;" v-if="viewDel" @click="doRoleDel(row)">删除</Button>
          </template>
        </tree-table>
      </div>
    </Card>

    <!--添加Modal-->
    <Modal v-model="isAdd" :mask-closable="false" :closable="false" title="角色添加：" width="500">
      <Form :model="addForm" ref="addForm" :label-width="100" :rules="rules">
        <FormItem label="角色名称：" prop="name">
          <Input clearable v-model="addForm.name" placeholder="角色名称"/>
        </FormItem>
        <FormItem label="父级角色：">
          <Cascader :data="roleCas" v-model="addForm.roleCas" placeholder="角色的父级角色"></Cascader>
        </FormItem>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelAddModal">取消</Button>
        <!--<Button type="primary" @click="doRoleAdd">确认</Button>-->
      </div>
    </Modal>

    <!--编辑Modal-->
    <Modal v-model="isEdit" :mask-closable="false" :closable="false" title="角色编辑：" width="500">
      <Form :model="editForm" ref="editForm" :label-width="100" :rules="rules">
        <FormItem label="角色名称：" prop="name">
          <Input clearable v-model="editForm.name" placeholder="角色名称"/>
        </FormItem>
        <FormItem label="父级角色：">
          <Cascader :data="roleCas" v-model="editForm.roleCas" placeholder="角色的父级角色"></Cascader>
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
  import {roleColumns} from '../../libs/table'
  import {hasOneOf, array4tree,tools4Del} from '@/libs/tools'

  export default {
    name: "role",
    computed: {
      access() {
        return this.$store.state.user.access
      },
      viewAdd() { // 该用户是否拥有用户添加权限
        // return hasOneOf(['role-add'], this.access)
        return true
      },
      viewEdit() { // 该用户是否拥有用户信息编辑权限
        // return hasOneOf(['role-edit'], this.access)
        return true
      },
      viewDel() { // 该用户是否拥有用户删除权限
        // return hasOneOf(['role-del'], this.access)
        return true
      },
      viewDelMany() { // 该用户是否拥有用户删除权限
        // return hasOneOf(['role-delMany'], this.access)
        return true
      },
      viewAccess() {
        // if (hasOneOf(['role-access-add'], this.access) && hasOneOf(['role-access-del'], this.access)) {
        //   return true
        // } else {
        //   return false
        // }
        return true
      }
    },
    data() {
      return {
        isAdd: false,
        isEdit: false,
        columns: [],
        tableData: [
          {
            name: '南部战区医院',
            level: 1,
            children: [
              {
                name: '骨科护士',
                level: 2,
                children: [
                  {
                    name: '护士部1',
                    level: 3,
                  },
                ]
              },
              {
                name: '专科护士',
                level: 2,
              }
            ]
          },
        ],
        addForm: {},
        editForm: {},
        rules: {
          name: [
            {required: true, message: '角色名不能为空', trigger: 'blur'},
            {max: 15, message: '请输入15个以内字符', trigger: 'blur'},
          ]
        },
        roleCas: [
          {
            label: '无',
            value:'0',
          },
          {
            label: '南部战区医院',
            value:'1',
            level: 1,
            children: [
              {
                label: '骨科护士',
                value:'2',
                name: '骨科护士',
                level: 2,
                children: [
                  {
                    label: '护士部1',
                    value:'3',
                    name: '护士部1',
                    level: 3,
                  },
                ]
              },
              {
                label: '专科护士',
                value:'4',
                name: '专科护士',
                level: 2,
              }
            ]
          },
        ],
        searchOption: {}, // 查询用参数
      }
    },
    created() {
      this.columns = roleColumns
    },
    mounted(){
    },
    methods: {
      //角色删除
      doRoleDel(row){
        this.$Modal.confirm({
          title: '请确认删除',
          content: `<p>删除数据: ${row.name} 后无法恢复,确认删除?</p>`,
          okText: '确认',
          onOk: () => {
            if (row[`children`]) { // 若是该数据有子类
              let ids = ''
              ids = row.id
              let idArray = []
              tools4Del(row.children, idArray)
              ids = ids + ',' + idArray.join(',')
              // console.log(ids)
            } else { // 若没有则删除单个
              let id = { id: row.id }
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
        console.log(params)
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
