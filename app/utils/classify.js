import User     from 'app/model/user'
import Event    from 'app/model/event'
import Invite   from 'app/model/invite'
import Booking  from 'app/model/booking'
import Resource from 'app/model/resource'
import Calendar from 'app/model/calendar'


export default function classify(json) {
    type = json._type
    delete json._type

    switch ( type.toLowerCase() )
    {
        case     'user': return new User(json)
        case    'event': return new Event(json)
        case   'invite': return new Invite(json)
        case  'booking': return new Booking(json)
        case 'resource': return new Resource(json)
        case 'calendar': return new Calendar(json)

        default return json
    }
}
