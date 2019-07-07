const debounce = function(
  func: (...args: any) => any,
  wait: number,
  immediate?: boolean
) {
  if (immediate === undefined) immediate = false;
  let timeout: any;
  return function() {
    //@ts-ignore
    const context = this;
    const args: any = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};
export default debounce;
