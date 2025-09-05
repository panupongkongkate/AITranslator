from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import logging
import asyncio
import os
import sys
from claude_code_sdk import query, ClaudeCodeOptions, AssistantMessage, TextBlock

# Set UTF-8 encoding for stdout/stderr
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

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
        
        # Create translation prompt with proper UTF-8 handling
        # Ensure source text is properly handled as UTF-8
        try:
            # Try to handle the text properly
            if isinstance(source_text, bytes):
                source_text_utf8 = source_text.decode('utf-8', errors='replace')
            else:
                source_text_utf8 = source_text
            
            # Log the actual text we're working with
            logger.info(f"PROCESS - Original text: {repr(source_text)}")
            logger.info(f"PROCESS - UTF-8 text: {repr(source_text_utf8)}")
            logger.info(f"PROCESS - Text bytes: {source_text_utf8.encode('utf-8')}")
            
        except Exception as encoding_error:
            logger.error(f"ERROR - UTF-8 encoding error: {encoding_error}")
            source_text_utf8 = source_text
        prompt = f"""You are a professional translator. Translate this exact text from {source_lang} to {target_lang}:

"{source_text_utf8}"

You MUST respond with ONLY a valid JSON object in this exact format:
{{"translatedText": "your translation here", "confidence": "high"}}

Do not include explanations, backticks, or any other text. Just the JSON object."""

        # Call Claude via Claude Code SDK
        try:
            logger.info("=" * 80)
            logger.info("TRANSLATION REQUEST STARTED")
            logger.info(f"INPUT - Source Text: '{source_text}'")
            logger.info(f"INPUT - Source Language: {source_lang}")
            logger.info(f"INPUT - Target Language: {target_lang}")
            logger.info(f"INPUT - Text Length: {len(source_text)} characters")
            logger.info(f"PROMPT - Full prompt being sent:")
            logger.info(f"{prompt}")
            logger.info("-" * 40)
            
            # Ensure no API key environment variable interferes
            if 'ANTHROPIC_API_KEY' in os.environ:
                logger.info("PROCESS - Removed ANTHROPIC_API_KEY from environment")
                del os.environ['ANTHROPIC_API_KEY']
            
            # Create options for Claude Code SDK
            options = ClaudeCodeOptions(
                max_turns=1
            )
            logger.info(f"PROCESS - Created Claude Code options: max_turns=1")
            
            # Create async function to handle Claude query
            async def get_translation():
                result_text = ""
                message_count = 0
                try:
                    logger.info("PROCESS - Starting Claude SDK async query...")
                    async for message in query(prompt=prompt, options=options):
                        message_count += 1
                        message_type = type(message).__name__
                        logger.info(f"PROCESS - Received message #{message_count}, type: {message_type}")
                        
                        if isinstance(message, AssistantMessage):
                            block_count = 0
                            for block in message.content:
                                block_count += 1
                                if isinstance(block, TextBlock):
                                    block_text = block.text
                                    logger.info(f"PROCESS - Processing TextBlock #{block_count}, length: {len(block_text)} chars")
                                    logger.info(f"PROCESS - TextBlock content preview: {block_text[:100]}...")
                                    result_text += block_text
                                else:
                                    logger.info(f"PROCESS - Skipping non-TextBlock: {type(block).__name__}")
                    
                    logger.info(f"PROCESS - Total messages received: {message_count}")
                    logger.info(f"PROCESS - Final result text length: {len(result_text)} characters")
                    
                except Exception as query_error:
                    logger.error(f"ERROR - Query error: {str(query_error)}")
                    logger.error(f"ERROR - Query error type: {type(query_error).__name__}")
                    raise query_error
                return result_text
            
            # Run async function with proper error handling
            try:
                logger.info("PROCESS - Running async translation...")
                response_text = asyncio.run(get_translation())
                logger.info("PROCESS - Async translation completed successfully")
            except Exception as async_error:
                logger.error(f"ERROR - Async error: {str(async_error)}")
                logger.error(f"ERROR - Async error type: {type(async_error).__name__}")
                raise async_error
            
            logger.info("-" * 40)
            logger.info(f"OUTPUT - Claude SDK raw response length: {len(response_text)} characters")
            logger.info(f"OUTPUT - Claude SDK response preview: {response_text[:200]}...")
            logger.info(f"OUTPUT - Full Claude SDK response: {response_text}")
            
            if not response_text.strip():
                logger.error("ERROR - Empty response from Claude SDK")
                return jsonify({'error': 'Empty response from translation service'}), 500
            
            # Parse JSON response
            logger.info("PROCESS - Attempting to parse JSON response...")
            try:
                trimmed_response = response_text.strip()
                logger.info(f"PROCESS - Trimmed response length: {len(trimmed_response)} characters")
                logger.info(f"PROCESS - Attempting JSON.loads() on: {trimmed_response[:100]}...")
                
                result = json.loads(trimmed_response)
                logger.info(f"PROCESS - JSON parsing successful!")
                logger.info(f"PROCESS - Parsed JSON keys: {list(result.keys())}")
                
                if 'translatedText' not in result:
                    logger.error(f"ERROR - Missing translatedText in response")
                    logger.error(f"ERROR - Available keys: {list(result.keys())}")
                    logger.error(f"ERROR - Full parsed result: {result}")
                    return jsonify({'error': 'Invalid response format from translation service'}), 500
                
                logger.info(f"OUTPUT - Translation successful!")
                logger.info(f"OUTPUT - Translated text: '{result['translatedText']}'")
                logger.info(f"OUTPUT - Confidence: {result.get('confidence', 'not specified')}")
                logger.info(f"OUTPUT - Final response: {result}")
                logger.info("=" * 80)
                
                return jsonify(result)
                
            except json.JSONDecodeError as json_error:
                logger.error(f"ERROR - JSON parse error: {str(json_error)}")
                logger.error(f"ERROR - JSON error type: {type(json_error).__name__}")
                logger.error(f"ERROR - Failed to parse response text: '{response_text}'")
                logger.error(f"ERROR - Response text length: {len(response_text)} characters")
                logger.error(f"ERROR - Response text type: {type(response_text)}")
                logger.info("=" * 80)
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