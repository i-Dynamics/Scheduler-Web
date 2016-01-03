import Uniquable from 'app/model/uniquable'


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
        this.resources    = resources
        this.events       = events
        this.bookings     = bookings
        this.owners       = owners
        this.contributors = contributors
        this.viewers      = viewers
        this.invites      = invites
    }
}
