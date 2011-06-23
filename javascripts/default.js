function render(val) {
  // $('#preview').html(Haml.render(val));
}

$(document).ready(function()
{
  // jQuery uniform controls (http://pixelmatrixdesign.com/uniform)
  $("select, input:checkbox, input:radio, input:file").uniform();

  // Tooltips (http://onehackoranother.com/projects/jquery/tipsy)
  $('#link-github').tipsy();

  // Editor
  var editor = CodeMirror.fromTextArea('code', {
    // parserfile: ["haml-colors/parsepython.js"],
    stylesheet: "javascripts/codemirror/haml-colors/pythoncolors.css",
    basefiles: ["javascripts/codemirror/codemirror_base.js"],
    // path: "javascripts/codemirror/",
    // lineNumbers: true,
    textWrapping: true,
    indentUnit: 4,
    parserConfig: {'pythonVersion': 2, 'strictErrors': true},
    iframeClass: "editor",
    height: '100%'
  });

  // Switch
  $('#switch').iphoneSwitch("on",
    function() {
      $('.editor').hide();
      $('#preview').show();
      render(editor.getCode());
      $('#preview').css('top', '35px');
    },
    function() {
      $('#preview').hide();
      $('.editor').show();
      $('.editor').focus();
    },
    {
      switch_path: 'images/switch.png'
    }
  );

  // Manage click events
  $('.example').click(function() {
    switch(this.id)
    {
      case "example-welcome":
        $('#code').load('examples/welcome.haml', function() {
          editor.setCode($('#code').val());
          $('#preview').html( Haml.render(editor.getCode()) );
        });
        break;

      case "example-screenshot":
        $('#code').load('examples/screenshot.haml', function() {
          editor.setCode($('#code').val());
          $('#preview').html( Haml.render(editor.getCode()) );
        });
        break;

      case "example-simple-block":
        $('#code').load('examples/simple-block.haml', function() {
          editor.setCode($('#code').val());
          $('#preview').html( Haml.render(editor.getCode()) );
        });
        break;

      case "example-login":
        $('#code').load('examples/login.haml', function() {
          editor.setCode($('#code').val());
          $('#preview').html( Haml.render(editor.getCode()) );
        });
        break;

      case "example-signup":
        $('#code').load('examples/signup.haml', function() {
          editor.setCode($('#code').val());
          $('#preview').html( Haml.render(editor.getCode()) );
        });
        break;

      case "example-big-big":
        $('#code').load('examples/big-big.haml', function() {
          editor.setCode($('#code').val());
          $('#preview').html( Haml.render(editor.getCode()) );
        });
        break;

      default:
        break;
    }
  });

  render($('#code').val());
  $('.editor').hide();
});