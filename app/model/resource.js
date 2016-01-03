import Uniquable from 'app/model/uniquable'
import classify  from 'app/utils/classify'


export default class Resource extends Uniquable
{
    constructor({
        id          = null,
        name        = null,
        preferences = {},
        calendar    = null,
        bookings    = [],
        tags        = [],
        _surrogate  = true
    }) {
        super(_surrogate)

        this.id           = id
        this.name         = name
        this.preferences  = preferences
        this.calendar     = classify(calendar)
        this.bookings     = bookings.map(b => classify(b))
        this.tags         = tags
    }
}
