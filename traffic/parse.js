const fs = require('fs')

const parseDate = (filename) => {
    // projectviews-20241101-000000
    const parts = filename.split("-")
    const dateString = parts[1];
    const timeString = parts[2];

    const year = dateString.substring(0, 4)
    const month = dateString.substring(4, 6)
    const day = dateString.substring(6, 8)
    const hour = timeString.substring(0, 2)

    const stringToParse = `${year}-${month}-${day}T${hour}:00:00Z`
    const date= Date.parse(stringToParse)
    return new Date(date)
}

const main = async () => {
    const files=  fs.readdirSync('files')
    let result = "file,date,entries\n";

    for (const file of files) {
        const data = fs.readFileSync(`files/${file}`, 'utf8')
        data.split("\n").forEach((line) => {
            const lineElements = line.split(" ")
            if (lineElements[0] === "pl") {
                const entries = lineElements[2]
                const date = parseDate(file)
                result = result + `${file},${date.toISOString()},${entries}\n`
            }
        })
    }

    fs.writeFileSync("data.csv", result)
}

main()
