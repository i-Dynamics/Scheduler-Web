import './login.css!'

import tmpl from './login.html!text'

import Vue from 'vue'


export default Vue.extend({
    template: tmpl,
    data() {
        return {
            username: null,
            password: null,
            pending_request: false,
            error_message: null
        }
    },
    ready() {
        this.resize(this.$root.window_size())

        Vue.nextTick(() => {
            this.$els.username.focus()
        })
    },
    methods: {
        resize(size) {
            // Make panel full height
            this.$els.panel.style.height = size.height + "px"
            // Pull loging down the page
            this.$els.logo.style.paddingTop = size.height / 10 + "px"
        },
        login() {
            this.pending_request = true
            this.error_message   = null

            this.$root.control.login(this.username, this.password, error_message => {
                this.error_message = error_message
            })
        }
    },
    computed: {
    },
    watch: {
    },
    events: {
        resize: 'resize'
    }
})
