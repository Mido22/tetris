
var exec = {}
 ,  concurrent = {}
 ,  nodemon = {}
 ,  startTasks = []
 ,  concurrentTasks = []
 ,  watch = {}
 ,  sass={}
 ,  jade={}
 ,  copy={}
 ,  concat = {}
 ,  babel = {
      options:  {
        sourceMap: true,
        presets: ['es2015']
      }
    }
 , browserify = {
    options: {
      transform: ["babelify"]
    }
  }, mochaTest = {
    spec: {
      options: {
        require: ['should'],
        reporter: 'spec',
        ui: 'bdd',
        colors: true
      },
      src: ['test/**/*.js']
    }    
  }
;

/* for jade to html  */    
jade.html= {
  expand: true,
  src: ['**/*.jade', '!layout.jade'], 
  cwd: 'client/jade',
  ext : '.html',
  dest: '.'
};  
watch.jade = {
  tasks: ['jade:html'],
  files: 'client/jade/**'
};
startTasks.push('jade:html');
/* for jade to html end */  



/* Watch Grunt file*/
watch.grunt = {
  files: ['Gruntfile.js'],
  reload: true
};
/* Watch Grunt file end*/


/* for es6 to es5 */    
  babel.es6 = { files: {
    'prod/app.js': 'client/js/app.js'
  }};
  var es6Tasks = ['babel:es6'];
  startTasks.push.apply(startTasks, es6Tasks);
  watch.es6 =  {
                files: 'client/js/app.js',
                tasks: es6Tasks
  };  
/* for es6 to es5 */  

/* Browserify */    

  browserify.tetris = {
    files: {
      'prod/tetris.js': 'client/js/tetris/tetris.js'
    },
    options: {
      browserifyOptions: {standalone: 'Tetris'}
    }
  };
  startTasks.push('browserify:tetris');
  watch.browserifyTetris =  {
                files: 'client/js/tetris/**',
                tasks: ['browserify:tetris']
  };  
/* Browserify */  

/** for copying images and other static stuff*/
copy.static = {
  expand: true,
  src: 'client/static/**',
  dest: 'prod/',
  filter:'isFile',
  flatten: true
};
/** for copying images and other static stuff end*/

/* for npm start and for monitoring the js files for change and restarting server*/

nodemon.dev = {
  script: 'server/app.js',
  options: {
    ignore: [],
    ext: 'js',
    delay: 1000,
    watch:  ['server/app.js'],
    sourcemap: 'none'
  }
};
concurrent.nodemon = {
  tasks: ['nodemon:dev']
};
/* for  npm start end */  

/* for sass */

sass.scss = {  
  files: [{
    expand: true,
    cwd: 'client/scss',
    src: ['*.scss'],
    dest: 'prod',
    ext: '.css'
  }]
};
watch.scss = {
  files: 'client/scss/*.scss',
  tasks: ['sass:scss']
};
startTasks.push('sass:scss');
/* for sass end*/

/* Live reload*/

watch.reload = {
  files: 'dist/**',
  options: {livereload: true}
};
/*Live reload end*/



concurrentTasks.push.apply(concurrentTasks, ['concurrent:nodemon']);
watchAll = Object.keys(watch).map(v => 'watch:'+v); 
concurrentTasks.push.apply(concurrentTasks, watchAll); 
startTasks.push('copy:static');  
startTasks.push('concurrent:tasks');  

concurrent.tasks = {
  tasks: concurrentTasks,
  options: {
    logConcurrentOutput: true,
    limit: 31
  }
};    


module.exports = grunt => {
  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    nodemon,
    browserify,
    concurrent,
    watch,
    sass,
    babel,
    concat,
    exec,
    copy,
    jade,
    mochaTest
  });           
  grunt.registerTask('default', startTasks);
  grunt.registerTask('dev', startTasks);
  grunt.registerTask('test', 'mochaTest:spec');
};
