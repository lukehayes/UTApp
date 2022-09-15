import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  Camera,
  CameraOptions,
  PictureSourceType,
} from '@ionic-native/camera/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject,
} from '@ionic-native/file-transfer/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './services/auth.guard';

import { socket_config } from './services/config';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
const config_socket: SocketIoConfig = {
  url: socket_config.SOCKET_URL,
  options: {},
};

// import { GooglePlus } from '@ionic-native/google-plus/ngx';
// import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';

import { NativeStorage } from '@ionic-native/native-storage/ngx';

import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';

import { NgxPayPalModule } from 'ngx-paypal';

import { Keyboard } from '@ionic-native/keyboard/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    SocketIoModule.forRoot(config_socket),
    NgxPayPalModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    HttpClient,
    AuthGuard,
    Camera,
    File,
    FilePath,
    FileTransfer,
    /*GooglePlus,Facebook,*/ SocialSharing,
    PDFGenerator,
    NativeStorage,
    FileChooser,
    Keyboard
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
