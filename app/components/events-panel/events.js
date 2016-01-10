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

        Vue.nextTick( this.resize_list )
    },
    methods: {
        resize_list() {
            let panel_height  = this.$els.panel.offsetHeight,
                header_height = this.$els.header.offsetHeight,
                list_height   = panel_height - header_height

            this.$els.list.style.height = list_height+"px"
        },
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
            this.resize_list()
            return true
        }
    },
    watch: {

    }
})
