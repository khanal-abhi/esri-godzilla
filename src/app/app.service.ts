import { Injectable} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
export enum eClickEvents {
    WhiteBlankScreen, NonLoadedTiles, InfiniteMemoryLoop, Reset
}

@Injectable()
export class AppService {
    public clickEvent: BehaviorSubject<eClickEvents> = new BehaviorSubject<eClickEvents>(null);
}
