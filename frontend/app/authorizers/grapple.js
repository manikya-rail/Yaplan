import Base from 'ember-simple-auth/authorizers/base';
import $ from 'jquery';

// [demid] @todo possible move it to env configuration
const tokenAttributeName = 'token';
const identificationAttributeName = 'email';

export default Base.extend({

  /**
   * Includes user token and identification
   * @param {Object} data The data that the session currently holds
   * @param {Function} block(headerName,headerContent) The callback to call with the authorization data; will receive the header name and header content as arguments
   */
  authorize(data, block){
    block('X-User-email', data[identificationAttributeName]);
    block('X-User-token', data[tokenAttributeName]);
    block('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));

    Ember.$.ajaxPrefilter(function(options, oriOptions, jqXHR){
      jqXHR.setRequestHeader("X-User-email", data[identificationAttributeName]);
      jqXHR.setRequestHeader("X-User-token", data[tokenAttributeName]);
    });
  }
});
