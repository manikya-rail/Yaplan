import Ember from 'ember';

export default {
  name: 'toasters',

  initialize: function(application) {
 		var Toaster = Ember.Object.extend({
		  	planToaster(text, upgrade_route, label_upgrade, label_close) {
		  		let plan_toaster = {
		  			icon: 'info-circle',
				    active: false,
				    text: text,
				    links: []
		  		};
		  		plan_toaster.links.push({
			      title: label_upgrade,
			      toggler: false,
			      target: upgrade_route
			    });
			    plan_toaster.links.push({
			      title: label_close,
			      toggler: true
			    });

			    return plan_toaster;
		  	},

		  	approvalToaster(text) {
		  		let approval_toaster = {
		  			icon: 'info-circle',
		  			active: false,
		  			text: text,
		  			links: []
		  		}

		  		return approval_toaster;
		  	}
	  });
	  application.register('toaster:main', Toaster);
	  application.inject('component', 'toaster', 'toaster:main');
  }
};
