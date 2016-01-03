import Uniquable from 'app/model/uniquable'


export default class Event extends Uniquable
{
    constructor({
        id         = null,
        name       = null,
        start_date = null,
        end_date   = null,
        notes      = null,
        hours      = null,
        bookings   = []
    }) {
        this.id         = id
        this.name       = name
        this.start_date = start_date
        this.end_date   = end_date
        this.notes      = notes
        this.hours      = hours
        this.bookings   = bookings
    }
}
