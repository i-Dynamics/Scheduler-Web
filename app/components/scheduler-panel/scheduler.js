import './scheduler.css!'

import tmpl from './scheduler.html!text'

import Vue         from 'vue'
import EventsPanel from 'app/components/events-panel/events'


export default Vue.extend({
    template: tmpl,
    components: {
        'events-panel': EventsPanel
    },
    data() {
        return {
            calendar: null // Should use router to get from url '#!/cal/a2zcloud'
        }
    },
    ready() {
        
    },
    route: {
        activate(transition) {
            // this.calendar = this.$root.control.get_calendar(this.$route.params.calendar_id);
            transition.next();
        }
    },
    methods: {

    },
    computed: {

    },
    watch: {

    },
    events: {

    }
})