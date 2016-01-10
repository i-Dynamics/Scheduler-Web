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
    },
    route: {
    },
    methods: {
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
    }
})
