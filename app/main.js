// CSS Imports
import 'skeleton-css/css/normalize.css!'
import 'skeleton-css/css/skeleton.css!'
import './main.css!'

// JS Imports
// -- Vue
import Vue         from 'vue'
import VueRouter   from 'vue-router'
import ResizeMixin from 'vue-resize-mixin'

// -- App panels
import SchedulerPanel from 'app/components/scheduler-panel/scheduler'
import LoginPanel     from 'app/components/login-panel/login'

// -- Connection to server 
import Control from 'app/utils/connection'


// Vue global settings
Vue.config.debug = true
Vue.use(VueRouter)

var router = window.router = new VueRouter()

router.map({
    '/calendar/:calendar_id': {
        name: 'calendar',
        component: SchedulerPanel
    },
    '/sign-in': {
        name: 'login',
        component: LoginPanel
    }
})

router.start({
    mixins: [ResizeMixin],
    data() {
        return {
            control: null,
            store: {
                user: null
            }
        }
    },
    created() {
        // var base_url = 'wss://a2z-scheduler-dev.herokuapp.com/v1/websocket'
        var base_url = 'ws://localhost:8889/v1/websocket'
        this.control = new Control(this, base_url)
    },
    ready() {
        var app = window.app = this
    },
    watch: {
        'store.user'(user) {
            if (user) this.control.get_calendars()
        }
    },
    methods: {
        window_size() {
            return { height: window.innerHeight, width: window.innerWidth }
        }
    },
    computed: {
    },
    events: {
        resize(size) {
            this.$broadcast('resize', size)
        }
    },
    components: {}
}, 'body')