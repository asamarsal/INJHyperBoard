# Injective Chatbot - RAG Implementation

## Overview

This chatbot implements **Retrieval-Augmented Generation (RAG)** to provide accurate, context-aware responses about the Injective blockchain protocol using Google's Gemini AI.

## Architecture

```
User Input → Chat Interface → API Route → Context Injection → Gemini API → Response
                                    ↓
                          injective-context.md
                          (Knowledge Base)
```

## How It Works

### 1. **Context Loading**
- The API route reads `injective-context.md` on each request
- This markdown file contains comprehensive information about Injective
- Context is loaded dynamically (no caching for real-time updates)

### 2. **Prompt Engineering**
The system uses a structured prompt with three components:

```
[System Instructions] + [Knowledge Base Context] + [User Question]
```

**System Instructions:**
- Define the AI's role and behavior
- Set response guidelines (conversational, educational, accurate)
- Specify formatting preferences

**Knowledge Base Context:**
- Full content from `injective-context.md`
- Comprehensive information about Injective features, tokenomics, ecosystem
- Updated context without redeployment

**User Question:**
- The actual query from the user
- Processed with the context for accurate responses

### 3. **Response Generation**
- Gemini Pro model processes the combined prompt
- Generates contextually relevant responses
- Returns formatted, easy-to-read answers

## Key Features

### ✅ **Retrieval-Augmented Generation (RAG)**
- **What it is:** Combines pre-trained language models with external knowledge retrieval
- **How we use it:** Inject Injective-specific context into each API call
- **Benefits:**
  - No model fine-tuning required
  - Easy to update knowledge base
  - Cost-effective implementation
  - Accurate, domain-specific responses

### ✅ **Dynamic Context Injection**
- Context loaded per request (not cached)
- Update `injective-context.md` anytime without code changes
- Immediate reflection of knowledge updates

### ✅ **Fallback Mechanism**
- If context file is missing, uses basic fallback context
- Ensures chatbot remains functional even with configuration issues

### ✅ **Structured Prompting**
- Clear instructions for AI behavior
- Consistent response quality
- Educational and conversational tone

## Configuration

### Knowledge Base Location
```
app/api/chatbot/injective-context.md
```

### API Endpoint
```
POST /api/chatbot
Body: { "message": "your question here" }
Response: { "response": "AI generated answer" }
```

### Environment Variables
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

## Customization

### Updating the Knowledge Base

1. **Edit the context file:**
   ```bash
   app/api/chatbot/injective-context.md
   ```

2. **Add new sections:**
   - Follow the existing markdown structure
   - Use clear headings and bullet points
   - Include specific facts and features

3. **No restart required:**
   - Changes take effect immediately
   - Next API call will use updated context

### Example Knowledge Base Structure

```markdown
# Topic Name

## Overview
Brief introduction to the topic

## Key Features
### Feature 1
- Detail 1
- Detail 2

### Feature 2
- Detail 1
- Detail 2

## Use Cases
Practical applications

## Common Questions
FAQ-style Q&A
```

### Adjusting AI Behavior

Edit the system instructions in `route.ts`:

```typescript
text: `You are an AI assistant specialized in [YOUR DOMAIN].

IMPORTANT INSTRUCTIONS:
- [Your custom instruction 1]
- [Your custom instruction 2]
- [Your custom instruction 3]

CONTEXT:
${injectiveContext}

USER QUESTION: ${message}

[Your custom closing instruction]`
```

### Tuning Generation Parameters

Modify in `route.ts`:

```typescript
generationConfig: {
    temperature: 0.7,      // Creativity (0.0-1.0)
    topK: 40,              // Token sampling diversity
    topP: 0.95,            // Nucleus sampling
    maxOutputTokens: 1024, // Response length limit
}
```

**Parameter Guide:**
- **temperature**: Lower = more focused, Higher = more creative
- **topK**: Limits token choices (lower = more deterministic)
- **topP**: Probability threshold for token selection
- **maxOutputTokens**: Maximum response length

## Performance Optimization

### Current Implementation
- ✅ File read on each request (simple, always up-to-date)
- ✅ Synchronous file reading (fast for small files)
- ✅ Error handling with fallback

### Potential Improvements

1. **Caching (for high traffic):**
   ```typescript
   let cachedContext: string | null = null
   let lastModified: number = 0
   
   // Check file modification time
   // Reload only if file changed
   ```

2. **Async file reading:**
   ```typescript
   injectiveContext = await fs.promises.readFile(contextPath, "utf-8")
   ```

