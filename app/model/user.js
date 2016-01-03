import Uniquable from 'app/model/uniquable'
import classify  from 'app/utils/classify'


export default class User extends Uniquable
{
    constructor({
        id            = null,
        username      = null,
        email_address = null,
        calendars     = [],
        invites       = []
    }) {
        super()

        this.id            = id
        this.username      = username
        this.email_address = email_address
        this.calendars     = calendars.map(c => classify(c))
        this.invites       = invites.map(i => classify(i))
    }
}
