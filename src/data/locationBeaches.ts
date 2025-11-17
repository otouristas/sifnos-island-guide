export interface NearbyBeach {
  name: string;
  distance: number; // in km
  type: 'sandy' | 'pebble' | 'mixed';
  accessDifficulty: 'easy' | 'moderate' | 'difficult';
  organized: boolean;
  slug?: string;
}

export interface LocationBeaches {
  locationSlug: string;
  beaches: NearbyBeach[];
}

export const locationBeachesMapping: LocationBeaches[] = [
  {
    locationSlug: 'kamares',
    beaches: [
      {
        name: 'Kamares Beach',
        distance: 0,
        type: 'sandy',
        accessDifficulty: 'easy',
        organized: true,
        slug: 'kamares'
      },
      {
        name: 'Chrysopigi',
        distance: 8,
        type: 'sandy',
        accessDifficulty: 'easy',
        organized: true,
        slug: 'chrysopigi'
      },
      {
        name: 'Vroulidia',
        distance: 12,
        type: 'pebble',
        accessDifficulty: 'moderate',
        organized: false,
        slug: 'vroulidia'
      }
    ]
  },
  {
    locationSlug: 'platis-gialos',
    beaches: [
      {
        name: 'Platis Gialos',
        distance: 0,
        type: 'sandy',
        accessDifficulty: 'easy',
        organized: true,
        slug: 'platis-gialos'
      },
      {
        name: 'Fasolou',
        distance: 2,
        type: 'sandy',
        accessDifficulty: 'easy',
        organized: false,
        slug: 'fasolou'
      },
      {
        name: 'Vathi',
        distance: 5,
        type: 'sandy',
        accessDifficulty: 'easy',
        organized: true,
        slug: 'vathi'
      },
      {
        name: 'Fykiada',
        distance: 3,
        type: 'sandy',
        accessDifficulty: 'difficult',
        organized: false,
        slug: 'fykiada'
      }
    ]
  },
  {
    locationSlug: 'apollonia',
    beaches: [
      {
        name: 'Kamares',
        distance: 5,
        type: 'sandy',
        accessDifficulty: 'easy',
        organized: true,
        slug: 'kamares'
      },
      {
        name: 'Platis Gialos',
        distance: 8,
        type: 'sandy',
        accessDifficulty: 'easy',
        organized: true,
        slug: 'platis-gialos'
      },
      {
        name: 'Chrysopigi',
        distance: 6,
        type: 'sandy',
        accessDifficulty: 'easy',
        organized: true,
        slug: 'chrysopigi'
      },
      {
        name: 'Vroulidia',
        distance: 10,
        type: 'pebble',
        accessDifficulty: 'moderate',
        organized: false,
        slug: 'vroulidia'
      }
    ]
  },
  {
    locationSlug: 'vathi',
    beaches: [
      {
        name: 'Vathi',
        distance: 0,
        type: 'sandy',
        accessDifficulty: 'easy',
        organized: true,
        slug: 'vathi'
      },
      {
        name: 'Platis Gialos',
        distance: 5,
        type: 'sandy',
        accessDifficulty: 'easy',
        organized: true,
        slug: 'platis-gialos'
      },
      {
        name: 'Fykiada',
        distance: 2,
        type: 'sandy',
        accessDifficulty: 'difficult',
        organized: false,
        slug: 'fykiada'
      },
      {
        name: 'Fasolou',
        distance: 4,
        type: 'sandy',
        accessDifficulty: 'easy',
        organized: false,
        slug: 'fasolou'
      }
    ]
  },
  {
    locationSlug: 'faros',
    beaches: [
      {
        name: 'Faros',
        distance: 0,
        type: 'sandy',
        accessDifficulty: 'easy',
        organized: true,
        slug: 'faros'
      },
      {
        name: 'Chrysopigi',
        distance: 1,
        type: 'sandy',
        accessDifficulty: 'easy',
        organized: true,
        slug: 'chrysopigi'
      },
      {
        name: 'Vroulidia',
        distance: 3,
        type: 'pebble',
        accessDifficulty: 'moderate',
        organized: false,
        slug: 'vroulidia'
      }
    ]
  },
  {
    locationSlug: 'kastro',
    beaches: [
      {
        name: 'Kamares',
        distance: 4,
        type: 'sandy',
        accessDifficulty: 'easy',
        organized: true,
        slug: 'kamares'
      },
      {
        name: 'Chrysopigi',
        distance: 5,
        type: 'sandy',
        accessDifficulty: 'easy',
        organized: true,
        slug: 'chrysopigi'
      },
      {
        name: 'Vroulidia',
        distance: 8,
        type: 'pebble',
        accessDifficulty: 'moderate',
        organized: false,
        slug: 'vroulidia'
      }
    ]
  },
  {
    locationSlug: 'artemonas',
    beaches: [
      {
        name: 'Kamares',
        distance: 4,
        type: 'sandy',
        accessDifficulty: 'easy',
        organized: true,
        slug: 'kamares'
      },
      {
        name: 'Chrysopigi',
        distance: 5,
        type: 'sandy',
        accessDifficulty: 'easy',
        organized: true,
        slug: 'chrysopigi'
      },
      {
        name: 'Platis Gialos',
        distance: 7,
        type: 'sandy',
        accessDifficulty: 'easy',
        organized: true,
        slug: 'platis-gialos'
      }
    ]
  }
];

export function getBeachesByLocation(locationSlug: string): NearbyBeach[] {
  const locationBeaches = locationBeachesMapping.find(
    (lb) => lb.locationSlug === locationSlug
  );
  return locationBeaches?.beaches || [];
}

