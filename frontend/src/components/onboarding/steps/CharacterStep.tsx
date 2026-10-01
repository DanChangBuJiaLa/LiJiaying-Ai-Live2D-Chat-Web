import type { CharacterDraft } from '@shared';
import { DEFAULT_CHARACTER } from '../../../constants/defaultCharacter';
import { TextAreaField, TextField } from '../../common/FormField';

/** 角色草稿里所有纯文本字段（都可直接编辑） */
type TextFieldKey = 'name' | 'personality' | 'tone' | 'background' | 'catchphrase' | 'taboos';

export interface CharacterStepProps {
  draft: CharacterDraft;
  onChange: (patch: Partial<CharacterDraft>) => void;
}

const TEXT_AREAS: Array<{
  key: Exclude<TextFieldKey, 'name'>;
  label: string;
  hint: string;
  rows: number;
  placeholder: string;
}> = [
  {
    key: 'background',
    label: '身份背景',
    hint: '她是谁、过着怎样的生活',
    rows: 4,
    placeholder: '例如：18 岁大学计算机系学生…',
  },
  {
    key: 'personality',
    label: '核心性格',
    hint: '扮演时必须保持一致',
    rows: 6,
    placeholder: '一条一行，例如：元气小太阳…',
  },
  {
    key: 'tone',
    label: '语气风格',
    hint: '说话方式与口头语',
    rows: 5,
    placeholder: '例如：语调轻快上扬，句尾加「嘛～」…',
  },
  {
    key: 'catchphrase',
    label: '口头禅 / 高频词',
    hint: '可选',
    rows: 3,
    placeholder: '例如：「哇～」「好可爱！」…',
  },
  {
    key: 'taboos',
    label: '禁忌与约束',
    hint: '可选',
    rows: 4,
    placeholder: '例如：永远以第一人称说话，不要说教…',
  },
];

/** 向导第 2 步：确认并可按需修改角色人格（默认填好内置「羽澄糯」） */
export function CharacterStep({ draft, onChange }: CharacterStepProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <TextField
            label="角色名字"
            hint="她会用这个名字介绍自己"
            value={draft.name}
            onChange={(event) => onChange({ name: event.target.value })}
            placeholder="羽澄糯"
          />
        </div>
        <button
          type="button"
          onClick={() => onChange({ ...DEFAULT_CHARACTER })}
          className="mb-0.5 shrink-0 rounded-full bg-white/70 px-4 py-2 text-xs text-ink shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
        >
          恢复默认人设
        </button>
      </div>

      <div className="scroll-soft flex max-h-[42vh] flex-col gap-4 overflow-y-auto pr-1">
        {TEXT_AREAS.map((field) => (
          <TextAreaField
            key={field.key}
            label={field.label}
            hint={field.hint}
            rows={field.rows}
            placeholder={field.placeholder}
            value={draft[field.key]}
            onChange={(event) => onChange({ [field.key]: event.target.value })}
          />
        ))}
      </div>

      <p className="text-[10px] leading-relaxed text-ink-soft">
        这些设定会拼进 System Prompt，决定角色的说话方式；之后随时可以在设置里改。
      </p>
    </div>
  );
}
