import numbro from 'numbro'

export const singularize = (value) =>
  value.replace(/s$/i, '')

export const titleCase = (value) => {
  const smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i

  return value.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, (match, index, title) => {
    if (index > 0 && index + match.length !== title.length &&
      match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" &&
      (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
      title.charAt(index - 1).search(/[^\s-]/) < 0) {
      return match.toLowerCase();
    }

    if (match.substr(1).search(/[A-Z]|\../) > -1) {
      return match;
    }

    return match.charAt(0).toUpperCase() + match.substr(1);
  })
};

export const currency = (value, props) => {
  const options = props.hash;
  options.precision = options.precision || 0;
  const number = numbro(value);
  return (options.precision == 2) ? number.format('$ 0,0.00') : number.format('$ 0,0');
}
