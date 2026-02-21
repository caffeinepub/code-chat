import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Text "mo:core/Text";

actor {
  type User = {
    principal : Principal;
    displayName : Text;
  };

  module User {
    public func compare(user1 : User, user2 : User) : Order.Order {
      compareByDisplayName(user1, user2);
    };

    func compareByDisplayName(user1 : User, user2 : User) : Order.Order {
      Text.compare(user1.displayName, user2.displayName);
    };
  };

  var nextUserId = 1;

  let users = Map.empty<Nat, User>();
  let connections = Map.empty<Nat, Nat>();

  public shared ({ caller }) func registerUser(displayName : Text) : async Nat {
    let userId = nextUserId;
    nextUserId += 1;

    let user : User = {
      principal = caller;
      displayName;
    };

    users.add(userId, user);
    userId;
  };

  public shared ({ caller }) func connectUsers(myId : Nat, targetId : Nat) : async () {
    switch (users.get(targetId)) {
      case (null) { Runtime.trap("User not found") };
      case (?_user) {
        connections.add(myId, targetId);
        connections.add(targetId, myId);
      };
    };
  };

  public query ({ caller }) func getAllUsers() : async [User] {
    users.values().toArray();
  };

  public query ({ caller }) func isConnected(userId1 : Nat, userId2 : Nat) : async Bool {
    switch (connections.get(userId1)) {
      case (null) { false };
      case (?connectedId) { connectedId == userId2 };
    };
  };
};
