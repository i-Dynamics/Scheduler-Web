import './resources.css!'

import tmpl from './resources.html!text'

import Vue from 'vue'
import InsertResourcePanel from 'app/components/insert-resource-panel/insert_resource'

import * as systems from 'app/utils/operating_systems'
import {key_codes} from 'app/utils/key_codes'

function expand_list_item(list, element, speed) {
    // check if the list needs to scroll
    if(list.scrollTop == element.offsetTop) return

    // calculate distance and magnitude
    // for the rate invert the sign for scroll direction and multiply by speed
    var distance   = list.scrollTop - element.offsetTop,
        magnitude  = Math.abs(distance),
        rate       = (distance/magnitude) * -(speed),
        last_value = magnitude

    // log values
    // console.log("element offset:" + element.offsetTop);
    // console.log("    scroll top:" + list.scrollTop);
    // console.log("     magnitude:" + magnitude);
    // console.log("      distance:" + distance);
    // console.log("         speed:" + speed);
    // console.log("          rate:" + rate);

    // animate to scroll position at given rate
    var interval = setInterval(animate, 10)
    function animate() {
        // console.log("run:" + magnitude);
        // check if the limit has been reached
        if(magnitude > last_value || magnitude == 0) {
            list.scrollTop = element.offsetTop
            // console.log("RESULT:" + list.scrollTop)
            clearInterval(interval)
        }
        else {
            // increment the scroll distance
            list.scrollTop += rate
            // save the last value and update the magnitude
            last_value = magnitude
            magnitude  = Math.abs(list.scrollTop - element.offsetTop)
        }
    }
}


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
                SEARCH: 2,
                EDITOR: 3
            },
            search_query: null,
            sort_order: 1,
            selected_resources: [],
            editing_resource: null,
            filtering: false
        }
    },
    ready() {
        this.control.get_resources(this.calendar)
        Vue.nextTick( this.resize_list )
    },
    methods: {
        resize_list() {
            // get constituent heights
            let panel_height   = this.$els.panel.offsetHeight,
                header_height  = this.$els.header.offsetHeight

            // calculate the lists height
            // take 1px off to resolve rounding error
            let list_height = panel_height - header_height - 1
            this.$els.list.style.height = list_height+"px"
        },
        edit_resource(resource, list, element) {
            // get the list and item heights
            var list_height = list.offsetHeight,
                item_height = element.offsetHeight,
                speed       = Math.ceil(list_height/item_height)

            // hide the scroll bar
            list.style.overflow = 'hidden'

            // set the editing resource
            this.state = this.states.EDITOR
            this.editing_resource = resource

            // wait to expand the item and scroll
            this.$nextTick(expand_list_item.bind(this, list, element, speed))
        },
        handle_insert_completion() {
            this.state = this.states.NORMAL
        },
        edit_button_clicked(index, resource, event) {
            // get the, list, element
            var list    = this.$els.listContainer,
                element = event.path[1]

            // check if the sub bar is open
            if(this.filtering) {
                // close menu and wait for animation
                this.filter_button_clicked()
                setTimeout(this.edit_resource.bind(this,resource,list,element), 300)
            }
            else {
                this.edit_resource(resource,list,element)
            }
        },
        plus_button_clicked() {
            if (this.state == this.states.NORMAL) {
                this.state = this.states.INSERT
            } else {
                if (this.state == this.states.SEARCH) {
                    this.search_query = ''
                } else if (this.state == this.states.EDITOR) {
                    this.editing_resource = null
                    this.$els.listContainer.style.overflow = 'auto'
                }
                this.state = this.states.NORMAL
            }
        },
        filter_button_clicked() {
            // toggle filtering
            this.filtering = !this.filtering

            // resize the list container to account for filter bar
            let list_height = this.$els.list.offsetHeight,
                bar_height  = this.filtering ? 45 : 0
            this.$els.listContainer.style.height = list_height - bar_height + "px"
        },
        search_button_clicked() {
            this.state = this.states.SEARCH
            this.$nextTick( () => {
                this.$els.search.focus()
            })
        },
        drag_start(resource) {
            // Make resources only selected if not alraedy part of selected list (otherwise take all selected)
            if (!this.selected_resources.has(resource)) {
                this.selected_resources.empty()
                this.selected_resources.set(resource)
            }
        },
        select_resource(resource, resources, event) {
            // check if edit mode is active
            if(this.editing_resource) return

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
        },
        action_sub_bar_active() {
            return this.filtering
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
