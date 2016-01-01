import './insert_event.css!'

import tmpl from './insert_event.html!text'

import Vue from 'vue'


export default Vue.extend({
    template: tmpl,
    components: {
    },
    props: [
        "calendar",
        "completed"
    ],
    data() {
        return {
            event: {
                name: null,
                notes: null,
                start_date: null,
                end_date: null,
                required_hours: null
            }
        }
    },
    ready() {
    },
    methods: {
        insert_event(event) {
            event.calendar_id = this.calendar.id
            this.$root.control.insert_event(event, error => {
                if (!error) this.$emit('completed')
            })
        }
    },
    computed: {
    },
    watch: {

    },
    events: {

    }
})