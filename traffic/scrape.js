const fs = require('fs')

// https://dumps.wikimedia.org/other/pageviews/2024/2024-11/projectviews-20241101-000000

const getUrlForDate = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()

  const monthString = month.toString().padStart(2, "0")
  const dayString = day.toString().padStart(2, "0")
  const hourString = hour.toString().padStart(2, "0")

  return `https://dumps.wikimedia.org/other/pageviews/${year}/${year}-${monthString}/projectviews-${year}${monthString}${dayString}-${hourString}0000`
}

const main = async () => {
    // 2024-09-09 - 2024-09-15
    const dateOfInterest = new Date("2024-09-09T00:00:00")

    for (let x = 0; x < 24 * 7; x++) {
        const url = getUrlForDate(dateOfInterest)
        console.log(url)

        const result = await fetch(url)
        const text = await result.text()

        const fileName = url.split("/").pop()
        fs.writeFileSync(`files/${fileName}`, text)

        dateOfInterest.setHours(dateOfInterest.getHours() + 1)
    }
}

main()


