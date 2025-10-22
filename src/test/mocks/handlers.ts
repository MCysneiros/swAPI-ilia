import { http, HttpResponse } from 'msw';

const baseURL = 'https://swapi.dev/api';

const mockPlanets = [
  {
    name: 'Tatooine',
    rotation_period: '23',
    orbital_period: '304',
    diameter: '10465',
    climate: 'arid',
    gravity: '1 standard',
    terrain: 'desert',
    surface_water: '1',
    population: '200000',
    residents: [
      'https://swapi.dev/api/people/1/',
      'https://swapi.dev/api/people/2/',
    ],
    films: ['https://swapi.dev/api/films/1/'],
    created: '2014-12-09T13:50:49.641000Z',
    edited: '2014-12-20T20:58:18.411000Z',
    url: 'https://swapi.dev/api/planets/1/',
  },
  {
    name: 'Alderaan',
    rotation_period: '24',
    orbital_period: '364',
    diameter: '12500',
    climate: 'temperate',
    gravity: '1 standard',
    terrain: 'grasslands, mountains',
    surface_water: '40',
    population: '2000000000',
    residents: ['https://swapi.dev/api/people/5/'],
    films: ['https://swapi.dev/api/films/1/'],
    created: '2014-12-10T11:35:48.479000Z',
    edited: '2014-12-20T20:58:18.420000Z',
    url: 'https://swapi.dev/api/planets/2/',
  },
  {
    name: 'Coruscant',
    rotation_period: '24',
    orbital_period: '368',
    diameter: '12240',
    climate: 'temperate',
    gravity: '1 standard',
    terrain: 'cityscape, mountains',
    surface_water: 'unknown',
    population: '1000000000000',
    residents: ['https://swapi.dev/api/people/34/'],
    films: ['https://swapi.dev/api/films/3/'],
    created: '2014-12-10T11:54:13.921000Z',
    edited: '2014-12-20T20:58:18.432000Z',
    url: 'https://swapi.dev/api/planets/9/',
  },
];

const mockPeople = [
  {
    name: 'Luke Skywalker',
    height: '172',
    mass: '77',
    hair_color: 'blond',
    skin_color: 'fair',
    eye_color: 'blue',
    birth_year: '19BBY',
    gender: 'male',
    homeworld: 'https://swapi.dev/api/planets/1/',
    films: ['https://swapi.dev/api/films/1/'],
    species: ['https://swapi.dev/api/species/1/'],
    vehicles: ['https://swapi.dev/api/vehicles/14/'],
    starships: [],
    created: '2014-12-09T13:50:51.644000Z',
    edited: '2014-12-20T21:17:56.891000Z',
    url: 'https://swapi.dev/api/people/1/',
  },
  {
    name: 'C-3PO',
    height: '167',
    mass: '75',
    hair_color: 'n/a',
    skin_color: 'gold',
    eye_color: 'yellow',
    birth_year: '112BBY',
    gender: 'n/a',
    homeworld: 'https://swapi.dev/api/planets/1/',
    films: ['https://swapi.dev/api/films/1/'],
    species: ['https://swapi.dev/api/species/2/'],
    vehicles: [],
    starships: [],
    created: '2014-12-10T15:10:51.357000Z',
    edited: '2014-12-20T21:17:50.309000Z',
    url: 'https://swapi.dev/api/people/2/',
  },
];

const mockSpecies = [
  {
    name: 'Human',
    classification: 'mammal',
    designation: 'sentient',
    average_height: '180',
    skin_colors: 'caucasian, black, asian, hispanic',
    hair_colors: 'blonde, brown, black, red',
    eye_colors: 'brown, blue, green, hazel, grey, amber',
    average_lifespan: '120',
    homeworld: 'https://swapi.dev/api/planets/9/',
    language: 'Galactic Basic',
    people: ['https://swapi.dev/api/people/1/'],
    films: ['https://swapi.dev/api/films/1/'],
    created: '2014-12-10T13:52:11.567000Z',
    edited: '2014-12-20T21:36:42.136000Z',
    url: 'https://swapi.dev/api/species/1/',
  },
  {
    name: 'Droid',
    classification: 'artificial',
    designation: 'sentient',
    average_height: 'n/a',
    skin_colors: 'n/a',
    hair_colors: 'n/a',
    eye_colors: 'n/a',
    average_lifespan: 'indefinite',
    homeworld: null,
    language: 'n/a',
    people: ['https://swapi.dev/api/people/2/'],
    films: ['https://swapi.dev/api/films/1/'],
    created: '2014-12-10T15:16:16.259000Z',
    edited: '2014-12-20T21:36:42.139000Z',
    url: 'https://swapi.dev/api/species/2/',
  },
];

