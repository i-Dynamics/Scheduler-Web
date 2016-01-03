import Uniquable from 'app/model/uniquable'


export default class User extends Uniquable
{
    constructor({
        id            = null,
        username      = null,
        email_address = null,
        calendars     = [],
        invites       = []
    }) {
        this.id            = id
        this.username      = username
        this.email_address = email_address
        this.calendars     = calendars
        this.invites       = invites
    }
}
