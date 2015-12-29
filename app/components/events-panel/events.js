import './events.css!'

import tmpl from './events.html!text'

import Vue from 'vue'


export default Vue.extend({
    template: tmpl,
    components: {

    },
    props: [
        'calendar'
    ],
    data() {
        return {
            title: 'Events'
        }
    },
    ready() {
        // this.events = this.$root.control.get_events(this.calendar.id)
    },
    methods: {

    },
    computed: {
        display_events() {
            return this.calendar.events
        }
    },
    watch: {

    },
    events: {

    }
})