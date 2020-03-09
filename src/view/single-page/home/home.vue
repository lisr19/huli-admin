<template>
  <div>
    <Row :gutter="20">
      <i-col :xs="12" :md="8" :lg="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`"
             style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <Row :gutter="20">
            <i-col :md="12" :lg="12">
              <chart-pie style="height: 300px;" :value="age" text="用户年龄分布"></chart-pie>
            </i-col>
            <i-col :md="12" :lg="12">
              <chart-pie style="height: 300px;" :value="userArea" text="用户区域分布"></chart-pie>
            </i-col>
          </Row>
        </Card>
      </i-col>
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <Row :gutter="20">
            <i-col :md="12" :lg="12">
              <chart-pie style="height: 300px;" :value="userGender" text="用户性别分布"></chart-pie>
            </i-col>
            <i-col :md="12" :lg="12">
              <chart-pie style="height: 300px;" :value="highRisk" text="用户身体状况分布"></chart-pie>
            </i-col>
          </Row>
        </Card>
      </i-col>
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <Row :gutter="20">
            <i-col :md="12" :lg="12">
              <chart-pie style="height: 300px;" :value="nurseArea" text="护士区域分布"></chart-pie>
            </i-col>
            <i-col :md="12" :lg="12">
              <chart-pie style="height: 300px;" :value="workYears" text="护士工作年限分布"></chart-pie>
            </i-col>
          </Row>
        </Card>
      </i-col>
      <!--<i-col :md="24" :lg="16" style="margin-bottom: 20px;">-->
      <!--<Card shadow>-->
      <!--<chart-bar style="height: 300px;" :value="barData" text="每周用户活跃量"/>-->
      <!--</Card>-->
      <!--</i-col>-->
    </Row>
    <Row :gutter="20">
      <!--<Card shadow>-->
      <!--<example style="height: 310px;"/>-->
      <!--</Card>-->
      <i-col :md="24" :lg="16" style="margin-bottom: 20px;">
        <Card shadow>
          <Row :gutter="20">
            <i-col :md="12" :lg="12">
              <chart-bar-category style="height: 300px;" :value1="order" :value2="price"
                                  text="订单/金额本年度统计"></chart-bar-category>
            </i-col>
            <i-col :md="12" :lg="12">
              <Row :gutter="20">
                <i-col :md="12" :lg="12">
                  <chart-pie style="height: 300px;" ref="orderStatus" :value="orderStatus" text="订单状态本年度统计"></chart-pie>
                </i-col>
                <i-col :md="12" :lg="12">
                  <chart-pie style="height: 300px;" :value="orderArea" text="订单与服务区域占比统计"></chart-pie>
                </i-col>
              </Row>
            </i-col>
          </Row>
        </Card>
      </i-col>
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <charts-pie-ringlike style="height: 300px;" :value1="orderServiceType" :value2="orderService"
                               text="订单与服务占比统计"></charts-pie-ringlike>
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import ChartPie from './pie'
import ChartBarCategory from './bar-category'
import ChartsPieRinglike from './pie-ringlike'
import Example from './example.vue'

import {
  findStatisticByHome,
  findStatisticByUser,
  findStatisticByNurse,
  findStatisticByOrderPrice,
  findStatisticByOrder,
  findStatisticByOrder1
} from '../../../api/statistic'

