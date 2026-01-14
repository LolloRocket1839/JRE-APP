'use client';

import { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { Upload, X, FileText } from 'lucide-react';

export interface FileUploadProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in MB
  error?: string;
  hint?: string;
  onFilesChange: (files: File[]) => void;
  className?: string;
}

export function FileUpload({
  label,
  accept = 'image/*,.pdf',
  multiple = true,
  maxFiles = 5,
  maxSize = 10,
  error,
  hint,
  onFilesChange,
  className,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles) return;

      const fileArray = Array.from(newFiles);
      const validFiles = fileArray.filter((file) => {
        // Check file size
        if (file.size > maxSize * 1024 * 1024) {
          return false;
        }
        return true;
      });

      const updatedFiles = multiple
        ? [...files, ...validFiles].slice(0, maxFiles)
        : validFiles.slice(0, 1);

      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
    },
    [files, maxFiles, maxSize, multiple, onFilesChange]
  );

  const removeFile = useCallback(
    (index: number) => {
      const updatedFiles = files.filter((_, i) => i !== index);
      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
    },
    [files, onFilesChange]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-[var(--color-foreground)]">
          {label}
        </label>
      )}

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all duration-200',
          dragActive
            ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
            : 'border-[var(--color-card-border)] bg-[var(--color-card)]',
          error && 'border-[var(--color-error)]'
        )}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="absolute inset-0 cursor-pointer opacity-0"
        />

        <Upload className="mb-2 h-8 w-8 text-[var(--color-foreground-muted)]" />
        <p className="text-sm text-[var(--color-foreground)]">
          Trascina i file qui o <span className="text-[var(--color-primary)] underline">sfoglia</span>
        </p>
        <p className="mt-1 text-xs text-[var(--color-foreground-muted)]">
          Max {maxSize}MB per file
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between rounded-lg border border-[var(--color-card-border)] bg-[var(--color-card)] px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[var(--color-foreground-muted)]" />
                <span className="text-sm text-[var(--color-foreground)] truncate max-w-[200px]">
                  {file.name}
                </span>
                <span className="text-xs text-[var(--color-foreground-muted)]">
                  ({(file.size / 1024 / 1024).toFixed(2)}MB)
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="rounded p-1 text-[var(--color-foreground-muted)] hover:bg-[var(--color-error)]/10 hover:text-[var(--color-error)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-1.5 text-sm text-[var(--color-error)]">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1.5 text-sm text-[var(--color-foreground-muted)]">{hint}</p>
      )}
    </div>
  );
}
