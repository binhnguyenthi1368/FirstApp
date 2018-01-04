var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { /*AngularFireDatabaseModule, FirebaseListObservable,*/ AngularFireDatabase, } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { CustomerService } from '../../services/customer.service';
import * as firebase from 'firebase';
var AuthService = /** @class */ (function () {
    function AuthService(afAuth, db, cusService, storage) {
        var _this = this;
        this.afAuth = afAuth;
        this.db = db;
        this.cusService = cusService;
        this.storage = storage;
        this.authState = null;
        this.user = afAuth.authState;
        this.afAuth.authState.subscribe(function (auth) {
            _this.authState = auth;
        });
    }
    Object.defineProperty(AuthService.prototype, "authenticated", {
        // Returns true if user is logged in
        get: function () {
            return this.authState !== null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "currentUser", {
        // Returns current user data
        get: function () {
            return this.authenticated ? this.authState : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "currentUserObservable", {
        // Returns
        get: function () {
            return this.afAuth.authState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "currentUserId", {
        // Returns current user UID
        get: function () {
            return this.authenticated ? this.authState.uid : '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "currentUserAnonymous", {
        // Anonymous User
        get: function () {
            return this.authenticated ? this.authState.isAnonymous : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "currentUserDisplayName", {
        // Returns current user display name or Guest
        get: function () {
            if (!this.authState) {
                return 'Guest';
            }
            else if (this.currentUserAnonymous) {
                return 'Anonymous';
            }
            else {
                return this.authState['displayName'] || 'User without a Name';
            }
        },
        enumerable: true,
        configurable: true
    });
    //// Social Auth ////
    AuthService.prototype.githubLogin = function () {
        var provider = new firebase.auth.GithubAuthProvider();
        return this.socialSignIn(provider);
    };
    AuthService.prototype.googleLogin = function () {
        var provider = new firebase.auth.GoogleAuthProvider();
        return this.socialSignIn(provider);
    };
    AuthService.prototype.facebookLogin = function () {
        var provider = new firebase.auth.FacebookAuthProvider();
        return this.socialSignIn(provider);
    };
    AuthService.prototype.twitterLogin = function () {
        var provider = new firebase.auth.TwitterAuthProvider();
        return this.socialSignIn(provider);
    };
    AuthService.prototype.socialSignIn = function (provider) {
        var _this = this;
        return this.afAuth.auth.signInWithPopup(provider)
            .then(function (credential) {
            _this.authState = credential.user;
            _this.updateUserData();
            console.log('parse gg user  ' + _this.authState.email + _this.authState.displayName);
            var UserGoogle = {
                first_name: _this.authState.displayName,
                email: _this.authState.email,
                phone: 0,
                birthday: '',
                tags: '',
                invited_code: 0,
                password: '',
                password_confirmation: '',
                accepts_marketing: true,
                accepts_agency: false,
                address: '',
                type: '',
                gender: 0,
                fcm_token: ''
            };
            _this.updateCustomerHaravan(UserGoogle);
        })
            .catch(function (error) { return console.log(error); });
    };
    //// Anonymous Auth ////
    AuthService.prototype.anonymousLogin = function () {
        var _this = this;
        return this.afAuth.auth.signInAnonymously()
            .then(function (user) {
            _this.authState = user;
            _this.updateUserData();
        })
            .catch(function (error) { return console.log(error); });
    };
    //// Email/Password Auth ////
    AuthService.prototype.emailSignUp = function (UserReg) {
        var _this = this;
        this.test = 'ok';
        return this.afAuth.auth.createUserWithEmailAndPassword(UserReg.email, UserReg.password)
            .then(function (user) {
            _this.authState = user;
            console.log(_this.user);
            console.log(_this.authState);
            _this.updateCustomerHaravan(UserReg);
            _this.updateUserFullInfo(UserReg);
            if (UserReg.accepts_agency == true) {
                _this.afAuth.auth.signOut();
            }
        })
            .catch(function (error) {
            console.log(error.message);
            _this.test = error.message;
        });
    };
    AuthService.prototype.emailLogin = function (email, password) {
        var _this = this;
        this.test = 'ok';
        return this.afAuth.auth.signInWithEmailAndPassword(email, password)
            .then(function (user) {
            _this.authState = user;
            _this.updateUserData();
        })
            .catch(function (error) {
            console.log(error);
            _this.test = error.message;
        });
    };
    AuthService.prototype.getUserInfo = function () {
        var path = "users/" + this.currentUserId;
        return this.db.object(path);
    };
    // Sends email allowing user to reset password
    AuthService.prototype.resetPassword = function (email) {
        var auth = firebase.auth();
        return auth.sendPasswordResetEmail(email)
            .then(function () { return console.log("email sent"); });
    };
    //// Sign Out ////
    AuthService.prototype.signOut = function () {
        this.afAuth.auth.signOut();
    };
    //private updateCustomer
    AuthService.prototype.updateCustomerHaravan = function (User) {
        this.cusService.addCustomer(User).subscribe(function (user) {
            console.log(user);
        }, function (error) { return console.log(error); });
    };
    //// Helpers ////
    AuthService.prototype.updateUserData = function () {
        var _this = this;
        var token = "";
        this.storage.get("fcm").then(function (value) {
            token = value;
            var path = "users/" + _this.currentUserId; // Endpoint on firebase
            var data = {
                email: _this.authState.email,
                name: _this.authState.displayName,
                fcm_token: token
            };
            _this.db.object(path).update(data)
                .catch(function (error) { return console.log(error); });
        });
    };
    AuthService.prototype.updateUserFullInfo = function (user) {
        var path = "users/" + this.currentUserId; // Endpoint on firebase
        var data = {
            email: this.authState.email,
            name: user.first_name,
            phone: user.phone,
            invited_code: user.invited_code,
            birthday: user.birthday,
            address: user.address,
            type: user.type,
            gender: user.gender,
            fcm_token: user.fcm_token
        };
        this.db.object(path).update(data)
            .catch(function (error) { return console.log(error); });
    };
    AuthService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [AngularFireAuth,
            AngularFireDatabase, CustomerService, Storage])
    ], AuthService);
    return AuthService;
}());
export { AuthService };
//# sourceMappingURL=auth.service.js.map