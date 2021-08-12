import Ember from 'ember';

export default Ember.Component.extend({
  rememberMe: false,
  identification: '',
  password: '',
  passwordVisible: false,
  notifyType: 0,
  session: Ember.inject.service(),
  registration : Ember.inject.service(),
  notification: {
    type: 0,
    msg: ""
  },
  isNotFilled : Ember.computed('identification', 'password', function(){

    var emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,4}))$/;
    return !(this.get('identification') && this.get('password') && emailPattern.test(this.get('identification')));
  }),
  didInsertElement: function() {
    this.set('session.store.cookieExpirationTime', null);
    Ember.run.scheduleOnce('afterRender', this, function() {
        this.$('body').setupNaoInput();
    });
  },
  actions: {
    authenticate() {
      NProgress.start();
      let { identification, password } = this.getProperties('identification', 'password');

      return this.get('session').authenticate('authenticator:devise', identification, password).then((response) => {
        NProgress.done();
        const self = this;
        let session_data = this.get('session.session.content.authenticated');
        // this.$('body').trackLogin(session_data.user_id);
        var registrationservice = this.get('registration');
        var transition = registrationservice.get('PREVIOUSURL');
        if(transition){
          transition.retry();
        }
        // this.$('body').initSentry(session_data.email, session_data.user_id);
      })
      .catch((reason) =>{
        NProgress.done();
        const self = this;
        this.set('notification', {
          type: 2,
          msg: reason.error
        });
        setTimeout(function(){
          self.set('notification.type', 0);
        }, 2000);
      });
    },
    toggleRememberMe: function() {
      this.set('rememberMe', !this.get('rememberMe'));
      debugger;
      if (this.get('rememberMe')) {
        Cookies.set('ember_simple_auth-session-expiration_time', (14 * 24 * 60 * 60));
        // this.set('session.store.cookieExpirationTime', (14 * 24 * 60 * 60));
      } else {
        Cookies.set('ember_simple_auth-session-expiration_time', null);
      }
    }
  },
});
