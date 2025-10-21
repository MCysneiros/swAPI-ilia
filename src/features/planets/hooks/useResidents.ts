import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants';
import { planetsApi } from '../api/planetsApi';

export interface ResidentDetails {
  name: string;
  hair_color: string;
  eye_color: string;
  gender: string;
  species: Array<{ name: string }>;
  vehicles: Array<{ name: string; model: string }>;
}

interface Species {
  name: string;
}

interface Vehicle {
  name: string;
  model: string;
}

async function fetchSpecies(url: string): Promise<Species> {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch species');
  return res.json();
}

async function fetchVehicle(url: string): Promise<Vehicle> {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch vehicle');
  return res.json();
}

async function fetchResidentWithDetails(url: string): Promise<ResidentDetails> {
  const resident = await planetsApi.getResidentByUrl(url);

  const [speciesData, vehiclesData] = await Promise.all([
    Promise.all(resident.species.map(fetchSpecies)),
    Promise.all(resident.vehicles.map(fetchVehicle)),
  ]);

  return {
    name: resident.name,
    hair_color: resident.hair_color,
    eye_color: resident.eye_color,
    gender: resident.gender,
    species: speciesData,
    vehicles: vehiclesData,
  };
}

export function useResidents(residentUrls: string[]) {
  return useQuery({
    queryKey: queryKeys.residents.byUrl(residentUrls.join(',')),
    queryFn: async () => {
      if (residentUrls.length === 0) return [];
      return Promise.all(residentUrls.map(fetchResidentWithDetails));
    },
    enabled: residentUrls.length > 0,
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  });
}
