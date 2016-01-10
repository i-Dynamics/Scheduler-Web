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
            let osx_client = (this.$root.user_os == systems.operating_systems.OSX)
            let keys_down  = this.$root.keys_down
            let selected   = this.selected_resources
            // add resource - cmd (os x) or ctrl (other os) and only key pressed
            let add = (osx_client) ? keys_down.has(key_codes.CMD) : keys_down.has(key_codes.CTRL)
            if (add && keys_down.length == 1) {
                // deselect or seelc bepending if already seelcted
                if (selected.has(resource))
                    selected.remove(resource)
                else
                    selected.set(resource)
            }
            // add _to_ resource (shift)
            else if (keys_down.has(key_codes.SHIFT) && keys_down.length == 1) {
                // Get the index of the last selected item (if none then go from the top of the list)
                let last_selected = (selected.lastIndex != -1) ? selected.last() : this.display_resources[0],
                    last_index    = this.display_resources.indexOf(last_selected),
                    current_index = this.display_resources.indexOf(resource),
                    ordered_index = [last_index, current_index].sort(),
                    new_resources = this.display_resources.slice(ordered_index[0], ordered_index[1]+1)

                new_resources.map(r => selected.set(r))
            }
            // select resource
            else {
                // deselect if only one already selected
                if (selected.has(resource) && selected.length == 1) {
                    selected.remove(resource)
                }
                else {
                    selected.empty()
                    selected.set(resource)
                }
            }
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
