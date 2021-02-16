import { Component, HostListener, OnInit, SkipSelf } from '@angular/core';
import { BROWSER_STORAGE, BrowserStorageService } from '../browser-storage.service';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [ BrowserStorageService,
    { provide: BROWSER_STORAGE, useFactory: () => sessionStorage }]
})
export class HomeComponent implements OnInit {

  constructor( @SkipSelf() private localStorageService: BrowserStorageService, private globalService: GlobalService) { }

  @HostListener('window: storage', ['$event'])
  localStorageChange(event: Storage) {
    console.log("WWWWWWWWWWWWWWWWWWWWWWWWWW", event);
    this.updateLocalStorage();

  } 

  currentExpression = ""
  consolidate = "0";
  content = [];
  expressionStack = [];
  operator = "";
  shouldSetCalc = false;
  num = "";
  calcStack = []
  limit = 11;
  showAlert = false;
  results: any =  [];
  
  ngOnInit(): void {
    this.content = [["1","2","3","+"],["4","5","6","-"],["7","8","9","/"],["*","0","#","X"], ["C", "<-", "=", "."]];
    // this.localStorageService.set('results', "");
    this.results = this.localStorageService.get("results").split(",");
  
  }
  handleClick(value: string) {

    if (this.expressionStack.length + this.num.length < 11 || value == "C") {

      if (this.shouldSetCalc) {
        this.expressionStack = [];
        this.consolidate = "";
        this.shouldSetCalc = false;
      }

      if ("+-X/".indexOf(value) > -1) {
        if ((this.expressionStack && !isNaN(parseFloat(this.expressionStack[this.expressionStack.length - 1])) || this.num)) {
          this.expressionStack.push(this.num);
          this.num = "";
          this.expressionStack.push(value);
        }       
      } else if (value == "C") {
        this.expressionStack = [];
        this.showAlert = false;
        this.num = "0";
      } else if (value === "=") {
        if (this.num) 
          this.expressionStack.push(this.num);
        this.num = ""
        this.shouldSetCalc = true;
        this.calculate(this.expressionStack);
        return;
      } else {
        this.num += value;
      }
      this.consolidate = this.expressionStack.join(" ") + this.num;
      this.currentExpression = this.consolidate;
    } else {
      this.showAlert = true;
    }
  }

  calculate(expressionStack) {
    let num1 = 0,i = 0;
    let sign = "+";
    
    this.results = "";
    for (let i = 0; i < expressionStack.length; i++) {
      let n = expressionStack[i];
      if (!isNaN(parseFloat(n)))
        num1 = parseFloat(n);
      if (isNaN(parseFloat(n)) || (i == this.expressionStack.length - 1)) {
      
        if (sign == "+") 
          this.calcStack.push(num1);
        else if (sign == "-")
          this.calcStack.push(-num1);
        else if (sign == "/")
          this.calcStack.push((parseFloat(this.calcStack.pop()) / num1));
        else if (sign == "X")
          this.calcStack.push(num1 * (parseFloat(this.calcStack.pop())));

          num1 = 0;
          sign = n;
      }
    }

    this.consolidate = this.calcStack.reduce(function (a, b) {
      return a + b;
    }, 0);
    this.calcStack = [];
    this.expressionStack = [];
    this.currentExpression += " = " + this.consolidate;
    
    this.updateLocalStorage();
  }

  updateLocalStorage() {

    this.results = this.localStorageService.get('results').split(",");
    
    if (this.results.length > 9) {
      this.results = this.results.splice(this.results.length-9, this.results.length-1);
    }

    if (this.currentExpression)
      this.results.push(this.currentExpression);
    this.localStorageService.set('results', this.results.join(","));
    this.currentExpression = "";
    
  }
  closeAlert() {
    this.showAlert = false;
    this.expressionStack = [];
    this.showAlert = false;
    this.num = "0";
  }
}
