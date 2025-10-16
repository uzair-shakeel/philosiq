import axios from "axios";

const WIKIPEDIA_API_BASE = "https://en.wikipedia.org/api/rest_v1";
const WIKIPEDIA_API_ACTION = "https://en.wikipedia.org/w/api.php";

/**
 * Search for Wikipedia articles by title
 * @param {string} query - Search query
 * @param {number} limit - Number of results to return (default: 10)
 * @returns {Promise<Array>} Array of search results
 */
export async function searchWikipedia(query, limit = 10) {
  try {
    const response = await axios.get(WIKIPEDIA_API_ACTION, {
      params: {
        action: "query",
        format: "json",
        list: "search",
        srsearch: query,
        srlimit: limit,
        origin: "*",
      },
    });

    return response.data.query.search.map((result) => ({
      pageId: result.pageid,
      title: result.title,
      snippet: result.snippet.replace(/<[^>]*>/g, ""), // Remove HTML tags
      wordCount: result.wordcount,
      size: result.size,
    }));
  } catch (error) {
    console.error("Error searching Wikipedia:", error);
    throw new Error("Failed to search Wikipedia");
  }
}

/**
 * Get detailed information about a Wikipedia page
 * @param {string} title - Wikipedia page title
 * @returns {Promise<Object>} Page information
 */
export async function getWikipediaPage(title) {
  try {
    // Get basic page info
    const pageInfoResponse = await axios.get(WIKIPEDIA_API_ACTION, {
      params: {
        action: "query",
        format: "json",
        titles: title,
        prop: "info|extracts|pageimages|categories",
        exintro: true,
        explaintext: true,
        exsectionformat: "plain",
        piprop: "original",
        origin: "*",
      },
    });

    const pages = pageInfoResponse.data.query.pages;
    const pageId = Object.keys(pages)[0];
    const page = pages[pageId];

    if (pageId === "-1") {
      throw new Error("Page not found");
    }

    // Get additional structured data
    const wikidataResponse = await axios.get(WIKIPEDIA_API_ACTION, {
      params: {
        action: "query",
        format: "json",
        titles: title,
        prop: "pageprops",
        origin: "*",
      },
    });

    const pageProps =
      wikidataResponse.data.query.pages[pageId]?.pageprops || {};

    // Extract birth/death dates and occupation from categories
    const categories = page.categories || [];
    const birthYear = extractYearFromCategories(categories, "births");
    const deathYear = extractYearFromCategories(categories, "deaths");
    const occupation = extractOccupationFromCategories(categories);

    return {
      pageId: parseInt(pageId),
      title: page.title,
      extract: page.extract,
      imageUrl: page.original?.source || null,
      categories: categories.map((cat) => cat.title.replace("Category:", "")),
      birthDate: birthYear,
      deathDate: deathYear,
      occupation: occupation,
      wikidataId: pageProps.wikibase_item || null,
    };
  } catch (error) {
    console.error("Error fetching Wikipedia page:", error);
    throw new Error("Failed to fetch Wikipedia page");
  }
}

/**
 * Get a high-quality image for a Wikipedia page
 * @param {string} title - Wikipedia page title
 * @returns {Promise<string|null>} Image URL or null if not found
 */
export async function getWikipediaImage(title) {
  try {
    const response = await axios.get(WIKIPEDIA_API_ACTION, {
      params: {
        action: "query",
        format: "json",
        titles: title,
        prop: "pageimages",
        piprop: "original",
        origin: "*",
      },
    });

    const pages = response.data.query.pages;
    const pageId = Object.keys(pages)[0];
    const page = pages[pageId];

    return page.original?.source || null;
  } catch (error) {
    console.error("Error fetching Wikipedia image:", error);
    return null;
  }
}

/**
 * Extract birth/death year from Wikipedia categories
 * @param {Array} categories - Array of category objects
 * @param {string} type - 'births' or 'deaths'
 * @returns {string|null} Year or null if not found
 */
function extractYearFromCategories(categories, type) {
  const yearRegex = /(\d{4})/;

  for (const category of categories) {
    const categoryTitle = category.title.toLowerCase();
    if (
      categoryTitle.includes(type) &&
      categoryTitle.includes("birth") === (type === "births")
    ) {
      const match = categoryTitle.match(yearRegex);
      if (match) {
        return match[1];
      }
    }
  }

  return null;
}

/**
 * Extract occupation from Wikipedia categories
 * @param {Array} categories - Array of category objects
 * @returns {string} Occupation or 'Public Figure'
 */
