module.exports = function(grunt) {
	require('time-grunt')(grunt);

	const fs = require('fs'),
		chalk = require('chalk'),
		PACK = grunt.file.readJSON('package.json'),
		update = grunt.template.today("yyyy-mm-dd'T'HH-MM-ss").replace(/[- ]+/gi, '');
	require('load-grunt-tasks')(grunt);
	grunt.initConfig({
		globalConfig : {},
		pkg : {},
		clean: {
			zip: ['*.zip'],
		},
		copy: {
			main: {
				files: [
					{
						expand: true,
						cwd: 'codemirror/addon',
						src: ['**'],
						dest: 'plugins/codemirror/codemirror/addon/',
					},
					{
						expand: true,
						cwd: 'codemirror/lib',
						src: ['**'],
						dest: 'plugins/codemirror/codemirror/lib/',
					},
					{
						expand: true,
						cwd: 'codemirror/mode',
						src: ['**'],
						dest: 'plugins/codemirror/codemirror/mode/',
					},
					{
						expand: true,
						cwd: 'codemirror/theme',
						src: ['**'],
						dest: 'plugins/codemirror/codemirror/theme/',
					},
				],
			},
		},
		requirejs: {
			main: {
				options: {
					baseUrl: "src/js/",
					out: "plugins/codemirror/plugin.js",
					paths: {},
					wrap: true,
					skipModuleInsertion: true,
					optimize: "none",
					include: [
						"plugin.js",
					],
					done: function(done, output) {
						grunt.log.writeln(output.magenta);
						grunt.log.writeln("Build ".cyan + "done!\n");
						done();
					},
					error: function(done, err) {
						grunt.log.warn(err);
						done();
					},
				},
			},
		},
		uglify: {
			options: {
				sourceMap: false,
				banner: ``,
				compress: {
					drop_console: false
				},
				output: {
					ascii_only: true
				},
			},
			main: {
				files: [
					{
						expand: true,
						flatten : true,
						src: [
							"plugins/codemirror/plugin.js"
						],
						dest: "plugins/codemirror",
						filter: "isFile",
						rename: function (dst, src) {
							return dst + "/" + src.replace(".js", ".min.js");
						}
					},
					{
						expand: true,
						flatten : true,
						src: [
							"src/js/langs/*"
						],
						dest: "plugins/codemirror/langs",
						filter: "isFile"
					},
					{
						expand: true,
						flatten : true,
						src: [
							"src/pug/script.js"
						],
						dest: "src/pug",
						filter: "isFile",
						rename: function (dst, src) {
							return dst + "/" + src.replace(".js", ".min.js");
						}
					},
				],
			},
		},
		cssmin: {
			options: {
				mergeIntoShorthands: false,
				roundingPrecision: -1
			},
			minify: {
				files: {
					'src/pug/style.min.css' : ['src/pug/style.css'],
				}
			},
		},
		pug: {
			main: {
				options: {
					doctype: 'html',
					client: false,
					pretty: '',
					separator:  '',
					data: function(dest, src) {
						return {}
					}
				},
				files: [
					{
						expand: true,
						cwd: __dirname + '/src/pug/',
						src: [ '*.pug' ],
						dest: 'plugins/codemirror/',
						ext: '.html'
					}
				]
			},
		},
		compress: {
			main: {
				options: {
					archive: `codemirror.zip`,
				},
				files: [
					{
						src: [
							'plugins/**',
						],
						dest: `tinymce/`,
					},
				],
			},
			evo4: {
				options: {
					archive: `codemirrorEvo.zip`,
				},
				files: [
					{
						src: [
							'plugins/**',
						],
						dest: `codemirrorEvo/assets/plugins/tinymce4/tinymce/`,
					},
				],
			}
		},
	});
	grunt.registerTask('default',	[
		"clean",
		"copy",
		"requirejs",
		"uglify",
		"cssmin",
		"pug",
		"compress",
	]);
}
