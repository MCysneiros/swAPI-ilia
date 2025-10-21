import { http, HttpResponse } from 'msw';

const baseURL = 'https://swapi.dev/api';

// Mock data
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

export const handlers = [
  // Get all planets
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

  // Get planet by ID
  http.get(`${baseURL}/planets/:id/`, ({ params }) => {
    const { id } = params;
    const planet = mockPlanets.find((p) => p.url.includes(`/${id}/`));

    if (!planet) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(planet);
  }),

  // Create planet (mock)
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

  // Update planet (mock)
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

  // Delete planet (mock)
  http.delete(`${baseURL}/planets/:id/`, ({ params }) => {
    const { id } = params;
    const planet = mockPlanets.find((p) => p.url.includes(`/${id}/`));

    if (!planet) {
      return new HttpResponse(null, { status: 404 });
    }

    return new HttpResponse(null, { status: 204 });
  }),
];
