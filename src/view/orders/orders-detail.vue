<template>
  <div>
    <Form :model="form" ref="form" :label-width="100" :rules="rules">
      <Row>
        <Col span="12">
          <Card>
            <FormItem label="订单号：" prop="orderNumber">
              <Input clearable v-model="form.orderNumber" disabled />
            </FormItem>
            <FormItem label="预约时间：" prop="addTime">
              <DatePicker type="datetime" placeholder="请选择预约时间" style="width: 100%"></DatePicker>
            </FormItem>
            <FormItem label="项目类型：" prop="nursingType">
              <Select clearable v-model="form.nursingType" placeholder="请选择护理项目类型" >
                <Option value="0" key="0">无</Option>
              </Select>
            </FormItem>
            <FormItem label="护理服务：" prop="nursing">
              <Card>
                <Row>
                  <Col span="12">
                    <Cascader :data="nursingData" ref="form" v-model="form.nursingCas"></Cascader>
                  </Col>
                  <Col span="4" offset="1">
                    <Button type="primary" >添加</Button>
                  </Col>
                </Row>
              </Card>
              <Card>
                <!--<Tag type="border" closable color="default" v-for="(item,index) in labelArray" :key="item.labelId"-->
                <!--:name="item.labelContent" @on-close="doLabelDel(item.id,index)">{{item.labelContent}}-->
                <!--</Tag>-->
              </Card>
            </FormItem>
            <FormItem label="金额：" prop="price">
              <Input clearable disabled v-model="form.price" placeholder="服务总金额">
              <span slot="append">元</span>
              </Input>
            </FormItem>
            <FormItem label="订单状态：" prop="orderStatus">
              <Select clearable v-model="form.orderStatus"  >
                <Option value="0" key="0">无</Option>
              </Select>
            </FormItem>
          </Card>
        </Col>
        <Col span="12">
          <Card>
            <FormItem label="客户姓名：" prop="customerId">
              <Select clearable v-model="form.customerId" placeholder="请选择客户" >
                <Option value="0" key="0">无</Option>
              </Select>
              <Button type="primary" style="width: 100px;margin: 10px 0">客户相关档案</Button>
            </FormItem>
            <FormItem label="审核结果：" prop="credentialsResult">
              <RadioGroup v-model="form.credentialsResult">
                <Radio label="拒绝" disabled></Radio>
                <Radio label="接受" disabled></Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="接单护士：" prop="nurseId">
              <Select clearable v-model="form.nurseId" placeholder="请选择接单护士" >
                <Option value="0" key="0">无</Option>
              </Select>
            </FormItem>
            <FormItem label="宣教内容：">
              <Card>
                <Row>
                  <Col span="12">
                    <Cascader :data="educationData" ref="form" v-model="form.educationCas"></Cascader>
                  </Col>
                  <Col span="4" offset="1">
                    <Button type="primary" >添加</Button>
                  </Col>
                </Row>
              </Card>
              <Card>
                <!--<Tag type="border" closable color="default" v-for="(item,index) in labelArray" :key="item.labelId"-->
                <!--:name="item.labelContent" @on-close="doLabelDel(item.id,index)">{{item.labelContent}}-->
                <!--</Tag>-->
              </Card>
            </FormItem>
          </Card>
        </Col>
      </Row>
    </Form>
  </div>
</template>

<script>
  export default {
    name: "orders-detail",
    props:{
      detailStatus: {
        type: Number,
        default: 0
      },
    },
    data() {
      return {
        rules: {},
        form:{},
        educationData:[],
        nursingData:[],
      }
    },
  }
</script>

<style scoped>

</style>
