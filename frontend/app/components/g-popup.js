import Ember from 'ember';
import $ from 'jquery';

export default Ember.Component.extend({
  classNames: ['g-popup'],
  classNameBindings: ['isOpened:opened'],

  isOpened: false,

  /**
   * When popup is opened - adds handlers for close, if it is closed - remove added handlers
   */
  addCloseHandlers: Ember.observer('isOpened', function(){
    if(this.get('isOpened')) {
      // defers close handlers adding so that, popup is not closed by click that opened it
      Ember.run.later(() =>{
        $(document).on('click.popup', (evt) =>{
          if($(evt.target).closest('.g-popup').length == 0) {
            this.close();
          }
        });

        $(document).on('keyup.popup', (evt) =>{
          if(evt.keyCode == 27) {
            this.close();
          }
        });
      });

    } else {
      $(document).off('click.popup keyup.popup');
    }
  }),

  /**
   * Shorthand for closing popup
   */
  close(){
    this.set('isOpened', false);
  }
});
