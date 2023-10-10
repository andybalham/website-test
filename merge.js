const fs = require("fs");
const yaml = require("js-yaml");

// Function to replace the template with the provided data
function generateHtmlFromTemplate(template, data) {
  let html = template;

  // Replace album name
  html = html.replace("<h1>Album Name</h1>", `<h1>${data.albumName}</h1>`);

  // Process each song and generate the corresponding HTML
  let songsHtml = "";
  data.songs.forEach((song, index) => {
    let songHtml = `
        <div class="song-item">
            <h3>${song.title}</h3>
            <audio controls>
                <source src="mp3s/${song.mp3Filename}" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>

            <div class="mt-2">
              <!-- Download Link -->
              <a href="mp3s/song.mp3" class="btn btn-primary btn-sm" download>Download MP3</a>
      
              <!-- Notes Toggle Button -->
              <button class="btn btn-info btn-sm toggle-btn" type="button" data-bs-toggle="collapse"
                data-bs-target="#notesSample">Show notes</button>
      
              <!-- Lyrics Toggle Button -->
              <button class="btn btn-secondary btn-sm toggle-btn" type="button" data-bs-toggle="collapse"
                data-bs-target="#lyricsSample">Show lyrics</button>
            </div>
    
            <!-- Notes Collapsible Section -->
            <div class="collapse mt-3" id="notesSample">
              <div class="card card-body">
                ${song.notes}
              </div>
            </div>
      
            <!-- Lyrics Collapsible Section -->
            <div class="collapse mt-3" id="lyricsSample">
              <div class="card card-body">
              ${song.lyrics}
              </div>
            </div>
        </div>
        `;
    songsHtml += songHtml;
  });

  // Replace the template song section with the generated songsHtml
  const songSectionRegex =
    /<!-- Sample song entry -->([\s\S]+?)<!-- You can copy the above div\.song-item for each song in the album and adjust IDs and paths accordingly -->/;
  html = html.replace(songSectionRegex, songsHtml);

  return html;
}

// Main function to merge the template with YAML data
function mergeTemplateWithYamlData(yamlFilename) {
  const template = fs.readFileSync("./template.htm", "utf-8");
  const yamlData = yaml.load(fs.readFileSync(yamlFilename, "utf-8"));

  const mergedHtml = generateHtmlFromTemplate(template, yamlData);
  fs.writeFileSync("./output.htm", mergedHtml);

  console.log("HTML file has been generated as 'output.htm'.");
}

const yamlFilename = process.argv[2];
if (!yamlFilename) {
  console.error("Please provide the YAML filename as an argument.");
  process.exit(1);
}

mergeTemplateWithYamlData(yamlFilename);
