import { Component } from '@angular/core';
import { AppService, eClickEvents } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private _appService: AppService) {}

  title = 'app';

  whiteBlankClicked() {
    this._appService.clickEvent.next(eClickEvents.WhiteBlankScreen);
  }

  nonLoadedClicked() {
    this._appService.clickEvent.next(eClickEvents.NonLoadedTiles);
  }

  infiniteMemoryClicked() {
    this._appService.clickEvent.next(eClickEvents.InfiniteMemoryLoop);
  }

  ResetClicked() {
    this._appService.clickEvent.next(eClickEvents.Reset);
  }
}
