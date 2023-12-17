const fs = require("fs");
const yaml = require("js-yaml");

function padWithZeros(number, width) {
  const numString = number.toString();
  const paddingWidth = Math.max(0, width - numString.length);
  const padding = '0'.repeat(paddingWidth);
  return padding + numString;
}

// Function to replace the template with the provided data
function generateHtmlFromTemplate(template, data) {
  let html = template;

  // Replace album name
  html = html.replace(
    "<title>Album Name</title>",
    `<title>${data.albumName}</title>`
  );
  html = html.replace("<h1>Album Name</h1>", `<h1>${data.albumName}</h1>`);

  // Process each song and generate the corresponding HTML
  let songsHtml = "";
  data.songs.forEach((song, index) => {
    let songIndex = padWithZeros(index + 1, 2);
    let songHtml = `
      <div class="song-item mt-4">
        <h3>${song.title}</h3>

        <!-- Audio player -->
        <audio controls>
            <source src="mp3s/${song.mp3Filename}.mp3" type="audio/mpeg">
            Your browser does not support the audio element.
        </audio>

        <div class="mt-2">
            <!-- Download Link -->
            <a href="mp3s/${song.mp3Filename}.mp3" class="btn btn-primary btn-sm" download>Download MP3</a>

            <!-- Notes Toggle Button -->
            <button class="btn btn-info btn-sm toggle-btn" type="button" data-bs-toggle="collapse"
                data-bs-target="#notesSample${songIndex}">Notes</button>

            <!-- Lyrics Toggle Button -->
            <button class="btn btn-secondary btn-sm toggle-btn" type="button" data-bs-toggle="collapse"
                data-bs-target="#lyricsSample${songIndex}" onclick="loadLyrics('${song.mp3Filename}')">Lyrics</button>
        </div>

        <!-- Notes Collapsible Section -->
        <div class="collapse mt-3" id="notesSample${songIndex}">
            <div class="card card-body">
                ${song.notes}
            </div>
        </div>

        <!-- Lyrics Collapsible Section -->
        <div class="collapse mt-3" id="lyricsSample${songIndex}">
            <div class="card card-body" id="${song.mp3Filename}-lyrics">
                <!-- Lyrics will be loaded here -->
            </div>
        </div>
      </div>`;
    songsHtml += songHtml;
  });

  // Replace the template song section with the generated songsHtml
  const songSectionRegex =
    /<!-- Sample song entry -->([\s\S]+?)<!-- Repeat the above div.song-item for each song on the album. Remember to adjust the unique IDs and paths. -->/;
  html = html.replace(songSectionRegex, songsHtml);

  return html;
}

// Main function to merge the template with YAML data
function mergeTemplateWithYamlData(yamlFilename) {
  const template = fs.readFileSync("./template.htm", "utf-8");
  const yamlData = yaml.load(fs.readFileSync(yamlFilename, "utf-8"));

  const mergedHtml = generateHtmlFromTemplate(template, yamlData);
  fs.writeFileSync("./docs/index.htm", mergedHtml);

  console.log("HTML file has been generated as 'output.htm'.");
}

const yamlFilename = process.argv[2];
if (!yamlFilename) {
  console.error("Please provide the YAML filename as an argument.");
  process.exit(1);
}

mergeTemplateWithYamlData(yamlFilename);
