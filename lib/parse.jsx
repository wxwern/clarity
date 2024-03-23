const parse = data => {
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("[clarity]", e, data);
    return undefined;
  }
};

export default parse;