3. **Context chunking (for large knowledge bases):**
   - Split context into sections
   - Use semantic search to find relevant chunks
   - Inject only relevant sections

4. **Vector embeddings (advanced RAG):**
   - Convert context to embeddings
   - Store in vector database
   - Retrieve most relevant sections per query

## Monitoring & Debugging

### Enable Logging

Add to `route.ts`:

```typescript
console.log("Context loaded:", injectiveContext.length, "characters")
console.log("User question:", message)
console.log("AI response:", generatedText)
```

### Common Issues

**Issue:** Context file not found
```
Solution: Verify file path and location
Check: app/api/chatbot/injective-context.md exists
```

**Issue:** Responses are generic
```
Solution: Ensure context is being loaded
Check: Console logs for context length
Verify: Context file has content
```

**Issue:** Slow responses
```
Solution: Reduce context size or implement caching
Check: Context file size (keep under 50KB for best performance)
```

## Best Practices

### ✅ Knowledge Base Maintenance
- Keep information accurate and up-to-date
- Use clear, structured formatting
- Include specific examples and use cases
- Avoid overly technical jargon unless necessary

### ✅ Prompt Engineering
- Be specific in system instructions
- Provide clear guidelines for AI behavior
- Include examples of desired response format
- Test with various question types

### ✅ Security
- Never include sensitive information in context
- Validate and sanitize user input
- Rate limit API calls to prevent abuse
- Monitor API usage and costs

### ✅ User Experience
- Keep responses concise but informative
- Use formatting for readability
- Provide sources when citing facts
- Handle edge cases gracefully

## Advanced Features (Future Enhancements)

### 1. **Conversation Memory**
- Store chat history
- Maintain context across messages
- Implement session management

### 2. **Multi-turn Conversations**
- Reference previous messages
- Build on earlier context
- Clarification questions

### 3. **Source Attribution**
- Cite specific sections from context
- Link to official documentation
- Provide confidence scores

### 4. **Semantic Search**
- Implement vector embeddings
- Find most relevant context chunks
- Reduce token usage

### 5. **Analytics**
- Track common questions
- Identify knowledge gaps
- Measure response quality

## Implementation Notes

- ✅ This chatbot uses **Retrieval-Augmented Generation (RAG)**
- ✅ **No model fine-tuning** is performed
- ✅ Context is **injected dynamically** per request
- ✅ Designed for **educational and onboarding** purposes only
- ✅ Uses **Gemini Pro** model (free tier available)
- ✅ **Stateless** implementation (no conversation history)

## Cost Considerations

### Gemini API Pricing (as of 2024)
- **Free tier:** 60 requests per minute
- **Token limits:** 1M tokens per month (free)
- **Context size:** ~50KB per request (within limits)

### Optimization Tips
1. Keep context file under 50KB
2. Use caching for high-traffic scenarios
3. Implement rate limiting
4. Monitor token usage

## Testing

### Test the API Directly

```bash
curl -X POST http://localhost:3000/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"message": "What is Injective?"}'
```

### Test Questions

1. **Basic:** "What is Injective?"
2. **Specific:** "How do I stake INJ tokens?"
3. **Technical:** "What consensus mechanism does Injective use?"
4. **Comparison:** "What makes Injective different from other DEXs?"
5. **Edge case:** "Tell me about Bitcoin" (should handle gracefully)

## Disclaimer

⚠️ **IMPORTANT DISCLAIMERS:**

- This chatbot is an **informational tool only**
- Does **NOT** provide financial, investment, or legal advice
- All Injective-related content belongs to their respective owners
- Responses are generated by AI and may contain inaccuracies
- Always verify critical information with official sources
- Use at your own risk

## Resources

### Official Injective Links
- Website: https://injective.com
- Documentation: https://docs.injective.network
- GitHub: https://github.com/InjectiveLabs

### Gemini API
- Documentation: https://ai.google.dev/docs
- API Key: https://makersuite.google.com/app/apikey

### RAG Resources
- [What is RAG?](https://research.ibm.com/blog/retrieval-augmented-generation-RAG)
- [RAG Best Practices](https://www.pinecone.io/learn/retrieval-augmented-generation/)

## Support

For issues or questions:
1. Check the console logs for errors
2. Verify `.env.local` configuration
3. Ensure `injective-context.md` exists
4. Test API endpoint directly
5. Review Gemini API quotas

---

**Built with ❤️ for the Injective community**

*Last updated: December 2024*
