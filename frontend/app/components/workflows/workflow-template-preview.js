import Ember from 'ember';

export default Ember.Component.extend({

router: Ember.inject.service('-routing'),
wid: '',
showButton: true,
didReceiveAttrs() {
	this._super(...arguments);
	const self = this;
	if(this.snapshot) {
		// self.set('showButton', true);
		document.querySelector('img').dispatchEvent(new CustomEvent('wheelzoom.reset'));
		document.querySelector('img').dispatchEvent(new CustomEvent('wheelzoom.destroy'));
		self.send('setId');
	}
},

actions: {

	clickImage() {
		document.querySelector('img').dispatchEvent(new CustomEvent('wheelzoom.reset'));
		document.querySelector('img').dispatchEvent(new CustomEvent('wheelzoom.destroy'));
		const self = this;
		self.set('wid', Math.floor((Math.random() * 678) + 1));
		setTimeout(function(){
			self.send('setZoomfunction');
		}, 1000);
	},

	setZoomfunction() {
		wheelzoom($('#workflow'+this.get('wid')+'.zoom'));
		this.set('showButton', false);
	},

	closemodal() {
		document.querySelector('#workflow'+this.get('wid')).dispatchEvent(new CustomEvent('wheelzoom.reset'));
		// document.querySelector('img').dispatchEvent(new CustomEvent('wheelzoom.destroy'));
		const self = this;
		this.set('active', false);
		// window.location.reload();
	},

	willClearRender() {
		document.querySelector('img').dispatchEvent(new CustomEvent('wheelzoom.reset'));
		document.querySelector('img').dispatchEvent(new CustomEvent('wheelzoom.destroy'));
	},

	setId() {
		this.set('wid', Math.floor((Math.random() * 678) + 1));
		console.log(this.get('wid'));
	}
},


});
