const parse = data => {
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

export default parse;