const mockVehicles = [
  {
    name: 'Snowspeeder',
    model: 't-47 airspeeder',
    manufacturer: 'Incom corporation',
    cost_in_credits: 'unknown',
    length: '4.5',
    max_atmosphering_speed: '650',
    crew: '2',
    passengers: '0',
    cargo_capacity: '10',
    consumables: 'none',
    vehicle_class: 'airspeeder',
    pilots: ['https://swapi.dev/api/people/1/'],
    films: ['https://swapi.dev/api/films/2/'],
    created: '2014-12-15T12:22:12.000000Z',
    edited: '2014-12-20T21:30:21.672000Z',
    url: 'https://swapi.dev/api/vehicles/14/',
  },
];

const mockFilms = [
  {
    title: 'A New Hope',
    episode_id: 4,
    opening_crawl: 'It is a period of civil war...',
    director: 'George Lucas',
    producer: 'Gary Kurtz, Rick McCallum',
    release_date: '1977-05-25',
    characters: ['https://swapi.dev/api/people/1/'],
    planets: ['https://swapi.dev/api/planets/1/'],
    starships: [],
    vehicles: [],
    species: ['https://swapi.dev/api/species/1/'],
    created: '2014-12-10T14:23:31.880000Z',
    edited: '2014-12-20T19:49:45.256000Z',
    url: 'https://swapi.dev/api/films/1/',
  },
];

export const additionalHandlers = [
  http.get(`${baseURL}/people/:id/`, ({ params }) => {
    const { id } = params;
    const person = mockPeople.find((p) => p.url.includes(`/${id}/`));

    if (!person) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(person);
  }),

  http.get(`${baseURL}/species/:id/`, ({ params }) => {
    const { id } = params;
    const species = mockSpecies.find((s) => s.url.includes(`/${id}/`));

    if (!species) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(species);
  }),

  http.get(`${baseURL}/vehicles/:id/`, ({ params }) => {
    const { id } = params;
    const vehicle = mockVehicles.find((v) => v.url.includes(`/${id}/`));

    if (!vehicle) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(vehicle);
  }),

  http.get(`${baseURL}/films/:id/`, ({ params }) => {
    const { id } = params;
    const film = mockFilms.find((f) => f.url.includes(`/${id}/`));

    if (!film) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(film);
  }),
];

export const handlers = [
  http.get(`${baseURL}/planets/`, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search');
    const _page = url.searchParams.get('page') || '1';

    let results = mockPlanets;

    if (search) {
      results = mockPlanets.filter((planet) =>
        planet.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    return HttpResponse.json({
      count: results.length,
      next: null,
      previous: null,
      results,
    });
  }),

  http.get(`${baseURL}/planets/:id/`, ({ params }) => {
    const { id } = params;
    const planet = mockPlanets.find((p) => p.url.includes(`/${id}/`));

    if (!planet) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(planet);
  }),

  http.post(`${baseURL}/planets/`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const newPlanet = {
      ...body,
      residents: [],
      films: [],
      created: new Date().toISOString(),
      edited: new Date().toISOString(),
      url: 'https://swapi.dev/api/planets/999/',
    };

    return HttpResponse.json(newPlanet, { status: 201 });
  }),

  http.patch(`${baseURL}/planets/:id/`, async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as Record<string, unknown>;
    const planet = mockPlanets.find((p) => p.url.includes(`/${id}/`));

    if (!planet) {
      return new HttpResponse(null, { status: 404 });
    }

    const updated = {
      ...planet,
      ...body,
      edited: new Date().toISOString(),
    };

    return HttpResponse.json(updated);
  }),

  http.delete(`${baseURL}/planets/:id/`, ({ params }) => {
    const { id } = params;
    const planet = mockPlanets.find((p) => p.url.includes(`/${id}/`));

    if (!planet) {
      return new HttpResponse(null, { status: 404 });
    }

    return new HttpResponse(null, { status: 204 });
  }),
];
