import Ember from 'ember';
import autosave from 'ember-autosave';
import bubble from '../../utils/bubble';
import $ from 'jquery';
import _ from 'underscore';

export default Ember.Component.extend({
  // document model editor works with
  document: null,
  documents: Ember.inject.service(),

  showAddSectionWizard: false,
  showUploadImageDialog: false,

  sectionInitiatedUpload: null,

  showAddSectionWizardChange: Ember.observer('showAddSectionWizard', function(){
    Ember.run.later(() =>{
      let $content = $('.document-content', this.element),
        el = $content[0];

      $content.animate({scrollTop: el.scrollHeight - el.offsetHeight});
    });
  }),

  /**
   * Sort the sections according to the position (initially when document loaded)
   */
  initSectionOrder: function(){
    let sectionContainers = this.get('document.sectionContainers');

    sectionContainers = _.sortBy(sectionContainers, 'position');
    this.set('document.sectionContainers', sectionContainers);

  }.on('didReceiveAttrs'),

  /**
   * Initializes section reordering functionality
   */
  initSectionReorder: function(){
    $('.document-content', this.element).sortable({
      containment: 'parent',
      cursor: 'move',
      handle: '.ia-handler',
      tolerance: 'pointer',
      items: '.g-section',
      axis: 'y',
      opacity: 0.9,
      helper: 'original',
      scroll: true,
      stop: (event, ui) =>{
        ui.item.trigger('reorder', {});
      }
    });

    var timer = null;
    $(window).on('dragover', () =>{
      if(timer) {
        clearTimeout(timer);
        timer = null;
      }

      $('.g-document-editor', this.element).addClass('drag');
    });

    $(window).on('dragleave', () =>{
      setTimeout(() =>{
        $('.g-document-editor', this.element).removeClass('drag');
      }, 100);

    });


  }.on('didInsertElement'),

  /**
   * Handles resize on window and resizes editor to appropriate size
   */
  initResize: function(){
    var resize = () =>{
      let $content = $('.document-content', this.element);
      $content.height($(document).innerHeight() - $content.offset().top);
      //console.log($content.offset());
    };

    resize();

  }.on('didInsertElement'),

  /**
   * Handles scrolling event for section menu floating effect
   */
  setupScrollMonitor: function(){
    $('#document-content').on('scroll', function(e){
      //var scrollTop = this.scrollTop;
      $('#document-content > .g-section').each(function(index){
        var offset = $(this).position();
        var height = $(this).innerHeight();

        if ((offset.top < 0) && (offset.top + height - 90 > 0)){
          $(this).find('.section-menu').css('top', offset.top * -1 + 25);
          $(this).find('.g-popup').css('top', offset.top * -1 + 55);
        }else{
          $(this).find('.section-menu').css('top', '25');
          $(this).find('.g-popup').css('top', '55');
        }
      });
    });    
  }.on('didInsertElement'),

  // proxy object for autosaving document when user changes its properties
  documentProxy: autosave('document', {
    save(model){
      this.sendAction('onSaving');

      model.save().then(()=> this.sendAction('onSaved'));
    }
  }),

  actions: {
    onSaved: bubble('onSaved'),
    onSaving: bubble('onSaving'),

    /**
     * Adds blank section to document
     */
    addBlankSection(){
      const self = this;
      this.get('documents').createSection(this.document).then(() => {
        self.notifyPropertyChange('document.section_containers')
      });
      // console.log('HIDDING');
      this.set('showAddSectionWizard', !this.get('showAddSectionWizard'));
    },

    /**
     * Import section from existing document
     */
    importSection(){
      this.sendAction('importSection', this.document);
    },

    /**
     * Import section from existing document
     */
    linkSection(){
      this.sendAction('linkSection', this.document);
    },

    openAttachImageDialog(sourceSection){
      this.sectionInitiatedUpload = sourceSection;
      this.set('showUploadImageDialog', !this.showUploadImageDialog);
    },

    

    /**
     * Adds uploaded image to section that initiated upload
     * @param url
     */
    addUploadedImage(url){
      this.sectionInitiatedUpload.addImage(url);
    }
  }
});
