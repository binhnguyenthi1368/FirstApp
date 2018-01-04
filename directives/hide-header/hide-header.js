var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Directive, ElementRef, Renderer } from '@angular/core';
import { Platform } from 'ionic-angular';
/**
 * Generated class for the HideHeaderDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
var HideHeaderDirective = /** @class */ (function () {
    function HideHeaderDirective(element, renderer, platform) {
        this.element = element;
        this.renderer = renderer;
        this.platform = platform;
        // console.log('Hello HideHeaderDirective Directive');
    }
    HideHeaderDirective.prototype.ngOnInit = function () {
        // this.headerHeight = this.header.clientHeight;
        // this.scrollContent = this.element.nativeElement.getElementsByClassName("scroll-content")[0];
        // this.menubar = this.element.nativeElement.getElementsByClassName("menu-bar1")[0];
        var content = this.element.nativeElement.getElementsByClassName('scroll-content')[0];
        this.headerTop = content.getElementsByClassName('header-back-parallax')[0];
        // this.bgScroll = content.getElementsByClassName('bg-parallax')[0];
        this.imgParallax = content.getElementsByClassName('img-parallax')[0];
        var mainContent = content.getElementsByClassName('main-content')[0];
        this.btnFavo1 = content.getElementsByClassName('btn-favorite-1')[0];
        this.btnFavo2 = content.getElementsByClassName('btn-favorite-2')[0];
        // this.buttons = this.headerTop.getElementsByClassName('bar-buttons')[0];
        this.btnBack = this.headerTop.getElementsByClassName('bar-button')[0];
        this.btnIcon1 = document.getElementById('btn1');
        this.btnIcon2 = document.getElementById('btn2');
        this.btnIcon3 = document.getElementById('btn3');
        this.btnIcon4 = document.getElementById('btn4');
        this.btnIcon5 = document.getElementById('btn5');
        this.headerHeight = this.imgParallax.clientHeight;
        // this.renderer.setElementStyle(this.bgScroll, 'webkitTransformOrigin', 'center bottom');
        this.renderer.setElementStyle(this.imgParallax, 'webkitTransformOrigin', 'center bottom');
        this.renderer.setElementStyle(mainContent, 'position', 'absolute');
        this.renderer.setElementStyle(mainContent, 'width', '100%');
    };
    HideHeaderDirective.prototype.onWindowResize = function (ev) {
        this.headerHeight = this.imgParallax.clientHeight;
    };
    HideHeaderDirective.prototype.onContentScroll = function (ev) {
        var _this = this;
        ev.domWrite(function () {
            _this.updateParallaxHeader(ev);
        });
    };
    // onContentScroll(event) {
    //   if(event.scrollTop > 61) {
    //   this.renderer.setElementStyle(this.header, 'webkitTransition', 'top 200ms');
    //     this.renderer.setElementStyle(this.header, "top", "-61px");
    //     this.renderer.setElementStyle(this.scrollContent, "margin-top", "0");
    //     // this.renderer.setElementStyle(this.menubar, "position", "fixed");
    //     if (this.platform.is('ios')) {
    //       // this.renderer.setElementStyle(this.menubar, "top", "20px");
    //     } else {
    //       // this.renderer.setElementStyle(this.menubar, "top", "0");
    //     }
    //     // this.renderer.setElementStyle(this.menubar, "z-index", "10");
    //   } else {
    //     this.renderer.setElementStyle(this.header, 'webkitTransition', 'top 0ms');
    //     this.renderer.setElementStyle(this.header, "top", "0");
    //     if (this.platform.is('ios')) {
    //       this.renderer.setElementStyle(this.scrollContent, "margin-top", "79px");
    //     } else {
    //       this.renderer.setElementStyle(this.scrollContent, "margin-top", "61px");
    //     }
    //     // this.renderer.setElementStyle(this.scrollContent, "margin-top", "61px");
    //     // this.renderer.setElementStyle(this.menubar, "position", "unset");
    //     // this.renderer.setElementStyle(this.menubar, "top", "unset");
    //   }
    // }
    HideHeaderDirective.prototype.updateParallaxHeader = function (ev) {
        var opacity = 1;
        if (ev.scrollTop >= 0) {
            this.translateAmt = ev.scrollTop / 2;
            this.scaleAmt = 1;
        }
        else {
            this.translateAmt = 0;
            this.scaleAmt = -ev.scrollTop / this.headerHeight + 1;
        }
        if (ev.scrollTop > 205) {
            console.log('>=0');
            this.renderer.setElementStyle(this.headerTop, 'position', 'fixed');
            this.renderer.setElementStyle(this.headerTop, 'background', '#e60f1e');
            this.renderer.setElementStyle(this.btnBack, 'color', '#fff');
            this.renderer.setElementStyle(this.btnIcon1, 'opacity', '1');
            this.renderer.setElementStyle(this.btnIcon1, 'color', '#fff');
            this.renderer.setElementStyle(this.btnIcon2, 'opacity', '1');
            this.renderer.setElementStyle(this.btnIcon2, 'color', '#fff');
            this.renderer.setElementStyle(this.btnIcon3, 'color', '#fff');
            this.renderer.setElementStyle(this.btnIcon4, 'color', '#fff');
            this.renderer.setElementStyle(this.btnIcon5, 'color', '#fff');
            // this.renderer.setElementStyle(this.bgScroll, 'opacity', '0');
            // this.renderer.setElementStyle(this.bgScroll, 'background', '#e60f1e');
        }
        else {
            console.log('else');
            this.renderer.setElementStyle(this.headerTop, 'position', 'absolute');
            this.renderer.setElementStyle(this.headerTop, 'background', 'transparent');
            this.renderer.setElementStyle(this.btnBack, 'color', '#747474');
            this.renderer.setElementStyle(this.btnIcon1, 'opacity', '0');
            this.renderer.setElementStyle(this.btnIcon1, 'color', '#747474');
            this.renderer.setElementStyle(this.btnIcon2, 'opacity', '0');
            this.renderer.setElementStyle(this.btnIcon2, 'color', '#747474');
            this.renderer.setElementStyle(this.btnIcon3, 'color', '#747474');
            this.renderer.setElementStyle(this.btnIcon4, 'color', '#747474');
            this.renderer.setElementStyle(this.btnIcon5, 'color', '#747474');
            // this.renderer.setElementStyle(this.bgScroll, 'opacity', '1');
            // this.renderer.setElementStyle(this.bgScroll, 'background', 'transparent');
        }
        if (ev.scrollTop > 200) {
            // if (opacity > 0) {
            //   opacity-=0.1;
            // }
            this.renderer.setElementStyle(this.btnFavo1, 'opacity', '0');
        }
        else {
            this.renderer.setElementStyle(this.btnFavo1, 'opacity', '1');
        }
        // this.renderer.setElementStyle(this.bgScroll, 'webkitTransform', 'translate3d(0,'+this.translateAmt+'px,0) scale('+this.scaleAmt+','+this.scaleAmt+')');
        this.renderer.setElementStyle(this.imgParallax, 'webkitTransform', 'translate3d(0,' + this.translateAmt + 'px,0) scale(' + this.scaleAmt + ',' + this.scaleAmt + ')');
    };
    HideHeaderDirective = __decorate([
        Directive({
            selector: '[hide-header]',
            host: {
                '(ionScroll)': 'onContentScroll($event)',
                '(window:resize)': 'onWindowResize($event)'
            }
        }),
        __metadata("design:paramtypes", [ElementRef,
            Renderer,
            Platform])
    ], HideHeaderDirective);
    return HideHeaderDirective;
}());
export { HideHeaderDirective };
//# sourceMappingURL=hide-header.js.map