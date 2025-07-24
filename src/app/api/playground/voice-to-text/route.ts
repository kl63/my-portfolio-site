import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const language = formData.get('language') as string || 'en';

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // Fallback transcription if no API key
    if (!process.env.OPENAI_API_KEY) {
      const fallbackText = generateFallbackTranscription(language);
      return NextResponse.json({ text: fallbackText });
    }

    // Use OpenAI Whisper for transcription
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: language.split('-')[0], // Convert 'en-US' to 'en'
      response_format: 'text',
    });

    return NextResponse.json({ text: transcription });
  } catch (error) {
    console.error('Error transcribing audio:', error);
    
    // Return fallback transcription on error
    const formData = await request.formData();
    const language = formData.get('language') as string || 'en';
    const fallbackText = generateFallbackTranscription(language);
    return NextResponse.json({ text: fallbackText });
  }
}

function generateFallbackTranscription(language: string): string {
  const fallbackTexts: { [key: string]: string } = {
    'en-US': 'Hello! This is a sample transcription. In a real implementation with an OpenAI API key, your speech would be accurately converted to text using Whisper AI. The system supports multiple languages and provides high-quality transcription results.',
    'en-GB': 'Hello! This is a sample transcription. In a real implementation with an OpenAI API key, your speech would be accurately converted to text using Whisper AI.',
    'es-ES': 'Hola! Esta es una transcripción de muestra. En una implementación real con una clave API de OpenAI, tu voz sería convertida a texto con precisión.',
    'fr-FR': 'Bonjour! Ceci est une transcription d\'exemple. Dans une implémentation réelle avec une clé API OpenAI, votre parole serait convertie en texte avec précision.',
    'de-DE': 'Hallo! Dies ist eine Beispieltranskription. In einer echten Implementierung mit einem OpenAI API-Schlüssel würde Ihre Sprache genau in Text umgewandelt.',
    'it-IT': 'Ciao! Questa è una trascrizione di esempio. In un\'implementazione reale con una chiave API OpenAI, il tuo discorso verrebbe convertito accuratamente in testo.',
    'pt-BR': 'Olá! Esta é uma transcrição de exemplo. Em uma implementação real com uma chave API OpenAI, sua fala seria convertida em texto com precisão.',
    'ja-JP': 'こんにちは！これはサンプル転写です。OpenAI APIキーを使用した実際の実装では、音声が正確にテキストに変換されます。',
    'ko-KR': '안녕하세요! 이것은 샘플 전사입니다. OpenAI API 키를 사용한 실제 구현에서는 음성이 정확하게 텍스트로 변환됩니다.',
    'zh-CN': '你好！这是一个示例转录。在使用OpenAI API密钥的实际实现中，您的语音将被准确地转换为文本。'
  };

  return fallbackTexts[language] || fallbackTexts['en-US'];
}
