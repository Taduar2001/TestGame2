pc.script.create("UVShader",(function(n){const UVShader=function(n){this.entity=n};return UVShader.prototype.initialize=function(){const i=new pc.Material;i.shader=this.createShader(n.graphicsDevice),this.entity.model.meshInstances.forEach((n=>{n.material=i}))},UVShader.prototype.createShader=function(n){return new pc.Shader(n,{attributes:{aPosition:pc.SEMANTIC_POSITION,aUv0:pc.SEMANTIC_TEXCOORD0},vshader:"\n            attribute vec3 aPosition;\n            attribute vec2 aUv0;\n            varying vec2 vUv0;\n\n            uniform mat4 matrix_model;\n            uniform mat4 matrix_viewProjection;\n\n            void main(void) {\n                vUv0 = aUv0;\n                gl_Position = matrix_viewProjection * matrix_model * vec4(aPosition, 1.0);\n            }\n        ",fshader:"\n            precision mediump float;\n            varying vec2 vUv0;\n\n            void main(void) {\n                gl_FragColor = vec4(vUv0, 0.0, 1.0);\n            }\n        "})},UVShader}));var ScaleRectByScreenWidth=pc.createScript("scaleRectByScreenWidth");ScaleRectByScreenWidth.attributes.add("scaleFactor",{type:"number",default:1,title:"Scale Factor",description:"Коэффициент масштабирования (от 0 до 1)"}),ScaleRectByScreenWidth.attributes.add("refResolution",{type:"vec2",default:[1920,1080],title:"Reference Resolution",description:"Базовое разрешение экрана"}),ScaleRectByScreenWidth.attributes.add("targetRects",{type:"entity",array:!0,title:"Target Rects",description:"Список целевых объектов для масштабирования"}),ScaleRectByScreenWidth.prototype.initialize=function(){this.initScales=[];for(var e=0;e<this.targetRects.length;e++){var t=this.targetRects[e];t&&(this.initScales[e]=t.getLocalScale().clone())}this.updateScale(),this.app.graphicsDevice.on("resizecanvas",this.updateScale,this)},ScaleRectByScreenWidth.prototype.destroy=function(){this.app.graphicsDevice.off("resizecanvas",this.updateScale,this)},ScaleRectByScreenWidth.prototype.updateScale=function(){var e=this.refResolution.x/this.refResolution.y,t=this.app.graphicsDevice.width/this.app.graphicsDevice.height;if(t<e)for(var i=pc.math.lerp(1,t/e,this.scaleFactor),c=0;c<this.targetRects.length;c++){var a=this.targetRects[c];if(a){var r=this.initScales[c];a.setLocalScale(r.x*i,r.y*i,r.z)}}};var SearchObject=pc.createScript("searchObject");SearchObject.attributes.add("buttons",{type:"entity",array:!0}),SearchObject.attributes.add("mainImage",{type:"entity"}),SearchObject.attributes.add("gameManager",{type:"entity"}),SearchObject.attributes.add("searchDetect",{type:"entity"}),SearchObject.attributes.add("id",{type:"number"}),SearchObject.prototype.initialize=function(){for(var t=0;t<this.buttons.length;t++)this.buttons[t]&&this.buttons[t].element.on("click",this.onButtonPress,this)},SearchObject.prototype.onButtonPress=function(){this.gameManager.script.gameManager.addCountDetectObject(this.id),this.enabledObject()},SearchObject.prototype.enabledObject=function(){this.searchDetect.enabled=!0,null!=this.mainImage&&(this.mainImage.element.opacity=1),this.entity.enabled=!1};var HeartSystemWithAnimation=pc.createScript("heartSystemWithAnimation");HeartSystemWithAnimation.attributes.add("loseBackgrounds",{type:"entity",array:!0}),HeartSystemWithAnimation.attributes.add("gameManager",{type:"entity"}),HeartSystemWithAnimation.attributes.add("progressBar",{type:"entity"}),HeartSystemWithAnimation.attributes.add("sound",{type:"entity"}),HeartSystemWithAnimation.attributes.add("nameScene",{type:"string"}),HeartSystemWithAnimation.attributes.add("isMobile",{type:"boolean"}),HeartSystemWithAnimation.attributes.add("objects",{type:"entity",array:!0,title:"Objects"}),HeartSystemWithAnimation.attributes.add("targetScale",{type:"vec3",default:[1,1,1],description:"Целевой скейл объекта"}),HeartSystemWithAnimation.attributes.add("additionalScale",{type:"vec3",default:[.5,.5,.5],description:"Дополнительный скейл, добавляемый к целевому скейлу"}),HeartSystemWithAnimation.attributes.add("durationUp",{type:"number",default:1,description:"Длительность увеличения до целевого масштаба"}),HeartSystemWithAnimation.attributes.add("durationDown",{type:"number",default:1,description:"Длительность уменьшения до нуля"}),HeartSystemWithAnimation.attributes.add("durationScaleZero",{type:"number",default:.5,description:"Длительность уменьшения до нуля"}),HeartSystemWithAnimation.prototype.initialize=function(){this.disabledObjects=[],this.countHeat=0;for(var t=0;t<this.loseBackgrounds.length;t++)this.isMobile?this.loseBackgrounds[t].element.on("touchstart",this.disableNext,this):this.loseBackgrounds[t].element.on("click",this.disableNext,this);this.load(),window.addEventListener("beforeunload",(function(){}))},HeartSystemWithAnimation.prototype.load=function(){this.countHeat=JSON.parse(localStorage.getItem("heart")),null!=this.countHeat?this.disableNoAnim(this.countHeat):this.countHeat=0},HeartSystemWithAnimation.prototype.disableNoAnim=function(t){for(var e=0;e<t;e++)if(this.objects[e].enabled){const t=this.objects[e];t.setLocalScale(0,0,0),t.enabled=!1,this.disabledObjects.push(t)}},HeartSystemWithAnimation.prototype.reset=function(){this.disabledObjects=[];for(var t=0;t<this.objectsClone.length;t++)this.disabledObjects.push(this.objectsClone[t])},HeartSystemWithAnimation.prototype.disableNext=function(){this.sound.sound.play("Lose"),localStorage.setItem("heart",JSON.stringify(++this.countHeat));for(var t=0;t<this.objects.length;t++){if(!this.objects[this.objects.length-2].enabled)return void this.allObjectsDisabled();if(this.objects[t].enabled){const e=this.objects[t];return this.disabledObjects.push(e),void this.animateScaleDown(e,(()=>{e.enabled=!1}))}}},HeartSystemWithAnimation.prototype.enableAllNoAnim=function(){for(var t=0;t<this.disabledObjects.length;t++){const t=this.disabledObjects.pop();t.enabled=!0,t.setLocalScale(this.targetScale)}},HeartSystemWithAnimation.prototype.enableNext=function(){if(this.disabledObjects.length>0){var t=this.disabledObjects.pop();t.enabled=!0,this.animateScaleUp(t)}},HeartSystemWithAnimation.prototype.animateScaleDown=function(t,e){t.tween(t.getLocalScale()).to({x:0,y:0,z:0},this.durationScaleZero,pc.Linear).onComplete(e).start()},HeartSystemWithAnimation.prototype.animateScaleUp=function(t){t.setLocalScale(0,0,0),t.tween(t.getLocalScale()).to({x:this.targetScale.x+this.additionalScale.x,y:this.targetScale.y+this.additionalScale.y,z:this.targetScale.z+this.additionalScale.z},this.durationUp,pc.Linear).onComplete((()=>{t.tween(t.getLocalScale()).to({x:this.targetScale.x,y:this.targetScale.y,z:this.targetScale.z},this.durationDown,pc.Linear).start()})).start()},HeartSystemWithAnimation.prototype.allObjectsDisabled=function(){if(0==this.gameManager.script.gameManager.levelID)return this.progressBar.script.progressBar.stopTimer(),localStorage.setItem("timer",null),this.app.scenes.changeScene(this.nameScene),localStorage.setItem("heart",null),localStorage.setItem("ids",null),void localStorage.setItem("levelID",JSON.stringify(1));this.progressBar.script.progressBar.stopTimer(),this.gameManager.script.gameManager.showLastScore(),this.app.scenes.changeScene(this.nameScene),localStorage.setItem("heart",null),localStorage.setItem("ids",null),localStorage.setItem("levelID",null),localStorage.setItem("timer",null)};pc.extend(pc,function(){var TweenManager=function(t){this._app=t,this._tweens=[],this._add=[]};TweenManager.prototype={add:function(t){return this._add.push(t),t},update:function(t){for(var i=0,e=this._tweens.length;i<e;)this._tweens[i].update(t)?i++:(this._tweens.splice(i,1),e--);if(this._add.length){for(let t=0;t<this._add.length;t++)this._tweens.indexOf(this._add[t])>-1||this._tweens.push(this._add[t]);this._add.length=0}}};var Tween=function(t,i,e){pc.events.attach(this),this.manager=i,e&&(this.entity=null),this.time=0,this.complete=!1,this.playing=!1,this.stopped=!0,this.pending=!1,this.target=t,this.duration=0,this._currentDelay=0,this.timeScale=1,this._reverse=!1,this._delay=0,this._yoyo=!1,this._count=0,this._numRepeats=0,this._repeatDelay=0,this._from=!1,this._slerp=!1,this._fromQuat=new pc.Quat,this._toQuat=new pc.Quat,this._quat=new pc.Quat,this.easing=pc.Linear,this._sv={},this._ev={}},_parseProperties=function(t){var i;return t instanceof pc.Vec2?i={x:t.x,y:t.y}:t instanceof pc.Vec3?i={x:t.x,y:t.y,z:t.z}:t instanceof pc.Vec4||t instanceof pc.Quat?i={x:t.x,y:t.y,z:t.z,w:t.w}:t instanceof pc.Color?(i={r:t.r,g:t.g,b:t.b},void 0!==t.a&&(i.a=t.a)):i=t,i};Tween.prototype={to:function(t,i,e,s,n,r){return this._properties=_parseProperties(t),this.duration=i,e&&(this.easing=e),s&&this.delay(s),n&&this.repeat(n),r&&this.yoyo(r),this},from:function(t,i,e,s,n,r){return this._properties=_parseProperties(t),this.duration=i,e&&(this.easing=e),s&&this.delay(s),n&&this.repeat(n),r&&this.yoyo(r),this._from=!0,this},rotate:function(t,i,e,s,n,r){return this._properties=_parseProperties(t),this.duration=i,e&&(this.easing=e),s&&this.delay(s),n&&this.repeat(n),r&&this.yoyo(r),this._slerp=!0,this},start:function(){var t,i,e,s;if(this.playing=!0,this.complete=!1,this.stopped=!1,this._count=0,this.pending=this._delay>0,this._reverse&&!this.pending?this.time=this.duration:this.time=0,this._from){for(t in this._properties)this._properties.hasOwnProperty(t)&&(this._sv[t]=this._properties[t],this._ev[t]=this.target[t]);this._slerp&&(this._toQuat.setFromEulerAngles(this.target.x,this.target.y,this.target.z),i=void 0!==this._properties.x?this._properties.x:this.target.x,e=void 0!==this._properties.y?this._properties.y:this.target.y,s=void 0!==this._properties.z?this._properties.z:this.target.z,this._fromQuat.setFromEulerAngles(i,e,s))}else{for(t in this._properties)this._properties.hasOwnProperty(t)&&(this._sv[t]=this.target[t],this._ev[t]=this._properties[t]);this._slerp&&(i=void 0!==this._properties.x?this._properties.x:this.target.x,e=void 0!==this._properties.y?this._properties.y:this.target.y,s=void 0!==this._properties.z?this._properties.z:this.target.z,void 0!==this._properties.w?(this._fromQuat.copy(this.target),this._toQuat.set(i,e,s,this._properties.w)):(this._fromQuat.setFromEulerAngles(this.target.x,this.target.y,this.target.z),this._toQuat.setFromEulerAngles(i,e,s)))}return this._currentDelay=this._delay,this.manager.add(this),this},pause:function(){this.playing=!1},resume:function(){this.playing=!0},stop:function(){this.playing=!1,this.stopped=!0},delay:function(t){return this._delay=t,this.pending=!0,this},repeat:function(t,i){return this._count=0,this._numRepeats=t,this._repeatDelay=i||0,this},loop:function(t){return t?(this._count=0,this._numRepeats=1/0):this._numRepeats=0,this},yoyo:function(t){return this._yoyo=t,this},reverse:function(){return this._reverse=!this._reverse,this},chain:function(){for(var t=arguments.length;t--;)t>0?arguments[t-1]._chained=arguments[t]:this._chained=arguments[t];return this},onUpdate:function(t){return this.on("update",t),this},onComplete:function(t){return this.on("complete",t),this},onLoop:function(t){return this.on("loop",t),this},update:function(t){if(this.stopped)return!1;if(!this.playing)return!0;if(!this._reverse||this.pending?this.time+=t*this.timeScale:this.time-=t*this.timeScale,this.pending){if(!(this.time>this._currentDelay))return!0;this._reverse?this.time=this.duration-(this.time-this._currentDelay):this.time-=this._currentDelay,this.pending=!1}var i=0;(!this._reverse&&this.time>this.duration||this._reverse&&this.time<0)&&(this._count++,this.complete=!0,this.playing=!1,this._reverse?(i=this.duration-this.time,this.time=0):(i=this.time-this.duration,this.time=this.duration));var e,s,n=0===this.duration?1:this.time/this.duration,r=this.easing(n);for(var h in this._properties)this._properties.hasOwnProperty(h)&&(e=this._sv[h],s=this._ev[h],this.target[h]=e+(s-e)*r);if(this._slerp&&this._quat.slerp(this._fromQuat,this._toQuat,r),this.entity&&(this.entity._dirtifyLocal(),this.element&&this.entity.element&&(this.entity.element[this.element]=this.target),this._slerp&&this.entity.setLocalRotation(this._quat)),this.fire("update",t),this.complete){var a=this._repeat(i);return a?this.fire("loop"):(this.fire("complete",i),this.entity&&this.entity.off("destroy",this.stop,this),this._chained&&this._chained.start()),a}return!0},_repeat:function(t){if(this._count<this._numRepeats){if(this._reverse?this.time=this.duration-t:this.time=t,this.complete=!1,this.playing=!0,this._currentDelay=this._repeatDelay,this.pending=!0,this._yoyo){for(var i in this._properties){var e=this._sv[i];this._sv[i]=this._ev[i],this._ev[i]=e}this._slerp&&(this._quat.copy(this._fromQuat),this._fromQuat.copy(this._toQuat),this._toQuat.copy(this._quat))}return!0}return!1}};var BounceOut=function(t){return t<1/2.75?7.5625*t*t:t<2/2.75?7.5625*(t-=1.5/2.75)*t+.75:t<2.5/2.75?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375},BounceIn=function(t){return 1-BounceOut(1-t)};return{TweenManager:TweenManager,Tween:Tween,Linear:function(t){return t},QuadraticIn:function(t){return t*t},QuadraticOut:function(t){return t*(2-t)},QuadraticInOut:function(t){return(t*=2)<1?.5*t*t:-.5*(--t*(t-2)-1)},CubicIn:function(t){return t*t*t},CubicOut:function(t){return--t*t*t+1},CubicInOut:function(t){return(t*=2)<1?.5*t*t*t:.5*((t-=2)*t*t+2)},QuarticIn:function(t){return t*t*t*t},QuarticOut:function(t){return 1- --t*t*t*t},QuarticInOut:function(t){return(t*=2)<1?.5*t*t*t*t:-.5*((t-=2)*t*t*t-2)},QuinticIn:function(t){return t*t*t*t*t},QuinticOut:function(t){return--t*t*t*t*t+1},QuinticInOut:function(t){return(t*=2)<1?.5*t*t*t*t*t:.5*((t-=2)*t*t*t*t+2)},SineIn:function(t){return 0===t?0:1===t?1:1-Math.cos(t*Math.PI/2)},SineOut:function(t){return 0===t?0:1===t?1:Math.sin(t*Math.PI/2)},SineInOut:function(t){return 0===t?0:1===t?1:.5*(1-Math.cos(Math.PI*t))},ExponentialIn:function(t){return 0===t?0:Math.pow(1024,t-1)},ExponentialOut:function(t){return 1===t?1:1-Math.pow(2,-10*t)},ExponentialInOut:function(t){return 0===t?0:1===t?1:(t*=2)<1?.5*Math.pow(1024,t-1):.5*(2-Math.pow(2,-10*(t-1)))},CircularIn:function(t){return 1-Math.sqrt(1-t*t)},CircularOut:function(t){return Math.sqrt(1- --t*t)},CircularInOut:function(t){return(t*=2)<1?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1)},BackIn:function(t){var i=1.70158;return t*t*((i+1)*t-i)},BackOut:function(t){var i=1.70158;return--t*t*((i+1)*t+i)+1},BackInOut:function(t){var i=2.5949095;return(t*=2)<1?t*t*((i+1)*t-i)*.5:.5*((t-=2)*t*((i+1)*t+i)+2)},BounceIn:BounceIn,BounceOut:BounceOut,BounceInOut:function(t){return t<.5?.5*BounceIn(2*t):.5*BounceOut(2*t-1)+.5},ElasticIn:function(t){var i,e=.1;return 0===t?0:1===t?1:(!e||e<1?(e=1,i=.1):i=.4*Math.asin(1/e)/(2*Math.PI),-e*Math.pow(2,10*(t-=1))*Math.sin((t-i)*(2*Math.PI)/.4))},ElasticOut:function(t){var i,e=.1;return 0===t?0:1===t?1:(!e||e<1?(e=1,i=.1):i=.4*Math.asin(1/e)/(2*Math.PI),e*Math.pow(2,-10*t)*Math.sin((t-i)*(2*Math.PI)/.4)+1)},ElasticInOut:function(t){var i,e=.1,s=.4;return 0===t?0:1===t?1:(!e||e<1?(e=1,i=.1):i=s*Math.asin(1/e)/(2*Math.PI),(t*=2)<1?e*Math.pow(2,10*(t-=1))*Math.sin((t-i)*(2*Math.PI)/s)*-.5:e*Math.pow(2,-10*(t-=1))*Math.sin((t-i)*(2*Math.PI)/s)*.5+1)}}}()),function(){pc.AppBase.prototype.addTweenManager=function(){this._tweenManager=new pc.TweenManager(this),this.on("update",(function(t){this._tweenManager.update(t)}))},pc.AppBase.prototype.tween=function(t){return new pc.Tween(t,this._tweenManager)},pc.Entity.prototype.tween=function(t,i){var e=this._app.tween(t);return e.entity=this,this.once("destroy",e.stop,e),i&&i.element&&(e.element=i.element),e};var t=pc.AppBase.getApplication();t&&t.addTweenManager()}();var LevelManager=pc.createScript("levelManager");LevelManager.attributes.add("nameScene",{type:"string"}),LevelManager.attributes.add("levelOne",{type:"entity"}),LevelManager.attributes.add("levelTwo",{type:"entity"}),LevelManager.attributes.add("levelOneImage",{type:"entity"}),LevelManager.attributes.add("levelTwoImage",{type:"entity"}),LevelManager.attributes.add("gameManager",{type:"entity"}),LevelManager.attributes.add("progressBar",{type:"entity"}),LevelManager.prototype.nextLevel=function(){this.levelOne.enabled?(this.levelOne.enabled=!1,this.levelTwo.enabled=!0,this.levelTwoImage.element.color=pc.Color.BLUE,this.levelTwoImage.element.opacity=1,this.levelOneImage.element.color=pc.Color.GRAY,this.levelOneImage.element.opacity=.5,localStorage.setItem("heart",null),this.levelID=JSON.parse(localStorage.getItem("levelID")),0==this.levelID||null==this.levelID?(this.progressBar.script.progressBar.stopTimer(),this.progressBar.script.progressBar.startTimer(0)):(this.progressBar.script.progressBar.stopTimer(),this.progressBar.script.progressBar.startTimer(JSON.parse(localStorage.getItem("timer"))))):(console.log("Completed"),this.gameManager.script.gameManager.showLastScore(),this.progressBar.script.progressBar.stopTimer(),localStorage.setItem("heart",null),localStorage.setItem("ids",null),localStorage.setItem("levelID",null),localStorage.setItem("timer",null),this.app.scenes.changeScene("Loader"))};var GameManager=pc.createScript("gameManager");GameManager.attributes.add("maxCountObject",{type:"number",default:10}),GameManager.attributes.add("itemsOne",{type:"entity",array:!0}),GameManager.attributes.add("itemsTwo",{type:"entity",array:!0}),GameManager.attributes.add("levelManager",{type:"entity"}),GameManager.attributes.add("heartSystem",{type:"entity"}),GameManager.attributes.add("progressBar",{type:"entity"}),GameManager.attributes.add("sound",{type:"entity"}),GameManager.prototype.initialize=function(){this.ids=[],this.levelID=0,this.countHeat=3,this.scoreLevelOne=0,this.scoreLevelTwo=0,this.load()},GameManager.prototype.load=function(){if(this.ids=JSON.parse(localStorage.getItem("ids")),this.levelID=JSON.parse(localStorage.getItem("levelID")),this.scoreLevelOne=JSON.parse(localStorage.getItem("scoreOne")),this.scoreLevelTwo=JSON.parse(localStorage.getItem("scoreTwo")),null!=this.levelID&&1==this.levelID?(this.levelManager.script.levelManager.nextLevel(),this.levelID=1,this.items=this.itemsTwo):(this.levelID=0,localStorage.setItem("levelID",this.levelID),this.items=this.itemsOne),null!=this.ids){const t=this.items.filter((e=>this.ids.includes(e.script.searchObject.id)));for(var e=0;e<t.length;e++)t[e].script.searchObject.enabledObject()}else this.ids=[];null==this.scoreLevelOne&&(this.scoreLevelOne=0),null==this.scoreLevelTwo&&(this.scoreLevelTwo=0)},GameManager.prototype.saveInit=function(){localStorage.setItem("ids",JSON.stringify(this.ids))},GameManager.prototype.showLastScore=function(){console.log("Score:"+(this.scoreLevelOne+this.scoreLevelTwo))},GameManager.prototype.addCountDetectObject=function(e){this.ids.push(e),this.sound.sound.play("Pick"),0==this.levelID?(this.scoreLevelOne=100*this.ids.length,localStorage.setItem("scoreOne",this.scoreLevelOne)):(this.scoreLevelTwo=100*this.ids.length,localStorage.setItem("scoreTwo",this.scoreLevelTwo)),this.ids.length>=this.maxCountObject&&(0==this.levelID?(this.progressBar.script.progressBar.isBonus()?this.scoreLevelOne=150*this.ids.length:this.scoreLevelOne=100*this.ids.length,localStorage.setItem("scoreOne",this.scoreLevelOne)):(this.progressBar.script.progressBar.isBonus()?this.scoreLevelTwo=150*this.ids.length:this.scoreLevelTwo=100*this.ids.length,localStorage.setItem("scoreTwo",this.scoreLevelTwo)),this.ids=[],this.levelID=1,this.heartSystem.script.heartSystemWithAnimation.enableAllNoAnim(),this.levelManager.script.levelManager.nextLevel(),localStorage.setItem("levelID",JSON.stringify(this.levelID))),this.saveInit()};var ProgressBar=pc.createScript("progressBar");ProgressBar.attributes.add("progressImage",{type:"entity"}),ProgressBar.attributes.add("progressImageMaxWidth",{type:"number"}),ProgressBar.attributes.add("fillTime",{type:"number",default:5}),ProgressBar.attributes.add("timerText",{type:"entity"}),ProgressBar.attributes.add("heartSystem",{type:"entity"}),ProgressBar.prototype.initialize=function(){this.imageRect=this.progressImage.element.rect.clone(),this.progress=1,this.remainingTime=0,this.isRunning=!1,this.load(),window.onbeforeunload=function(){}},ProgressBar.prototype.load=function(){this.remainingTime=JSON.parse(localStorage.getItem("timer")),null!=this.remainingTime?this.startTimer(this.remainingTime):this.startTimer(this.fillTime)},ProgressBar.prototype.setProgress=function(e){e=pc.math.clamp(e,0,1),this.progress=e;var t=pc.math.lerp(0,this.progressImageMaxWidth,e);this.progressImage.element.width=t,this.imageRect.copy(this.progressImage.element.rect),this.imageRect.z=e,this.progressImage.element.rect=this.imageRect},ProgressBar.prototype.updateTimerText=function(e){localStorage.setItem("timer",JSON.stringify(Math.ceil(e))),this.timerText&&this.timerText.element&&(this.timerText.element.text=Math.ceil(e).toString())},ProgressBar.prototype.startTimer=function(e){this.remainingTime=e||this.fillTime,this.setProgress(this.remainingTime/this.fillTime),this.updateTimerText(this.remainingTime),this.isRunning=!0},ProgressBar.prototype.stopTimer=function(){this.isRunning=!1},ProgressBar.prototype.onTimerComplete=function(){this.heartSystem.script.heartSystemWithAnimation.allObjectsDisabled()},ProgressBar.prototype.isBonus=function(){return this.remainingTime>=this.fillTime/2},ProgressBar.prototype.update=function(e){if(this.isRunning){this.remainingTime-=e;var t=this.remainingTime/this.fillTime;this.setProgress(t),this.updateTimerText(this.remainingTime),this.remainingTime<=0&&(this.isRunning=!1,this.updateTimerText(0),this.onTimerComplete())}};var Loader=pc.createScript("loader");Loader.attributes.add("desktop",{type:"entity"}),Loader.attributes.add("mobile",{type:"entity"}),Loader.prototype.initialize=function(){this.isMobile()?(this.desktop.enabled=!0,this.mobile.enabled=!1):(this.mobile.enabled=!0,this.desktop.enabled=!1)},Loader.prototype.start=function(){this.isMobile()?this.loadScene("GameScene_Desktop"):this.loadScene("GameScene_Mobile")},Loader.prototype.isMobile=function(){return!pc.platform.mobile},Loader.prototype.loadScene=function(e){this.app.scenes.changeScene(e)};var SaveLoad=pc.createScript("saveLoad");SaveLoad.attributes.add("levelOne",{type:"entity"}),SaveLoad.attributes.add("levelTwo",{type:"entity"}),SaveLoad.attributes.add("buttonOne1",{type:"entity"}),SaveLoad.attributes.add("buttonOne2",{type:"entity"}),SaveLoad.attributes.add("buttonTwo1",{type:"entity"}),SaveLoad.attributes.add("buttonTwo2",{type:"entity"}),SaveLoad.attributes.add("loader",{type:"entity"}),SaveLoad.prototype.initialize=function(){this.load(),this.buttonOne1.element.on("click",this.btnOne1,this),this.buttonOne2.element.on("click",this.btnOne2,this),this.buttonTwo1.element.on("click",this.btnOne1,this),this.buttonTwo2.element.on("click",this.btnTwo2,this),this.scoreLevelOne=JSON.parse(localStorage.getItem("scoreOne")),null==this.scoreLevelOne&&(this.scoreLevelOne=0),this.scoreLevelTwo=JSON.parse(localStorage.getItem("scoreTwo")),null==this.scoreLevelTwo&&(this.scoreLevelTwo=0)},SaveLoad.prototype.load=function(){this.levelID=JSON.parse(localStorage.getItem("levelID")),0==this.levelID?(this.levelTwo.enabled=!1,this.levelOne.enabled=!0):1==this.levelID?(this.levelTwo.enabled=!0,this.levelOne.enabled=!1):this.btnOne1()},SaveLoad.prototype.btnOne1=function(){this.loader.script.loader.start()},SaveLoad.prototype.btnOne2=function(){localStorage.setItem("levelID",JSON.stringify(1)),localStorage.setItem("ids",null),localStorage.setItem("heart",null),localStorage.setItem("timer",null),this.loader.script.loader.start()},SaveLoad.prototype.btnTwo2=function(){console.log("Score:"+(this.scoreLevelOne+this.scoreLevelTwo)),localStorage.setItem("levelID",JSON.stringify(0)),localStorage.setItem("ids",null),localStorage.setItem("heart",null),localStorage.setItem("timer",null),this.loader.script.loader.start()};pc.script.createLoadingScreen((function(e){e.on("preload:end",(function(){e.off("preload:progress")}))}));