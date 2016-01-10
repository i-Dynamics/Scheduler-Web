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
        }
    },
    computed: {
    },
    events: {
        resize(size) {
            let panel_height  = this.$els.panel.style.height,
                header_height = this.$els.header.style.height,
                list_height   = this.$els.list.style.height

            this.$els.list.style.height = panel_height - header_height

            return true
        }
    },
    watch: {

    }
})
