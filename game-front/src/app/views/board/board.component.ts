import { Component, OnInit } from '@angular/core';
import { take, timer } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';

@Component({
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  players: string [] = ['Gustavo','MC','Gustavo','Gustavo','Gustavo','Gustavo','Gustavo','Gustavo','Gustavo','Gustavo','Gustavo','Gustavo']
  playersQualified: string [] = ['Gustavo']

  gameRunning: boolean = false;
  countdown: number = 5;
  sequenceTime: number = 5;
  displayAlert: boolean = false;
  displayCountdown: boolean = false;
  displaySequence: boolean = false;
  alertMessage: string = '';
  displayResults: boolean = false;
  sequence: string[] = [];
  ws: any;

  constructor() { }

  ngOnInit(): void {
    this.ws = webSocket('ws://localhost:65/ws');
    this.ws.subscribe({
      next: (msg:any) => {
        if (msg.player && msg.result) {
          this.playersQualified.push(msg.player)
        }
      }, // Called whenever there is a message from the server.
      error: (err:any) => console.log(err), // Called if at any point WebSocket API signals some kind of error.
      complete: () => console.log('complete') // Called when connection is closed (for whatever reason).
     });

  }

  roundStart() {
    this.gameRunning = true
    this.displayCountdown = true
    this.ws.next({ message: {owner: 'board', sequence: [1]} });
    const source = timer(1000, 1000).pipe(take(this.countdown));
    const subscribe = source.subscribe(val => {
      this.countdown -= 1
      if (this.countdown === 0) {
        this.countdown = 5
        this.displayCountdown = false
        this.showAlert()
      }
    });
  }

  showAlert() {
    this.displayAlert = true
    this.alertMessage = 'Decore a sequência!'
    let alertTime = 2
    const source = timer(1000, 1000).pipe(take(2));
    const subscribe = source.subscribe(val => {
      alertTime -= 1
      if (alertTime === 0) {
        this.displayAlert = false
        this.showSequence()
      }
    });
  }

  showSequence() {
    this.displaySequence = true
    let newSequenceTime = this.sequenceTime + 1
    const source = timer(1000, 1000).pipe(take(this.sequenceTime));
    const subscribe = source.subscribe(val => {
      this.sequenceTime -= 1
      if (this.sequenceTime === 0) {
        this.sequenceTime = newSequenceTime
        this.displaySequence = false
        this.awaitSequences()
      }
    });
  }

  awaitSequences() {
    this.playersQualified = []
    this.displayAlert = true
    this.alertMessage = 'Envie sua sequência!'
    let alertTime = 10
    const source = timer(1000, 1000).pipe(take(alertTime));
    const subscribe = source.subscribe(val => {
      alertTime -= 1
      if (alertTime === 0) {
        this.displayAlert = false
        this.showResults()
        this.ws.next({ message: {owner: 'board', sequence: this.sequence} });
      }
    });
  }

  showResults() {
    this.ws.next({ message: {owner: 'board', sequence: [1, 2]} });
    this.displayResults = true
    let alertTime = 10
    const source = timer(1000, 1000).pipe(take(alertTime));
    const subscribe = source.subscribe(val => {
      alertTime -= 1
      if (alertTime === 0) {
        this.displayResults = false
        this.roundStart()
      }
    });
  }

  playerPassed(player: string) {
    return this.playersQualified.includes(player)
  }

  lastSequence(sequence: string[]) {
    this.sequence = sequence
  }
}
