import Uniquable from 'app/model/uniquable'
import classify  from 'app/utils/classify'


export default class Invite extends Uniquable
{
    constructor({
        id         = null,
        title      = null,
        user       = null,
        calendar   = null,
        _surrogate = true
    }) {
        super(_surrogate)

        this.id          = id
        this.title       = title
        this.user        = classify(user)
        this.calendar    = classify(calendar)
    }
}
