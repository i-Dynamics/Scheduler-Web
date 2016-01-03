import Uniquable from 'app/model/uniquable'
import classify  from 'app/utils/classify'


export default class Calendar extends Uniquable
{
    constructor({
        id           = null,
        name         = null,
        resources    = [],
        events       = [],
        bookings     = [],
        owners       = [],
        contributors = [],
        viewers      = [],
        invites      = []
    }) {
        super()

        this.id           = id
        this.name         = name
        this.resources    = resources.map(r => classify(r))
        this.events       = events.map(e => classify(e))
        this.bookings     = bookings.map(b => classify(b))
        this.owners       = owners.map(o => classify(o))
        this.contributors = contributors.map(c => classify(c))
        this.viewers      = viewers.map(v => classify(v))
        this.invites      = invites.map(i => classify(i))
    }
}
