import fetch from './index'

// FIXME: tests are failing at the moment - seems to be a typescript compilation issue, or a puppeteer in test env issue ?

jest.setTimeout(9000)

// TODO: mock HTML instead of actually scraping for tests!

it('can fetch', async () => {
  const data = await fetch()

  // @ts-ignore
  expect(data.locationName).toEqual('Point Nepean')

  // @ts-ignore
  expect(typeof data.swellHeightMin).toEqual('number')
})