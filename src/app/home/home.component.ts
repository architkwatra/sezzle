import { Component, HostListener, OnInit, SkipSelf } from '@angular/core';
import { BROWSER_STORAGE, BrowserStorageService } from '../browser-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [ BrowserStorageService,
    { provide: BROWSER_STORAGE, useFactory: () => sessionStorage }]
})
export class HomeComponent implements OnInit {

  constructor( @SkipSelf() private localStorageService: BrowserStorageService) { }

  @HostListener('window: storage', ['$event'])
  localStorageChange(event: Storage) {
    this.updateLocalStorage();
  }

  currentExpression: string = ""
  consolidate: string = "";
  content = new Array();
  expressionStack = new Array();
  operator: string = "";
  shouldSetCalc: boolean = false;
  num: string = "";
  calcStack = new Array();
  limit: number = 10;
  characterLimit: number = 20;
  showAlert: boolean = false;
  results: any = new Array();
  
  ngOnInit(): void {
    this.content = [["1","2","3","+"],["4","5","6","-"],["7","8","9","/"],["*","0","#","X"], ["C", "00", "=", "."]];
    if (this.checkLocalStorage()) {
      this.results = this.localStorageService.get("results").split(",");  
    }
  }

  handleClick(value: string) {
    if (this.expressionStack.length + this.num.length < this.characterLimit || value == "C") {
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
          this.num = "";
      } else if (value === "=") {
          if (this.num)  this.expressionStack.push(this.num);
            this.num = ""
            this.shouldSetCalc = true;
            this.calculate(this.expressionStack);
            return;
      } else {
        if ((value == "." && !isNaN(parseFloat(this.num[this.num.length - 1])) || !isNaN(parseFloat(value)))) 
          this.num += value;
      }
      this.consolidate = this.expressionStack.join(" ") + " " + this.num;
      this.currentExpression = this.consolidate;
    } else {
      this.showAlert = true;
    }
  }

  calculate(expressionStack) {
    let num1 = 0, sign = "+";
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
    this.postEvaluation();
  }

  updateLocalStorage() {

    if (this.checkLocalStorage()) {
      this.results = this.localStorageService.get('results').split(",");
    }
    
    if (this.results.length == this.limit && this.currentExpression != "") {
      this.results = this.results.splice(1, this.results.length);
    }

    if (this.currentExpression != "") {
      this.results.push(this.currentExpression);
    }
    
    let temp = this.results.join(",");
    if (temp[0] == ",") {
      temp = temp.splice(1, temp.length - 1);
    }
    this.localStorageService.set('results', temp);
    this.currentExpression = "";
  }

  postEvaluation() {
    this.consolidate = this.calcStack.reduce(function (a, b) {
      return a + b;
    }, 0);
    this.calcStack = [];
    this.expressionStack = [];
    this.currentExpression += " = " + this.consolidate;    
    this.updateLocalStorage();
  }
  
  closeAlert() {
    this.showAlert = false;
    this.expressionStack = [];
    this.showAlert = false;
    this.num = "0";
  }
  checkLocalStorage() {
    if (this.localStorageService.get('results') != null && this.localStorageService.get('results') != undefined)
      return true;
    return false;
  }
}

