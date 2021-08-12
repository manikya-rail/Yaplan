import Ember from 'ember';

export default Ember.Component.extend({
  class: Ember.computed('type', function() {
  	let cssClass;
    switch (this.get('type')) {
      case 0: //Invisible
        cssClass = 'hidden';
        break;
      case 1: //Invalid Credentials
        cssClass = 'error';
        break;
      case 2: //Invalid Input
        cssClass = 'error';
        break;
      case 3: //Invalid Input
        cssClass = 'warning';
        break;
      case 4: //Invalid Input
        cssClass = 'warning';
        break;
      case 100:
        cssClass = 'success';
        break;
      default:
        cssClass = '';
    }
    return Ember.String.htmlSafe(`g-reg-notify ${cssClass}`);
  }),
  message: Ember.computed('type', 'msg', function() {
    let msg = this.get('msg');

    if (msg != "" && msg != undefined && msg != null)
      return msg;

    switch (this.get('type')) {
      case 0: //Invisible
        return '';
      case 1: //Invalid Credentials
        return 'Wrong email or password. Please try again.';
      case 2: //Invalid Input
        return 'Please enter valid input.';
      case 3: //Invalid Input
        return 'In progress...';
      case 4:
        return 'Successfully saved.';
      case 100:
        return 'Successfully saved.';
      default:
        return '';
    }
  }),

  actions: {
    hideNotification() {
      this.set('type', 0);
    }
  }
});
