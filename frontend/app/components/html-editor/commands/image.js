import Command from './command';
import $ from 'jquery';

export default class extends Command {

  $panel;

  /**
   * Default constructor
   */
  constructor(){
    super('image', true);
  }

  /**
   * Makes text selected in the editor bold
   */
  execute(url){
    let html = `<p><div class="avoid-break"><img class="grapple-image align-left size-full" src="${url}" data-size="size-full"/></div></p>`;
    let commandContext = this;

    let $image = $(html);

    this.editor.insert($image);

    $image.find('img').on('load', function(){
      commandContext.editor.updateHeight();
    });

    this.editor.checkChange();
  }


  /**
   * Makes provided image moveable through then text
   * @param $image
   */
  makeMoveable($image){

  }

  /**
   * Registers command to the given editor
   */
  register(editor){
    super.register(editor);

    let getActive = function(){
      return editor.$editable.find('.grapple-image.active');
    };

    let updatePanelPosition = ($image) =>{
      let $panel = this.$panel;
      $panel.css($image.offset()).outerWidth($image.width());
      if($panel.offset().left + $panel.outerWidth() > editor.$editable.width()){
        $panel.css('left', editor.$editable.width() - $panel.outerWidth());
      }

      return $panel;
    };

    let helperGetSizeClass = (current_class, is_increase) =>{
      let arr_ordered_classes = [
        "size-ico",
        "size-xs",
        "size-sm",
        "size-md",
        "size-lg",
        "size-full"
      ];

      let current_index = arr_ordered_classes.indexOf(current_class);
      let new_index = current_index;

      if (is_increase){
        if (current_index < arr_ordered_classes.length - 1)
          new_index = current_index + 1;
      }else{
        if (current_index > 0)
          new_index = current_index - 1;
      }

      return arr_ordered_classes[new_index];
    };

    $(editor.doc).on('click', (evt) =>{
      let $target = $(evt.target);

      getActive().removeClass('active');

      if($target.hasClass('grapple-image')) {
        $target.addClass('active');
        updatePanelPosition($target).addClass('active');

      } else {
        this.$panel.removeClass('active');
      }
    });

    $(editor.doc).on('drop', function(){
      updatePanelPosition(getActive());
    });

    this.$panel = $('<ul class="image-pane">' +
      '<li class="align align-left" data-class="align-left"></li>' +
      '<li class="align align-center" data-class="align-center"></li>' +
      '<li class="align align-right" data-class="align-right"></li>' +
      '<li class="size size-decrease" data-type="decrease"></li>' +
      '<li class="size size-increase" data-type="increase"></li>' +
      '<li class="remove"></li></ul>')
      .prependTo(editor.doc.body);

    this.$panel.on('click', 'li.remove', (evt) =>{
      evt.stopPropagation();

      getActive().remove();
      this.$panel.removeClass('active');
      editor.checkChange();
    });

    this.$panel.on('click', 'li.align', (evt) =>{
      let $active = getActive();
      evt.stopPropagation();

      $active.removeClass('align-left align-right align-center').addClass(evt.target.getAttribute('data-class'));
      editor.checkChange();
      updatePanelPosition($active);
    });

    this.$panel.on('click', 'li.size', (evt) =>{
      let $active = getActive();
      evt.stopPropagation();

      let action_type = evt.target.getAttribute('data-type');
      let current_class = $active.attr('data-size');
      let new_class = helperGetSizeClass(current_class, (action_type=="increase"));
      
      $active.removeClass('size-ico size-xs size-sm size-md size-lg size-full').addClass(new_class);
      $active.attr('data-size', new_class);

      editor.checkChange();
      editor.updateHeight();
      updatePanelPosition($active);
    });
  }
}
