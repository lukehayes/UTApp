import { Component, OnInit , ViewChild} from '@angular/core';
import { StartWorkoutPage } from '../../start-workout/start-workout.page';
import { ModalController, IonContent} from '@ionic/angular';  
import { Router, ActivatedRoute} from '@angular/router';
import { ApiService } from '../../services/apiservice.service';
import { GlobalFooService } from '../../services/globalFooService.service';
import { config } from '../../services/config';
import { EventsService } from '../../services/events/events.service';

@Component({
  selector: 'app-forumcomments',
  templateUrl: './forumcomments.page.html',
  styleUrls: ['./forumcomments.page.scss'],
})
export class ForumcommentsPage implements OnInit {

  	response: any;
  	detail: any;
  	comment_response: any;
  	id: any;
  	errors = config.errors;
  	IMAGES_URL = config.IMAGES_URL;
  	commentList: any;
  	comment = '';
  	@ViewChild(IonContent, {static: false}) ionContent: IonContent;

  	constructor(public modalController: ModalController,public apiService: ApiService, public router: Router, private globalFooService: GlobalFooService, public events:EventsService, private activatedRoute: ActivatedRoute) { 

    	this.id = activatedRoute.snapshot.paramMap.get('id');
  	}

  	ngOnInit() {

    	this.getForumDetail();
  	}

	timeSince(date){
		return this.apiService.timeSince(date);
	} 

  	getForumDetail(){

      this.apiService.post('/forum_detail', {_id: this.id, userId: localStorage.getItem('userId')}, '').subscribe((res) => {

        console.log(res);
        this.detail = res;
        this.getComments();
      });

  	}

  	getComments(){

      this.apiService.post('/comments_list', {forumId: this.id}, '').subscribe((res) => {

        console.log(res);
        this.response = res;
        this.commentList = this.response.data;
        this.ionContent.scrollToBottom();
      });

  	}

  	addComment(){

  		if(this.comment == ''){
  			this.apiService.presentToast('Please enter your comment', 'danger');
  			return;
  		}

  		this.apiService.post('/add_comment', {userId: localStorage.getItem('userId'),comment: this.comment, forumId: this.id}, '').subscribe((res) => {

	        console.log(res);
	        this.comment_response = res;
	        var dict = {

	        	comment: this.comment_response.data.comment,
				created_on: this.comment_response.data.created_on,
				forumId: this.comment_response.data.forumId,
				userId: this.comment_response.data.userId,
				userinfo: JSON.parse(localStorage.getItem('userObj')),
				_id: this.comment_response.data._id
	        }

	        this.commentList.push(dict);
	        this.comment = '';

	        this.ionContent.scrollToBottom();
	        
      	});

  	}

}
