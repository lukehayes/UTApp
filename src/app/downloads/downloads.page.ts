import { Component, OnInit } from '@angular/core';
import { File, FileEntry } from '@ionic-native/file/ngx';
declare var window: any; 
import { DomSanitizer } from '@angular/platform-browser';
import * as $ from "jquery";
@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.page.html',
  styleUrls: ['./downloads.page.scss'],
})
export class DownloadsPage implements OnInit {
  	
  	profiletab: string = "video";
  	count: any;
    fileEntries: any;
    source: any;
    filesArry: any = [];
    public win: any = window;
  
  	
  	constructor(public file: File, public sanitizer:DomSanitizer) { }

  	ngOnInit() {

  		// this.checkFiles();
      // alert('a')
      // this.filesArry = JSON.parse(localStorage.getItem('downloadExer'));

      // // alert(localStorage.getItem('downloadExer'))
      // for(var i = 0; i < this.filesArry.length; i++){
      //   this.file.resolveDirectoryUrl(this.file.documentsDirectory +
      //     '/UnconventionalApp/')
      //     .then((rootDir) => {
      //       return this.file.getFile(rootDir, this.filesArry[i].imagename, { create: false })
      //     })
      //     .then((fileEntry) => {
      //       fileEntry.file(file => {
      //         console.log(file)
      //         alert(JSON.stringify(file))
      //       })
      //     })
      //     .catch((error) => 
      //     {
      //       alert(JSON.stringify(error))
      //       console.log('error', error)
      //     });
      // }
      

  	}

    getFileEntry(imgUri) {

          console.log(this.file.externalRootDirectory, imgUri)


          // this.file.resolveLocalFileSystemURL(this.file.externalRootDirectory.replace(/^file:\/\//g, '') + imgUri, function(entry) { 
          //     console.log('eeeeeeeeeeeeee ===' ,entry);
          // }, (e) => console.error(e))

          var filePathCorrected = this.win.Ionic.WebView.convertFileSrc(this.file.externalRootDirectory + imgUri);

          var str = filePathCorrected;
          var index = str.lastIndexOf('/');
          var splitstr = str.substring(0,index);
          var splitstrlast = str.substring(index, str.length -1);

          var concatstr = splitstr + '/UnconventionalApp' + splitstrlast;
          console.log(index,splitstr, splitstrlast, concatstr);
        filePathCorrected = concatstr.replace('file:/', "https://localhost/_app_file_/");
        console.log('ssssssssssss------' ,filePathCorrected);


            this.file.readAsDataURL(splitstr + '/UnconventionalApp/', imgUri)
              .then((imgData) => {
                console.log('Image Data', imgData)
                this.source = imgData;
              })
              .catch((error) => console.log('error', error)); //Logs error {"code":1,"message":"NOT_FOUND_ERR"}
        }

  	checkFiles(){
      this.filesArry = [];
  		this.file.listDir(this.file.externalRootDirectory, 'UnconventionalApp')
      	.then((data) => {
	        console.log(data);
	        this.count = data.length;
          console.log(this.count);
          this.fileEntries = data;
          this.getFileEntry(this.fileEntries[0].name);

          for(let file of data){
            let name=file.name; 
            console.log("File name "+name);
            let path=this.file.externalRootDirectory+name; 
            console.log(path);
            this.filesArry.push(path);
            this.file.resolveLocalFilesystemUrl(this.file.externalRootDirectory + name).then(result => {
               console.log("beforeresult:"+this.file.externalRootDirectory + "test.png")
               console.log("result"+result.nativeURL)
               this.filesArry.push(result.nativeURL);
            }, error =>{
               return JSON.stringify(error);
            });
            
          }

          console.log(this.fileEntries[0].name);
          this.file.checkFile(this.file.externalRootDirectory, this.fileEntries[0].name).then((correct : boolean) => {
            if(correct){
                this.file.readAsDataURL(this.file.externalRootDirectory, this.fileEntries[0].name).then((base64) => {
                    this.source = this.sanitizer.bypassSecurityTrustUrl(base64);
                    console.log(this.source);
                }).catch((err) => {
                    console.log("VIDEO :: No se pudo recuperar el video");
                    console.log(err);
                });
            } else {
                console.log("VIDEO :: El video no pudo ser encontrado");
            }
        }).catch((err) => {
            console.log("VIDEO :: Ocurrio un error al verificar si el video existe");
            console.log(err);
        });


	        const src = data[0].toInternalURL();
	        // this.file.resolveLocalFilesystemUrl(src).then(data => {
	        //   this.content = data.toURL();
	        //   document.getElementById('video').setAttribute('src', this.content);
	        //   console.log('Content path cahnged ', this.content);
	        // }, error => {
	        //   	console.log('File path error');
        	// })
      	})
  		.catch(err => console.log('Directory doesnt exist'));
  	}



   	

}
