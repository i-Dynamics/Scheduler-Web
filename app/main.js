// CSS Imports
import 'skeleton-css/css/normalize.css!'
import 'skeleton-css/css/skeleton.css!'
import './main.css!'

// JS Imports

// -- Prototype Extentions
import 'app/utils/array_hipster'

// -- Vue
import router from 'app/router'
import ResizeMixin from 'vue-resize-mixin'

// -- Utils
import classify from 'app/utils/classify'
import * as systems from 'app/utils/operating_systems'

import Calendar from 'app/model/calendar'


router.start({
    mixins: [ResizeMixin],
    data() {
        return {
            store: {
                user: {
                    calendars: [
                        new Calendar({id:1, name:'my calendar'}),
                    ],
                },
            },
            user_os: systems.parse_os_from_user_agent(navigator.userAgent),
            keys_down: null,
            status: null,
            error: null,
        }
    },
    created() {
        this.control
            .init((signal, message) => {
                this.$dispatch(signal, message)
                this.$broadcast(signal, message)
            })
            .then(status => {
                this.status = status
            })
            .catch(error => {
                this.error = error
            })
        this.keys_down = []
    },
    ready() {
        // watch key presses
        document.onkeydown = this.key_down
        document.onkeyup   = this.key_up
    },
    watch: {
    },
    methods: {
        window_size() {
            return { height: window.innerHeight, width: window.innerWidth }
        },
        key_down(event) {
            event = event || window.event
            this.keys_down.set(event.keyCode)
        },
        key_up(event) {
            event = event || window.event
            this.keys_down.remove(event.keyCode)
        },
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
        delete_user() {
            this.store.user = null
        },
        set_calendars(calendars) {
            this.store.user.update_from_json({calendars})
        },
        insert_calendar(calendar) {
            calendar = classify(calendar)
            this.store.user.calendars.push(calendar)
        },
        update_calendar(calendar) {
            const old_calendar = this.store.user.calendars.find(c => c.id === calendar.id)
            old_calendar.update_from_json(calendar)
        },
        delete_calendar(id) {
            const index = this.store.user.calendars.findIndex(c => c.id === id)
            this.store.user.calendars.splice(index, 1)
        },
        set_invites(invites) {
            this.store.user.update_from_json({invites})
        },
        insert_invite(invite) {
            invite = classify(invite)
            this.store.user.invites.push(invite)
        },
        update_invite(invite) {
            const old_invite = this.store.user.invites.find(i => i.id === invite.id)
            old_invite.update_from_json(invite)
        },
        delete_invite(id) {
            const index = this.store.user.invites.findIndex(i => i.id === id)
            calendar.invites.splice(index, 1)
        },
        set_events(calendar_id, events) {
            let calendar = this.store.user.calendars.find(c => c.id === calendar_id)
            calendar.update_from_json({
                events: events
            })
        },
        insert_event(event) {
            let calendar = this.store.user.calendars.find(c => c.id === event.calendar.id)
            event        = classify(event)
            calendar.events.push(event)
        },
        update_event(event) {
            let calendar  = this.store.user.calendars.find(c => c.id === event.calendar.id)
            let old_event = calendar.events.find(e => e.id == event.id)
            old_event.update_from_json(event)
        },
        delete_event(id) {
            let calendar = this.store.user.calendars.find(c => c.id === event.calendar.id)
            let index    = calendar.events.findIndex(e => e.id == id)
            calendar.events.splice(index, 1)
        },
        set_resources(calendar_id, resources) {
            let calendar = this.store.user.calendars.find(c => c.id === calendar_id)
            calendar.update_from_json({
                resources: resources
            })
        },
        insert_resource(resource) {
            let calendar = this.store.user.calendars.find(c => c.id === resource.calendar.id)
            resources    = classify(resource)
            calendar.resources.push(resource)
        },
        update_resource(resource) {
            let calendar     = this.store.user.calendars.find(c => c.id === resource.calendar.id)
            let old_resource = calendar.resources.find(r => r.id === resource.id)
            old_resource.update_from_json(resource)
        },
        delete_resource(id) {
            let calendar = this.store.user.calendars.find(c => c.id === resource.calendar.id)
            let index    = calendar.resources.findIndex(r => r.id === id)
            calendar.resources.splice(index, 1)
        },
        set_bookings(calendar_id, bookings) {
            let calendar = this.store.user.calendars.find(c => c.id === calendar_id)
            calendar.update_from_json({
                bookings: bookings
            })
        },
        insert_booking(booking) {
            let calendar = this.store.user.calendars.find(c => c.id === booking.calendar.id)
            booking      = classify(booking)
            calendar.bookings.push(booking)
        },
        update_booking(booking) {
            let calendar    = this.store.user.calendars.find(c => c.id === booking.calendar.id)
            let old_booking = calendar.bookings.find(b => b.id == booking.id)
            old_booking.update_from_json(booking)
        },
        delete_booking(id) {
            let calendar = this.store.user.calendars.find(c => c.id === booking.calendar.id)
            let index    = calendar.bookings.findIndex(b => b.id === id)
            calendar.bookings.splice(index, 1)
        }
    },
}, 'body')
