import Ember from 'ember';
import $ from 'jquery';

import BoldCommand from './commands/bold';
import ItalicCommand from './commands/italic';
import UnderlineCommand from './commands/underline';
import StrikeCommand from './commands/strike';
import UnorderedListCommand from './commands/unordered-list';
import OrderedListCommand from './commands/ordered-list';
import HeadingCommand from './commands/heading';
import AlignCommand from './commands/align';
import FontIncreaseCommand from './commands/font-up';
import FontDecreaseCommand from './commands/font-down';

import TableCommand from './commands/table';
import ImageCommand from './commands/image';

/**
 * @class Editor
 */
export default Ember.Component.extend({
  classNames: ['g-html-editor'],

  classNameBindings: ['isEmpty:empty'],

  MIN_HEIGHT: 150,

  /**
   * JQuery Reference to the IFRAME element where editor is contained
   *
   * @type HTMLIFrameElement
   */
  iframe: null,

  /**
   * Reference to the document of the editor iframe
   *
   * @type Document
   */
  doc: null,

  /**
   * JQuery reference to the editable element
   *
   * @type jQuery
   */
  $editable: null,

  /**
   * String value currently set to the editable area
   *
   * @type string
   */
  value: null,

  /**
   * Popup toolpane with commands that changes content like bold, italic, list etc
   *
   * @type jQuery
   */
  $toolpane: null,

  /**
   * List of commands that could be applied to content. Commands are registered in pane and shown as icons
   *
   * @type Array
   */
  commands: [],

  isEmpty: true,

  valueChange: Ember.observer('value', function(){
    this.set('isEmpty', !this.value || this.value == '<br>');
  }),

  initProperties: function(){
    this.set('commands', []);

  }.on('init'),

  /**
   * Initializes default command available to the editor
   */
  initDefaultCommands: function(){
    this.set('commands', []);

    this.registerCommand(new BoldCommand());
    this.registerCommand(new ItalicCommand());
    this.registerCommand(new UnderlineCommand());
    this.registerCommand(new StrikeCommand());

    this.registerCommand(new UnorderedListCommand());
    this.registerCommand(new OrderedListCommand());

    this.registerCommand(new FontIncreaseCommand());
    this.registerCommand(new FontDecreaseCommand());

    this.registerCommand(new TableCommand());
    this.registerCommand(new ImageCommand());


    this.registerCommand(new AlignCommand('left'));
    this.registerCommand(new AlignCommand('center'));
    this.registerCommand(new AlignCommand('right'));
    this.registerCommand(new AlignCommand('full'));
  },

  /**
   * Initializes editor component
   */
  initEditor: function(){
    let $iframe = $('<iframe frameborder="0"/>').on('load', () =>{
      this.initEditableContent();
    });

    this.iframe = $iframe[0];

    $iframe.appendTo(this.element);

  }.on('didInsertElement'),

  /**
   * Initializes editable content. Called when IFRAME is completely loaded
   */
  initEditableContent(){
    let self = this;
    this.doc = this.iframe.contentDocument;
    this.win = this.iframe.contentWindow;

    // adds stylesheet
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = '/assets/html-editor.css';

    this.doc.head.appendChild(link);

    this.$editable = $(this.doc.body.appendChild(this.doc.createElement('div')));
    this.$toolpane = $('.html-editor-toolpane', this.element);

    $(document.body).append(this.$toolpane);

    this.$editable[0].contentEditable = true;

    this.doc.execCommand("enableInlineTableEditing", false, false);
    this.doc.execCommand("enableObjectResizing", false, false);

    this.$editable
      .on('keyup', evt => this.checkChange())
      .on('keyup paste', evt => this.updateHeight())
      .on('keyup mouseup', evt => {
        this.checkSelection()
        this.checkChange()
      })
    ;

    // sets initial value to editable area
    this.$editable.html(this.value);

    this.$editable.find('img').on('load', (event) =>{
        setTimeout(function(){
          self.updateHeight();
        }, 500);
    });

    this.initDefaultCommands();
    this.updateHeight();
  },

  initValue: function(){
    this.set('isEmpty', !this.value || this.value == '<br>');

  }.on('didReceiveAttrs'),

  /**
   * Helper : Trims HTML value
   */
  trimHTML: function(html_str){

  },
  /**
   * Registers component in target
   * @TODO: candidate for moving to some mixin. However it has small collisions with DDAU approach
   */
  _registerWithParent: function(){
    this.attrs.registerAs.update(this);
  }.on('init'),

  /**
   * Returns current selection object
   * @return Selection
   */
  getSelection(){
    return this.win.getSelection();
  },

  /**
   * Returns if text is currently selected
   * @return {boolean}
   */
  isTextSelected(){
    return !!this.getSelection().toString();
  },

  /**
   * Executes provided command
   * @param name
   * @param arg
   */
  execCommand(name, arg){
    this.doc.execCommand(name, false, arg);
    this.checkChange();
  },

  execute(name){
    var command = this.commands.filter(c => c.name == name)[0];
    var args = Array.prototype.slice.call(arguments);
    args.shift();

    if(command) {
      command.execute.apply(command, args);
    }
  },

  click(){
    this.$editable.focus();
  },

  /**
   * Checks if content of the editable area was updated and in case it did - change value property
   */
  checkChange(){
    if(this.value != this.$editable.html()) {
      this.set('value', this.$editable.html());
      this.updateHeight();
      //this.$editable.scrollTop(0);
    }
  },

  /**
   * When content of editor is changing - updates container height, so that
   * all content is visible
   */
  updateHeight(){
    var contentHeight = this.$editable.outerHeight();

    if(contentHeight != this.iframe.offsetHeight) {
      this.iframe.style.height = Math.max(contentHeight, this.MIN_HEIGHT) + 'px';
    }
    /*var body = this.doc.body;

    if(body.scrollHeight != this.iframe.offsetHeight) {
      this.iframe.style.height = Math.max(body.scrollHeight, this.MIN_HEIGHT) + 'px';
    }*/
  },

  /**
   * Registers command in the editor
   * @param command
   */
  registerCommand(command){
    this.get('commands').push(command);

    command.register && command.register(this);
  },

  /**
   * Checks if we have selected text and in case we have - shows toolpane popup
   */
  checkSelection(){
    Ember.run.next(() =>{
      let sel = this.getSelection(),
        hasSelection = !!$.trim(sel.toString());

      this.$toolpane.css('visibility', hasSelection ? 'visible' : 'hidden');

      if(hasSelection) {
        this.$toolpane.css(this.getToolpaneCoords(sel));
      }
    });
  },

  /**
   * Inserts mixed content at the current caret position
   */
  insert(it){
    var range = this.getSelection().getRangeAt(0);

    if(it instanceof $) {
      it.each((index, node) =>{
        range.insertNode(node);
      })
    } else if (typeof it == "string"){
      this.insert($(it));

    } else {
      range.insertNode(it);
    }
  },

  /**
   * Returns position for the toolbar pane
   */
  getToolpaneCoords(sel){
    let range = sel.getRangeAt(0).cloneRange();
    let coords = range.getClientRects()[0];
    let offset = $(this.iframe).offset();

    if(coords) {
      return {
        top: offset.top + coords.top - this.$toolpane.height() - 8,
        left: offset.left + coords.left - this.$toolpane.width() / 2
      };
    }

    return null;
  },

  // User actions
  actions: {
    /**
     * Handles when user clicks on the toolpane icon
     * @param command
     */
    clickPaneIcon(command){
      command.execute();

      this.getSelection().getRangeAt(0).collapse(false);
      this.checkSelection();
    }
  }
});
