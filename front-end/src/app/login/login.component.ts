import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AppboolService } from '../appbool.service';
import { UserService } from '../users/user.service';
import { AuthService } from '../auth.service';
import { ServerService } from '../server.service';
import { VolunteersService } from '../volunteer/volunteers.service';
import { EventService } from '../event/event.service';
import { DonorService } from '../donor/donor.service';
import { EMLINK } from 'constants';

//TODO
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  clicked = '';
  username: "";
  password: "";
  hide = true;

  @Output() Loginform = true;
  constructor(
    private router: Router,
    private app: AppboolService,
    private UserService: UserService,
    private auth: AuthService,
    private serverService: ServerService,
    private volservice: VolunteersService,

    private eventService: EventService,
    private donorList: DonorService,
  ) { }

  ngOnInit() {
  }

  calltype(value) {
    this.clicked = value;
  }

  change() {
    this.Loginform = false;

  }

  clk() {

  }
  loadVolunteers() {
    this.serverService.getVolunteerEvents()
    .subscribe((res) => {
      this.eventService.volunteersEvents = [];
      this.eventService.volunteersEvents.push.apply(this.eventService.volunteersEvents, res.json().events);//her we get all the donor event.. just push them to the array you read from
    });

    this.serverService.getAllVolunteers()
      .subscribe((res) => {
        this.volservice.volunteers = [];
        let volunteersList = res.json().volunteers
        for (let i = 0; i < volunteersList.length; i++)
          this.volservice.volunteers.push(volunteersList[i]);
      }, (e) => alert("בעיה צד שרת"))
  }
  loadUsers() {
    this.UserService.usersList = [];
    this.serverService.getAllUsers()
      .subscribe((res) => {
        let allUsers = res.json().users;
        for (let index = 0; index < allUsers.length; index++) {
          this.UserService.usersList.push(allUsers[index]);
        }
      }, (e) => {
        alert('error while fetching users');
      });
  }
  loadDonors(){
    this.serverService.getDonorEvents()
    .subscribe((res) => {
      this.eventService.donorsEvents = [];
      this.eventService.donorsEvents.push.apply(this.eventService.donorsEvents, res.json().events);//her we get all the donor event.. just push them to the array you read from
    });
    this.serverService.getAllDonors()
    .subscribe((res) => {
      res.json().forEach(element => {
        if (element.donorType == "פרטי"){
          this.donorList.private_donor.push(element)
        } else {
          this.donorList.org_donor.push(element)
        }
      });
      this.donorList.donor.push.apply(this.donorList.donor, res.json())
    }, (e) => alert(e));

  }
  onSubmit() {
    // for (let index = 0; index < this.UserService.usersList.length; index++) {
    //   if (this.UserService.usersList[index].username == this.username) {
    //     if (this.UserService.usersList[index].password == this.password) {
    //       if (this.UserService.usersList[index].Freeze == false) {
    //         this.router.navigate(["/Header/main"]);
    //         this.UserService.activeUser = this.UserService.usersList[index];
    //         this.auth.login();
    //         return;
    //       } else {
    //         alert("please contact the admin");
    //         return;
    //       }
    //     }
    //   }
    //   if (index == this.UserService.usersList.length - 1) {
    //     alert("אחד או יותר מהנתונים שגויים");
    //     return;
    //   }
    // }
    var user = { username: this.username, password: this.password }
    this.serverService.login(user)
      .subscribe((res) => {
        if (res.status === 200) {
          if (res.json().Freeze == true) {
            return alert("please contact the admin!");
          }
          this.router.navigate(["/Header/main"]);
          this.UserService.activeUser = res.json();
          this.auth.login();
          
          if (this.UserService.activeUser.VolPer == true) {
            this.loadVolunteers()
          }
          if (this.UserService.activeUser.DonorPer == true) {
            this.loadDonors()
          }
          if (this.UserService.activeUser.username == "admin") {
            this.loadUsers();
          }

        }
      }, (e) => {
        if (e.status === 400) {
          return alert("אתה לא מיחובר")
        }
        if (e.status === 404) {
          return alert("אחד או יותר מהנתונים שגויים");
        }
      });

  }



}