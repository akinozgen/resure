const Toast = function ({ title, description, icon, priority, bgColor, loader, timeout = 5000 }) {
  return () => {
    $.toast({
      heading: title,
      text: description,
      icon,
      showHideTransition: 'fade',
      loader: loader ? true : false,
      loaderBg: bgColor ? bgColor : '#9EC600',
      hideAfter: timeout
    });
  }
};

$(document).ready(function (e) {
  
  const $uploaders = $('.uploader');
  $uploaders.each(function (index, $uploader) {
    $uploader = $($uploader);
    const input = $uploader.find('input');
    const img = $uploader.find('img');
    
    input.hide();
    
    input.on('click', function (e) {
      e.stopPropagation();
    });
    
    input.on('change', function (e) {
      e.stopPropagation();

      if (this.files && this.files[0]) {
        var reader = new FileReader();
    
        reader.onload = function(_e) {
          img.attr('src', _e.target.result);
        };
    
        reader.readAsDataURL(this.files[0]);
      }
    });
    
    $uploader.on('click', function (event) {
      event.stopPropagation();
      input.click();
    });
  });
  
});