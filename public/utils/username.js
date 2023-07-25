const generateUsername = () => {
  const adjectives = [
    "Starlight",
    "Galaxy",
    "Nova",
    "Cosmo",
    "Astro",
    "Orion",
    "Nebula",
    "Stardust",
    "Lunar",
    "Solar",
    "Celestial",
    "Astrum",
    "Supernova",
    "Comet",
    "Spectre",
    "Sputnik",
    "Quasar",
    "Pulsar",
    "Zephyr",
    "Aurora",
    "Vortex",
    "Zero-G",
    "Infinity",
    "Eclipse",
    "Cosmic",
    "Zenith",
    "Jupiter",
    "Nimbus",
    "Pluto",
    "Cygnus",
    "Cosmonaut",
    "Voyager",
    "Astrotron",
    "Hyperion",
    "Andromeda",
    "Apollo",
    "Astrofox",
    "Luminex",
    "Spock",
    "Leia",
    "Neo",
    "Gandalf",
    "Frodo",
    "Darth",
    "Rey",
    "Picard",
    "Kirk",
    "Ripley",
    "Skywalker",
    "Morpheus",
    "Xena",
    "Zorro",
    "Trinity",
    "Luke",
    "Obi-Wan",
    "Vader",
    "Yoda",
    "Solo",
    "Scully",
    "Mulder",
    "Hermione",
    "Tyrion",
    "Katniss",
    "Hannibal",
    "Rorschach",
    "Marty",
    "Doc",
    "EllenRipley",
    "Sherlock",
    "Wolverine",
    "Voldemort",
    "Gollum",
  ];
  const nouns = [
    "Star",
    "Comet",
    "Astronaut",
    "Galaxy",
    "Spaceship",
    "Supernova",
    "Meteor",
    "Satellite",
    "Lunar",
    "Nebula",
    "Asteroid",
    "Spectre",
    "Cosmos",
    "Planet",
    "Solar",
    "Stardust",
    "Celestial",
    "Orbit",
    "Zephyr",
    "Nimbus",
    "Quasar",
    "Pulsar",
    "Cybertron",
    "Zenith",
    "Nexus",
    "Sputnik",
    "Astrofox",
    "Nyx",
    "Eclipse",
    "Jupiter",
    "Nucleus",
    "Galaxia",
    "Nemesis",
    "Nyx",
    "Venus",
    "Phoenix",
    "Hyperion",
    "Andromeda",
    "Pluto",
    "Infinity",
    "Cosmonaut",
    "Astrotron",
    "Voyager",
    "Cygnus",
    "Frodo",
    "Dobby",
    "R2D2",
    "Terminator",
    "Dumbledore",
    "Waldo",
    "Gollum",
    "Sherlock",
    "Wolverine",
    "Voldemort",
    "Hobbit",
    "Cyborg",
    "Jedi",
    "NinjaTurtle",
    "Ghostbuster",
    "Pirate",
    "Sith",
    "Hobbit",
    "Hannibal",
    "Joker",
    "Wookie",
    "Padawan",
    "Droid",
    "Thundercat",
    "Hawkeye",
    "Aragorn",
    "Xena",
    "Zorro",
    "Trinity",
    "Luke",
    "Morpheus",
    "Neo",
    "Superman",
    "Batman",
    "WonderWoman",
    "Hermione",
  ];

  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

  return [randomAdjective, randomNoun];
};
