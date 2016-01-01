import './resources.css!'

import tmpl from './resources.html!text'

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
            title: 'Resources'
        }
    },
    ready() {
        this.$root.control.get_resources(this.calendar.id)
    },
    methods: {

    },
    computed: {
        display_resources() {
            return this.calendar.resources
        }
    },
    watch: {

    },
    events: {

    }
})