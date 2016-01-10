import './insert_resource.css!'

import tmpl from './insert_resource.html!text'

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
            resource: {
                name: null,
                tags: null
            }
        }
    },
    ready() {
        this.$els.name.focus()
    },
    methods: {
        insert_resource(resource) {
            resource.calendar_id = this.calendar.id
            this.$root.control.insert_resource(resource, error => {
                if (!error) this.$emit('completed')
            })
        }
    },
    computed: {
        valid_resource() {
            return (this.resource.name) ? true : false
        }
    },
    watch: {

    },
    events: {

    }
})
