import './resources.css!'

import tmpl from './resources.html!text'

import Vue from 'vue'
import InsertResourcePanel from 'app/components/insert-resource-panel/insert_resource'

import * as systems from 'app/utils/operating_systems'
import {key_codes} from 'app/utils/key_codes'


export default Vue.extend({
    template: tmpl,
    components: {
        'insert-resource-panel': InsertResourcePanel
    },
    props: [
        'calendar'
    ],
    data() {
        return {
            title: 'Resources',
            state: 0,
            states: {
                NORMAL: 0,
                INSERT: 1,
                SEARCH: 2
            },
            search_query: null,
            sort_order: 1,
            selected_resources: []
        }
    },
    ready() {
        this.$root.control.get_resources(this.calendar)

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
        },
        select_resource(resource, resources) {
            // TODO: what if resource is removed by server. needto add watcher to listen for that event here and remove obj from selected
            let osx_client = (this.$root.user_os == systems.operating_systems.OSX),
                keys_down  = this.$root.keys_down,
                selected   = this.selected_resources,
                add        = (osx_client) ? keys_down.has(key_codes.CMD) : keys_down.has(key_codes.CTRL)
            // add resource - cmd (os x) or ctrl (other os) and only key pressed
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
            // TODO: sort and filter programatically  | filterBy search_query in 'name' 'notes' | orderBy 'name' sort_order"
            let filter_by = Vue.options.filters['filterBy'],
                order_by  = Vue.options.filters['orderBy'],
                result    = this.calendar.resources

            result = filter_by(result, this.search_query, ['name', 'notes']),
            result = order_by(result, 'name', this.sort_order)

            return result
        }
    },
    watch: {

    },
    events: {
        resize(size) {
            this.resize_list();
            return true
        }
    }
})
