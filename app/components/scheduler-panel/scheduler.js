import './scheduler.css!'

import tmpl from './scheduler.html!text'

import Vue            from 'vue'
import CalendarPanel  from 'app/components/calendar-panel/calendar'
import EventsPanel    from 'app/components/events-panel/events'
import ResourcesPanel from 'app/components/resources-panel/resources'


export default Vue.extend({
    template: tmpl,
    components: {
        'calendar-panel':  CalendarPanel,
        'events-panel':    EventsPanel,
        'resources-panel': ResourcesPanel
    },
    props: [
        'calendars'
    ],
    data() {
        return {}
    },
    ready() {
        this.$root.control.get_calendars()
        this.resize(this.$root.window_size())
    },
    route: {
    },
    methods: {
        resize(size) {
            // main panel
            this.$els.calendarPanel.style.height  = size.height + "px"
            // side panels
            let half_height                       = size.height / 2
            this.$els.eventsPanel.style.height    = half_height + "px"
            this.$els.resourcesPanel.style.height = half_height + "px"
        }
    },
    computed: {
        selected_calendar() {
            var url_id = this.$route.params.calendar_id
            return this.calendars ? this.calendars.find(cal => cal.id == url_id) : null
        }
    },
    watch: {

    },
    events: {
        resize(size) {
            // main panel
            this.$els.calendarPanel.style.height  = size.height + "px"
            // side panels
            let half_height                       = size.height / 2
            this.$els.eventsPanel.style.height    = half_height + "px"
            this.$els.resourcesPanel.style.height = half_height + "px"
            return true
        }
    }
})
