import type { StepDeepDive, ChapterDeepDive } from './types';
import { DEEP_DIVE_CH01_02 } from './ch01-02';
import { DEEP_DIVE_CH03_04 } from './ch03-04';
import { DEEP_DIVE_CH05 } from './ch05';
import { DEEP_DIVE_CH06_07 } from './ch06-07';
import { DEEP_DIVE_CH08_09 } from './ch08-09';
import { DEEP_DIVE_CH10_11 } from './ch10-11';
import { DEEP_DIVE_CH12_14 } from './ch12-14';

export type { DeepDiveQA, WorkedExample, StepDeepDive, ChapterDeepDive } from './types';

const DEEP_DIVES: Record<number, ChapterDeepDive> = {
  ...DEEP_DIVE_CH01_02,
  ...DEEP_DIVE_CH03_04,
  ...DEEP_DIVE_CH05,
  ...DEEP_DIVE_CH06_07,
  ...DEEP_DIVE_CH08_09,
  ...DEEP_DIVE_CH10_11,
  ...DEEP_DIVE_CH12_14,
};

export function getStepDeepDive(chapterId: number, stepNumber: number): StepDeepDive | undefined {
  return DEEP_DIVES[chapterId]?.[stepNumber];
}
