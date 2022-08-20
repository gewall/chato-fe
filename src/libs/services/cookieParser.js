const cookieParser = (value) => {
  const cookie = document.cookie.split("; ").find((_) => _.match(value));

  const _cookie = cookie?.slice(value.length + 1, cookie.length);

  return _cookie;
};

export default cookieParser;
