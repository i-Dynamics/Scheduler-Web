import Uniquable from 'app/model/uniquable'
import classify  from 'app/utils/classify'


export default class Booking extends Uniquable
{
    constructor({
        id         = null,
        start_date = null,
        end_date   = null,
        event      = null,
        resource   = null,
        _surrogate = true
    }) {
        super(_surrogate)

        this.id         = id
        this.start_date = start_date
        this.end_date   = end_date
        this.event      = classify(event)
        this.resource   = classify(resource)
    }
}
