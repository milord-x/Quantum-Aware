import type { WordlistDescriptor } from "./types";

const commonWords = [
  "amber", "anchor", "apricot", "atlas", "aurora", "badger", "bamboo", "barley", "beacon", "birch",
  "breeze", "cactus", "canopy", "carbon", "cedar", "cipher", "clover", "comet", "coral", "cosmos",
  "cricket", "crystal", "delta", "ember", "falcon", "fern", "fjord", "fossil", "galaxy", "garden",
  "glacier", "harbor", "hazel", "helium", "horizon", "island", "ivory", "jasmine", "jupiter", "lantern",
  "lavender", "ledger", "lemon", "lotus", "lunar", "maple", "meadow", "meteor", "mint", "nebula",
  "nectar", "nickel", "north", "oasis", "onyx", "opal", "orbit", "orchid", "otter", "pebble",
  "pepper", "phoenix", "pine", "planet", "pluto", "prairie", "quartz", "quill", "radar", "raven",
  "reef", "river", "robin", "saffron", "sage", "saturn", "scarlet", "shadow", "silver", "solar",
  "spruce", "stone", "summit", "sunset", "tiger", "timber", "topaz", "vector", "violet", "walnut",
  "willow", "winter", "zephyr", "zinc", "brook", "cinder", "cobalt", "drift", "elm", "signal"
];

export const defaultWordlist: WordlistDescriptor = {
  id: "default-100",
  label: "Default 100-word list",
  words: commonWords
};
