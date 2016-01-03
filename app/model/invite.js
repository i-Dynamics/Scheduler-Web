import Uniquable from 'app/model/uniquable'


export default class Invite extends Uniquable
{
    constructor({
        id       = null,
        title    = null,
        user     = null,
        calendar = null
    }) {
        this.id       = id
        this.title    = title
        this.user     = user
        this.calendar = calendar
    }
}
