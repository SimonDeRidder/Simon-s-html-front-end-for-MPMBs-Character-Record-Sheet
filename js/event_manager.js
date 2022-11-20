const EventType = createEnum(['AC_calculate']);

const eventManager = {
    _listeners: new Map(), /*EventType -> Array[function]*/

    add_listener: function(event_type /*EventType*/, func /*function*/) {
        if (this._listeners.has(event_type)) {
            this._listeners.get(event_type).push(func);
        }
        else {
            this._listeners.set(event_type, [func]);
        }
    },

    handle_event: function(event_type /*EventType*/) {
        console.log("Event triggered:", event_type);
        if (this._listeners.has(event_type)) {
            this._listeners.get(event_type).forEach(element => {
                element();
            });
        }
    }
};