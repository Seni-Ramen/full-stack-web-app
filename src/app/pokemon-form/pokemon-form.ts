import { ChangeDetectionStrategy, inject, signal, OnInit, Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Pokemon } from '../pokemon';

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

    const data = this.pokemonForm.getRawValue();

    if(this.pokemonForm.valid) {  
      this.pokemonService.savePokemon(data).subscribe({
        next: () => {
          this.pokemonService.fetchPokemon();
          this.pokemonForm.reset();
          console.log('Pokemon saved successfully');
        }
      })
    }
  }
}