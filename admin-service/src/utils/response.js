export const success = (res, data) => {
  return res.json({
    data
  });
};

export const successPaginated = (res, data, meta) => {
  return res.json({
    data,
    meta
  });
};

export const error = (res, code, message, status = 400) => {
  return res.status(status).json({
    error: {
      code,
      message
    }
  });
};