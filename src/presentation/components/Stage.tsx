import React from 'react';
import { FORMATION_NAMES } from '../latent/formations';

interface StageProps {
  index: number;
  className?: string;
  children?: React.ReactNode;
  /** readout shown in the stage's corner */
  note?: React.ReactNode;
  /** replaces the default `formation: name` readout */
  label?: React.ReactNode;
  /** positions a sub-box for the field to anchor to, instead of the whole stage */
  anchorClassName?: string;
}

/** The box the latent field anchors formation `index` to. Purely visual. */
export const Stage: React.FC<StageProps> = ({ index, className = '', children, note, label, anchorClassName }) => (
  <div data-stage={anchorClassName ? undefined : index} aria-hidden="true" className={`ticks relative ${className}`}>
    {anchorClassName && <div data-stage={index} className={`absolute ${anchorClassName}`} />}
    {children}
    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
      <span>{label ?? `formation: ${FORMATION_NAMES[index]}`}</span>
      {note && <span className="text-right">{note}</span>}
    </div>
  </div>
);
