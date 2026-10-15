import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';

export interface PokemonRecord {
  _id: string;
  name: string;
  type: string;
  level: number;
  nature: string;
}

export interface PokemonDetails {
  name: string;
  type: string;
  level: number;
  nature: string;
}

@Injectable({
  providedIn: 'root'
})
export class Pokemon {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/pokemon';

  pokemonList = signal<PokemonRecord[]>([]);
  errorMessage = signal<string | null>(null);

  fetchPokemon(): void {
    this.http.get<PokemonRecord[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.pokemonList.set(data);
        this.errorMessage.set(null);
      },
      error: () => {
        this.errorMessage.set('Could not load Gary’s team. Check that the server is running and try again.');
      }
    });
  }

  savePokemon(data: PokemonDetails) {
    return this.http.post<PokemonRecord>(this.apiUrl, data);
  }

  updatePokemon(id: string, data: PokemonDetails) {
    return this.http.put<PokemonRecord>(`${this.apiUrl}/${id}`, data);
  }

  deletePokemon(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
