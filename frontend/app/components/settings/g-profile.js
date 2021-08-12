import Ember from 'ember';
import $ from 'jquery';
import bubble from '../../utils/bubble';

export default Ember.Component.extend({
  id: '',
  password: '',
  full_name: '',
  first_name: '',
  last_name: '',
  email: '',
  country_code: '',
  phone_number: '',
  passwordVisible: false,
  notifyType: 0,
  session: Ember.inject.service(),
  users: Ember.inject.service(),
  isEditProfile: false,
  isnotEditProfile: true,
  uName: '',
  userdata: '',
  imageurl: '',
  showRemoveButton: null,
  router: Ember.inject.service(),
  notification: {
    type: 0,
    msg: ''
  },
  time_zone: '',
  time_array: [],

  utc_array: [],

  isNotFilled: Ember.computed('phone_number', 'first_name', 'last_name', function() {
    const self = this;
    let return_value = false
    let first_name = '';
    let last_name = '';
    if (self.get('first_name')) {
      first_name = self.get('first_name');
    } else {
      first_name = '';
    }
    if (self.get('last_name')) {
      last_name = self.get('last_name');
    } else {
      last_name = '';
    }
    if (this.get('phone_number')) {
      let phonenumber = self.get('phone_number');
      let a = /^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/.test(phonenumber);
      if (first_name.length == 0 || last_name.length == 0 || phonenumber.length == 0 || phonenumber.length > 15 || !a) {
        return_value = true;
      } else {
        return_value = false;
      }
    } else {
      return_value = true;
    }
    // console.log(return_value);
    return return_value;
  }),
  didInsertElement: function() {
    this._super(...arguments);
    Ember.run.scheduleOnce('afterRender', this, function() {

      let session_data = this.get('session.session.content.authenticated');

      let self = this;

      self.set('id', session_data.user_id);
      self.$('body').setupNaoInput();
      $.ajaxSetup({
        headers: {
          'X-User-email': session_data.email,
          'X-User-token': session_data.token
        }
      });

      $.ajax({
        type: "GET",
        url: "users/" + session_data.user_id,
        success: function(data) {
          // console.log(data);
          self.set('userdata', data.user);
          self.set('uName', data.user.full_name);
          self.set('full_name', data.user.full_name);
          self.set('phone_number', data.user.phone_number);
          self.set('country_code', data.user.country_code);
          self.set('first_name', data.user.first_name);
          self.set('last_name', data.user.last_name);
          self.set('time_zone', data.user.time_zone);
          if (data.user.portrait == null) {
            self.set('showRemoveButton', null);
            self.set('imageurl', 'assets/images/profile/default.png');
          } else {
            self.set('showRemoveButton', data.user.portrait.image.url);
            self.set('imageurl', data.user.portrait.image.url);
          }
        }
      });
    });
  }.observes('model'),
  initFormFields: function() {
    let session_data = this.get('session.session.content.authenticated');
    this.set('id', session_data.user_id);
    // this.set('full_name', session_data.full_name);
    this.set('email', session_data.email);
    // this.set('uName',session_data.full_name);
    let utcArray = [];
    this.set('time_array', this.get('users').getTimeZoneArray());
    let timeArray = this.get('time_array');
    timeArray.forEach(function(value, key) {
      let b = [];
      b = value.utc;
      if (value.utc) {
        b.forEach(function(value1, key1) {
          utcArray.push({ "name": value1, "value": value.text + value1})
        })
      }
    });
    this.set('utc_array', utcArray);
    // console.log(utcArray);
  }.on('didReceiveAttrs'),

  actions: {
    save() {
      NProgress.start();
      let { password, first_name, last_name, email, phone_number } = this.getProperties('password', 'first_name', 'last_name', 'email', 'phone_number');

      let componentContext = this;
      let c_code = document.getElementById('countryCode').value;
      let t_zone = document.getElementById('time-zone').value;
      let session_time_data = componentContext.get('session.session.content.authenticated');
      let session_time_zone = session_time_data.time_zone;
      var params = {};
      params = {
        "user": {
          "first_name": this.get('first_name'),
          "last_name": this.get('last_name'),
          "phone_number": this.get('phone_number'),
          "country_code": c_code,
          "time_zone": t_zone,
        }
      };

      let session_data = this.get('session.session.content.authenticated');
      $.ajaxSetup({
        headers: {
          'X-User-email': this.get('email'),
          'X-User-token': session_data.token
        }
      });

      $.ajax({
        type: "PATCH",
        url: "users/" + this.get('id'),
        data: params,
        success: function(data) {
          componentContext.set('uName', data.user.full_name);
          componentContext.set('full_name', data.user.full_name);
          componentContext.set('first_name', data.user.first_name);
          componentContext.set('last_name', data.user.last_name);
          componentContext.set('phone_number', data.user.phone_number);
          componentContext.set('country_code', data.user.country_code);
          componentContext.set('time_zone', data.user.time_zone);

          let s_data = componentContext.get('session.session.content.authenticated');
          if (session_time_zone == componentContext.get('time_zone')) {
            // componentContext.set('session.session.content.authenticated', s_data);
            if (data.user.portrait == null) {
              componentContext.set('imageurl', 'assets/images/profile/default.png');
            } else {
              componentContext.set('imageurl', data.user.portrait.image.url);
            }
            NProgress.done();
            componentContext.toggleProperty('isEditProfile');
            componentContext.toggleProperty('isnotEditProfile');
            componentContext.sendAction('updateProfile');
            componentContext.set('notification.type', 3);
            componentContext.set('notification.msg', 'Profile Successfully Updated');
            setTimeout(function() {
              componentContext.set('notification.type', 0);
            }, 2000);
          } else {
            alert("Time zone is updated successfully, you will be redirected to login screen.  Please Login again to check the changes.");
            const promise = componentContext.get('users').signoutTest();
            promise.then(() => {
              componentContext.get('session').invalidate();
              setTimeout(() => {
                Cookies.set('ember_simple_auth-session-expiration_time', null);
              }, 500);
            });
          }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          componentContext.set('notification.type', 3);
          componentContext.set('notification.msg', "Oops!, There was a technical glitch. Couldn't save the details");
          setTimeout(function() {
            componentContext.set('notification.type', 0);
          }, 2000);
        }
      });
    },

    /*
     ** Event handler : Opens up file selector dialog
     */
    uploadPortrait() {
      $('#portraitFilePicker').click();
    },

    /*
     ** Handles selected file
     */
    onFileSelect() {
      NProgress.start();
      let componentContext = this;
      let file_input = document.getElementById('portraitFilePicker');

      let file = file_input.files[0];
      if (!file)
        return;

      var reader = new FileReader();

      reader.addEventListener("load", function() {
        var dataURL = reader.result;
        componentContext.get('users').createPortrait(componentContext.get('id'), dataURL).then((res) => {
          $("#portrait img").attr('src', res.get('image').url + "?rand=" + Date.now());
          $('#portrait').css('background-image', 'url(' + res.get('image').url + "?rand=" + Date.now() + ')');
          $('#userportrait').css('background-image', 'url(' + res.get('image').url + "?rand=" + Date.now() + ')');
          componentContext.set('imageurl', res.get('image').url + "?rand=" + Date.now());
          componentContext.toggleProperty('isEditProfile');
          componentContext.toggleProperty('isnotEditProfile');
          componentContext.sendAction('updateProfile');
          NProgress.done();
          componentContext.set('showRemoveButton', res.get('image').url + "?rand=" + Date.now());
          componentContext.set('notification.type', 3);
          componentContext.set('notification.msg', 'Successfully Updated');
          setTimeout(function() {
            componentContext.set('notification.type', 0);
          }, 2000);

        }, (err) => {
          componentContext.set('notification.type', 3);
          componentContext.set('notification.msg', "Oops!, There was a technical glitch. Couldn't upload");
          setTimeout(function() {
            componentContext.set('notification.type', 0);
          }, 2000);
        });
      }, false);

      reader.readAsDataURL(file);
      $("#portraitFilePicker")[0].value = '';
    },

    editProfile: function() {
      this.toggleProperty('isEditProfile');
      this.toggleProperty('isnotEditProfile');
      this.set('full_name', this.get('uName'));
      this.send('setcountryCode');
    },

    cancel: function() {
      this.toggleProperty('isEditProfile');
      this.toggleProperty('isnotEditProfile');
      this.set('full_name', this.get('uName'));
    },

    setcountryCode: function() {
      const self = this;
      setTimeout(function() {
        if (self.get('country_code')) {
          $('select[name=countryCode]').val(self.get('country_code'));
          if (self.get('time_zone') !== 'UTC') {
            $('select[name=time-zone]').val(self.get('time_zone'));
          }
        }
      }, 1000);

      // console.log(self.get('time_zone'));
    },
    /*
     ** Removes profile image
     */
    removePortrait() {
      NProgress.start();
      let componentContext = this;
      this.get('users').removePortrait(this.get('id')).then(() => {
        $("#portrait img").attr('src', 'assets/images/profile/default.png');
        $('#portrait').css('background-image', 'url(' + 'assets/images/profile/default.png' + ')');
        $('#userportrait').css('background-image', 'url(' + 'assets/images/profile/default.png' + ')');
        componentContext.set('imageurl', 'assets/images/profile/default.png');

        componentContext.toggleProperty('isEditProfile');
        componentContext.toggleProperty('isnotEditProfile');
        componentContext.sendAction('updateProfile');
        NProgress.done();
        componentContext.set('showRemoveButton', null);
        componentContext.set('notification.type', 3);
        componentContext.set('notification.msg', `Profile Photo Removed.`);
        setTimeout(function() {
          componentContext.set('notification.type', 0);
        }, 2000);

      }, (err) => {
        NProgress.start();
        // console.log("Error while removing portrait.")
        NProgress.done();
        componentContext.set('notification.type', 3);
        componentContext.set('notification.msg', "Oops!, There was a technical glitch. Couldn't Remove the Profile Photo.");
        setTimeout(function() {
          componentContext.set('notification.type', 0);
        }, 2000);
      });
    }
  }
});
