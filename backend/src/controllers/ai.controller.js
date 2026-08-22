export const getLocationPhoto = async (req, res, next) => {
  try {
    const { place, city } = req.body;
    const locationName = place || city || 'Rome Colosseum';

    const apiKey = process.env.OPENROUTER_API;

    // Call OpenRouter API with free model (google/gemini-2.0-flash-lite-preview-02-05:free or meta-llama/llama-3.2-1b-instruct:free)
    const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'Wanderly Travel'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-lite-preview-02-05:free',
        messages: [
          {
            role: 'system',
            content: 'You are a travel AI assistant. Respond strictly with valid JSON only. Do not include markdown code block formatting.'
          },
          {
            role: 'user',
            content: `Provide a high-resolution Unsplash photo URL query keyword and description for landmark: "${locationName}". JSON format: {"queryKeyword": "string", "description": "string", "photoUrl": "string"}`
          }
        ]
      })
    });

    let aiData = null;
    if (openRouterRes.ok) {
      const responseJson = await openRouterRes.json();
      const content = responseJson.choices?.[0]?.message?.content || '';
      try {
        const cleanJsonStr = content.replace(/```json/g, '').replace(/```/g, '').trim();
        aiData = JSON.parse(cleanJsonStr);
      } catch (e) {
        aiData = { description: content };
      }
    }

    const cleanQuery = encodeURIComponent(locationName.replace(/[^a-zA-Z0-9\s]/g, ''));
    const photoUrl = aiData?.photoUrl || `https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80`;

    return res.status(200).json({
      success: true,
      place: locationName,
      photoUrl,
      description: aiData?.description || `Popular landmark ${locationName}`,
      aiModel: 'google/gemini-2.0-flash-lite-preview-02-05:free'
    });
  } catch (error) {
    console.error('OpenRouter AI Error:', error);
    const fallbackPlace = req.body?.place || 'Landmark';
    return res.status(200).json({
      success: true,
      place: fallbackPlace,
      photoUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
      description: `Scenic view of ${fallbackPlace}`
    });
  }
};
