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
        update_user(user) {
            calendar.user = user
        },
        insert_invite(invite) {
            store.user.invites.push(invite)
        },
        update_invite(invite) {
            let index = store.user.invites.findIndex(i => i.id == invite.id)
            store.user.invites.$set(index, invite)
        },
        delete_invite(id) {
            var index = store.user.invites.findIndex(i => i.id == id)
            calendar.invites.splice(index, 1)
        },
        insert_event(event) {
            let calendar = this.$root.store.user.calendars.find(c => c.id == event.calendar.id)
            calendar.events.push(event)
        },
        update_event(event) {
            let calendar = this.$root.store.user.calendars.find(c => c.id == event.calendar.id)
            let index    = calendar.events.findIndex(e => e.id == event.id)
            calendar.events.$set(index, event)
        },
        delete_event(id) {
            let calendar = this.$root.store.user.calendars.find(c => c.id == event.calendar.id)
            var index    = calendar.events.findIndex(e => e.id == id)
            calendar.events.splice(index, 1)
        },
        insert_resource(resource) {
            let calendar = this.$root.store.user.calendars.find(c => c.id == resource.calendar.id)
            calendar.resources.push(resource)
        },
        update_resource(resource) {
            let calendar = this.$root.store.user.calendars.find(c => c.id == resource.calendar.id)
            let index    = calendar.resources.findIndex(r => r.id == resource.id)
            calendar.resources.$set(index, resource)
        },
        delete_resource(id) {
            let calendar = this.$root.store.user.calendars.find(c => c.id == resource.calendar.id)
            var index    = calendar.resources.findIndex(r => r.id == id)
            calendar.resources.splice(index, 1)
        },
        insert_booking(booking) {
            let calendar = this.store.user.calendars.find(c => c.id == booking.calendar.id)
            calendar.bookings.push(booking)
        },
        update_booking(booking) {
            let calendar = this.store.user.calendars.find(c => c.id == booking.calendar.id)
            let index    = calendar.bookings.findIndex(b => b.id == booking.id)
            calendar.bookings.$set(index, booking)
        },
        delete_booking(id) {
            let calendar = this.store.user.calendars.find(c => c.id == booking.calendar.id)
            var index    = calendar.bookings.findIndex(b => b.id == id)
            calendar.bookings.splice(index, 1)
        }
    },
    components: {
        'login-panel': LoginPanel
    }
}, 'body')
