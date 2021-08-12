import Ember from 'ember';
import $ from 'jquery';

export default Ember.Mixin.create({
  on: false,

  /**
   * Currently selected value
   * @type any
   */
  value: null,

  text: null,

  options: null,


  /**
   * Handles click on the button
   */
  click(){
    this.set('on', !this.get('on'));
  },

  // temporary. not very good
  afterRenderHook: function(){
    Ember.run.later(() =>{
      this.initOptions();
      this.initText();
    });

  }.on('didRender'),

  /**
   * If options was not provided - initializes it from entire HTML
   */
  initOptions(){
    if(!this.options) {
      var options = [];
      $('li[data-id]', this.element).each((index, o) =>{
        options.push({id: o.getAttribute('data-id'), title: o.innerHTML});
      });

      this.set('options', options);
    }
  },

  initText(){
    this.set('text', this.optionToText(this.findOption(this.get('value'))));
  },

  /**
   * Takes something that could be ether id value or option object or empty value and returns
   * appropriate option from this.options or null
   * @param it
   */
  findOption(it){
    return this.options.filter(o => o == it|| o.id == it)[0] || null;
  },

  /**
   * Handler that watches value property and updates text property
   */
  updateTextHandler: Ember.observer('value', function(){
    this.set('text', this.optionToText(this.get('value')));
  }),

  /**
   * Retuns text value for given option
   * @param option
   * @return {*}
   */
  optionToText(option){
    return option ? option.get ? option.get('title') : option.title || option : this.placeholder;
  },

  actions: {
    /**
     * Handles when user clicks one of the option
     * @param opt
     */
    clickOption(opt){
      var newValue = this.findOption(opt);

      if(this.get('value') != newValue) {
        this.set('value', newValue);
        this.sendAction('onChange', newValue);
      }
    }
  }

});
