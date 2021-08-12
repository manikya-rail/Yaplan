import Command from './command';

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

export default class extends Command{
	/**
	 * Parameterized Constructor
	 * @Param : align type
	 */
	 constructor(type){
	 	super('align-' + type);
	 	this.align_type = type;
	 }

	 /**
	  * Aligns text selected in the editor 
	  */
	 execute(){
	 	if (this.editor.isTextSelected()){
	 		this.editor.execCommand('justify'+this.align_type.capitalize());
	 	}
	 }
}