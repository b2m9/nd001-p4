module.exports = function(grunt) {
    var jpegOptim = require("imagemin-jpegoptim");
    var pngZopfli = require("imagemin-zopfli");
    var pngQuant = require("imagemin-pngquant");

    grunt.initConfig({
        htmlmin: {
            main: {
                options: {
                    minifyCSS: true,
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
                    expand: true,
                    cwd: "src/",
                    src: ["**/*.html"],
                    dest: "dist/"
                }]
            }
        },
        cssmin: {
            main: {
                files: [{
                    expand: true,
                    cwd: "src/",
                    src: ["**/*.css"],
                    dest: "dist/"
                }]
            }
        },
        uglify: {
            main: {
                files: [{
                    expand: true,
                    cwd: "src/",
                    src: ["**/*.js"],
                    dest: "dist/"
                }]
            }
        },
        imagemin: {
            main: {
                options: {
                    optimizationLevel: 5,
                    progressive: true,
                    use: [
                        jpegOptim({
                            progressive: true,
                            max: 80
                        }),
                        pngZopfli(),
                        pngQuant()
                    ]
                },
                files: [{
                    expand: true,
                    cwd: "src/",
                    src: ["**/*.{png,jpg}"],
                    dest: "dist/"
                }]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-htmlmin");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-imagemin");

    grunt.registerTask("build", ["htmlmin", "cssmin", "uglify", "imagemin"]);
};
