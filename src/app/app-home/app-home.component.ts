import { Component } from '@angular/core';

@Component({
  selector: 'app-app-home',
  templateUrl: './app-home.component.html',
  styleUrls: ['./app-home.component.scss']
})
export class AppHomeComponent {
  selectedLanguage: string = '';
  isLanguageMenuOpen: boolean = false;
  searchQuery: string = '';

  changeLanguage(languageCode: string): void {
    // Implement language change logic here
    this.selectedLanguage = languageCode;
    this.hideLanguageMenu(); // Hide the language menu when a language is selected
  }

  showLanguageMenu(): void {
    this.isLanguageMenuOpen = true;
  }

  hideLanguageMenu(): void {
    this.isLanguageMenuOpen = false;
  }

  performSearch(): void {
    // Implement your search logic here
  }
}