import './calendar.css!'

import tmpl from './calendar.html!text'

import Vue from 'vue'
import moment from 'moment'
import $ from 'jquery'
import fullCalendar from 'fullcalendar'


export default Vue.extend({
    template: tmpl,
    components: {

    },
    props: [
        'calendar'
    ],
    data() {
        return {
            'element': null,
            'view': {},
            'options': {
                header: false,
                minTime: '06:00:00',
                maxTime: '22:00:00',
                firstDay: 1,
                weekends: false,
                timeFormat: 'hh:mm a',
                allDayText: '',
                defaultView: 'month',
                businessHours: false,
                slotLabelFormat: 'h a',
                slotEventOverlap: false,
                views: {
                    week: {
                        titleFormat: 'D MMM YYYY',
                        columnFormat: 'dddd Do'
                    }
                }
            }
        }
    },
    ready() {
        this.$root.control.get_bookings(this.calendar)

        this.element = $('#calendar')
        this.element.fullCalendar(this.options)

        this.view = this.element.fullCalendar('getView')

        // TODO: sizing
    },
    methods: {
        page(direction='next') {
            this.element.fullCalendar(direction)
        },
        change_view(view_name) {
            this.element.fullCalendar('changeView', view_name)
            this.view = this.element.fullCalendar('getView') // TODO: view properties not reactive (e.g. changing month, title stops udating)
        },
    },
    computed: {
        display_title() {
            let title = (this.view.title ? this.view.title : "Loading");
            return title.replace('—', '-');
        },
        grouped_bookings() {
            // Takes bookings that only differ on resource and groups them into a single entity
            var groups   = new Map()
            for(let b of this.calendar.bookings) {
                let key   = b.start_date + '-' + b.end_date + '-' + b.event.id
                let group = groups.has(key) ? groups.get(key) : groups.set(key, {
                    start_date: b.start_date,
                    end_date: b.end_date,
                    event: b.event,
                    bookings: []
                }).get(key)

                group.bookings.push({
                    id: b.id,
                    resource: b.resource
                })
            }
            return Array.from( groups.values() )
        },
    },
    watch: {

    },
    events: {

    }
})