export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBarCategory,
    ChartsPieRinglike,
    Example
  },
  data () {
    return {
      inforCardData: [
        { title: '新增用户', icon: 'md-person-add', count: 0, color: '#2d8cf0' },
        { title: '现有用户', icon: 'md-locate', count: 0, color: '#19be6b' },
        { title: '新增护士', icon: 'md-help-circle', count: 0, color: '#ff9900' },
        { title: '现有护士', icon: 'md-share', count: 0, color: '#ed3f14' },
        { title: '新增订单', icon: 'md-chatbubbles', count: 0, color: '#E46CBB' },
        { title: '总订单', icon: 'md-map', count: 0, color: '#9A66E4' }
      ],
      age: [],
      userArea: [],
      userGender: [],
      highRisk: [],
      nurseArea: [],
      workYears: [],
      price: [],
      order: [],
      orderStatus: [],
      orderArea: [],
      orderServiceType: [],
      orderService: []
    }
  },
  created () {
    this.findStatisticByHome()
    this.findStatisticByUser()
    this.findStatisticByNurse()
    this.findStatisticByOrder()
    this.findStatisticByOrderPrice()
    this.findStatisticByOrder1()
  },
  mounted () {
  },
  methods: {
    async findStatisticByHome () {
      let res = await findStatisticByHome()
      if (res.code === 200) {
        let data = res.data
        this.inforCardData.forEach((v, index) => {
          switch (index) {
            case 0:
              v.count = data.userNewCreate
              break
            case 1:
              v.count = data.userTotal
              break
            case 2:
              v.count = data.nurseNewCreate
              break
            case 3:
              v.count = data.nurseTotal
              break
            case 4:
              v.count = data.orderNewCreate
              break
            case 5:
              v.count = data.orderCount
              break
          }
        })
      } else {
        this.$Message.error(res.message)
      }
    },
    async findStatisticByUser () {
      let res = await findStatisticByUser()
      if (res.code === 200) {
        let data = res.data
        for (let v in data) {
          switch (v) {
            case 'age':
              this.list4Object(this.age, data[v])
              break
            case 'area':
              this.list4Object(this.userArea, data[v])
              break
            case 'gender':
              this.list4Object(this.userGender, data[v])
              break
            case 'highRisk':
              this.list4Object(this.highRisk, data[v])
              break
          }
        }
      } else {
        this.$Message.error(res.message)
      }
    },
    async findStatisticByNurse () {
      let res = await findStatisticByNurse()
      if (res.code === 200) {
        let data = res.data
        for (let v in data) {
          switch (v) {
            case 'area':
              this.list4Object(this.nurseArea, data[v])
              break
            case 'workYears':
              this.list4Object(this.workYears, data[v])
              break
          }
        }
      } else {
        this.$Message.error(res.message)
      }
    },
    async findStatisticByOrderPrice () {
      let res = await findStatisticByOrderPrice({ flag: 2, num: new Date().getMonth() + 1 })
      if (res.code === 200) {
        let data = res.data
        data.forEach(v => {
          let count = 0
          if (v != null) {
            count = count + v
          }
          this.price.push(count)
        })
      } else {
        this.$Message.error(res.message)
      }
    },
    async findStatisticByOrder () {
      let res = await findStatisticByOrder({ year: 2019 })
      if (res.code === 200) {
        let data = res.data
        let reject = 0
        let cancel = 0
        let success = 0
        let working = 0
        data.forEach(v => {
          let count = 0
          v.status.forEach(i => {
            count = count + i
          })
          reject = reject + v.status[1]
          cancel = cancel + v.status[0]
          working = working + v.status[2] + v.status[3] + v.status[4] + v.status[5] + v.status[6]
          success = success + v.status[7] + v.status[8] + v.status[9] + v.status[10]
          this.order.push(count)
        })
        this.orderStatus.push({
          value: reject,
          name: '拒绝订单'
        }, {
          value: cancel,
          name: '取消订单'
        }, {
          value: working,
          name: '处理中订单'
        }, {
          value: success,
          name: '成功订单'
        })
        // console.log(this.orderStatus)
      } else {
        this.$Message.error(res.message)
      }
    },
    async findStatisticByOrder1 () {
      let res = await findStatisticByOrder1({ year: 2019 })
      if (res.code === 200) {
        let data = res.data
        // console.log(data)
        for (let v in data) {
          if (v === '服务区域统计') {
            data[v].forEach(o => {
              this.orderArea.push({
                value: o.num,
                name: o.serviceArea
              })
            })
          } else {
            let count = 0
            data[v].forEach(o => {
              count = count + o.num
              this.orderService.push({
                value: o.num,
                name: o.serviceName
              })
            })
            this.orderServiceType.push({
              value: count,
              name: v
            })
          }
        }
      } else {
        this.$Message.error(res.message)
      }
    },
    list4Object (array, obj) {
      for (let o in obj) {
        if (obj[o] !== 0) {
          let name = ''
          if (o === 'woman') {
            name = '女性'
          } else if (o === 'man') {
            name = '男性'
          } else if (o === 'highRisk') {
            name = '高风险'
          } else if (o === 'lowRisk') {
            name = '低风险'
          } else {
            name = o
          }
          array.push({
            value: obj[o],
            name: name
          })
        }
      }
    }
  }
}
</script>

<style lang="less">
  .count-style {
    font-size: 32px;
  }
</style>
