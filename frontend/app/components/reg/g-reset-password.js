import Ember from 'ember';
import bubble from '../../utils/bubble';

export default Ember.Component.extend({
  password: '',
  passwordVisible: false,
  notifyType: 0,
  notifyMsg: '',
  passwordReset: false,

  users: Ember.inject.service(),

  isNotFilled: Ember.computed('password', 'token', function() {
    return !this.get('password') || !this.get('token');
  }),

  bubbleContinue: bubble('onContinue'),
  revealClass: Ember.computed('passwordVisible', function() {
    return Ember.String.htmlSafe(
      `tool-reveal ${this.get('passwordVisible') ? "ico_reg_eyeon" : "ico_reg_eyeoff"}`
    );
  }),
  actions: {
    reset() {
      let { token, password, passwordReset } = this.getProperties('token', 'password', 'passwordReset');
      let componentContext = this;


      if (passwordReset) {
        this.bubbleContinue();
      } else {
        this.get('users').resetPasswordwToken(password, token).then(function(data, textStatus, jqXHR) {
          componentContext.set('notifyType', 100);
          componentContext.set('notifyMsg', 'Password was reset successfully.');
          componentContext.set('passwordReset', true);

          //this.bubbleContinue();
        }, function(data, textStatus, jqXHR) {
          componentContext.set('notifyType', 2);
          componentContext.set('notifyMsg', 'Invalid token.');
        });
      }
    }
  },

  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      this.$('body').setupNaoInput();
    });
  }
});
