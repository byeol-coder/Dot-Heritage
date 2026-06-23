export type Lang = 'ko' | 'en';

export function speak(text: string, lang: Lang = 'ko', onEnd?: () => void): void {
  cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang === 'ko' ? 'ko-KR' : 'en-US';
  u.rate = 0.9;
  u.pitch = 1;
  if (onEnd) u.onend = onEnd;
  window.speechSynthesis.speak(u);
}

export function pause(): void {
  window.speechSynthesis.pause();
}

export function resume(): void {
  window.speechSynthesis.resume();
}

export function cancel(): void {
  window.speechSynthesis.cancel();
}

export function isSpeaking(): boolean {
  return window.speechSynthesis.speaking;
}
