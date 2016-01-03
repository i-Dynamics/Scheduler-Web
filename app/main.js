// CSS Imports
import 'skeleton-css/css/normalize.css!'
import 'skeleton-css/css/skeleton.css!'
import './main.css!'

// JS Imports
// -- Consts
import {debug, ws_url} from 'consts'

// -- Vue
import Vue         from 'vue'
import VueRouter   from 'vue-router'
import ResizeMixin from 'vue-resize-mixin'

// -- App panels
import SchedulerPanel from 'app/components/scheduler-panel/scheduler'
import LoginPanel     from 'app/components/login-panel/login'

// -- Connection to server
import Control  from 'app/utils/connection'

// -- Utils
import classify from 'app/utils/classify'


// Vue global settings
Vue.config.debug = debug
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
        this.control = new Control(this, ws_url)
    },
    ready() {
        if (debug) {
            console.log("Running Debug")
            window.app = this
        }
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
        },
        insert_user(user) {
            this.store.user = classify(user)
        },
        update_user(user) {
            this.store.user.update_from_json(user)
        },
        delete_user(user) {
            this.store.user = null
        },
        set_calendars(calendars) {
            this.store.user.update_from_json({
                calendars: calendars
            })
        },
        insert_calendar(calendar) {
            calendar = classify(calendar)
            this.store.user.calendars.push(calendar)
        },
        update_calendar(calendar) {
            let old_calendar = this.store.user.calendars.find(c => c.id == calendar.id)
            old_calendar.update_from_json(calendar)
        },
        delete_calendar(id) {
            var index = this.store.user.calendars.findIndex(c => c.id == id)
            calendar.calendars.splice(index, 1)
        },
        set_invites(invites) {
            this.store.user.update_from_json({
                invites: invites
            })
        },
        insert_invite(invite) {
            invite = classify(invite)
            this.store.user.invites.push(invite)
        },
        update_invite(invite) {
            let old_invite = this.store.user.invites.find(i => i.id == invite.id)
            old_invite.update_from_json(invite)
        },
        delete_invite(id) {
            let index = this.store.user.invites.findIndex(i => i.id == id)
            calendar.invites.splice(index, 1)
        },
        set_events(calendar_id, events) {
            let calendar = this.store.user.calendars.find(c => c.id == calendar_id)
            calendar.update_from_json({
                events: events
            })
        },
        insert_event(event) {
            let calendar = this.store.user.calendars.find(c => c.id == event.calendar.id)
            event        = classify(event)
            calendar.events.push(event)
        },
        update_event(event) {
            let calendar  = this.store.user.calendars.find(c => c.id == event.calendar.id)
            let old_event = calendar.events.find(e => e.id == event.id)
            old_event.update_from_json(event)
        },
        delete_event(id) {
            let calendar = this.store.user.calendars.find(c => c.id == event.calendar.id)
            let index    = calendar.events.findIndex(e => e.id == id)
            calendar.events.splice(index, 1)
        },
        set_resources(calendar_id, resources) {
            let calendar = this.store.user.calendars.find(c => c.id == calendar_id)
            calendar.update_from_json({
                resources: resources
            })
        },
        insert_resource(resource) {
            let calendar = this.store.user.calendars.find(c => c.id == resource.calendar.id)
            resources    = classify(resource)
            calendar.resources.push(resource)
        },
        update_resource(resource) {
            let calendar     = this.store.user.calendars.find(c => c.id == resource.calendar.id)
            let old_resource = calendar.resources.find(r => r.id == resource.id)
            old_resource.update_from_json(resource)
        },
        delete_resource(id) {
            let calendar = this.store.user.calendars.find(c => c.id == resource.calendar.id)
            let index    = calendar.resources.findIndex(r => r.id == id)
            calendar.resources.splice(index, 1)
        },
        set_bookings(calendar_id, bookings) {
            let calendar = this.store.user.calendars.find(c => c.id == calendar_id)
            calendar.update_from_json({
                bookings: bookings
            })
        },
        insert_booking(booking) {
            let calendar = this.store.user.calendars.find(c => c.id == booking.calendar.id)
            booking      = classify(booking)
            calendar.bookings.push(booking)
        },
        update_booking(booking) {
            let calendar    = this.store.user.calendars.find(c => c.id == booking.calendar.id)
            let old_booking = calendar.bookings.find(b => b.id == booking.id)
            old_booking.update_from_json(booking)
        },
        delete_booking(id) {
            let calendar = this.store.user.calendars.find(c => c.id == booking.calendar.id)
            let index    = calendar.bookings.findIndex(b => b.id == id)
            calendar.bookings.splice(index, 1)
        }
    },
    components: {
        'login-panel': LoginPanel
    }
}, 'body')
