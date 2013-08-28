
var SWF_NS = 'swf',
	_replaceMarkupIE = function(markup, values) {
		var arr;
		$.each(values, function(key, value) {
			if(value === undefined || value === false) {
				return true;
			}
			arr = key.split('_');
			markup = markup.replace('%'+ arr[0] +'%', value);
		});
		return markup;
	};

$.magnificPopup.registerModule(SWF_NS, {
	options: {
		markup: '<div class="mfp-swf-scaler">'+
				'<div class="mfp-close"></div>'+
				'<object id="mfp-swf-object" class="mfp-swf" type="application/x-shockwave-flash" data="" width="100%" height="100%">'+
					'<param name="allowfullscreen" value="true" />'+
					'<param name="allowscriptaccess" value="always" />'+
					'<param class="mfp-wmode" name="wmode" value="opaque" />'+
					'<p class="mfp-fallback"></p>'+
				'</object>'+
			'</div>',
		markupIE: '<div class="mfp-swf-scaler">'+
				'<div class="mfp-close"></div>'+
				'<object id="mfp-swf-object" class="mfp-swf" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%">'+
					'<param name="movie" value="%movie%" />'+
					'<param name="allowfullscreen" value="true" />'+
					'<param name="allowscriptaccess" value="always" />'+
					'<param name="wmode" value="%wmode%" />'+
					'<p class="mfp-fallback">%fallback%</p>'+
				'</object>'+
			'</div>',
		wmode: 'opaque',
		fallback: 'This page requires <a href="http://get.adobe.com/flashplayer/">Adobe Flash Player</a>',
	},
	proto: {
		initSwf: function() {
			mfp.types.push(SWF_NS);
			mfp.isIE = navigator.appVersion.indexOf("MSIE") !== -1; // TODO: watch out for different UA string in IE11

			_mfpOn('BeforeOpen', function(e) {
					if (mfp.isIE) mfp.st[SWF_NS].markup = mfp.st[SWF_NS].markupIE;
			});
		},
		getSwf: function(item, template) {
			var embedSrc = item.src;
			var swfSt = mfp.st.swf;
			
			var dataObj = {
				wmode_value: swfSt.wmode,
				fallback: swfSt.fallback,
			};
			if (mfp.isIE) {
				dataObj.movie_value = embedSrc;	// 'movie' param for IE
				// Replace values in markup string and recreate <object> in DOM
				// (IE BUG) -> elements under <object> cannot be simply selected and modified
				var markup = _replaceMarkupIE(swfSt.markup, dataObj);
				template = mfp.currTemplate[SWF_NS] = $(markup);
			} else {
				dataObj.swf_data = embedSrc;
			}
			mfp._parseMarkup(template, dataObj, item);
			mfp.updateStatus('ready');
			return template;
		}
	}
});
