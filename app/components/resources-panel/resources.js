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
        this.$root.control.get_resources(this.calendar)
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
        // insert_resource(resource) {
        //     let calendar = this.store.user.calendars.find(c => c.id == resource.calendar.id)
        //     calendar.resources.push(resource)
        // },
        // update_resource(resource) {
        //     let calendar = this.store.user.calendars.find(c => c.id == resource.calendar.id)
        //     let index    = calendar.resources.findIndex(r => r.id == resource.id)
        //     calendar.resources.$set(index, resource)
        // },
        // delete_resource(id) {
        //     let calendar = this.store.user.calendars.find(c => c.id == resource.calendar.id)
        //     var index    = calendar.resources.findIndex(r => r.id == id)
        //     calendar.resources.splice(index, 1)
        // }
    }
})