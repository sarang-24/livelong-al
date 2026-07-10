export const getIndianFemaleVoice = (): SpeechSynthesisVoice | null => {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  
  // 1. Prioritize English (India) female voices (e.g., Veena, Heera, Google en-IN Female)
  let voice = voices.find(v => {
    const lang = v.lang.toLowerCase();
    const name = v.name.toLowerCase();
    return lang.includes("en-in") && 
      (name.includes("female") || name.includes("veena") || name.includes("heera") || name.includes("google")) &&
      !name.includes("rishi") && !name.includes("male");
  });
  
  // 2. Try any English (India) voice that is explicitly NOT male
  if (!voice) {
    voice = voices.find(v => {
      const lang = v.lang.toLowerCase();
      const name = v.name.toLowerCase();
      return lang.includes("en-in") && !name.includes("rishi") && !name.includes("male");
    });
  }
  
  // 3. Fallback to clear, premium female English voices (Samantha, Zira, Victoria, Google US/UK Female, Veena, Karen, Moira, Tessa, Kate, Serena, Susan, Fiona)
  if (!voice) {
    voice = voices.find(v => {
      const name = v.name.toLowerCase();
      const lang = v.lang.toLowerCase();
      return lang.startsWith("en") && 
        (
          name.includes("female") || 
          name.includes("zira") || 
          name.includes("samantha") || 
          name.includes("veena") || 
          name.includes("hazel") || 
          name.includes("heera") ||
          name.includes("victoria") ||
          name.includes("karen") ||
          name.includes("moira") ||
          name.includes("tessa") ||
          name.includes("kate") ||
          name.includes("serena") ||
          name.includes("susan") ||
          name.includes("fiona") ||
          name.includes("agnes") ||
          name.includes("kathy") ||
          name.includes("vicki")
        ) && !name.includes("male") && !name.includes("rishi");
    });
  }
  
  // 4. Try any English voice that is explicitly NOT male (excluding common male voice names to guarantee a female voice)
  if (!voice) {
    voice = voices.find(v => {
      const lang = v.lang.toLowerCase();
      const name = v.name.toLowerCase();
      return lang.startsWith("en") && 
        !name.includes("male") && 
        !name.includes("rishi") && 
        !name.includes("daniel") && 
        !name.includes("alex") && 
        !name.includes("fred") &&
        !name.includes("bruce") &&
        !name.includes("oliver");
    });
  }
  
  // 5. Fallback to any English voice
  if (!voice) {
    voice = voices.find(v => v.lang.toLowerCase().startsWith("en"));
  }
  
  return voice;
};

export const speakText = (
  text: string, 
  onStart?: () => void, 
  onEnd?: () => void, 
  onError?: () => void
) => {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  
  window.speechSynthesis.cancel();
  
  // Remove markdown symbols from speech
  const cleanText = text.replace(/[#*`_]/g, "");
  const utterance = new SpeechSynthesisUtterance(cleanText);
  
  // Configure natural, light, human parameters
  utterance.pitch = 1.08; // Slightly elevated pitch for a lighter, pleasant female tone
  utterance.rate = 0.92;  // Natural cadence speed
  utterance.volume = 1.0;
  
  const voice = getIndianFemaleVoice();
  if (voice) {
    utterance.voice = voice;
  }
  
  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  if (onError) utterance.onerror = onError;
  
  window.speechSynthesis.speak(utterance);
};
