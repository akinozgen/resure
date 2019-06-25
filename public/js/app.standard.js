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