import clsx from 'clsx';
import { useId } from 'react';
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';

const CONTROL_CLASS = clsx(
  'w-full rounded-bubble border border-white/80 bg-white/85 px-4 py-2.5 text-sm text-ink-deep',
  'placeholder:text-ink-soft/70 transition duration-200',
  'focus:border-pink focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink/35',
  'disabled:cursor-not-allowed disabled:opacity-60',
);

interface FieldShellProps {
  label: string;
  hint?: ReactNode;
  htmlFor: string;
  children: ReactNode;
}

function FieldShell({ label, hint, htmlFor, children }: FieldShellProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="flex items-baseline justify-between gap-2 text-xs">
        <span className="text-ink">{label}</span>
        {hint ? <span className="text-right text-[10px] text-ink-soft">{hint}</span> : null}
      </label>
      {children}
    </div>
  );
}

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: ReactNode;
}

export function TextField({ label, hint, className, ...props }: TextFieldProps) {
  const id = useId();
  return (
    <FieldShell label={label} hint={hint} htmlFor={id}>
      <input id={id} className={clsx(CONTROL_CLASS, className)} {...props} />
    </FieldShell>
  );
}

export interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: ReactNode;
}

export function TextAreaField({ label, hint, className, ...props }: TextAreaFieldProps) {
  const id = useId();
  return (
    <FieldShell label={label} hint={hint} htmlFor={id}>
      <textarea
        id={id}
        className={clsx(CONTROL_CLASS, 'scroll-soft resize-y leading-relaxed', className)}
        {...props}
      />
    </FieldShell>
  );
}

export interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: ReactNode;
}

export function SelectField({ label, hint, className, children, ...props }: SelectFieldProps) {
  const id = useId();
  return (
    <FieldShell label={label} hint={hint} htmlFor={id}>
      <select id={id} className={clsx(CONTROL_CLASS, 'appearance-none', className)} {...props}>
        {children}
      </select>
    </FieldShell>
  );
}
