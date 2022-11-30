import { Component, OnInit } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';

@Component({
  templateUrl: './game-controller.component.html',
  styleUrls: ['./game-controller.component.scss']
})
export class GameControllerComponent implements OnInit {

  player: string = ''
  eliminated = false;
  ws: any;
  sequence: string[] = [];
  showController = false;
  ready = false;

  constructor() { }

  ngOnInit(): void {
    this.ws = webSocket('ws://localhost:65/ws');
    this.ws.subscribe({
      next: (msg:any) => {
        if (msg.player === this.player && !msg.result) {
          this.eliminated = true
        }
        if (msg.getSequence) {
          this.ws.next({ message: {owner: this.player, sequence: this.sequence} });
        }
        if (msg.roundEnd) {
          this.sequence = []
          this.showController = false
        }
        if (msg.roundStart) {
          this.showController = true
        }
      }, // Called whenever there is a message from the server.
      error: (err:any) => console.log(err), // Called if at any point WebSocket API signals some kind of error.
      complete: () => console.log('complete') // Called when connection is closed (for whatever reason).
     });
  }

  addArrow(arrow: string) {
    this.sequence.push(arrow)
  }

  resetArrows() {
    this.sequence = []
  }

  removeLast() {
    this.sequence.splice(this.sequence.length - 1, 1)
  }

  imReady() {
    this.ready = true
  }
}
