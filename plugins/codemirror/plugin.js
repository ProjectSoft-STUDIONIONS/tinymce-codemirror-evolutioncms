/**
 *
 * The source HTML code of the CodeMirror plugin
 *
 * plugin.js
 *
 * Copyright 2013 Web Power, www.webpower.nl
 * @author Arjan Haverkamp
 * @author ProjectSoft <projectsoft2009@yandex.ru>
 *
 */

!(function(tiny){

/* jshint unused:false */
/* global tinymce:true */

tiny.PluginManager.requireLangPack('codemirror');

tiny.PluginManager.add('codemirror', function(editor, url) {
	function showSourceEditor() {
		editor.focus();
		editor.selection.collapse(true);
		let codeSettings = editor.settings.codemirror ? Object.assign({}, editor.settings.codemirror) : {};
		codeSettings.indentOnInit = true;
		codeSettings.fullscreen = codeSettings.fullscreen ? true : false;
		codeSettings.iframe = codeSettings.iframe ? codeSettings.iframe : 'source.html';
		codeSettings.path = "codemirror";
		codeSettings.config = codeSettings.config ? Object.assign(codeSettings.config, {
			mode: "application/x-httpd-php",
			lineNumbers: true,
			indentUnit: 4,
			tabSize: 4,
			theme: "mariana"
		}) : {
			mode: "application/x-httpd-php",
			lineNumbers: true,
			indentUnit: 4,
			tabSize: 4,
			theme: "mariana"
		};
		codeSettings.saveCursorPosition = codeSettings.saveCursorPosition ?  true : false;
		codeSettings.jsFiles = codeSettings.jsFiles ? codeSettings.jsFiles : [
			"mode/php/php.js",
			"addon/edit/matchbrackets.js",
			"mode/xml/xml.js",
			"mode/javascript/javascript.js",
			"mode/css/css.js",
			"mode/htmlmixed/htmlmixed.js",
			"addon/selection/active-line.js"
		];
		codeSettings.cssFiles = codeSettings.cssFiles ? codeSettings.cssFiles : [
			"lib/codemirror.css",
			"theme/mariana.css"
		];

		editor.settings.codemirror = Object.assign({}, codeSettings);
		// Insert caret marker
		if (editor.settings.codemirror.saveCursorPosition) {
			editor.selection.setContent('<span style="display: none;" class="CmCaReT">&#x0;</span>');
		}

		var buttonsConfig = (tiny.majorVersion < 5)
			? [
				{
					text: 'Ok',
					subtype: 'primary',
					onclick: function() {
						var doc = document.querySelectorAll('.mce-container-body>iframe')[0]
						doc.contentWindow.submit()
						win.close()
					},
				},
				{
					text: 'Cancel',
					onclick: 'close',
				},
			]
			: [
				{
					type: 'custom',
					text: 'Ok',
					name: 'codemirrorOk',
					primary: true,
				},
				{
					type: 'cancel',
					text: 'Cancel',
					name: 'codemirrorCancel',
				},
			];
		var config = {
			title: 'The source HTML code of the CodeMirror plugin',
			url: url + '/' + editor.settings.codemirror.iframe,
			classes: 'codemirror-dialog',
			width: window.innerWidth - 100,
			height: window.innerHeight - 200,
			resizable: true,
			maximizable: true,
			fullScreen: editor.settings.codemirror.fullscreen,
			saveCursorPosition: true,
			buttons: buttonsConfig,
			size: 'normal'
		};

		if (tiny.majorVersion >= 5) {
			config.onAction = function (dialogApi, actionData) {
				if (actionData.name === 'codemirrorOk') {
					var doc = document.querySelectorAll('.tox-dialog__body-iframe iframe')[0];
					doc.contentWindow.submit();
					editor.undoManager.add();
					win.close();
				}
			}
		}

		var win = (tiny.majorVersion < 5)
			? editor.windowManager.open(config)
			: editor.windowManager.openUrl(config);
		if (editor.settings.codemirror.fullscreen) {
			win.fullscreen(true);
		}
	}

	if (tiny.majorVersion < 5) {
		// Add a button to the button bar
		editor.addButton('codemirror', {
			title: 'The source HTML code of the CodeMirror plugin',
			image: tinymce.baseURL + '/plugins/codemirror/codemirror.svg',
			//icon: 'codesample',
			onclick: showSourceEditor,
		});

		// Add a menu item to the tools menu
		editor.addMenuItem('codemirror', {
			//icon: 'codesample',,
			image: tinymce.baseURL + '/plugins/codemirror/codemirror.svg',
			text: 'The source HTML code of the CodeMirror plugin',
			context: 'tools',
			onclick: showSourceEditor,
		});
	} else {
		editor.ui.registry.addButton('codemirror', {
			//icon: 'sourcecode',
			image: tinymce.baseURL + '/plugins/codemirror/codemirror.svg',
			title: 'The source HTML code of the CodeMirror plugin',
			tooltip: 'The source HTML code of the CodeMirror plugin',
			onAction: showSourceEditor,
		});

		editor.ui.registry.addMenuItem('codemirror', {
			//icon: 'sourcecode',
			image: tinymce.baseURL + '/plugins/codemirror/codemirror.svg',
			text: 'The source HTML code of the CodeMirror plugin',
			onAction: showSourceEditor,
			context: 'tools',
		});
	}
});

}(tinymce));

