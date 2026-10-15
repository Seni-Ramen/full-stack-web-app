import { ChangeDetectionStrategy, inject, OnInit, Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Pokemon, PokemonRecord } from '../pokemon';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-pokemon-form',
  styleUrl: './pokemon-form.css',
  templateUrl: './pokemon-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PokemonForm implements OnInit {
  private formBuilder = inject(FormBuilder);
  pokemonService = inject(Pokemon);
  editingPokemon = signal<PokemonRecord | null>(null);

  pokemonForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    type: ['', Validators.required],
    level: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
    nature: ['', Validators.required]
  });

  ngOnInit() {
    this.pokemonService.fetchPokemon();
  }

  onSubmit() {
    if (this.pokemonForm.invalid) return;

    this.pokemonService.errorMessage.set(null);
    const formValue = this.pokemonForm.getRawValue();
    const data = { ...formValue, level: Number(formValue.level) };
    const editingPokemon = this.editingPokemon();
    const request = editingPokemon
      ? this.pokemonService.updatePokemon(editingPokemon._id, data)
      : this.pokemonService.savePokemon(data);

    request.subscribe({
      next: () => {
        this.pokemonForm.reset();
        this.editingPokemon.set(null);
        this.pokemonService.fetchPokemon();
      },
      error: () => {
        this.pokemonService.errorMessage.set(
          editingPokemon
            ? 'Could not update this Pokémon. Please try again.'
            : 'Could not save this Pokémon. Please try again.'
        );
      }
    });
  }

  editPokemon(pokemon: PokemonRecord): void {
    this.pokemonService.errorMessage.set(null);
    this.editingPokemon.set(pokemon);
    this.pokemonForm.patchValue({
      name: pokemon.name,
      type: pokemon.type,
      level: String(pokemon.level),
      nature: pokemon.nature
    });
  }

  cancelEdit(): void {
    this.editingPokemon.set(null);
    this.pokemonForm.reset();
    this.pokemonService.errorMessage.set(null);
  }

  deletePokemon(pokemon: PokemonRecord): void {
    const confirmed = window.confirm(`Release ${pokemon.name} from Gary's team? This cannot be undone.`);
    if (!confirmed) return;

    this.pokemonService.errorMessage.set(null);
    this.pokemonService.deletePokemon(pokemon._id).subscribe({
      next: () => this.pokemonService.fetchPokemon(),
      error: () => {
        this.pokemonService.errorMessage.set('Could not remove this Pokémon. Please try again.');
      }
    });
  }
}