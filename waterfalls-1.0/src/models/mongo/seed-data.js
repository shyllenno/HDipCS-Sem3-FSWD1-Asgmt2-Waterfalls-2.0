export const seedData = {
  users: {
    _model: "Users",
    homer: {
      firstName: "Homer",
      lastName: "Simpson",
      email: "homer@simpson.com",
      password: "secret",
    },
    marge: {
      firstName: "Marge",
      lastName: "Simpson",
      email: "marge@simpson.com",
      password: "secret",
    },
    bart: {
      firstName: "Bart",
      lastName: "Simpson",
      email: "bart@simpson.com",
      password: "secret",
    },
  },
  waterfalls: {
    _model: "Waterfalls",
    powerscourt: {
      name: "Powerscourt Waterfall",
      description: "Powerscourt Waterfall in Wicklow",
      latitude: 53.1911,
      longitude: -6.1178,
      userid: "->users.homer",
    },
    iguazu: {
      name: "Iguazu Falls",
      description: "Iguazu Falls is located on the border of Argentina and Brazil.",
      latitude: -25.6953,
      longitude: -54.4367,
      userid: "->users.marge",
    },
    niagara: {
      name: "Niagara Falls",
      description: "Niagara Falls is located on the border of the United States and Canada.",
      latitude: 43.0799,
      longitude: -79.0747,
      userid: "->users.bart",
    },
    victoria: {
      name: "Victoria Falls",
      description: "Victoria Falls is located on the border of Zambia and Zimbabwe.",
      latitude: -17.9243,
      longitude: 25.8567,
      userid: "->users.marge",
    },
  },
  POIs: {
    _model: "POIs",
    powerscourtHouse: {
      type: "Powerscourt House & Gardens",
      description: "Beautiful gardens",
      latitude: 53.1911,
      longitude: -6.1178,
      waterfallid: "->waterfalls.powerscourt",
    },

    attractionGargantaDoDiabo: {
      type: "Attraction",
      description: "The Garganta do Diabo (Devil’s Throat): Location: Accessible from both sides, but superior from Argentina. Type: Natural Feature.",
      latitude: -25.6953,
      longitude: -54.4367,
      waterfallid: "->waterfalls.iguazu",
    },
    hospitalDraMarta: {
      type: "Hospital",
      description: "Hospital Dra. Marta T. Schwarz (Puerto Iguazú, Argentina): Location: Av. Victoria Aguirre 131, Puerto Iguazú. Hours: Open 24 hours. Type: Public Hospital.",
      latitude: -25.5971159,
      longitude: -54.5778447,
      waterfallid: "->waterfalls.iguazu",
    },
    restaurantLaRueda: {
      type: "Restaurant",
      description: "La Rueda 1975 (Puerto Iguazú, Argentina): Location: Av. Victoria Aguirre 1975, Puerto Iguazú. Hours: 12:00 PM - 11:00 PM. Type: Casual Dining.",
      latitude: -25.5958,
      longitude: -54.5772,
      waterfallid: "->waterfalls.iguazu",
    },
  },
};
