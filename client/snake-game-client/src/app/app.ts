import { Component, signal } from '@angular/core';
import { SnakeGameComponent } from './snake-game/snake-game.component';

@Component({
  selector: 'app-root',
  imports: [SnakeGameComponent],
  template: '<app-snake-game></app-snake-game>',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('snake-game-client');
}
