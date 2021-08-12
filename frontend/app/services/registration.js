import Ember from 'ember';
import $ from 'jquery';

export default Ember.Service.extend({
  REGISTRATION_URL: '/users',
  PREVIOUSURL : null,

  /**
   * Sends new user registration request and returns promise
   * @param fullName
   * @param email
   * @param password
   */
  register(firstName, lastName, email, password){
    return $.post(
      this.REGISTRATION_URL,
      {
        user : {
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password
        }
      }
    );
  },


});
