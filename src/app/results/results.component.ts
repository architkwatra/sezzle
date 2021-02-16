import { Component, Input, OnInit, SkipSelf } from '@angular/core';
import { BROWSER_STORAGE, BrowserStorageService } from '../browser-storage.service';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
  providers: [ BrowserStorageService,
    { provide: BROWSER_STORAGE, useFactory: () => sessionStorage }]
})
export class ResultsComponent implements OnInit {

  @Input() results: string[];

  constructor(@SkipSelf() private localStorageService: BrowserStorageService, private globalService: GlobalService) { }

  ngOnInit(): void {
    this.updateData();
  }

  updateData() {
    this.globalService.checkLocalStorageUpdate.subscribe( data =>  {
      if (data)
        this.results = this.localStorageService.get('results').split(",");
      console.log(this.results);
    });

  }

}
