import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  players: string [] = ['Gustavo','Gustavo','Gustavo','Gustavo','Gustavo','Gustavo','Gustavo','Gustavo','Gustavo','Gustavo','Gustavo','Gustavo',]

  constructor() { }

  ngOnInit(): void {
  }

}
