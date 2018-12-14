const puppeteer = require('puppeteer')
const cheerio = require('cheerio')

const url = 'http://www.vicports.vic.gov.au/community-and-bay-users/Pages/Waves-wind-weather.aspx'

const fetchBuoyData = async () => {
  try {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto(url)
    // Wait for swell height to be populated
    await page.waitFor(() => !!document.querySelector('.waves ul [role="listitem"] em').innerHTML)
    const html = await page.content()
    // const html = await page.evaluate(() => document.documentElement.outerHTML)

    const locationName = cheerio('.waves h2', html)[0].children[0].data
    const swellHeightMin =
      parseFloat(
        cheerio('.waves ul [role="listitem"] em', html)[0].children[0].data
        .replace(' m', '')
      )
    const swellHeightMax =
      parseFloat(
        cheerio('.waves ul [role="listitem"] em', html)[1].children[0].data
        .replace(' m', '')
      )
    const swellPeriodMin =
      parseFloat(
        cheerio('.waves ul [role="listitem"] em', html)[2].children[0].data
        .replace(' s', '')
      )
    const swellPeriodMax =
      parseFloat(
        cheerio('.waves ul [role="listitem"] em', html)[3].children[0].data
        .replace(' s', '')
      )
    const swellDirection =
      parseFloat(
        cheerio('.waves ul [role="listitem"] em', html)[4].children[0].data
        .replace(' °', '')
      )
    const waterTemperature =
      parseFloat(
        cheerio('.waves ul [role="listitem"] em', html)[5].children[0].data
      )

    const time = cheerio('.waves ul [role="listitem"] em', html)[6].children[0].data
    const date = cheerio('.waves ul [role="listitem"] .tz-date', html)[0].children[0].data

    // TODO: convert dd/mm/yyyy to yyyy-mm-dd
    const datetime = `${date.replace(/\//g, '-')}T${time}+11:00`

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
  }
}

module.exports = fetchBuoyData