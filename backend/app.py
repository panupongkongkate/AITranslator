from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import logging
import asyncio
import os
from claude_code_sdk import query, ClaudeCodeOptions, AssistantMessage, TextBlock

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Supported languages
LANGUAGES = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 
    'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi',
    'Dutch', 'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Polish',
    'Turkish', 'Greek', 'Hebrew', 'Thai', 'Vietnamese', 'Indonesian'
]

@app.route('/api/translate', methods=['POST'])
def translate_text():
    try:
        data = request.json
        source_text = data.get('sourceText', '').strip()
        source_lang = data.get('sourceLang', 'English')
        target_lang = data.get('targetLang', 'Spanish')
        
        # Validation
        if not source_text:
            return jsonify({'error': 'Source text is required'}), 400
        
        if source_lang not in LANGUAGES or target_lang not in LANGUAGES:
            return jsonify({'error': 'Unsupported language'}), 400
        
        if source_lang == target_lang:
            return jsonify({
                'translatedText': source_text,
                'confidence': 'high'
            })
        
        # Create translation prompt
        prompt = f"""Translate the following text from {source_lang} to {target_lang}. Respond ONLY with a valid JSON object in this exact format:
{{
  "translatedText": "your translation here",
  "confidence": "high/medium/low"
}}

Text to translate: "{source_text}"

IMPORTANT: Your entire response MUST be a single, valid JSON object. DO NOT include anything else, no backticks, no explanations."""

        # Call Claude via Claude Code SDK
        try:
            logger.info(f"Translation request: {source_text} from {source_lang} to {target_lang}")
            
            # Ensure no API key environment variable interferes
            if 'ANTHROPIC_API_KEY' in os.environ:
                del os.environ['ANTHROPIC_API_KEY']
            
            # Create options for Claude Code SDK
            options = ClaudeCodeOptions(
                max_turns=1
            )
            
            # Create async function to handle Claude query
            async def get_translation():
                result_text = ""
                try:
                    async for message in query(prompt=prompt, options=options):
                        logger.info(f"Message type: {type(message).__name__}")
                        if isinstance(message, AssistantMessage):
                            for block in message.content:
                                if isinstance(block, TextBlock):
                                    result_text += block.text
                except Exception as query_error:
                    logger.error(f"Query error: {str(query_error)}")
                    raise query_error
                return result_text
            
            # Run async function with proper error handling
            try:
                response_text = asyncio.run(get_translation())
            except Exception as async_error:
                logger.error(f"Async error: {str(async_error)}")
                raise async_error
            
            logger.info(f"Claude SDK response: {response_text}")
            
            if not response_text.strip():
                logger.error("Empty response from Claude SDK")
                return jsonify({'error': 'Empty response from translation service'}), 500
            
            # Parse JSON response
            try:
                result = json.loads(response_text.strip())
                if 'translatedText' not in result:
                    logger.error(f"Missing translatedText in response: {result}")
                    return jsonify({'error': 'Invalid response format from translation service'}), 500
                return jsonify(result)
            except json.JSONDecodeError as json_error:
                logger.error(f"JSON parse error: {str(json_error)}")
                logger.error(f"Response text: {response_text}")
                return jsonify({'error': 'Invalid JSON response from translation service'}), 500
                
        except Exception as e:
            logger.error(f"Claude SDK error: {str(e)}")
            import traceback
            logger.error(f"Full traceback: {traceback.format_exc()}")
            return jsonify({'error': 'Translation service error'}), 500
            
    except Exception as e:
        logger.error(f"Translation error: {str(e)}")
        return jsonify({'error': 'Translation failed'}), 500

@app.route('/api/languages', methods=['GET'])
def get_languages():
    return jsonify({'languages': LANGUAGES})

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'AI Translator Backend'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)