import { Component, Input, OnInit, SkipSelf } from '@angular/core';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

  @Input() results: string[];

  constructor() { }

  ngOnInit(): void {
  }
}
