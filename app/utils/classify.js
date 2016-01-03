import Calendar from 'app/model/calendar'
import Resource from 'app/model/resource'
import Booking  from 'app/model/booking'
import Invite   from 'app/model/invite'
import Event    from 'app/model/event'
import User     from 'app/model/user'


export default function classify(json) {
    let type = json._type
    delete json._type

    switch ( type.toLowerCase() )
    {
        case 'calendar': return new Calendar(json)
        case 'resource': return new Resource(json)
        case  'booking': return new Booking(json)
        case   'invite': return new Invite(json)
        case    'event': return new Event(json)
        case     'user': return new User(json)

        default: return json
    }
}
