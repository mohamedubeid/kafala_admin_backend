/* eslint-disable */
export function parseCookies(request) {
  const list: any = {};
  const cookieHeader = request.headers?.cookie;
  if (!cookieHeader) {
    return list;
  }

  cookieHeader.split(';').forEach(cookie => {
    let [name, ...rest] = cookie.split('=');
    name = name?.trim();
    if (!name) {
      return;
    }
    const value = rest.join('=').trim();
    if (!value) {
      return;
    }
    list[name] = decodeURIComponent(value);
  });

  return list;
}
