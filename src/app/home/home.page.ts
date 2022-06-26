import { Component } from '@angular/core';
import { PickerController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public timer: number = 25;

  constructor(private pickerCtrl: PickerController) {}

  pomodoro() {
    alert("hola");
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
}