function extractOccupationFromCategories(categories) {
  const occupationKeywords = [
    // Real person occupations
    "politicians",
    "presidents",
    "prime ministers",
    "senators",
    "governors",
    "actors",
    "actresses",
    "musicians",
    "singers",
    "writers",
    "authors",
    "scientists",
    "physicists",
    "chemists",
    "biologists",
    "mathematicians",
    "artists",
    "painters",
    "sculptors",
    "directors",
    "producers",
    "athletes",
    "basketball players",
    "football players",
    "tennis players",
    "businesspeople",
    "entrepreneurs",
    "ceos",
    "founders",
    "philosophers",
    "economists",
    "historians",
    "journalists",

    // Fictional character roles
    "superheroes",
    "villains",
    "anti-heroes",
    "protagonists",
    "antagonists",
    "wizards",
    "witches",
    "magicians",
    "warriors",
    "knights",
    "soldiers",
    "detectives",
    "spies",
    "agents",
    "criminals",
    "gangsters",
    "princesses",
    "princes",
    "kings",
    "queens",
    "emperors",
    "empresses",
    "pirates",
    "ninjas",
    "samurai",
    "vampires",
    "werewolves",
    "monsters",
    "robots",
    "androids",
    "aliens",
    "cyborgs",
    "mutants",
    "students",
    "teachers",
    "doctors",
    "nurses",
    "police officers",
    "cowboys",
    "outlaws",
    "sheriffs",
    "marshals",
    "bounty hunters",
  ];

  for (const category of categories) {
    const categoryTitle = category.title.toLowerCase();

    for (const keyword of occupationKeywords) {
      if (categoryTitle.includes(keyword)) {
        // Clean up and format the occupation
        return keyword
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
          .replace(/s$/, ""); // Remove plural 's'
      }
    }
  }

  return "Public Figure";
}

/**
 * Validate if a Wikipedia page is suitable for creating an icon
 * @param {Object} pageData - Wikipedia page data
 * @returns {Object} Validation result with isValid and reasons
 */
export function validateIconCandidate(pageData) {
  const reasons = [];
  let isValid = true;

  // Check if it's a person (real or fictional)
  const categories = pageData.categories || [];
  const extract = pageData.extract || "";

  // Check for real person indicators
  const hasRealPersonCategory = categories.some(
    (cat) =>
      cat.toLowerCase().includes("births") ||
      cat.toLowerCase().includes("deaths") ||
      cat.toLowerCase().includes("people") ||
      cat.toLowerCase().includes("living people")
  );

  // Check for fictional character indicators
  const fictionalIndicators = [
    "fictional character",
    "fictional people",
    "fictional characters",
    "film characters",
    "movie characters",
    "television characters",
    "tv characters",
    "video game characters",
    "game characters",
    "comic book characters",
    "cartoon characters",
    "anime characters",
    "manga characters",
    "literary characters",
    "novel characters",
    "book characters",
    "disney characters",
    "marvel characters",
    "dc characters",
    "star wars characters",
    "harry potter characters",
    "lord of the rings characters",
  ];

  const hasFictionalCategory = categories.some((cat) =>
    fictionalIndicators.some((indicator) =>
      cat.toLowerCase().includes(indicator)
    )
  );

  // Check extract for fictional character indicators
  const fictionalTextIndicators = [
    "fictional character",
    "character in",
    "character from",
    "is a character",
    "fictional",
    "cartoon",
    "anime",
    "manga",
    "comic book",
    "video game",
    "film character",
    "movie character",
    "tv character",
    "television character",
  ];

  const hasFictionalTextIndicator = fictionalTextIndicators.some((indicator) =>
    extract.toLowerCase().includes(indicator)
  );

  // Check for real person text indicators
  const realPersonIndicators = [
    "born",
    "died",
    "is a",
    "was a",
    "politician",
    "actor",
    "writer",
    "scientist",
  ];
  const hasRealPersonIndicator = realPersonIndicators.some((indicator) =>
    extract.toLowerCase().includes(indicator)
  );

  // Determine if it's a valid person (real or fictional)
  const isRealPerson = hasRealPersonCategory || hasRealPersonIndicator;
  const isFictionalCharacter =
    hasFictionalCategory || hasFictionalTextIndicator;

  if (!isRealPerson && !isFictionalCharacter) {
    isValid = false;
    reasons.push("This does not appear to be a person or character");
  }

  // Check if we have enough information
  if (!pageData.imageUrl) {
    reasons.push("No image available");
  }

  if (!extract || extract.length < 50) {
    isValid = false;
    reasons.push("Insufficient biographical information");
  }

  // Determine character type for better categorization
  const characterType = isFictionalCharacter ? "fictional" : "real";

  return {
    isValid,
    reasons,
    confidence: isValid ? (reasons.length === 0 ? 100 : 75) : 0,
    characterType,
    isFictional: isFictionalCharacter,
  };
}
