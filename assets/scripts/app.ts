/// <reference path="../../typings/tsd.d.ts" />

import SequenceCall = jquery.velocity.SequenceCall;
interface JQuery {
    typed(options:any) : JQuery;
}

interface Velocity {
    RunSequence(options:any) : void;
}

$.Velocity.RunSequence([]);

class Scene {
    private _sceneBox:JQuery;
    private _contentBoxContent:JQuery;
    private _sequence:Array<SequenceCall>;
    private _text:Array<JQuery>;
    private _counter:number;


    constructor(sceneBox:JQuery) {
        this.text = [];
        this.sceneBox = sceneBox;
        this.contentBoxContent = sceneBox.children('.text').eq(0);
        var _that = this;
        this.contentBoxContent.children('p').each(function (index, el) {
            _that.text.push($(el));
        });
        var sequences = [];
        this.text.forEach(function (element, index) {
            sequences.push(
                <SequenceCall>{e: element, p: {translateX: 100}, o: {duration: 1000}}
            );
        })
        this.sequence = sequences;
        this.counter = 0;
    }

    get sceneBox():JQuery {
        return this._sceneBox;
    }

    set sceneBox(value:JQuery) {
        this._sceneBox = value;
    }

    get contentBoxContent():JQuery {
        return this._contentBoxContent;
    }

    set contentBoxContent(value:JQuery) {
        this._contentBoxContent = value;
    }

    get sequence():Array<SequenceCall> {
        return this._sequence;
    }

    set sequence(value:Array<SequenceCall>) {
        this._sequence = value;
    }

    get text():Array<JQuery> {
        return this._text;
    }

    set text(value:Array<JQuery>) {
        this._text = value;
    }

    get counter():number {
        return this._counter;
    }

    set counter(value:number) {
        this._counter = value;
    }

    public startSequence():any {
        if (this.counter === 0) {
            this._contentBoxContent.velocity("transition.flipBounceYIn", 1000);
        }
        var _that = this;
        this.text[this.counter].typed({
            strings: [this.text[this.counter].eq(0).text()],
            contentType: 'html',
            loop: false,
            startDelay: 1,
            callback: function () {
                if (_that.counter < _that.text.length - 1) {
                    $('.typed-cursor').remove();
                    _that.counter++;
                    setTimeout(_that.startSequence(), 500);
                }
            }
        });
        this.text[this.counter].show(250);
    }
}

class App {

    private _swiper;
    private _scenes:Array<Scene>;
    private _events:Array<CustomEvent>;
    private _lastScenePlayed:boolean;

    constructor() {
        this._scenes = [];
        this._events = [];
        this.initSwiper();
        this.initHearts();
        this.lastScenePlayed = false;
    }

    get lastScenePlayed():boolean {
        return this._lastScenePlayed;
    }

    set lastScenePlayed(value:boolean) {
        this._lastScenePlayed = value;
    }

    get swiper() {
        return this._swiper;
    }

    set swiper(value) {
        this._swiper = value;
    }


    get scenes():Scene[] {
        return this._scenes;
    }

    set scenes(value:Scene[]) {
        this._scenes = value;
    }

    get events():Array<CustomEvent> {
        return this._events;
    }

    set events(value:Array<CustomEvent>) {
        this._events = value;
    }

    private initSwiper() {
        this._swiper = new Swiper('.swiper-container', <SwiperOptions>{
            pagination: '.swiper-pagination',
            paginationClickable: true,
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev',
            parallax: true,
            speed: 600,
            paginationType: 'progress',
            mousewheelControl: true,
            keyboardControl: true,
        });
        var _that = this;
        this.swiper.slides.each(function (index, scene) {
            _that.events.push(new CustomEvent('SceneStart' + index));
            _that.scenes.push(new Scene($(scene)));
            scene.addEventListener('SceneStart' + index, () => _that.scenes[index].startSequence());
        });
        this.scenes[0].sceneBox.get(0).dispatchEvent(this.events[0]);
        this._swiper.on('onSlideChangeEnd', function (swiper) {
            _that.scenes[swiper.activeIndex].sceneBox.get(0).dispatchEvent(_that.events[swiper.activeIndex]);
            if (swiper.activeIndex === 6 && _that.lastScenePlayed === false) {
                var heart1 = document.createElement('div');
                heart1.className = 'pounding-heart pounding-heart1';
                var heart2 = document.createElement('div');
                heart2.className = 'pounding-heart pounding-heart2';
                document.body.appendChild(heart1);
                document.body.appendChild(heart2);
                setTimeout(function () {
                    var heart3 = document.createElement('div');
                    heart3.className = 'pounding-heart pounding-heart1';
                    var heart4 = document.createElement('div');
                    heart4.className = 'pounding-heart pounding-heart2';
                    document.body.appendChild(heart3);
                    document.body.appendChild(heart4);
                }, 300);
                _that.lastScenePlayed = true;
            }
        });
    }


    private initHearts() {
        for (var i = 0; i < 80; i++) {
            var d = document.createElement('div');
            d.className = 'floating-heart';
            var a = Math.random() * 50 + 20 + 'px';
            d.style.width = a;
            d.style.height = a;
            d.style.bottom = Math.random() * (window.innerHeight * 2) + 'px';
            d.style.left = (Math.random() * document.body.getElementsByClassName('parallax-bg').item(0).clientWidth) * 0.5 + 'px';
            document.body.getElementsByClassName('parallax-bg').item(0).appendChild(d);
            this.animateHearts(d);
        }
    }

    private animateHearts(a) {
        var _that = this;
        $(a).animate({
            bottom: document.body.offsetHeight + 'px',
            left: '+=' + ((Math.random() * 100) - 50) + 'px'
        }, Math.random() * 2000 + 1000, 'linear', function () {
            a.style.bottom = '-50px';
            _that.animateHearts(a);
        });
    }
}

var app = new App();