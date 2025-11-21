'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';

export type CircuitVariable = {
  name: string;
  min: number | null;
  max: number | null;
};

interface VariableEditorProps {
  variables: CircuitVariable[];
  onVariablesChange: (variables: CircuitVariable[]) => void;
}

export function VariableEditor({
  variables,
  onVariablesChange,
}: VariableEditorProps) {
  const handleValueChange = (
    index: number,
    field: 'min' | 'max',
    value: string
  ) => {
    const newVariables = [...variables];
    const numValue = value === '' ? null : parseFloat(value);
    newVariables[index] = { ...newVariables[index], [field]: numValue };
    onVariablesChange(newVariables);
  };

  return (
    <div className="rounded-lg border p-4">
      <div className="grid grid-cols-3 gap-x-4 gap-y-2 px-2 pb-2 font-medium text-muted-foreground text-sm">
        <div>Variable Name</div>
        <div>Min Value</div>
        <div>Max Value</div>
      </div>
      <Separator />
      <ScrollArea className="h-72">
        <div className="p-1 space-y-2">
          {variables.map((variable, index) => {
            const isInvalid = variable.min !== null && variable.max !== null && variable.min >= variable.max;
            return (
            <div
              key={index}
              className="grid grid-cols-3 items-center gap-x-4 gap-y-2 rounded-md p-2 hover:bg-muted/50"
            >
              <Label htmlFor={`${variable.name}-min`} className="truncate font-normal">
                {variable.name}
              </Label>
              <Input
                id={`${variable.name}-min`}
                type="number"
                value={variable.min ?? ''}
                onChange={(e) => handleValueChange(index, 'min', e.target.value)}
                step="any"
                className={cn(isInvalid && "border-destructive ring-destructive focus-visible:ring-destructive")}
              />
              <Input
                id={`${variable.name}-max`}
                type="number"
                value={variable.max ?? ''}
                onChange={(e) => handleValueChange(index, 'max', e.target.value)}
                step="any"
                className={cn(isInvalid && "border-destructive ring-destructive focus-visible:ring-destructive")}
              />
            </div>
          )})}
        </div>
      </ScrollArea>
    </div>
  );
}
