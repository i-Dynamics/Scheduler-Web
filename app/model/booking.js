import Uniquable from 'app/model/uniquable'


export default class Booking extends Uniquable
{
    constructor({
        id         = null,
        start_date = null,
        end_date   = null,
        event      = null,
        resource   = null
    }) {
        super()
        
        this.id         = id
        this.start_date = start_date
        this.end_date   = end_date
        this.event      = event
        this.resource   = resource
    }
}
