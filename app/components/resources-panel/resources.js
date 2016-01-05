import './resources.css!'

import tmpl from './resources.html!text'

import Vue from 'vue'
import InsertEventPanel from 'app/components/insert-resource-panel/insert_resource'

import * as systems from 'app/utils/operating_systems'
import {key_codes} from 'app/utils/key_codes'


export default Vue.extend({
    template: tmpl,
    components: {
        'insert-resource-panel': InsertEventPanel
    },
    props: [
        'calendar'
    ],
    data() {
        return {
            title: 'Resources',
            display_insert: false,
            selected_resources: []
        }
    },
    ready() {
        this.$root.control.get_resources(this.calendar)
    },
    methods: {
        toggle_insert() {
            this.display_insert = !this.display_insert
        },
        handle_insert_completion() {
            this.display_insert = false
        },
        select_resource(resource) {
            // TODO: what if resource is removed by server. needto add watcher to listen for that event here and remove obj from selected
            // TODO: convert from set functions to array
            // let osx_client = (this.$root.user_os == systems.operating_systems.OSX)
            // let keys_down  = this.$root.keys_down
            // // add resource - cmd (os x) or ctrl (other os) and only key pressed
            // let add = (osx_client) ? keys_down.has(key_codes.CMD) : keys_down.has(key_codes.CTRL)
            // if (add && keys_down.size == 1) {
            //     let already_selected = selected.has(resource)
            //     if (already_selected) selected.add(resource)
            //     else selected.delete(resource)
            // }
            // // add _to_ resource (shift)
            // else if (keys_down.has(key_codes.SHIFT) && keys_down.size == 1) {
            //     // Get the index of the last selected item (if none then go from the top of the list)
            //     let selected_array   = Array.from(selected)
            //     let last_selected    = (selected_array.length > 0) ? selected_array[selected_array.length-1] : 0
            //     last_selected        = (last_selected == 0) ? last_selected : this.display_resources.indexOf(last_selected)
            //     let current_selected = this.display_resources.indexOf(resource)
            //     let newly_selected   = this.display_resources.slice(last_selected, newly_selected)
            //     newly_selected.map(r => selected.add(r))
            // }
            // // select resource
            // else {
            //     // deselect if only one already selected
            //     if (selected.size == 1 && selected.has(resource)) {
            //         selected.delete(resource)
            //     } else {
            //         selected.add(resource)
            //     }
            // }
        }
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
