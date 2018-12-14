import cheerio from 'cheerio'
import puppeteer from 'puppeteer'

const url = 'http://www.vicports.vic.gov.au/community-and-bay-users/Pages/Waves-wind-weather.aspx'
const SELECTOR = '.waves ul [role="listitem"] em'

const getObservation = (html: string, index: number, stripUnit: string) => {
  const element = cheerio(SELECTOR, html)[index].children[0]

  if (!element.data) { return null }

  return parseFloat(
    element.data
    .replace(` ${stripUnit}`, '')
  )
}

const fetchBuoyData = async () => {
  try {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto(url)

    console.log(process.env.NODE_ENV)
    // await console.log(page.evaluate(() => console.log(`url is ${location.href}`)))

    // Wait for swell height to be populated
    // Note that you can't use the SELECTOR variable here as it's not in scope for Puppeteer
    // @ts-ignore // This gets run in the puppeteer browser session
    await page.waitForFunction(
      (selector) => !!document.querySelector(selector).innerHTML,
      {},
      SELECTOR
    )

    const html = await page.content()

    const locationName = cheerio('.waves h2', html)[0].children[0].data

    const swellHeightMin = getObservation(
      html,
      0,
      'm'
    )
    const swellHeightMax =
      parseFloat(
        cheerio(SELECTOR, html)[1].children[0].data!
        .replace(' m', '')
      )
    const swellPeriodMin =
      parseFloat(
        cheerio(SELECTOR, html)[2].children[0].data!
        .replace(' s', '')
      )
    const swellPeriodMax =
      parseFloat(
        cheerio(SELECTOR, html)[3].children[0].data!
        .replace(' s', '')
      )
    const swellDirection =
      parseFloat(
        cheerio(SELECTOR, html)[4].children[0].data!
        .replace(' °', '')
      )
    const waterTemperature =
      parseFloat(
        cheerio(SELECTOR, html)[5].children[0].data!
      )

    const time = cheerio(SELECTOR, html)[6].children[0].data
    const date = cheerio('.waves ul [role="listitem"] .tz-date', html)[0].children[0].data

    // TODO: convert dd/mm/yyyy to yyyy-mm-dd
    const datetime = date ? `${date.replace(/\//g, '-')}T${time}+11:00` : null

    const result = {
      locationName,
      datetime,
      swellHeightMin,
      swellHeightMax,
      swellPeriodMin,
      swellPeriodMax,
      swellDirection,
      waterTemperature,
    }

    // console.log(html)

    console.log(result)

    await browser.close()

    return result
  } catch (error) {
    console.error(error)

    return {
      error: error
    }
  }
}

export default fetchBuoyData