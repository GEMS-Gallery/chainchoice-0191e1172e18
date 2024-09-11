import Func "mo:base/Func";
import Hash "mo:base/Hash";
import Option "mo:base/Option";
import Result "mo:base/Result";

import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Iter "mo:base/Iter";

actor VotingWebsite {
    // Define the options for each dimension
    private let logoOptions = ["Bitcoin with ICP Logo", "Purple cK Bitcoin Logo"];
    private let namingOptions = ["ckBitcoin", "Bitcoin (cK)", "Chain Key Bitcoin"];
    private let groupingOptions = ["Assets listed as standalone", "ckAssets grouped under their underlying native asset"];

    // Create HashMaps to store votes for each dimension
    private var logoVotes = HashMap.HashMap<Text, Nat>(2, Text.equal, Text.hash);
    private var namingVotes = HashMap.HashMap<Text, Nat>(3, Text.equal, Text.hash);
    private var groupingVotes = HashMap.HashMap<Text, Nat>(2, Text.equal, Text.hash);

    // Initialize vote counts
    private func initVotes() {
        for (option in logoOptions.vals()) {
            logoVotes.put(option, 0);
        };
        for (option in namingOptions.vals()) {
            namingVotes.put(option, 0);
        };
        for (option in groupingOptions.vals()) {
            groupingVotes.put(option, 0);
        };
    };
    initVotes();

    // Function to cast a vote
    public func vote(logo: Text, naming: Text, grouping: Text) : async Text {
        switch (logoVotes.get(logo), namingVotes.get(naming), groupingVotes.get(grouping)) {
            case (?logoCount, ?namingCount, ?groupingCount) {
                logoVotes.put(logo, logoCount + 1);
                namingVotes.put(naming, namingCount + 1);
                groupingVotes.put(grouping, groupingCount + 1);
                "Vote recorded successfully!"
            };
            case _ {
                "Invalid options provided. Please check your choices and try again."
            };
        };
    };

    // Function to get voting results
    public query func getResults() : async Text {
        func mapToArray(map: HashMap.HashMap<Text, Nat>) : [(Text, Nat)] {
            Iter.toArray(map.entries())
        };

        let logoResults = mapToArray(logoVotes);
        let namingResults = mapToArray(namingVotes);
        let groupingResults = mapToArray(groupingVotes);

        // Convert results to JSON string manually
        var json = "{";
        json #= "\"logo\":[" # Text.join(",", Iter.map(logoResults.vals(), encodeResult)) # "]";
        json #= ",\"naming\":[" # Text.join(",", Iter.map(namingResults.vals(), encodeResult)) # "]";
        json #= ",\"grouping\":[" # Text.join(",", Iter.map(groupingResults.vals(), encodeResult)) # "]";
        json #= "}";

        json
    };

    // Helper function to encode a single result as JSON
    private func encodeResult(item: (Text, Nat)) : Text {
        "{\"option\":\"" # item.0 # "\",\"votes\":" # Nat.toText(item.1) # "}"
    };
};
