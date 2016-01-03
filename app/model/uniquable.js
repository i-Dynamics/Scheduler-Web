import classify from 'app/utils/classify'


export default class Uniquable {
    static primary_keys = ['id']

    function* properties() {
        for (let key of Object.keys(this)) {
            yield [ key, obj[key] ];
        }
    }

    function update_from_json(update) {
        for ( let [key, old] of this.properties )
        {
            // get the corrisonding new value for current property
            let new = update[key]

            // if the value doesn't exist, move on to the next property
            if ( typeof new === "undefined" ) {
                continue
            }
            // else, if the old value can be identified as an instance of new update it
            else if ( old instanceof Uniquable && old.is(new) ) {
                this[key].update_from_json(new)
            }
            // else, if values are both arrays
            else if ( old instanceof Array && new instanceof Array ) {

                // go through old values to update or, otherwise, remove
                this[key] = old.filter( old_child => {

                    // if there's no chance to identify value remove it from old array
                    if !(old_child instanceof Uniquable) return false

                    // try and find its matching value in new array
                    let new_child_index = new.findIndex( new_child => {
                        old_child.is(new_child)
                    })

                    // if found, get it, update old value with it and remove it from new array
                    if (new_child_index) {
                        new_child = new[new_child_index]
                        old_child.update_from_json(new_child)
                        new.splice(new_child_index, 1)

                        // value found and updated from new - keep in the array
                        return true
                    }

                    // unable to find match, remove it
                    return false
                })

                // Add any remaining objects in new into the old array
                for (new_child of new) {
                    // Try to put into class
                    new_child = classify(new_child)
                    this[key].push(new_child)
                }
            }
            // Try to put into a class and just replace old value
            else {
                this[key] = classify(new)
            }
        }
    }

    function is(object) {
        let result = true
        for (let key of this.primary_keys) {
            result &= (this.key == object.key)
        }
        return result
    }
}
