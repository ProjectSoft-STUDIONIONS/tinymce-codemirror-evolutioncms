/**
 * plugin.js
 *
 * Copyright 2013 Web Power, www.webpower.nl
 * @author Arjan Haverkamp
 */

/* jshint unused:false */
/* global tinymce:true */

tinymce.PluginManager.requireLangPack('codemirror');

tinymce.PluginManager.add('codemirror', function(editor, url) {
	function showSourceEditor() {
		editor.focus();
		editor.selection.collapse(true);
		let codeSettings = editor.settings.codemirror ? Object.assign({}, editor.settings.codemirror) : {};
		codeSettings.indentOnInit = true;
		codeSettings.fullscreen = codeSettings.fullscreen ? true : false;
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

		var buttonsConfig = (tinymce.majorVersion < 5)
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
			url: url + '/source.html',
			width: window.innerWidth - 100,
			height: window.innerHeight - 200,
			resizable: true,
			maximizable: true,
			fullScreen: editor.settings.codemirror.fullscreen,
			saveCursorPosition: true,
			buttons: buttonsConfig,
			size: 'normal'
		};

		if (tinymce.majorVersion >= 5) {
			config.onAction = function (dialogApi, actionData) {
				if (actionData.name === 'codemirrorOk') {
					var doc = document.querySelectorAll('.tox-dialog__body-iframe iframe')[0];
					doc.contentWindow.submit();
					editor.undoManager.add();
					win.close();
				}
			}
		}

		var win = (tinymce.majorVersion < 5)
			? editor.windowManager.open(config)
			: editor.windowManager.openUrl(config);

		if (editor.settings.codemirror.fullscreen) {
			win.fullscreen(true);
		}
	}

	if (tinymce.majorVersion < 5) {
		// Add a button to the button bar
		editor.addButton('codemirror', {
			title: 'The source HTML code of the CodeMirror plugin',
			icon: 'codesample',
			onclick: showSourceEditor,
		});

		// Add a menu item to the tools menu
		editor.addMenuItem('codemirror', {
			icon: 'codesample',
			text: 'The source HTML code of the CodeMirror plugin',
			context: 'tools',
			onclick: showSourceEditor,
		});
	} else {
		editor.ui.registry.addButton('codemirror', {
			icon: 'sourcecode',
			title: 'The source HTML code of the CodeMirror plugin',
			tooltip: 'The source HTML code of the CodeMirror plugin',
			onAction: showSourceEditor,
		});

		editor.ui.registry.addMenuItem('codemirror', {
			icon: 'sourcecode',
			text: 'The source HTML code of the CodeMirror plugin',
			onAction: showSourceEditor,
			context: 'tools',
		});
	}
});
