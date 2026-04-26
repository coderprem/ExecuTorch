// navigation/ScreenRegistry.ts

import ChatScreen from '../../features/chat/screens/ChatScreen';
import ImageGeneratorScreen from '../../features/imageGeneration/screens/ImageGeneratorScreen';
import SpeechToTextScreen from '../../features/speechToText/screens/SpeechToTextScreen';
import TextToSpeechScreen from '../../features/textToSpeech/screens/TextToSpeechScreen';
import { ScreenNames } from './ScreenNames';


export const SCREEN_REGISTRY: Record<string, any> = {
  [ScreenNames.CHAT]: ChatScreen,
  [ScreenNames.IMAGE_GENERATOR]: ImageGeneratorScreen,
  [ScreenNames.SPEECH_TO_TEXT]: SpeechToTextScreen,
  [ScreenNames.TEXT_TO_SPEECH]: TextToSpeechScreen,
};