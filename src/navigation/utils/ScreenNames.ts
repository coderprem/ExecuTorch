export const ScreenNames = {
  CHAT: 'Chat Screen',
  TEXT_TO_SPEECH: 'Text to Speech',
  SPEECH_TO_TEXT: 'Speech to Text',
  IMAGE_GENERATOR: 'Image Generator',
} as const;

export type ScreenName = (typeof ScreenNames)[keyof typeof ScreenNames];


export const NavigatorNames = {
  TABS: 'Tabs',
  MAIN: 'Main',
} as const;