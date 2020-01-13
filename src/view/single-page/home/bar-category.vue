<template>
  <div ref="dom" style="width: 100%"></div>
</template>

<script>
  import echarts from 'echarts'
  import { on, off } from '@/libs/tools'

  export default {
    name: "bar-category",
    props: {
      value1: Array,
      value2: Array,
      text: String,
      subtext: String
    },
    data () {
      return {
        dom: null
      }
    },
    methods: {
      resize () {
        this.dom.resize()
      }
    },
    mounted () {
      this.$nextTick(() => {
        // let legend = this.value.map(_ => _.name)
        let option = {
          title: {
            text: this.text,
            subtext: this.subtext,
            x: 'center'
          },
          tooltip: {
            trigger: 'axis',
          },
          toolbox: {
            feature: {
              magicType: {show: true, type: ['line', 'bar']},
              restore: {show: true},
            }
          },
          xAxis: [
            {
              type: 'category',
              data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '订单数',
              axisLabel: {
                formatter: '{value} 笔'
              }
            },
            {
              type: 'value',
              name: '金额',
              axisLabel: {
                formatter: '{value} ￥'
              }
            }
          ],
          series: [
            {
              name:'订单数',
              type:'bar',
              data:this.value1
            },
            {
              name:'金额',
              type:'line',
              yAxisIndex: 1,
              data:this.value2
            }
          ]
        }
        setTimeout(()=>{
          this.dom = echarts.init(this.$refs.dom)
          this.dom.setOption(option)
        },1500)
        on(window, 'resize', this.resize)
      })
    },
    beforeDestroy () {
      off(window, 'resize', this.resize)
    }
  }
</script>

<style scoped>

</style>
