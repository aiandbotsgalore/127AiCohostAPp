# Speech generation (text-to-speech)  |  Gemini API  |  Google AI for Developers

Source: https://ai.google.dev/gemini-api/docs/speech-generation

/\* Styles inlined from /site-assets/css/pricing.css \*/ /\* Pricing table styles \*/ .pricing-table { border-collapse: separate; border-spacing: 0; border-radius: 8px; overflow: hidden; } .pricing-table th { background-color: #f2f2f2; text-align: left; padding: 8px; } /\* Set the second and after (of three total) columns to 35% width. \*/ .pricing-table th:nth-child(n+2) { width: 35%; } /\* These should use theme colours for light too, so we don't \* need an override. \*/ .color-scheme--dark .pricing-table th { background-color: var(--devsite-ref-palette--grey800); } .pricing-table td { padding: 8px; } .free-tier { background-color: none; } .paid-tier { background-color: #eff5ff; } .color-scheme--dark .paid-tier { background-color: var(--devsite-background-5); } .pricing-table th:first-child { border-top-left-radius: 8px; } .pricing-table th:last-child { border-top-right-radius: 8px; } .pricing-table tr:last-child td:first-child { border-bottom-left-radius: 8px; } .pricing-table tr:last-child td:last-child { border-bottom-right-radius: 8px; } .pricing-container { max-width: 1100px; width: 100%; } .pricing-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; justify-content: center; } .pricing-card { background-color: #ffffff; border-radius: 16px; border: 1px solid #dadce0; padding: 2.5rem; display: flex; flex-direction: column; transition: all 0.3s ease; position: relative; } .color-scheme--dark .pricing-card { background-color: var(--devsite-ref-palette--grey800); } .plan-name { font-size: 1.75rem; font-weight: 700; margin: 0 0 0.5rem 0; } .plan-description { font-size: 1rem; color: #5f6368; margin: 0 0 2.5rem 0; line-height: 1.5; min-height: 80px; } .color-scheme--dark .plan-description { color: var(--devsite-primary-text-color); } .plan-description a { color: #1a73e8; text-decoration: none; } .plan-description a:hover { text-decoration: underline; } .features { list-style: none; padding: 0; margin: 0 0 2rem 0; } .features li { display: flex; align-items: flex-start; margin-bottom: 1.25rem; font-size: 1rem; line-height: 1.5; color: #3c4043; } .features li.feature-description { display: block; color: #5f6368; } .features li a { color: #1a73e8; text-decoration: none; margin-left: 4px; } .features li .material-symbols-outlined { font-size: 24px; margin-right: 0.75rem; color: #3c4043; margin-top: 2px; } .color-scheme--dark .features li, .features li .material-symbols-outlined { color: var(--devsite-primary-text-color); } .cta-button { display: inline-block; text-align: center; text-decoration: none; width: 100%; padding: 0.75rem 1rem; border-radius: 8px; font-size: 1rem; font-weight: 500; cursor: pointer; transition: background-color 0.2s ease; box-sizing: border-box; border: 1px solid #dadce0; background-color: #fff; color: #1a73e8; margin-top: auto; } .cta-button:hover { background-color: rgba(66, 133, 244, 0.05); } .pricing-card.recommended { border: 2px solid #1a73e8; overflow: hidden; } .pricing-card.recommended::before { position: absolute; top: 22px; right: -32px; width: 120px; height: 30px; background-color: #1a73e8; color: white; display: flex; justify-content: center; align-items: center; font-size: 0.8rem; font-weight: 600; transform: rotate(45deg); z-index: 1; } .heading-group { display: flex; flex-direction: column; } .heading-group h2 { margin-bottom: 0; } .heading-group em { margin-top: 0; }

Gemini 3 Pro is here. [Try it for free in Google AI Studio](https://aistudio.google.com?model=gemini-3-pro-preview).

*   [Home](https://ai.google.dev/)
*   [Gemini API](https://ai.google.dev/gemini-api)
*   [Gemini API Docs](https://ai.google.dev/gemini-api/docs)

Send feedback

# Speech generation (text-to-speech)

The Gemini API can transform text input into single speaker or multi-speaker audio using native text-to-speech (TTS) generation capabilities. Text-to-speech (TTS) generation is *[controllable](#controllable)*, meaning you can use natural language to structure interactions and guide the *style*, *accent*, *pace*, and *tone* of the audio.

The TTS capability differs from speech generation provided through the [Live API](/gemini-api/docs/live), which is designed for interactive, unstructured audio, and multimodal inputs and outputs. While the Live API excels in dynamic conversational contexts, TTS through the Gemini API is tailored for scenarios that require exact text recitation with fine-grained control over style and sound, such as podcast or audiobook generation.

This guide shows you how to generate single-speaker and multi-speaker audio from text.

**Preview:** Native text-to-speech (TTS) is in [Preview](/gemini-api/docs/models#preview).

## Before you begin

Ensure you use a Gemini 2.5 model variant with native text-to-speech (TTS) capabilities, as listed in the [Supported models](/gemini-api/docs/speech-generation#supported-models) section. For optimal results, consider which model best fits your specific use case.

You may find it useful to [test the Gemini 2.5 TTS models in AI Studio](https://aistudio.google.com/generate-speech) before you start building.

**Note:** TTS models accept text-only inputs and produce audio-only outputs. For a complete list of restrictions specific to TTS models, review the [Limitations](/gemini-api/docs/speech-generation#limitations) section.

## Single-speaker text-to-speech

To convert text to single-speaker audio, set the response modality to "audio", and pass a `SpeechConfig` object with `VoiceConfig` set. You'll need to choose a voice name from the prebuilt [output voices](#voices).

This example saves the output audio from the model in a wave file:

### Python

```
from google import genai
from google.genai import types
import wave

# Set up the wave file to save the output:
def wave_file(filename, pcm, channels=1, rate=24000, sample_width=2):
   with wave.open(filename, "wb") as wf:
      wf.setnchannels(channels)
      wf.setsampwidth(sample_width)
      wf.setframerate(rate)
      wf.writeframes(pcm)

client = genai.Client()

response = client.models.generate_content(
   model="gemini-2.5-flash-preview-tts",
   contents="Say cheerfully: Have a wonderful day!",
   config=types.GenerateContentConfig(
      response_modalities=["AUDIO"],
      speech_config=types.SpeechConfig(
         voice_config=types.VoiceConfig(
            prebuilt_voice_config=types.PrebuiltVoiceConfig(
               voice_name='Kore',
            )
         )
      ),
   )
)

data = response.candidates[0].content.parts[0].inline_data.data

file_name='out.wav'
wave_file(file_name, data) # Saves the file to current directory
```

For more code samples, refer to the "TTS - Get Started" file in the cookbooks repository:

[View on GitHub](https://colab.research.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Get_started_TTS.ipynb)

### JavaScript

```
import {GoogleGenAI} from '@google/genai';
import wav from 'wav';

async function saveWaveFile(
   filename,
   pcmData,
   channels = 1,
   rate = 24000,
   sampleWidth = 2,
) {
   return new Promise((resolve, reject) => {
      const writer = new wav.FileWriter(filename, {
            channels,
            sampleRate: rate,
            bitDepth: sampleWidth * 8,
      });

      writer.on('finish', resolve);
      writer.on('error', reject);

      writer.write(pcmData);
      writer.end();
   });
}

async function main() {
   const ai = new GoogleGenAI({});

   const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: 'Say cheerfully: Have a wonderful day!' }] }],
      config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
               voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Kore' },
               },
            },
      },
   });

   const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
   const audioBuffer = Buffer.from(data, 'base64');

   const fileName = 'out.wav';
   await saveWaveFile(fileName, audioBuffer);
}
await main();
```

### REST

```
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
        "contents": [{
          "parts":[{
            "text": "Say cheerfully: Have a wonderful day!"
          }]
        }],
        "generationConfig": {
          "responseModalities": ["AUDIO"],
          "speechConfig": {
            "voiceConfig": {
              "prebuiltVoiceConfig": {
                "voiceName": "Kore"
              }
            }
          }
        },
        "model": "gemini-2.5-flash-preview-tts",
    }' | jq -r '.candidates[0].content.parts[0].inlineData.data' | \
          base64 --decode >out.pcm
# You may need to install ffmpeg.
ffmpeg -f s16le -ar 24000 -ac 1 -i out.pcm out.wav
```

## Multi-speaker text-to-speech

For multi-speaker audio, you'll need a `MultiSpeakerVoiceConfig` object with each speaker (up to 2) configured as a `SpeakerVoiceConfig`. You'll need to define each `speaker` with the same names used in the [prompt](#controllable):

### Python

```
from google import genai
from google.genai import types
import wave

# Set up the wave file to save the output:
def wave_file(filename, pcm, channels=1, rate=24000, sample_width=2):
   with wave.open(filename, "wb") as wf:
      wf.setnchannels(channels)
      wf.setsampwidth(sample_width)
      wf.setframerate(rate)
      wf.writeframes(pcm)

client = genai.Client()

prompt = """TTS the following conversation between Joe and Jane:
         Joe: How's it going today Jane?
         Jane: Not too bad, how about you?"""

response = client.models.generate_content(
   model="gemini-2.5-flash-preview-tts",
   contents=prompt,
   config=types.GenerateContentConfig(
      response_modalities=["AUDIO"],
      speech_config=types.SpeechConfig(
         multi_speaker_voice_config=types.MultiSpeakerVoiceConfig(
            speaker_voice_configs=[
               types.SpeakerVoiceConfig(
                  speaker='Joe',
                  voice_config=types.VoiceConfig(
                     prebuilt_voice_config=types.PrebuiltVoiceConfig(
                        voice_name='Kore',
                     )
                  )
               ),
               types.SpeakerVoiceConfig(
                  speaker='Jane',
                  voice_config=types.VoiceConfig(
                     prebuilt_voice_config=types.PrebuiltVoiceConfig(
                        voice_name='Puck',
                     )
                  )
               ),
            ]
         )
      )
   )
)

data = response.candidates[0].content.parts[0].inline_data.data

file_name='out.wav'
wave_file(file_name, data) # Saves the file to current directory
```

### JavaScript

```
import {GoogleGenAI} from '@google/genai';
import wav from 'wav';

async function saveWaveFile(
   filename,
   pcmData,
   channels = 1,
   rate = 24000,
   sampleWidth = 2,
) {
   return new Promise((resolve, reject) => {
      const writer = new wav.FileWriter(filename, {
            channels,
            sampleRate: rate,
            bitDepth: sampleWidth * 8,
      });

      writer.on('finish', resolve);
      writer.on('error', reject);

      writer.write(pcmData);
      writer.end();
   });
}

async function main() {
   const ai = new GoogleGenAI({});

   const prompt = `TTS the following conversation between Joe and Jane:
         Joe: How's it going today Jane?
         Jane: Not too bad, how about you?`;

   const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
               multiSpeakerVoiceConfig: {
                  speakerVoiceConfigs: [
                        {
                           speaker: 'Joe',
                           voiceConfig: {
                              prebuiltVoiceConfig: { voiceName: 'Kore' }
                           }
                        },
                        {
                           speaker: 'Jane',
                           voiceConfig: {
                              prebuiltVoiceConfig: { voiceName: 'Puck' }
                           }
                        }
                  ]
               }
            }
      }
   });

   const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
   const audioBuffer = Buffer.from(data, 'base64');

   const fileName = 'out.wav';
   await saveWaveFile(fileName, audioBuffer);
}

await main();
```

### REST

```
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
  "contents": [{
    "parts":[{
      "text": "TTS the following conversation between Joe and Jane:
                Joe: Hows it going today Jane?
                Jane: Not too bad, how about you?"
    }]
  }],
  "generationConfig": {
    "responseModalities": ["AUDIO"],
    "speechConfig": {
      "multiSpeakerVoiceConfig": {
        "speakerVoiceConfigs": [{
            "speaker": "Joe",
            "voiceConfig": {
              "prebuiltVoiceConfig": {
                "voiceName": "Kore"
              }
            }
          }, {
            "speaker": "Jane",
            "voiceConfig": {
              "prebuiltVoiceConfig": {
                "voiceName": "Puck"
              }
            }
          }]
      }
    }
  },
  "model": "gemini-2.5-flash-preview-tts",
}' | jq -r '.candidates[0].content.parts[0].inlineData.data' | \
    base64 --decode > out.pcm
# You may need to install ffmpeg.
ffmpeg -f s16le -ar 24000 -ac 1 -i out.pcm out.wav
```

## Controlling speech style with prompts

You can control style, tone, accent, and pace using natural language prompts for both single- and multi-speaker TTS. For example, in a single-speaker prompt, you can say:

```
Say in an spooky whisper:
"By the pricking of my thumbs...
Something wicked this way comes"
```

In a multi-speaker prompt, provide the model with each speaker's name and corresponding transcript. You can also provide guidance for each speaker individually:

```
Make Speaker1 sound tired and bored, and Speaker2 sound excited and happy:

Speaker1: So... what's on the agenda today?
Speaker2: You're never going to guess!
```

Try using a [voice option](#voices) that corresponds to the style or emotion you want to convey, to emphasize it even more. In the previous prompt, for example, *Enceladus*'s breathiness might emphasize "tired" and "bored", while *Puck*'s upbeat tone could complement "excited" and "happy".

## Generating a prompt to convert to audio

The TTS models only output audio, but you can use [other models](/gemini-api/docs/models) to generate a transcript first, then pass that transcript to the TTS model to read aloud.

### Python

```
from google import genai
from google.genai import types

client = genai.Client()

transcript = client.models.generate_content(
   model="gemini-2.0-flash",
   contents="""Generate a short transcript around 100 words that reads
            like it was clipped from a podcast by excited herpetologists.
            The hosts names are Dr. Anya and Liam.""").text

response = client.models.generate_content(
   model="gemini-2.5-flash-preview-tts",
   contents=transcript,
   config=types.GenerateContentConfig(
      response_modalities=["AUDIO"],
      speech_config=types.SpeechConfig(
         multi_speaker_voice_config=types.MultiSpeakerVoiceConfig(
            speaker_voice_configs=[
               types.SpeakerVoiceConfig(
                  speaker='Dr. Anya',
                  voice_config=types.VoiceConfig(
                     prebuilt_voice_config=types.PrebuiltVoiceConfig(
                        voice_name='Kore',
                     )
                  )
               ),
               types.SpeakerVoiceConfig(
                  speaker='Liam',
                  voice_config=types.VoiceConfig(
                     prebuilt_voice_config=types.PrebuiltVoiceConfig(
                        voice_name='Puck',
                     )
                  )
               ),
            ]
         )
      )
   )
)

# ...Code to stream or save the output
```

### JavaScript

```
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

async function main() {

const transcript = await ai.models.generateContent({
   model: "gemini-2.0-flash",
   contents: "Generate a short transcript around 100 words that reads like it was clipped from a podcast by excited herpetologists. The hosts names are Dr. Anya and Liam.",
   })

const response = await ai.models.generateContent({
   model: "gemini-2.5-flash-preview-tts",
   contents: transcript,
   config: {
      responseModalities: ['AUDIO'],
      speechConfig: {
         multiSpeakerVoiceConfig: {
            speakerVoiceConfigs: [
                   {
                     speaker: "Dr. Anya",
                     voiceConfig: {
                        prebuiltVoiceConfig: {voiceName: "Kore"},
                     }
                  },
                  {
                     speaker: "Liam",
                     voiceConfig: {
                        prebuiltVoiceConfig: {voiceName: "Puck"},
                    }
                  }
                ]
              }
            }
      }
  });
}
// ..JavaScript code for exporting .wav file for output audio

await main();
```

## Voice options

TTS models support the following 30 voice options in the `voice_name` field:

<table><colgroup><col class="paid-tier"> <col> <col class="paid-tier"></colgroup><tbody><tr><td><b>Zephyr</b> -- <em>Bright</em></td><td><b>Puck</b> -- <em>Upbeat</em></td><td><b>Charon</b> -- <em>Informative</em></td></tr><tr><td><b>Kore</b> -- <em>Firm</em></td><td><b>Fenrir</b> -- <em>Excitable</em></td><td><b>Leda</b> -- <em>Youthful</em></td></tr><tr><td><b>Orus</b> -- <em>Firm</em></td><td><b>Aoede</b> -- <em>Breezy</em></td><td><b>Callirrhoe</b> -- <em>Easy-going</em></td></tr><tr><td><b>Autonoe</b> -- <em>Bright</em></td><td><b>Enceladus</b> -- <em>Breathy</em></td><td><b>Iapetus</b> -- <em>Clear</em></td></tr><tr><td><b>Umbriel</b> -- <em>Easy-going</em></td><td><b>Algieba</b> -- <em>Smooth</em></td><td><b>Despina</b> -- <em>Smooth</em></td></tr><tr><td><b>Erinome</b> -- <em>Clear</em></td><td><b>Algenib</b> -- <em>Gravelly</em></td><td><b>Rasalgethi</b> -- <em>Informative</em></td></tr><tr><td><b>Laomedeia</b> -- <em>Upbeat</em></td><td><b>Achernar</b> -- <em>Soft</em></td><td><b>Alnilam</b> -- <em>Firm</em></td></tr><tr><td><b>Schedar</b> -- <em>Even</em></td><td><b>Gacrux</b> -- <em>Mature</em></td><td><b>Pulcherrima</b> -- <em>Forward</em></td></tr><tr><td><b>Achird</b> -- <em>Friendly</em></td><td><b>Zubenelgenubi</b> -- <em>Casual</em></td><td><b>Vindemiatrix</b> -- <em>Gentle</em></td></tr><tr><td><b>Sadachbia</b> -- <em>Lively</em></td><td><b>Sadaltager</b> -- <em>Knowledgeable</em></td><td><b>Sulafat</b> -- <em>Warm</em></td></tr></tbody></table>

You can hear all the voice options in [AI Studio](https://aistudio.google.com/generate-speech).

## Supported languages

The TTS models detect the input language automatically. They support the following 24 languages:

   
| Language | BCP-47 Code | Language | BCP-47 Code |
| --- | --- | --- | --- |
| Arabic (Egyptian) | `ar-EG` | German (Germany) | `de-DE` |
| English (US) | `en-US` | Spanish (US) | `es-US` |
| French (France) | `fr-FR` | Hindi (India) | `hi-IN` |
| Indonesian (Indonesia) | `id-ID` | Italian (Italy) | `it-IT` |
| Japanese (Japan) | `ja-JP` | Korean (Korea) | `ko-KR` |
| Portuguese (Brazil) | `pt-BR` | Russian (Russia) | `ru-RU` |
| Dutch (Netherlands) | `nl-NL` | Polish (Poland) | `pl-PL` |
| Thai (Thailand) | `th-TH` | Turkish (Turkey) | `tr-TR` |
| Vietnamese (Vietnam) | `vi-VN` | Romanian (Romania) | `ro-RO` |
| Ukrainian (Ukraine) | `uk-UA` | Bengali (Bangladesh) | `bn-BD` |
| English (India) | `en-IN` & `hi-IN` bundle | Marathi (India) | `mr-IN` |
| Tamil (India) | `ta-IN` | Telugu (India) | `te-IN` |

## Supported models

| Model | Single speaker | Multispeaker |
| --- | --- | --- |
| [Gemini 2.5 Flash Preview TTS](/gemini-api/docs/models#gemini-2.5-flash-preview-tts) | ✔️ | ✔️ |
| [Gemini 2.5 Pro Preview TTS](/gemini-api/docs/models#gemini-2.5-pro-preview-tts) | ✔️ | ✔️ |

## Limitations

*   TTS models can only receive text inputs and generate audio outputs.
*   A TTS session has a [context window](/gemini-api/docs/long-context) limit of 32k tokens.
*   Review [Languages](/gemini-api/docs/speech-generation#languages) section for language support.

## What's next

*   Try the [audio generation cookbook](https://colab.research.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Get_started_TTS.ipynb).
*   Gemini's [Live API](/gemini-api/docs/live) offers interactive audio generation options you can interleave with other modalities.
*   For working with audio *inputs*, visit the [Audio understanding](/gemini-api/docs/audio) guide.

Send feedback

Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2025-09-22 UTC.
