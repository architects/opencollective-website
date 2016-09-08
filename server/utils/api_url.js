import config from 'config';

export const url = (originalUrl) => {
  //console.log('RECEIVED', originalUrl)
  const result = rewriteUrl(originalUrl)
  //console.log('RETURNED', result)
  return result
}

export default url

export const rewriteUrl = (url) => {
  const withoutParams = config.host.api + (url.replace('/api/', '/'));
  const hasParams = `${url}`.match(/\?/)

  return `${withoutParams}${hasParams ? '&' : '?'}api_key=${config.apiKey}`;
};
