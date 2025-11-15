export const customLog = (message: any, color = 'black') => {
  if (true) {
    switch (color) {
      case 'success':
        console.info(message);
        break;
      case 'info':
        console.info(message);
        break;
      case 'error':
        console.error(message);
        break;
      case 'warning':
        console.warn(message);
        break;
      default:
        console.log(message);
    }
  }
};
