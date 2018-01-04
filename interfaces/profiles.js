var Profile = /** @class */ (function () {
    function Profile(app, account) {
        this.app = null;
        this.account = null;
        this.type = {
            name: "",
            percent: 0
        };
        this.app = app;
        this.account = account;
    }
    //Goi ra khi create new Profile Object
    Profile.prototype.init = function () {
        this.getAccountType();
        console.log("Profile was initted");
        console.log(this.app);
        console.log(this.account);
        console.log(this.type);
        console.log(this.getOwnerPercent());
    };
    Profile.prototype.setApp = function (app) {
        this.app = app;
    };
    Profile.prototype.setAccount = function (account) {
        this.account = account;
    };
    //check app is empty
    Profile.prototype.isAppEmpty = function () {
        if (this.app == null) {
            return true;
        }
        return false;
    };
    //check account is empty
    Profile.prototype.isAccountEmpty = function () {
        if (this.account == null) {
            return true;
        }
        return false;
    };
    //check đại lý
    Profile.prototype.isAgency = function () {
        if (this.account.tags.indexOf('AGENCY') !== -1) {
            return true;
        }
        return false;
    };
    //check tổng đại lý
    Profile.prototype.isAgencyRegular = function () {
        if (this.account.tags.indexOf('AGENCY-REGULAR') !== -1) {
            if (this.account.tags.indexOf('AGENCY-NORTH')) {
                return true;
            }
            else if (this.account.tags.indexOf('AGENCY-SOUTH')) {
                return true;
            }
        }
        return false;
    };
    //Lấy ra loại khách hàng và % chiết khấu
    //profile.type.name, profile.type.percent
    Profile.prototype.getAccountType = function () {
        var name = "";
        var percent = 0;
        if (this.account.tags.indexOf('AGENCY') !== -1) {
            name = "Đại lý";
            percent = this.app.percent.dai_ly;
            if (this.account.tags.indexOf('AGENCY-GENERAL') !== -1) {
                if (this.account.tags.indexOf('AGENCY-NORTH') !== -1) {
                    name = "tổng đại lý bắc";
                    percent = this.app.percent.dai_ly_bac;
                }
                else if (this.account.tags.indexOf('AGENCY-SOUTH') !== -1) {
                    name = "tổng đại lý nam";
                    percent = this.app.percent.dai_ly_nam;
                }
            }
        }
        else {
            name = "Cộng tác viên";
            percent = this.app.percent.tich_luy;
        }
        this.type.name = name;
        this.type.percent = percent;
    };
    //Lây ra % thưởng nhị cấp
    //profile.getOwnerPercent()
    Profile.prototype.getOwnerPercent = function () {
        return this.app.percent.thuong_nhi_cap;
    };
    return Profile;
}());
export { Profile };
export * from "./profiles";
//# sourceMappingURL=profiles.js.map