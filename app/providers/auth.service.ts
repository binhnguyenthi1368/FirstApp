import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { /*AngularFireDatabaseModule, FirebaseListObservable,*/ AngularFireDatabase, } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { User, UserRegister, UpdateUser } from '../../interfaces/user';
import { CustomerService } from '../../services/customer.service';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class AuthService {

  authState: any = null;
  test;
  user: Observable<firebase.User>;
  constructor(private afAuth: AngularFireAuth,
              private db: AngularFireDatabase, private cusService: CustomerService, private storage: Storage) {
            this.user = afAuth.authState;
            this.afAuth.authState.subscribe((auth) => {
              this.authState = auth
            });
          }

  // Returns true if user is logged in
  get authenticated(): boolean {
    return this.authState !== null;
  }

  // Returns current user data
  get currentUser(): any {
    return this.authenticated ? this.authState : null;
  }

  // Returns
  get currentUserObservable(): any {
    return this.afAuth.authState
  }

  // Returns current user UID
  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
  }

  // Anonymous User
  get currentUserAnonymous(): boolean {
    return this.authenticated ? this.authState.isAnonymous : false
  }

  // Returns current user display name or Guest
  get currentUserDisplayName(): string {
    if (!this.authState) { return 'Guest' }
    else if (this.currentUserAnonymous) { return 'Anonymous' }
    else { return this.authState['displayName'] || 'User without a Name' }
  }

  //// Social Auth ////
  githubLogin() {
    const provider = new firebase.auth.GithubAuthProvider()
    return this.socialSignIn(provider);
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.socialSignIn(provider);
  }

  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider()
    return this.socialSignIn(provider);
  }

  twitterLogin(){
    const provider = new firebase.auth.TwitterAuthProvider()
    return this.socialSignIn(provider);
  }

  private socialSignIn(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) =>  {
          this.authState = credential.user;
          this.updateUserData();
          console.log('parse gg user  ' + this.authState.email + this.authState.displayName);
          var UserGoogle: UserRegister = {
            first_name: this.authState.displayName,
            email: this.authState.email,
            phone: 0,
            birthday: '',
            tags: '',
            invited_code: 0, //the code which customer inserted
            password: '',
            password_confirmation: '',
            accepts_marketing: true,
            accepts_agency: false,
            address: '',
            type: '',
            gender: 0,
            fcm_token: ''
          };
          this.updateCustomerHaravan(UserGoogle);

      })
      .catch(error => console.log(error));
  }


  //// Anonymous Auth ////
  anonymousLogin() {
    return this.afAuth.auth.signInAnonymously()
    .then((user) => {
      this.authState = user
      this.updateUserData()
    })
    .catch(error => console.log(error));
  }

  //// Email/Password Auth ////
  emailSignUp(UserReg: UserRegister) {
    this.test = 'ok';
    return this.afAuth.auth.createUserWithEmailAndPassword(UserReg.email, UserReg.password)
      .then((user) => {
        this.authState = user;
        console.log(this.user);
        console.log(this.authState);
        this.updateCustomerHaravan(UserReg);
        this.updateUserFullInfo(UserReg);
        if (UserReg.accepts_agency == true) {
          this.afAuth.auth.signOut();
        }
      })
      .catch((error) => {
        console.log(error.message); 
        this.test = error.message; 
      });
  }

  emailLogin(email: string, password: string) {
    this.test = 'ok';
     return this.afAuth.auth.signInWithEmailAndPassword(email, password)
       .then((user) => {
         this.authState = user;
         this.updateUserData();
       })
       .catch((error) => {
        console.log(error);
        this.test = error.message;
      });
  }

  getUserInfo(): Observable<any>{
    let path = `users/${this.currentUserId}`;
    return this.db.object(path);
  }

  // Sends email allowing user to reset password
  resetPassword(email: string) {
    var auth = firebase.auth();

    return auth.sendPasswordResetEmail(email)
      .then(() => console.log("email sent"))
  }

  //// Sign Out ////
  signOut(): void {
    this.afAuth.auth.signOut();
  }

  //private updateCustomer
  private updateCustomerHaravan(User: UserRegister): void{
    this.cusService.addCustomer(User).subscribe( user => {
                                    console.log(user)             
       },
                         error => console.log(error))
  }

  //// Helpers ////
  private updateUserData(): void {
    let token = "";
    this.storage.get("fcm").then((value)=>{
      token = value;
      let path = `users/${this.currentUserId}`; // Endpoint on firebase
      let data = {
                    email: this.authState.email,
                    name: this.authState.displayName,
                    fcm_token: token
                  }

      this.db.object(path).update(data)
      .catch(error => console.log(error));
    })
  
  }

  private updateUserFullInfo(user: UserRegister): void {
    let path = `users/${this.currentUserId}`; // Endpoint on firebase
    let data = {
                  email: this.authState.email,
                  name: user.first_name,
                  phone: user.phone,
                  invited_code: user.invited_code,
                  birthday: user.birthday,
                  address: user.address,
                  type: user.type,
                  gender: user.gender,
                  fcm_token: user.fcm_token
                }

    this.db.object(path).update(data)
    .catch(error => console.log(error));
  }

}
