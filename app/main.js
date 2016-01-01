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
        // update_user(user) {
        //     calendar.user = user
        // },
        // insert_invite(invite) {
        //     store.user.invites.push(invite)
        // },
        // update_invite(invite) {
        //     let index = store.user.invites.findIndex(i => i.id == invite.id)
        //     store.user.invites.$set(index, invite)
        // },
        // delete_invite(id) {
        //     var index = store.user.invites.findIndex(i => i.id == id)
        //     calendar.invites.splice(index, 1)
        // }
    },
    components: {
        'login-panel': LoginPanel
    }
}, 'body')