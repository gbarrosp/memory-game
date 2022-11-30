import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sequence',
  templateUrl: './sequence.component.html',
  styleUrls: ['./sequence.component.scss']
})
export class SequenceComponent implements OnInit {

  @Input() size!: number;
  @Output() sequence = new EventEmitter<string[]>();

  arrowOptions = ['arrow_back', 'arrow_forward','arrow_upward','arrow_downward']
  arrows: string[] = []

  constructor() { }

  ngOnInit(): void {
    for (let i = 0; i<= this.size; i++) {
      let arrow = this.arrowOptions[Math.floor(Math.random() * (4))]
      this.arrows.push(arrow)
    }
    this.sequence.emit(this.arrows)
  }

}
