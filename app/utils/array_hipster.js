// Gets the index value for the last item in the
// Returns -1 if none
if (!Array.prototype.lastIndex) {
    Object.defineProperty(Array.prototype, 'lastIndex', {
        get: function() {
            return this.length - 1
        }
    })
}

// Gets the last item in the array
if (!Array.prototype.last) {
    Array.prototype.last = function() {
        return this[this.lastIndex]
    }
}

// Pushs element in array (unless already exists)
// If bubble is true the element will be moved to the end of the array - if already existed
if (!Array.prototype.set) {
    Array.prototype.set = function(item, bubble) {
        if (typeof(bubble)==='undefined') bubble = false

        var index = this.findIndex(function(i) {return i == item}) // TODO: Can't do i => i == item uglify doens't like

        if (index == -1) this.push(item)
        else if (bubble) this.move(index, this.lastIndex)
    }
}

// Returns true or false if array contains item
if (!Array.prototype.has) {
    Array.prototype.has = function(item) {
        return (this.indexOf(item) != -1)
    }
}

// Removes first occurence of item in array
if (!Array.prototype.remove) {
    Array.prototype.remove = function(item) {
        var index = this.findIndex(function(i) {return i == item}) // TODO: Can't do i => i == item uglify doens't like
        this.splice(index, 1)
    }
}

// Pop the item at the given index - removing it from the array
if (!Array.prototype.popIndex) {
    Array.prototype.popIndex = function(index) {
        return this.splice(index, 1)
    }
}

// Move an item in an array to a different position in the array (within )
if (!Array.prototype.move) {
    Array.prototype.move = function (old_index, new_index) {
        this.splice(new_index, 0, this.splice(old_index, 1)[0])
    }
}

// Empty out all elements from array
if (!Array.prototype.empty) {
    Array.prototype.empty = function () {
        this.splice(0, this.length)
    }
}
