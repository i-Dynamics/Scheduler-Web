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
            state: 0,
            states: {
                NORMAL: 0,
                INSERT: 1,
                SEARCH: 2
            },
            search_query: null,
            sort_order: 1,
            selected_event: null,
        }
    },
    ready() {
        this.$root.control.get_events(this.calendar)
    },
    methods: {
        handle_insert_completion() {
            this.state = this.states.NORMAL
        },
        plus_button_clicked() {
            if (this.state == this.states.NORMAL) {
                this.state = this.states.INSERT
            } else if (this.state == this.states.SEARCH) {
                this.search_query = ''
                this.state = this.states.NORMAL
            } else {
                this.state = this.states.NORMAL
            }
        },
        search_button_clicked() {
            this.state = this.states.SEARCH
            this.$nextTick( () => {
                this.$els.search.focus()
            })
        },
        drag(event) {
            this.selected_event = event
        }
    },
    computed: {
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
