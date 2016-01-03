import docCookies from "app/utils/cookies";
import classify from 'app/utils/classify'


export default class Connection {
    constructor(app, url){
        this._url = url;
        this._app = app;
        this._ws = null;
        this._next_id = 1;
        this._pending_request = [];
        this._pending_response = {};
        this._send_timeout = null;
        this._connected = false;
        this.connect();

        // ping to keep connection alive
        setInterval( () => {
            if(this._connected) {
                this.send("ping")
            }
        }, 30000);
    }

    connect(){
        this._ws = new WebSocket(this._url);
        this._ws.onopen = () => {
            this._connected = true;
        };
        this._ws.onmessage = evt => {
            var payload = JSON.parse(evt.data);
            if(payload.response_id){
                var request = this._pending_response[payload.response_id];
                if(request){
                    delete this._pending_response[payload.response_id];
                    request.callback(request,payload);
                }
            } else if(payload.signal == "cookie") {
                var value = docCookies.getItem(payload.message.cookie_name);
                if(value){
                    this.send("cookie",{value: value});
                }
            } else if(payload.signal == "user") {
                this._app.store.user = classify(payload.message);
                if(payload.cookie){
                    var expires = new Date();
                    expires.setMonth( expires.getMonth() + 1 );
                    docCookies.setItem(payload.cookie_name, payload.cookie,expires.toGMTString());
                }
            } else {
                this._app.$broadcast(payload.signal, payload.message);
            }
        };
        this._ws.onclose = () =>{
            this._ws = null;
            this._connected = false;
        };
    }

    send(action,args,callback){
        this._pending_request.push({
            id: this._next_id ++,
            action:action,
            args: args,
            callback: callback
        });
        if(!this._send_timeout && this._connected){
            this._send_timeout = setTimeout(this._send.bind(this),0);
        }
    }

    _send() {
        this._send_timeout = null;
        this._ws.send(JSON.stringify({
            requests: this._pending_request.map(item=>{
                    if(item.callback){
                        this._pending_response[item.id]=item;
                    }
                    return [item.id,item.action,item.args];
                })
            }));
        this._pending_request = [];
    }

    login(username, password, error_back){
        this.send("login",{ username:username, password:password },(request,response)=>{
            if(response.error && error_back){
                error_back(response.error);
            }
        });
    }

    logout(error_back){
        this.send("logout",{},(request,response)=>{
            if(response.error){
                if(error_back){
                    error_back(response.error);
                }
                return;
            }
            this._app.store.user = null;
            docCookies.removeItem(response.result);
        });
    }

    get_calendars(error_back) {
        this.send('get_calendars', {}, (request, response) => {
            if(response.error) {
                if(error_back) error_back(response.error)
                return
            }
            this._app.store.user.calendars = response.result
        })
    }

    get_events(calendar, error_back) {
        this.send('get_events', { calendar_id: calendar.id }, (request, response) => {
            if(response.error) {
                if(error_back) error_back(response.error)
                return
            }
            calendar.events = response.result
        })
    }

    insert_event(event, error_back) {
        this.send('insert_event', event, (request, response) => {
            if(error_back) error_back(response.error)
        })
    }

    get_resources(calendar, error_back) {
        this.send('get_resources', { calendar_id: calendar.id }, (request, response) => {
            if(response.error) {
                if(error_back) error_back(response.error)
                return
            }
            calendar.resources = response.result
        })
    }

    insert_resource(resource, error_back) {
        this.send('insert_resource', resource, (request, response) => {
            if(error_back) error_back(response.error)
        })
    }

    get_bookings(calendar, error_back) {
        this.send('get_bookings', { calendar_id: calendar.id }, (request, response) => {
            if(response.error) {
                if(error_back) error_back(response.error)
                return
            }
            calendar.bookings = response.result
        })
    }
}
