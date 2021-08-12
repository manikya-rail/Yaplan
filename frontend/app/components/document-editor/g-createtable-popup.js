import Ember from 'ember';
import $ from 'jquery';

export default Ember.Component.extend({
  rows : 0,
  cols : 0,

  // currently this does not affect view !!!
  columnCount : 10,

  dimensionChanged : function(){
    let cells = $('span', this.element);

    cells.removeClass('active');

    for(let i = 0; i < this.rows; i++){
      for(let j = 0; j < this.cols; j++){
        cells.eq(i * this.columnCount + j).addClass('active');
      }
    }
  }.observes('rows', 'cols'),

  /**
   * Binds events for showing table dimension and for creating table when cell is clicked
   */
  bindEvents : function(){
    $(this.element).on('mouseover', 'span', (evt) => {
      let i = $(evt.target).prevAll('span').length;

      this.set('rows', Math.floor(i / this.columnCount) + 1);
      this.set('cols', i % this.columnCount + 1);
    });

    $(this.element).on('click', 'span', (evt) =>{
      this.sendAction('createTable', this.rows, this.cols);
    });

    }.on('didInsertElement')
});
