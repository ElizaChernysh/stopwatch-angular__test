import { Injectable } from "@angular/core";
import {
  Observable,
  timer,
  BehaviorSubject,
  Subscription
} from "rxjs";
import { map } from "rxjs/operators";
import { StopWatch } from "./stopwatch.interface";

@Injectable({
  providedIn: "root"
})
export class TimeService {
  private readonly initialTime = 0;

  private timer$: BehaviorSubject<number> = new BehaviorSubject(
    this.initialTime
  );
  private lastStopedTime: number = this.initialTime;
  private timerSubscription: Subscription = new Subscription();
  private isRunning: boolean = false;
  private intervalSec = 0;

  constructor() {}

  public get stopWatch$(): Observable<StopWatch> {
    return this.timer$.pipe(
      map((seconds: number): StopWatch => this.secondsToStopWatch(seconds))
    );
  }

  startCount(): void {
    if (this.isRunning) {
      return;
    }
    this.timerSubscription = timer(0, 1000).pipe(map((value: number): number => value + this.lastStopedTime)).subscribe(this.timer$);
    this.isRunning = true;
  }

  stopTimer(): void {
    this.lastStopedTime = this.timer$.value;
    // console.log(`it is lastStopedtime${this.timer$.value}`);
    this.timerSubscription.unsubscribe();
    this.isRunning = false;
  }


  resetTimer(): void {
    this.timerSubscription.unsubscribe();
    this.lastStopedTime = this.initialTime;
    this.timer$.next(this.initialTime);
    this.isRunning = false;
  }

  private secondsToStopWatch(timeValue: number): StopWatch {
    let mainNotification = '';
    const firstNotification = 'Go ahead!';
    const limitNotification = 'An hour has passed, you can start the stopwatch again!';

    this.intervalSec = timeValue;
    const seconds = this.intervalSec % 60;
    const minutes = Math.floor(timeValue / 60);

    if (timeValue === 3599) {
      mainNotification = limitNotification;
      this.lastStopedTime = this.initialTime;
      this.timerSubscription.unsubscribe();
      this.isRunning = false;
    } else {
      mainNotification = firstNotification;
    }

    return {
      mainNotification: mainNotification,
      minutes: this.convertToNumberString(minutes),
      seconds: this.convertToNumberString(seconds),
    };
  }

  private convertToNumberString(value: number): string {
    return `${value < 10 ? "0" + value : value}`;
  }
}
