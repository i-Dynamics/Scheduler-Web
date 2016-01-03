import Uniquable from 'app/model/uniquable'


export default class Resource extends Uniquable
{
    constructor({
        id          = null,
        name        = null,
        preferences = {},
        calendar    = null,
        bookings    = [],
        tags        = []
    }) {
        this.id          = id
        this.name        = name
        this.preferences = preferences
        this.calendar    = calendar
        this.bookings    = bookings
        this.tags        = tags
    }
}
