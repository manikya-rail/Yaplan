import Ember from 'ember';
import $ from 'jquery';

export default Ember.Service.extend({
  store: Ember.inject.service(),

  /**
   * Creates new blank document with one predefined section
   * @return {*|Promise|DS.Model}
   */
  createBlankDocument(project) {
    let store = this.get('store');

    let document = store.createRecord('document', {
      title: 'Untitled document',
      project_id: project
    });

    // @TODO: handle reject issues
    return new Ember.RSVP.Promise((resolve, reject) => {
      document.save().then(() => this.createSection(document).then(() => resolve(document)));
    });
  },

  createBlankTemplate(categoryid) {

    let document_template_object = {};
    document_template_object.document_template = {};
    document_template_object.document_template.category_id = categoryid;

    let self = this;
    var ajaxResponse;
    let store = this.get('store');

    $.ajax({
      async: false,
      url: "/v1/document_templates?",
      method: 'POST',
      data: document_template_object,
      success: function(response) {
        ajaxResponse = response;
        let templates = store.findAll('document_template');
        // templates.save();
      },
    });

    return ajaxResponse;

  },


  /**
   * Creates new document from provided template
   * @param template
   * @param project
   */
  createFromTemplate(template, project) {
    let document = this.get('store').createRecord('document');
    document.set('project_id', project);
    document.set('duplicate_from_id', template.id);

    return document.save();
  },

  /**
   * Creates new blank section and assigns it to given document
   *
   * @param document
   * @param index - Index where to put new section
   * @return {*|Promise|DS.Model}
   */
  createSection(document, index) {
    let store = this.get('store');

    let sectionContainer = store.createRecord('sectionContainer');

    //sectionText.text = '';

    let containers = document.get('section_containers'),
      length = containers.get('length');

    // if index where to put section is not passed - put it to the very end
    let position = typeof index != 'undefined' ? index : length;

    // sectionContainer.set('position', position);
    sectionContainer.set('document_id', document);
    var sectionText = store.createRecord('sectionText');
    sectionText.title = '';
    sectionContainer.set('section_text', sectionText);
    console.log('sending save')
    // persist container
    return sectionContainer.save();
  },

  /**
   * Creates document template from given document
   * @param document
   */
  createTemplate(document) {
    NProgress.start();
    let document_template_object = {};
    document_template_object.document_template = {};
    document_template_object.document_template.document_id = document.id;

    return $.post('/v1/document_templates?', document_template_object).then((res) => {
      NProgress.done();
      console.log('template', res);
    });

  },

  /**
   * Notify approver on approval request
   * @param document
   * @param additional message
   */
  issueApproval(document, msg) {
    let store = this.get('store');

    return $.post('/v1/documents/' + document.id + '/submit', { message: msg });
  },

  /**
   * Moves provided section to the new position
   * @param section
   * @param position
   */
  moveSection(section, position) {
    section.set('position', position);
    return section.save();
  },

  /**
   * Import sections to the target document
   */
  importSections(target, sections, isLink) {
    let store = this.get('store');

    return Ember.RSVP.Promise.all(sections.map((section) => {
      let sectionText = section.get('section_text');
      let newSection = store.createRecord('sectionContainer', { section_text: { id: sectionText.id } });
      let newSectionText = store.createRecord('sectionText');

      if (isLink) {
        newSectionText.set('id', sectionText.get('id'));
      } else {
        newSectionText.set('text', sectionText.get('text'));
        newSectionText.set('title', sectionText.get('title'));
      }

      newSection.set('document_id', target);
      newSection.set('section_text', newSectionText);

      return newSection.save();
    }));
  },

  /**
   * Creates image related to provided document
   */
  createImage(document, url) {
    let image = this.get('store').createRecord('image', {
      document: document,
      document_id: document.get('id'),
      image: url
    });

    return image.save();
  },

  /**
   * Deletes provided section
   * @param section
   */
  deleteSection(section) {
    return section.destroyRecord();
  },

  /**
   * Deletes provided document
   * @param document
   */
  deleteDocument(document) {
    return document.destroyRecord();
  },

  /**
   * Clones provided section
   * @param section
   */
  cloneSection(section) {
    var store = this.get('store');
    var sectionText = section.get('section_text');

    var newSection = store.createRecord('sectionContainer');
    newSection.set('document_id', section.get('document_id'));

    var newSectionText = store.createRecord('sectionText');
    newSectionText.title = sectionText.get('title');
    newSectionText.text = sectionText.get('text');

    newSection.set('section_text', newSectionText);

    return newSection.save();
  },

  /**
   * Shifts containers to the right starting from the given position. Just increases
   * position of the containers by one
   * @param containers
   * @param position
   * @private
   */
  _shiftContainers(containers, position) {
    containers.forEach(c => {
      let pos = c.get('position');
      pos >= position && c.set('position', pos + 1);
    });
  },

  changeState(document, state) {
    document.set('state', state);

    return document.save();
  },

  changeApprover(document, approver_id) {
    document.set('approverId', approver_id);

    return document.save();
  },

});
