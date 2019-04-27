import Vue from 'vue'
import Router from 'vue-router'
import timepickerDemo from '@/view/demo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'timepicker',
      component: timepickerDemo
    }
  ]
})
