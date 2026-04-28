export const ChatStrings = {
  status: 'Status: ',
  readyToChat: 'Ready to chat',
  downloading: 'Downloading: {{progress}}%',
  letStartChat: 'Let\'s chat',
  getResults: 'Get results',
}

export const TextToSpeechStrings = {
  status: 'Status: ',
  readyToSpeak: 'Ready to speak',
  typeSomethingToHearIt: 'Type something to hear it...',
  speak: 'Speak',
  speaking: 'Speaking...',
  tapToPlay: 'Tap to Play',
};

export const CommonStrings = {
  status: 'Status: ',
  downloading: 'Downloading: {{progress}}%',
  /** Shown while the runtime checks cache / disk before reporting download bytes. */
  modelChecking: 'Checking if model is available…',
};

export const ImageGenerationStrings = {
  readyToGenerate: 'Ready to generate',
  describeImage: 'Describe an image…',
  generate: 'Generate',
  generating: 'Generating…',
};

export const HuggingFaceStrings = {
  placeholder: 'Describe an image…',
  generate: 'Generate',
  generating: 'Generating…',
  offlineMessage:
    'Internet connection is required to use Hugging Face inference.',
  tokenMissing:
    'Set HF_INFERENCE_API_KEY, HF_API_KEY, or HF_TOKEN in the project root .env, then restart Metro with --reset-cache.',
  generationFailed: 'Could not generate an image. Try again.',
};

export const SpeechToTextStrings = {
  readyToTranscribe: 'Ready to transcribe',
  tapToRecord: 'Tap to record',
  recording: 'Recording…',
  transcribing: 'Transcribing…',
  processingRecording: 'Processing your recording…',
  /** Shown under the record control — manual stop only. */
  recordStopHint: 'Tap again to stop recording and transcribe.',
  microphoneDenied:
    'Microphone access is required. Enable it in Settings to transcribe speech.',
  recordingStartFailed: 'Could not start recording. Please try again.',
  recordingStopFailed: 'Could not save your recording. Please try again.',
  recordingTooShort:
    'Recording was too short. Speak for a bit longer, then tap stop.',
  transcriptionFailed:
    'Could not transcribe this recording. Check that the model is loaded and try again.',
  noSpeechRecognized:
    'No speech was recognized. Try speaking more clearly or closer to the microphone.',
  genericFailure: 'Something went wrong. Please try again.',
  transcriptPlaceholder: 'Your transcript will appear here after you finish recording.',
};