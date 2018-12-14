const fetch = require('./index')

jest.setTimeout(9000)

// TODO: mock HTML instead of actually scraping for tests!

it('can fetch', async () => {
  const data = await fetch()
  expect(data.locationName).toEqual('Point Nepean')

  expect(typeof data.swellHeightMin).toEqual('number')
})