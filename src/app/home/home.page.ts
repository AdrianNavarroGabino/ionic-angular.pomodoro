import { Component } from '@angular/core';
import { AlertController, PickerController } from '@ionic/angular';
import { now } from '@ionic/core/dist/types/utils/helpers';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public timer: number = 25;
  public currentMinutes: string;
  public currentSeconds: string;
  public start: Date;
  private intervalId: any;

  constructor(private pickerCtrl: PickerController, private alertController: AlertController) {}

  ngOnInit() {
    const start = localStorage.getItem("start");
    
    if(start) {
      this.start = new Date(start);
      if(((new Date()).getTime() - this.start.getTime()) / 1000 / 60 > 25) {
        localStorage.removeItem("start");
        this.start = null;
      }
      else {
        this.playPomodoro();
      }
    }
  }

  pomodoro() {
    if(!this.start) {
      localStorage.setItem("start", (new Date()).toString());
      this.start = new Date();
      this.currentMinutes = (this.timer - 1).toString().padStart(2, "0");
      this.currentSeconds = "59";
      this.playPomodoro();
    }
  }

  async playPomodoro() {
    this.intervalId = setInterval(() => {
      this.calculateTime();
    }, 1000);
  }

  calculateTime() {
    const now = new Date();
    this.currentMinutes = ((this.timer - ((now.getTime() - this.start.getTime()) / 1000 / 60) | 0)).toString().padStart(2, "0");
    this.currentSeconds = ((60 - ((now.getTime() - this.start.getTime()) / 1000 % 60) | 0)).toString().padStart(2, "0");
  }

  async openPicker() {
    const picker = await this.pickerCtrl.create({
      columns: [
        {
          name: 'timer',
          options: [
            {
              text: '25 minutes',
              value: '25',
            },
            {
              text: '15 minutes',
              value: '15',
            },
            {
              text: '5 minutes',
              value: '5',
            }
          ]
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Confirm',
          handler: (value) => {
            this.timer = value.timer.value;
          },
        },
      ],
    });

    await picker.present();
  }

  stopTimer(event) {
    event.preventDefault();
    this.presentAlert();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Stop timer',
      message: 'Would you like to stop the timer?',
      buttons: [
        {
          text: 'Yes',
          handler: () => this.clearTime()
        },
        {
          text: 'No'
        }
      ]
    });

    await alert.present();
  }

  clearTime() {
    localStorage.removeItem("start");
    this.start = null;
    this.currentMinutes = null;
    this.currentSeconds = null;
    clearInterval(this.intervalId);
  }
}
