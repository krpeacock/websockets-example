import List "mo:base/List";
import Nat "mo:base/Nat";

actor EventStack {

  stable var events: List.List<Event> = List.nil();

  type Event = {
    kind: Text;
    message: Text;
  };

  public func push_event(ev: Event) : async Nat {
    events := List.push(ev, events);
    List.size(events);
  };

  public query func get_events_at_height (height: Nat): async [Event] {
    let eventsHeight = List.size(events);
    if (height >= eventsHeight) {
      [];
    }
    else {
      let freshEvents = List.take(events, Nat.sub(eventsHeight, height));
      List.toArray(freshEvents);
    }
  };

  public query func get_current_height () : async Nat {
    List.size(events);
  };
}
