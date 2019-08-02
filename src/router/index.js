import Vue from 'vue'
import Router from 'vue-router'
import MP3Player from '@/components/MP3Player/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MP3Player',
      component: MP3Player
    }
  ]
})
