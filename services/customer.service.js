var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { HTTP } from '@ionic-native/http';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
var CustomerService = /** @class */ (function () {
    function CustomerService(http, storage, httpNative) {
        this.http = http;
        this.storage = storage;
        this.httpNative = httpNative;
        this.baseUrl = 'https://suplo-app.herokuapp.com/dogo-app';
        this.baseUrl2 = "https://4cc20ebced68dd60b91f826bc3dfa43e:b7eca5f38ab3a3574d063d63fa387fdd@dogobtgroup@myharavan.com";
        this.access_token = "bearer G5K_xm2bWU7lfFVM1pZTPJGnQgW3BET0GB03WzBGI6wr_EroQQ0GfycpiCBqZr6usyngelOraIFRniXhh7XHXc5YawS0B5i7S7pLM1bmQSkvwpujPFG_Som6oOtVIkngoPBe-9UIW1j_fV6mwQ3GNxrd8Pm-XMhzk3_qnSF81uc6DqQ199fBhK1k_J1G8iq7EuZ55sOl3e7-GmLpIMCnDbEBRrEFnJlEr15L956vBhha6SoPplFrr6RAgFQpHX53ln7MoMSziau7vdrE5eWCT6P3appaopmDiyq3Yn0skxLV06ryf3YEaHyZa5Kf34Qw8FDHEKG2da2odLVhhpSdNt3HJw4zPkr1_lGH0X6XS1dszVmUgh18ubvGGJA72klNIE8B82Iu9vemfzn3L2qmQulAZXkPkKxNz2qCWXzVqqgznFwwe66s2OzX4o42OqR43lmrt0yxT80u2pwt8xrCGA3SgVHvuc_Qi-DulVRqrpBWpaeNYQ06kC-mLIDY2OgGx2EhstBgTh6OmZt6zXpKxB4ZY_0";
    }
    CustomerService.prototype.getHeaders = function () {
        // I included these headers because otherwise FireFox
        // will request text/html
        var headers = new Headers();
        headers.append('Accept', 'application/json');
        return headers;
    };
    CustomerService.prototype.postHeaders = function () {
        var headers = new Headers();
        headers.append('Content-Type', 'text/html');
        return headers;
    };
    CustomerService.prototype.getHeadersToken = function () {
        var headers = new Headers();
        headers.append('Authorization', this.access_token);
        headers.append('Access-Control-Allow-Origin', 'https://dogobtgroup.myharavan.com');
        return headers;
    };
    // lay thong tin tai khoan
    CustomerService.prototype.getTest = function () {
        var User$ = this.httpNative.get(this.baseUrl2 + "/admin/customers.json", {}, {}).then(function (data) {
            console.log(data);
        });
        // return User$;
    };
    // lay thong tin tai khoan
    CustomerService.prototype.get = function (id) {
        var User$ = this.http
            .get(this.baseUrl + "/customer/" + id, { headers: this.getHeaders() })
            .map(mapUser)
            .catch(handleError);
        return User$;
    };
    // them acc
    CustomerService.prototype.addCustomer = function (User) {
        return this
            .http
            .post(this.baseUrl + "/register", User, { headers: this.getHeaders() });
    };
    // update thong tin acc
    CustomerService.prototype.updateCustomer = function (id, code, addid, User) {
        console.log(User);
        return this
            .http
            .put(this.baseUrl + "/customer/" + id + "/" + code + "/" + addid, User, { headers: this.getHeaders() });
    };
    // lay thong tin tai khoan
    CustomerService.prototype.getBank = function (id, phone) {
        var Bank$ = this.http
            .get(this.baseUrl + "/commission/" + id + "/" + phone, { headers: this.getHeaders() })
            .map(mapBank)
            .catch(handleError);
        return Bank$;
    };
    // lay ds don hang theo customer_id
    CustomerService.prototype.getOrder = function (id) {
        var order$ = this.http
            .get(this.baseUrl + "/customer/orders/" + id, { headers: this.getHeaders() })
            .map(mapOrder)
            .catch(handleError);
        return order$;
    };
    // lay thống kê don hang theo customer_id
    CustomerService.prototype.getStatic = function (id) {
        var orderStatic$ = this.http
            .get(this.baseUrl + "/customer/orders/" + id, { headers: this.getHeaders() })
            .map(mapOrderStatic)
            .catch(handleError);
        return orderStatic$;
    };
    // lay chi tiet don hang theo order_id
    CustomerService.prototype.getDetailOrder = function (id) {
        var orderDetail$ = this.http
            .get(this.baseUrl + "/orders/" + id, { headers: this.getHeaders() })
            .map(mapOrderDetail)
            .catch(handleError);
        return orderDetail$;
    };
    // lay thuong nhị cấp va thuong tich luy ca nhan
    CustomerService.prototype.getReward = function (id) {
        var orderStatic$ = this.http
            .get(this.baseUrl + "/customer/orders/shipped/" + id, { headers: this.getHeaders() })
            .map(mapOrderStatic)
            .catch(handleError);
        return orderStatic$;
    };
    CustomerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http, Storage, HTTP])
    ], CustomerService);
    return CustomerService;
}());
export { CustomerService };
function mapOrder(response) {
    //throw new Error('ups! Force choke!');
    // The response of the API has a results
    // property with the actual results
    return response.json().data.orders.map(toOrder);
    // return toOrder(response.json().data.orders);
}
function mapOrderStatic(response) {
    return response.json().data.orders.map(toOrderStatic);
    // return toOrder(response.json().data.orders);
}
// function mapCollection(response:Response): Collection {
//   return toCollecton(response.json().data.collections);
// }
function toOrder(r) {
    var Order = ({
        id: r.id,
        name: r.name,
        created_at: r.created_at,
        financial_status: r.financial_status,
        fulfillment_status: r.fulfillment_status,
        cancelled_status: r.cancelled_status,
        first_item: r.line_items[0],
        total_price: r.total_price,
        count_items: r.line_items.length,
        reward_points_2: 0
    });
    var lengthNote = r.note_attributes.length;
    if (lengthNote > 0) {
        for (var i = 0; i <= lengthNote - 1; i++) {
            if (r.note_attributes[i].name == "Tích lũy xu") {
                Order.reward_points_2 = r.note_attributes[i].value;
                break;
            }
            console.log(r.note_attributes[i]);
        }
    }
    if (Order.reward_points_2 < 0) {
        Order.reward_points_2 = 0;
    }
    console.log('Parsed order:', Order);
    return Order;
}
function toOrderStatic(r) {
    var OrderStatic = ({
        id: r.id,
        reward_points_1: 0,
        reward_points_2: 0
    });
    var lengthNote = r.note_attributes.length;
    if (lengthNote > 0) {
        for (var i = 0; i <= lengthNote - 1; i++) {
            if (r.note_attributes[i].name == "Tích lũy xu") {
                OrderStatic.reward_points_2 = r.note_attributes[i].value;
            }
            if (r.note_attributes[i].name == "Hoa hồng giới thiệu") {
                OrderStatic.reward_points_1 = r.note_attributes[i].value;
            }
        }
    }
    if (OrderStatic.reward_points_1 < 0) {
        OrderStatic.reward_points_1 = 0;
    }
    if (OrderStatic.reward_points_2 < 0) {
        OrderStatic.reward_points_2 = 0;
    }
    console.log('Parsed order static:', OrderStatic);
    return OrderStatic;
}
function toOrderDetail(r) {
    var OrderDetail = ({
        name: r.name,
        billing_address: r.billing_address,
        shipping_price: r.shipping_lines[0].price,
        discount_codes: r.discount_codes,
        total_discounts: r.total_discounts,
        financial_status: r.financial_status,
        fulfillment_status: r.fulfillment_status,
        cancel_reason: r.cancel_reason,
        cancelled_status: r.cancelled_status,
        line_items: r.line_items,
        total_price: r.total_price,
        count_items: r.line_items.length,
        reward_points_2: 0,
    });
    var lengthNote = r.note_attributes.length;
    if (lengthNote > 0) {
        for (var i = 0; i <= lengthNote - 1; i++) {
            if (r.note_attributes[i].name == "Tích lũy xu") {
                console.log(r.note_attributes[i]);
                OrderDetail.reward_points_2 = r.note_attributes[i].value;
            }
            console.log(r.note_attributes[i]);
        }
    }
    if (OrderDetail.reward_points_2 < 0) {
        OrderDetail.reward_points_2 = 0;
    }
    console.log('Parsed order detail:', OrderDetail);
    return OrderDetail;
}
function toBank(r) {
    var BankAcc = ({
        bank: '',
        bank_branch: '',
        account_name: '',
        account_number: null,
        individual_tax_number: null
    });
    var des = r.description;
    if (des != null && des != undefined) {
        var info = des.split('##');
        var lengthInfo = info.length;
        if (lengthInfo > 0) {
            BankAcc.bank = info[0];
            BankAcc.bank_branch = info[1];
            BankAcc.account_name = info[2];
            BankAcc.account_number = info[3];
            BankAcc.individual_tax_number = info[4];
        }
    }
    console.log('Parsed info bank:', BankAcc);
    return BankAcc;
}
function toUserDetail(r) {
    var User = ({
        id: r.id,
        first_name: r.first_name,
        last_name: r.last_name,
        email: r.email,
        addresses: r.addresses,
        default_address: r.default_address,
        metafields: null,
        birthday: r.birthday,
        gender: r.gender,
        tags: r.tags,
        code: '0',
        invited_code: '0',
        agency: '',
        agency_verified: '',
        firebase_token: r.tags,
        multipass_identifier: r.multipass_identifier,
        password: r.tags,
        password_confirmation: r.tags,
        logged: null,
        expire_logged: null,
        accepts_marketing: r.accepts_marketing,
        verified_email: r.email,
        send_email_invite: true,
        send_email_welcome: true,
    });
    // console.log(r.tags.split(',').length);
    // xu ly tags
    if (r.tags != null && r.tags != undefined) {
        var tags = r.tags.split(',');
        var lengthTags = tags.length;
        if (lengthTags > 0) {
            var agencyG = false;
            var agencyN = false;
            var agencyS = false;
            for (var i = 0; i <= lengthTags - 1; i++) {
                if (tags[i].indexOf("IVCODE-") != -1) {
                    User.invited_code = tags[i].trim().replace('IVCODE-', '');
                }
                if (tags[i].indexOf("CODE-") != -1 && tags[i].indexOf("IVCODE-") == -1) {
                    User.code = tags[i].trim().replace('CODE-', '');
                }
                // if (tags[i].indexOf("AGENCY") != -1 && (tags[i].indexOf("AGENCY-GENERAL") == -1 || tags[i].indexOf("AGENCY-NORTH") == -1 || tags[i].indexOf("AGENCY-SOUTH") == -1 )) {
                //   User.agency = 'AGENCY';
                // }else{
                // tổng đại lý bắc
                if (tags[i].indexOf("AGENCY-NORTH") != -1) {
                    // User.agency = 'AGENCY-NORTH';
                    agencyN = true;
                }
                else {
                    // tổng đại lý nam
                    if (tags[i].indexOf("AGENCY-SOUTH") != -1) {
                        // User.agency = 'AGENCY-SOUTH';
                        agencyS = true;
                    }
                    else {
                        // đại lý
                        if (tags[i].indexOf("AGENCY") != -1 || tags[i].indexOf("AGENCY-GENERAL") != -1 && tags[i].indexOf("AGENCY-NORTH") == -1 && tags[i].indexOf("AGENCY-SOUTH") == -1) {
                            // User.agency = 'AGENCY';
                            agencyG = true;
                        }
                    }
                }
                // }
                // // tổng đại lý bắc
                // if (tags[i].indexOf("AGENCY-GENERAL") != -1 && tags[i].indexOf("AGENCY-NORTH") != -1 ) {
                //   User.agency = 'AGENCY-NORTH';
                // }
                // // tổng đại lý nam
                // if (tags[i].indexOf("AGENCY-GENERAL") != -1 && tags[i].indexOf("AGENCY-SOUTH") != -1 ) {
                //   User.agency = 'AGENCY-SOUTH';
                // }
                // chưa xác nhận
                if (tags[i].indexOf("NOT-VERIFIED") != -1) {
                    User.agency_verified = 'NOT-VERIFIED';
                }
                // đã xác nhận
                if (tags[i].indexOf("VERIFIED") != -1 && tags[i].indexOf("NOT-VERIFIED") == -1) {
                    User.agency_verified = 'VERIFIED';
                }
            }
            if (agencyG == true && agencyN == true) {
                User.agency = 'AGENCY-NORTH';
            }
            else {
                if (agencyG == true && agencyS == true) {
                    User.agency = 'AGENCY-SOUTH';
                }
                else {
                    if (agencyG == true && (agencyN == false || agencyS == false)) {
                        User.agency = 'AGENCY';
                    }
                }
            }
        }
    }
    // // xu ly addresses, ban đầu default_address = r.default_address, check lại trong ds địa chỉ xem cái này có là default = true ko
    // if (r.addresses != null && r.addresses != undefined) {
    //   let addresses = r.addresses;
    //   let lengthAddresses = addresses.length;
    //   if (lengthAddresses > 0) {
    //     for(let i = 0; i <= lengthAddresses - 1; i++){
    //       if (addresses[i].default == "true" || addresses[i].default == true ) {
    //         User.default_address = addresses[i];
    //       }
    //     }
    //   }
    // }
    console.log('Parsed User:', User);
    return User;
}
function mapUser(response) {
    // toUser looks just like in the previous example
    return toUserDetail(response.json().data.customers[0]);
}
function mapOrderDetail(response) {
    // toUser looks just like in the previous example
    return toOrderDetail(response.json().data.order);
}
function mapBank(response) {
    // toUser looks just like in the previous example
    return toBank(response.json().data.metafields[0]);
}
// this could also be a private method of the component class
function handleError(error) {
    // log error
    // could be something more sofisticated
    var errorMsg = error.message || "K\u1EBFt n\u1ED1i d\u1EEF li\u1EC7u kh\u00F4ng th\u00E0nh c\u00F4ng! Vui l\u00F2ng th\u1EED l\u1EA1i.";
    console.error(errorMsg);
    // throw an application level error
    return Observable.throw(errorMsg);
}
//# sourceMappingURL=customer.service.js.map