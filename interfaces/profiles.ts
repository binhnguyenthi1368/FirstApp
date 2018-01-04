import { IProfile } from './profiles';

export class Profile implements IProfile{
  app: IApp = null;
  account: IAccount = null;
  type: IType = {
    name: "",
    percent: 0
  };

  constructor(app: IApp, account: IAccount){
    this.app = app;
    this.account = account;
  }

  //Goi ra khi create new Profile Object
  public init(){
    this.getAccountType();
    console.log("Profile was initted");
    console.log(this.app);
    console.log(this.account);
    console.log(this.type);
    console.log(this.getOwnerPercent());
  }

  public setApp(app: IApp){
    this.app = app;
  }
  public setAccount(account: IAccount){
    this.account = account;
  }
  
  //check app is empty
  public isAppEmpty(){
    if(this.app == null){
      return true;
    }
    return false;
  }

  //check account is empty
  public isAccountEmpty(){
    if(this.account == null){
      return true;
    }
    return false;
  }

  //check đại lý
  public isAgency (){
    if(this.account.tags.indexOf('AGENCY') !== -1){
      return true;
    }
    return false;
  }

  //check tổng đại lý
  public isAgencyRegular(){
    if(this.account.tags.indexOf('AGENCY-REGULAR') !== -1){
      if(this.account.tags.indexOf('AGENCY-NORTH')){
        return true;
      }else if(this.account.tags.indexOf('AGENCY-SOUTH')){
        return true;
      }
    }
    return false;
  }

  //Lấy ra loại khách hàng và % chiết khấu
  //profile.type.name, profile.type.percent
  public getAccountType(){
    let name  = "";
    let percent  = 0;
    if(this.account.tags.indexOf('AGENCY') !== -1){
      name = "Đại lý";
      percent  = this.app.percent.dai_ly;
      if(this.account.tags.indexOf('AGENCY-GENERAL') !== -1){
        if(this.account.tags.indexOf('AGENCY-NORTH') !== -1){
          name = "tổng đại lý bắc";
          percent = this.app.percent.dai_ly_bac;
        }else if(this.account.tags.indexOf('AGENCY-SOUTH') !== -1){
          name = "tổng đại lý nam";
          percent = this.app.percent.dai_ly_nam;
        }
      }
    }else{
      name = "Cộng tác viên";
      percent = this.app.percent.tich_luy;
    }
    this.type.name = name;
    this.type.percent = percent;
  }

  //Lây ra % thưởng nhị cấp
  //profile.getOwnerPercent()
  public getOwnerPercent(){
    return this.app.percent.thuong_nhi_cap;
  }
}

//Interfaces ----------------- Used for only Profile Class above
export interface IProfile{
  app: IApp;
  account: IAccount
}

export interface IApp{
  collections: any[];
  percent: IPercentPoint;
}

export interface IPercentPoint{
  dai_ly: number;
  dai_ly_bac: number;
  dai_ly_nam: number;
  thuong_nhi_cap: number;
  tich_luy: number;
  quy_tu_thien: number;
}

export interface IAccount{
  id: number;
  email: string;
  name: string;
  code: string;
  invited_code: string;
  tags: string;
}

export interface IType{
  name: string; //dai ly, tong dai ly, cong tac vien
  percent: number; // % chiet khau
}

export * from "./profiles";