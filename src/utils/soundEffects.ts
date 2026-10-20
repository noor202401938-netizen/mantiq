// SoundFX Manager - Completely silenced as requested by user
class SoundFXManager {
  private isMuted: boolean = true;

  constructor() {
    this.isMuted = true;
  }

  public toggleMute(): boolean {
    return true;
  }

  public getMuted(): boolean {
    return true;
  }

  public playClick(): void {
    // Silenced
  }

  public playCorrect(): void {
    // Silenced
  }

  public playIncorrect(): void {
    // Silenced
  }

  public playError(): void {
    // Silenced
  }

  public playWrong(): void {
    // Silenced
  }

  public playFanfare(): void {
    // Silenced
  }

  public playLevelUp(): void {
    // Silenced
  }

  public playStep(): void {
    // Silenced
  }
}

export const soundFX = new SoundFXManager();

