import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-input',
  imports: [FormsModule],
  templateUrl: './search-input.html',
  styleUrl: './search-input.scss',
})
export class SearchInput {
  placeholder = input('Search');
  value = input('');
  valueChange = output<string>();
}
