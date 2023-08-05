// Function to replace words with Norwegian translations
function translate(englishWord) {
  return fetch(chrome.runtime.getURL("./no.json"))
    .then((response) => response.json())
    .then((data) => {
      const translation = data.words.find((word) =>
        word.englishWord === englishWord
      );
      return translation;
    });
}

// Main function to handle text replacement on hover
async function handleHover(event) {
  const originalText = event.target.innerText;
  const enabled = await getTranslationStatus();

  if (enabled) {
    const translatedText = await replaceWordsWithTranslations(originalText);
    event.target.setAttribute("data-original-text", originalText);
    event.target.innerText = translatedText;
  }
}

// Function to revert back to the original text on hover out
function handleHoverOut(event) {
  const originalText = event.target.getAttribute("data-original-text");
  if (originalText) {
    event.target.innerText = originalText;
  }
}

// Function to get the current translation status
function getTranslationStatus() {
  return new Promise((resolve) => {
    chrome.storage.sync.get("enabled", function (data) {
      resolve(data.enabled !== false);
    });
  });
}

async function replaceRandomWordWithTranslation(element) {
  const words = element.textContent.split(" ");
  // Try to replace about 10% of the words.
  const numberOfWordsToReplace = Math.ceil(words.length * 0.1);
  
    for (let i = 0; i < numberOfWordsToReplace; i++) {
      const randomIndex = Math.floor(Math.random() * words.length);

      const word = await translate(words[randomIndex]);
  if (!word) {
    return;
  }

  words[randomIndex] = word.targetWord;

  const styledWord = document.createElement("span");
  styledWord.style.fontWeight = "bold";
  styledWord.style.color = "red";
  styledWord.style.backgroundColor = "#e6e6e6";
  styledWord.textContent = words[randomIndex];

  words[randomIndex] = styledWord.outerHTML;
  element.innerHTML = words.join(" ");

    }

}

const paragraphs = [
  ...document.querySelectorAll("p"),
  ...document.querySelectorAll("h1"),
  ...document.querySelectorAll("h2"),
  ...document.querySelectorAll("h3"),
  ...document.querySelectorAll("h4"),
  ...document.querySelectorAll("h5"),
  ...document.querySelectorAll("h6"),
];


// Choose at max 5 paragraphs to replace words in.
for (let i = 0; i < Math.floor(paragraphs.length / 2); i++) {
  replaceRandomWordWithTranslation(paragraphs[i]);
}

