const ERROR_HANDLERS = {
  CastError: res =>
    res.status(400).send({ error: 'Id used is malformed' }),

  ValidationError: (res, { message }) =>
    res.status(409).send({ error: message }),

  JsonWebToken: res =>
    res.status(401).json({ error: 'Invalid token' }),

  TokenExpirerError: res =>
    res.status(401).json({ error: 'Token expited' }),

  defaultError: res =>
    res.status(500).end()
}

module.exports = (err, req, res, next) => {
  console.error(err.name)
  const handler = ERROR_HANDLERS[err.name] || ERROR_HANDLERS.defaultError
  handler(res, err)
}
