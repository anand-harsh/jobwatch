import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditableCellProps {
  value: string;
  onUpdate: (value: string) => void;
  type?: "text" | "textarea" | "date";
  className?: string;
  placeholder?: string;
}

export function EditableCell({ 
  value, 
  onUpdate, 
  type = "text", 
  className,
  placeholder 
}: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (localValue !== value) {
      onUpdate(localValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && type !== "textarea") {
      handleBlur();
    }
    if (e.key === "Escape") {
      setLocalValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    if (type === "textarea") {
      return (
        <Textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={cn("min-h-[60px] resize-none text-xs", className)}
          placeholder={placeholder}
        />
      );
    }
    return (
      <Input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type={type}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn("h-8 text-xs", className)}
        placeholder={placeholder}
      />
    );
  }

  return (
    <div 
      className={cn(
        "group flex items-center justify-between gap-2 min-h-[2rem] px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer", 
        className
      )}
      onClick={() => setIsEditing(true)}
    >
      <span className={cn("truncate flex-1", !value && "text-muted-foreground italic")}>
        {value || placeholder || "Click to edit"}
      </span>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          setIsEditing(true);
        }}
      >
        <Pencil className="h-3 w-3 text-muted-foreground" />
      </Button>
    </div>
  );
}
