import './calendar.css!'

import tmpl from './calendar.html!text'

import Vue from 'vue'
import moment from 'moment'
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
            'options': {
                header: false,
                minTime: '06:00:00',
                maxTime: '22:00:00',
                firstDay: 1,
                weekends: false,
                timeFormat: 'hh:mm a',
                allDayText: '',
                defaultView: 'agendaWeek',
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
        // this.$els.calendar.fullCalendar(this.options)
    },
    methods: {

    },
    computed: {
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
        }
    },
    watch: {

    },
    events: {
        // insert_booking(booking) {
        //     let calendar = this.store.user.calendars.find(c => c.id == booking.calendar.id)
        //     calendar.bookings.push(booking)
        // },
        // update_booking(booking) {
        //     let calendar = this.store.user.calendars.find(c => c.id == booking.calendar.id)
        //     let index    = calendar.bookings.findIndex(b => b.id == booking.id)
        //     calendar.bookings.$set(index, booking)
        // },
        // delete_booking(id) {
        //     let calendar = this.store.user.calendars.find(c => c.id == booking.calendar.id)
        //     var index    = calendar.bookings.findIndex(b => b.id == id)
        //     calendar.bookings.splice(index, 1)
        // }
    }
})