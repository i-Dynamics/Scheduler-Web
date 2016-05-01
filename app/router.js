import Vue from 'vue'
import VueRouter from 'vue-router'

import {debug} from 'consts'

import SchedulerPanel from 'app/components/scheduler-panel/scheduler'


Control.prototype.install = function(Vue) {
    Vue.prototype.control = this
}


Vue.use(VueRouter)
Vue.use(new Control())


if (debug) {
    console.warn("Running Debug")
    Vue.config.debug = debug
}


const router = new VueRouter()

router.map({
    '/calendar/:calendar_id': {
        name: 'calendar',
        component: SchedulerPanel,
    },
})

export default router
