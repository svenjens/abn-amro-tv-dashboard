/**
 * AI-powered semantic search using GPT-3.5 to transform natural language queries
 * into optimized TVMaze search terms
 */

import OpenAI from 'openai'

export default defineEventHandler(async (event) => {
  const { query } = await readBody(event)

  if (!query || typeof query !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Query parameter is required',
    })
  }

  const config = useRuntimeConfig()

  if (!config.openaiApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'OpenAI API key not configured',
    })
  }

  try {
    const openai = new OpenAI({
      apiKey: config.openaiApiKey,
    })

    // Step 1: Use GPT to understand the query and generate search terms
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a TV show search expert. Transform natural language queries into optimized search terms for TVMaze API.

Your task:
1. Extract show names, genres, moods, and themes from the query
2. Generate 3-5 optimized search terms that will find matching shows
3. Return as JSON with these fields:
   - searchTerms: array of strings to search
   - intent: object describing what user is looking for

Examples:

Query: "dark sci-fi shows like Black Mirror"
Response: {
  "searchTerms": ["Black Mirror", "Westworld", "Twilight Zone", "sci-fi anthology", "dystopian"],
  "intent": {
    "genres": ["science-fiction", "thriller"],
    "mood": ["dark", "dystopian"],
    "similar": "Black Mirror",
    "type": "series"
  }
}

Query: "funny workplace comedies"
Response: {
  "searchTerms": ["The Office", "Parks and Recreation", "workplace comedy", "sitcom office"],
  "intent": {
    "genres": ["comedy"],
    "mood": ["funny", "light-hearted"],
    "theme": "workplace"
  }
}

Query: "mystery series with strong female leads"
Response: {
  "searchTerms": ["Killing Eve", "Mare of Easttown", "mystery female lead", "thriller woman"],
  "intent": {
    "genres": ["mystery", "thriller"],
    "theme": "strong female lead"
  }
}

Always return valid JSON. Be creative with search terms to maximize results.`,
        },
        {
          role: 'user',
          content: query,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 300,
    })

    const gptResult = JSON.parse(response.choices?.[0]?.message?.content || '{}')

    // Step 2: Search TVMaze with generated terms
    const searchTerms = Array.isArray(gptResult.searchTerms) ? gptResult.searchTerms : [query]
    const allResults = new Map() // Deduplicate by show ID

    // Search with each term
    for (const term of searchTerms.slice(0, 5)) {
      // Limit to 5 terms to avoid too many API calls
      try {
        const shows = await $fetch<Array<{ show: any; score: number }>>(
          `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(term)}`,
          {
            headers: {
              'User-Agent': 'BingeList/1.0',
            },
          }
        )

        // Validate response is an array
        if (!Array.isArray(shows)) {
          console.error(`Invalid shows response for term: ${term}`, shows)
          continue
        }

        // Add to results (TVMaze returns [{score, show}])
        for (const result of shows.slice(0, 10)) {
          // Top 10 per search term
          if (!allResults.has(result.show.id)) {
            allResults.set(result.show.id, {
              show: result.show,
              score: result.score,
              matchedTerm: term,
            })
          }
        }
      } catch (error) {
        console.error(`Failed to search for term: ${term}`, error)
        // Continue with other terms
      }
    }

    // Step 3: Convert to array and sort by relevance
    const results = Array.from(allResults.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 20) // Top 20 results

    return {
      query,
      intent: gptResult.intent,
      searchTerms: gptResult.searchTerms,
      results,
      total: results.length,
    }
  } catch (error) {
    console.error('Semantic search error:', error)

    // Fallback to regular search if GPT fails
    try {
      const fallbackResults = await $fetch<Array<{ show: any; score: number }>>(
        `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`,
        {
          headers: {
            'User-Agent': 'BingeList/1.0',
          },
        }
      )

      // Validate response is an array
      if (!Array.isArray(fallbackResults)) {
        throw createError({
          statusCode: 500,
          statusMessage: 'Invalid search results',
        })
      }

      return {
        query,
        intent: { fallback: true },
        searchTerms: [query],
        results: fallbackResults.slice(0, 20).map((r) => ({
          show: r.show,
          score: r.score,
          matchedTerm: query,
        })),
        total: fallbackResults.length,
      }
    } catch {
      throw createError({
        statusCode: 500,
        statusMessage: 'Search failed',
      })
    }
  }
})
