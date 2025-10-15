import { searchWikipedia, getWikipediaPage, validateIconCandidate } from '../../../utils/wikipedia';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { q: query, limit = 10 } = req.query;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchResults = await searchWikipedia(query.trim(), parseInt(limit));

    // Enhance results with validation for icon suitability
    const enhancedResults = await Promise.all(
      searchResults.map(async (result) => {
        try {
          // Get basic page info to validate if it's suitable for an icon
          const pageData = await getWikipediaPage(result.title);
          const validation = validateIconCandidate(pageData);

          return {
            ...result,
            imageUrl: pageData.imageUrl,
            occupation: pageData.occupation,
            birthDate: pageData.birthDate,
            deathDate: pageData.deathDate,
            extract: pageData.extract?.substring(0, 200) + '...',
            validation,
          };
        } catch (error) {
          console.error(`Error validating ${result.title}:`, error);
          return {
            ...result,
            validation: {
              isValid: false,
              reasons: ['Unable to validate this page'],
              confidence: 0,
            },
          };
        }
      })
    );

    // Sort by validation confidence and filter out clearly invalid results
    const validResults = enhancedResults
      .filter(result => result.validation.confidence > 0)
      .sort((a, b) => b.validation.confidence - a.validation.confidence);

    return res.status(200).json({
      results: validResults,
      total: validResults.length,
    });
  } catch (error) {
    console.error('Error searching Wikipedia:', error);
    return res.status(500).json({ 
      message: 'Failed to search Wikipedia',
      error: error.message 
    });
  }
}
