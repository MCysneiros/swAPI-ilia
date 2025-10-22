import { test as base, expect } from '@playwright/test';
import {
  mockPlanets,
  mockPeople,
  mockSpecies,
  mockVehicles,
  mockFilms,
} from '../src/test/mocks/mock-data';

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route('**/api/planets/', async (route) => {
      const url = new URL(route.request().url());
      const search = url.searchParams.get('search');
      const pageParam = url.searchParams.get('page') || '1';
      const pageNumber = parseInt(pageParam, 10);
      const pageSize = 10;

      let results = [...mockPlanets].sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      if (search) {
        results = results.filter((planet) =>
          planet.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      const totalCount = results.length;
      const startIndex = (pageNumber - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedResults = results.slice(startIndex, endIndex);
      const hasNext = endIndex < totalCount;
      const hasPrevious = pageNumber > 1;

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          count: totalCount,
          next: hasNext
            ? `https://swapi.dev/api/planets/?page=${pageNumber + 1}`
            : null,
          previous: hasPrevious
            ? `https://swapi.dev/api/planets/?page=${pageNumber - 1}`
            : null,
          results: paginatedResults,
        }),
      });
    });

    await page.route('**/api/planets/*/', async (route) => {
      const url = route.request().url();
      const match = url.match(/\/planets\/(\d+)\//);

      if (match) {
        const id = match[1];
        const planet = mockPlanets.find((p) => p.url.includes(`/${id}/`));

        if (planet) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(planet),
          });
        } else {
          await route.fulfill({ status: 404 });
        }
      } else {
        await route.continue();
      }
    });

    await page.route('**/api/people/*/', async (route) => {
      const url = route.request().url();
      const match = url.match(/\/people\/(\d+)\//);

      if (match) {
        const id = match[1];
        const person = mockPeople.find((p) => p.url.includes(`/${id}/`));

        if (person) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(person),
          });
        } else {
          await route.fulfill({ status: 404 });
        }
      } else {
        await route.continue();
      }
    });

    await page.route('**/api/species/*/', async (route) => {
      const url = route.request().url();
      const match = url.match(/\/species\/(\d+)\//);

      if (match) {
        const id = match[1];
        const species = mockSpecies.find((s) => s.url.includes(`/${id}/`));

        if (species) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(species),
          });
        } else {
          await route.fulfill({ status: 404 });
        }
      } else {
        await route.continue();
      }
    });

    await page.route('**/api/vehicles/*/', async (route) => {
      const url = route.request().url();
      const match = url.match(/\/vehicles\/(\d+)\//);

      if (match) {
        const id = match[1];
        const vehicle = mockVehicles.find((v) => v.url.includes(`/${id}/`));

        if (vehicle) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(vehicle),
          });
        } else {
          await route.fulfill({ status: 404 });
        }
      } else {
        await route.continue();
      }
    });

    await page.route('**/api/films/*/', async (route) => {
      const url = route.request().url();
      const match = url.match(/\/films\/(\d+)\//);

      if (match) {
        const id = match[1];
        const film = mockFilms.find((f) => f.url.includes(`/${id}/`));

        if (film) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(film),
          });
        } else {
          await route.fulfill({ status: 404 });
        }
      } else {
        await route.continue();
      }
    });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(page);
  },
});

export { expect };
