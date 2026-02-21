import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";

module {
  type OldUser = {
    principal : Principal;
    displayName : Text;
  };

  type OldActor = {
    nextUserId : Nat;
    users : Map.Map<Nat, OldUser>;
    connections : Map.Map<Nat, Nat>;
  };

  type NewUser = {
    principal : Principal;
    displayName : Text;
    authCode : Text;
  };

  type NewActor = {
    nextUserId : Nat;
    users : Map.Map<Nat, NewUser>;
    connections : Map.Map<Nat, Nat>;
    sessions : Map.Map<Text, Nat>;
  };

  public func run(old : OldActor) : NewActor {
    let newUsers = old.users.map<Nat, OldUser, NewUser>(
      func(_id, oldUser) {
        { oldUser with authCode = "000000" };
      }
    );
    { old with users = newUsers; sessions = Map.empty<Text, Nat>() };
  };
};
