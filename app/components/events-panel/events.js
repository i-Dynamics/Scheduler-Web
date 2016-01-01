import './events.css!'

import tmpl from './events.html!text'

import Vue from 'vue'
import InsertEventPanel from 'app/components/insert-event-panel/insert_event'


export default Vue.extend({
    template: tmpl,
    components: {
        'insert-event-panel': InsertEventPanel
    },
    props: [
        'calendar'
    ],
    data() {
        return {
            title: 'Events',
            child_view: null
        }
    },
    ready() {
        this.$root.control.get_events(this.calendar)
    },
    methods: {
        toggle_insert() { 
            this.child_view = this.child_view ? null : 'insert-event-panel'
        },
        handle_insert_completion() {
            this.child_view = null
        },
        test() {
            console.log("hello")
        }
    },
    computed: {
        display_events() {
            return this.calendar.events
        }
    },
    events: {
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
        }
    }
})