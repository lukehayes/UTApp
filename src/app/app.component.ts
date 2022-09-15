import { Component, OnInit } from '@angular/core';
import { EventsService } from './services/events/events.service';
import { ApiService } from './services/apiservice.service';
import { GlobalFooService } from './services/globalFooService.service';
import { config } from './services/config';
import { Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
declare var Branch;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  response: any;
  freeTrial: any;
  response_payment: any;
  errors = config.errors;
  adminMembershipStatus: any;

  constructor(
    public apiService: ApiService,
    private globalFooService: GlobalFooService,
    public events: EventsService,
    private router: Router,
    private navCtrl: NavController,
    public platform: Platform,
    public file: File,
    public keyboard: Keyboard
  ) {
    this.platform.ready().then(() => {
      this.branchInit();
      // this.keyboard.disableScroll(false);

      this.file
        .checkDir(this.file.documentsDirectory, 'UnconventionalApp')
        .then((res) => {
          console.log('Directory exists', res);
        })
        .catch((err) => {
          console.log('Directory doesnt exist');
          // this.file.createDir(this.file.dataDirectory,"mydir",true);

          this.file
            .createDir(this.file.documentsDirectory, 'UnconventionalApp', true)
            .then(() => {
              console.log('Directory created successfully');
            })
            .catch(() => {
              console.log('Failed to create directory');
            });
        });
    });

    this.platform.resume.subscribe(() => {
      this.branchInit();
    });
  }

  ionViewDidEnter() {
    this.platform.ready().then(() => {
      this.keyboard.disableScroll(true);
    });
  }
  ionViewWillLeave() {
    this.platform.ready().then(() => {
      this.keyboard.disableScroll(false);
    });
  }

  ngOnInit() {
    this.checkAdminMembership();
    this.getProfilenew();
  }

  checkAdminMembership() {
    this.apiService
      .post(
        '/check_admin_activate_membership',
        { userId: localStorage.getItem('userId') },
        ''
      )
      .subscribe((res) => {
        this.adminMembershipStatus = res;
        this.checkFreeTrial();
      });
  }

  checkFreeTrial() {
    this.apiService
      .post('/check_free_trial', { userId: localStorage.getItem('userId') }, '')
      .subscribe((res) => {
        this.freeTrial = res;
        if (this.freeTrial.status == 1 || this.freeTrial.status == 0) {
          localStorage.setItem('freetrial', 'no');

          if (this.adminMembershipStatus.status == 0) {
            this.checkSubscription();
          } else {
            localStorage.setItem('subsexits', 'yes');
          }
        } else {
          localStorage.setItem('freetrial', 'yes');
          this.apiService
            .post(
              '/check_payment_subscription',
              { userId: localStorage.getItem('userId') },
              ''
            )
            .subscribe((res) => {
              this.response_payment = res;
              if (this.response_payment.status == 1) {
                if (this.adminMembershipStatus.status == 0) {
                  localStorage.setItem('subsexits', 'no');
                } else {
                  localStorage.setItem('subsexits', 'yes');
                }
                localStorage.setItem('price', '0');
              } else {
                localStorage.setItem('price', this.response_payment.data.price);
                localStorage.setItem('subsexits', 'yes');
              }
            });
        }
      });
  }

  checkSubscription() {
    this.apiService
      .post(
        '/check_payment_subscription',
        { userId: localStorage.getItem('userId') },
        ''
      )
      .subscribe((res) => {
        this.response_payment = res;

        if (this.response_payment.status == 1) {
          localStorage.setItem('subsexits', 'no');
          localStorage.setItem('price', '0');
          this.navCtrl.navigateRoot('/getstarted');
        } else {
          this.response_payment = res;
          localStorage.setItem('price', this.response_payment.data.price);
          localStorage.setItem('subsexits', 'yes');
        }
      });
  }

  getProfilenew() {
    this.apiService
      .post('/getProfile', { _id: localStorage.getItem('userId') }, '')
      .subscribe((res) => {
        console.log(res);
        this.response = res;

        if (this.response.data != null) {
          localStorage.setItem('userEmail', this.response.data.email);
          console.log(this.errors.indexOf(this.response.data.gender));
          console.log(this.response.data.not_choose);
        } else {
          this.navCtrl.navigateRoot('/login');
        }
      });
  }

  branchInit = () => {
    var ptr = this;
    // only on devices
    // const Branch = window['Branch'];

    // for development and debugging only
    Branch.setDebug(true);
    console.log('branch', Branch);

    // Branch initialization within your deviceready and resume
    Branch.initSession()
      .then(function success(data) {
        // alert("Open app with a Branch deep link: " + JSON.stringify(res));
        if (data['+clicked_branch_link']) {
          //save the link clicked data into localstorage of the app.
          localStorage.setItem('clickedData', JSON.stringify(data));

          console.log(data);

          setTimeout(function () {
            localStorage.setItem('item', data.post);
            localStorage.setItem('postId', data.postId);
            ptr.router.navigate(['/post-details']);
          }, 2000);
        } else if (data['+non_branch_link']) {
          //alert("Open app with a non Branch deep link: " + JSON.stringify(data));
        } else {
          // alert("Open app organically");
          // Clicking on app icon or push notification
        }
      })
      .catch(function error(err) {});
  };
}
