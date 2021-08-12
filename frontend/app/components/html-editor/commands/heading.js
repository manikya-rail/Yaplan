import Command from './command';

export default class extends Command{
	/**
	 * Parameterized Constructor
	 * @Param : heading number
	 */
	 constructor(num){
	 	super('h-' + num);
	 	this.heading_num = num;
	 }

	 /**
	  * Makes text selected in the editor a heading
	  */
	 execute(){
	 	if (this.editor.isTextSelected()){
	 		this.editor.execCommand('heading', this.heading_num);
	 	}
	 }
}