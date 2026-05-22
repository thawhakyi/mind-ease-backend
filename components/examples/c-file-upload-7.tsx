'use client';

import {
    CircleAlertIcon,
    CloudUploadIcon,
    ImageIcon,
    PencilIcon,
    XIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/reui/alert';
import { formatBytes, useFileUpload } from '@/hooks/use-file-upload';
import type { FileMetadata } from '@/hooks/use-file-upload';

type FeaturedImageUploadProps = {
    accept?: string;
    className?: string;
    defaultImagePath?: string | null;
    maxSize?: number;
    onFileChange?: (file: File | null) => void;
};

export function Pattern({
    accept = 'image/*',
    className,
    defaultImagePath,
    maxSize = 2 * 1024 * 1024,
    onFileChange,
}: FeaturedImageUploadProps) {
    const initialFiles: FileMetadata[] = defaultImagePath
        ? [
              {
                  id: 'current-feature-image',
                  name: 'Current feature image',
                  size: 0,
                  type: 'image/*',
                  url: defaultImagePath,
              },
          ]
        : [];

    const [
        { files, isDragging, errors },
        {
            getInputProps,
            handleDragEnter,
            handleDragLeave,
            handleDragOver,
            handleDrop,
            openFileDialog,
            removeFile,
        },
    ] = useFileUpload({
        accept,
        initialFiles,
        maxSize,
        multiple: false,
        onFilesChange: (updatedFiles) => {
            const file = updatedFiles[0]?.file;

            onFileChange?.(file instanceof File ? file : null);
        },
    });

    const selectedFile = files[0];

    function removeSelectedFile() {
        if (!selectedFile) {
            return;
        }

        removeFile(selectedFile.id);
    }

    function replaceSelectedFile() {
        openFileDialog();
    }

    return (
        <div className={cn('w-full max-w-4xl', className)}>
            <Card
                className={cn(
                    'rounded-md border-dashed shadow-none transition-colors',
                    isDragging
                        ? 'border-primary bg-primary/5'
                        : 'border-muted-foreground/25 hover:border-muted-foreground/50',
                )}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <CardContent className="text-center">
                    <input {...getInputProps()} className="sr-only" />
                    <div className="mx-auto mb-3 flex size-8 items-center justify-center rounded-full border border-border">
                        <CloudUploadIcon />
                    </div>
                    <h3 className="mb-2 text-sm font-semibold text-foreground">
                        Choose a file or drag & drop here.
                    </h3>
                    <span className="mb-3 block text-xs font-normal text-secondary-foreground">
                        JPEG, PNG, up to {formatBytes(maxSize, 1)}.
                    </span>
                    <Button size="sm" type="button" onClick={openFileDialog}>
                        Browse File
                    </Button>
                </CardContent>
            </Card>

            {selectedFile && (
                <Card className="mt-4 rounded-md p-0 shadow-none">
                    <CardContent className="grid gap-3 p-3 sm:grid-cols-[8rem_minmax(0,1fr)_auto] sm:items-center">
                        <div className="flex aspect-video items-center justify-center overflow-hidden rounded-md border bg-muted">
                            {selectedFile.preview ? (
                                <img
                                    src={selectedFile.preview}
                                    alt={selectedFile.file.name}
                                    className="size-full object-cover"
                                />
                            ) : (
                                <ImageIcon className="text-muted-foreground" />
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                                {selectedFile.file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {formatBytes(selectedFile.file.size)}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={replaceSelectedFile}
                            >
                                <PencilIcon data-icon="inline-start" />
                                Edit
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={removeSelectedFile}
                            >
                                <XIcon data-icon="inline-start" />
                                Delete
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {errors.length > 0 && (
                <Alert variant="destructive" className="mt-5">
                    <CircleAlertIcon />
                    <AlertTitle>File upload error(s)</AlertTitle>
                    <AlertDescription>
                        {errors.map((error) => (
                            <p key={error} className="last:mb-0">
                                {error}
                            </p>
                        ))}
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}
