import classify from 'app/utils/classify'


// const PRIMARY_KEYS = ['id']

export default class Uniquable {

    constructor(_surrogate = true) {
        this._primary_keys = ['id']
        this.__surrogate   = _surrogate
    }

    get _surrogate() {
        return this.__surrogate
    }

    set _surrogate(value) {
        // if a object is at any time no longer a surrogate it should never be one again
        this.__surrogate = (this.__surrogate) ? value : false
    }

    * public_properties() {
        // surrogate counts as public as it should be modified by the update json
        yield [ '_surrogate', this._surrogate ]

        for (let key of Object.keys(this)) {
            if (key.charAt(0) == '_') continue
            yield [ key, this[key] ]
        }
    }

    update_from_json(update) {
        for ( let [key, old] of this.public_properties() )
        {
            // get the corrisonding new value for current property
            let _new = update[key]

            // if the value doesn't exist, move on to the next property
            if ( typeof _new === "undefined" ) {
                continue
            }
            // else, if the old value can be identified as an instance of new update it
            else if ( old instanceof Uniquable && old.is(_new) ) {
                this[key].update_from_json(_new)
            }
            // else, if values are both arrays
            else if ( old instanceof Array && _new instanceof Array ) {

                // go through old values to update or, otherwise, remove
                this[key] = old.filter( old_child => {

                    // if there's no chance to identify value remove it from old array
                    if (!(old_child instanceof Uniquable)) return false

                    // try and find its matching value in new array
                    let new_child_index = _new.findIndex( new_child => {
                        return old_child.is(new_child)
                    })

                    // if found, get it, update old value with it and remove it from new array
                    if (new_child_index != -1) {
                        let new_child = _new[new_child_index]
                        old_child.update_from_json(new_child)
                        _new.splice(new_child_index, 1)

                        // value found and updated from _new - keep in the array
                        return true
                    }

                    // unable to find match, remove it
                    return false
                })

                // Add any remaining objects in new into the old array
                for (let new_child of _new) {
                    // Try to put into class
                    new_child = classify(new_child)
                    this[key].push(new_child)
                }
            }
            // Try to put into a class and just replace old value
            else {
                this[key] = classify(_new)
            }
        }
    }

    is(object) {
        let result = true
        for (let key of this._primary_keys) {
            result &= (this.key == object.key)
        }
        return result
    }
}
