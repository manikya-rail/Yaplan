$.fn.setupNaoInput = function() {
			   	console.log("Loaded page...");
				// trim polyfill : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
				if (!String.prototype.trim) {
					(function() {
						// Make sure we trim BOM and NBSP
						var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
						String.prototype.trim = function() {
							return this.replace(rtrim, '');
						};
					})();
				}
				console.log('step2');
				[].slice.call( document.querySelectorAll( 'input.input__field' ) ).forEach( function( inputEl ) {
					// in case the input is already filled..
					// events:
					inputEl.addEventListener( 'focus', onInputFocus );
					inputEl.addEventListener( 'blur', onInputBlur );


					if( inputEl.value.trim() !== '' ) {
						console.log('Input filled');
						classie.add( inputEl.parentNode, 'input--filled' );
					}

					$(inputEl).change(function(){
						if ($(this).val()!='')
							classie.add( inputEl.parentNode, 'input--filled' );
					});
				} );

				function onInputFocus( ev ) {
					console.log("Input got focus.");
					classie.add( ev.target.parentNode, 'input--filled' );
				}

				function onInputBlur( ev ) {
					if( ev.target.value.trim() === '' ) {
						classie.remove( ev.target.parentNode, 'input--filled' );
					}
				}           
};