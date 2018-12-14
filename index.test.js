const fetch = require('./index')

it('can fetch', async () => {
  const name = await fetch().name
  expect(name).toEqual('Point Nepean')
})