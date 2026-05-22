'use client';

import {
    CircleAlertIcon,
    ImageIcon,
    PencilIcon,
    UploadIcon,
    XIcon,
    ZoomInIcon,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/reui/alert';
import { formatBytes, useFileUpload } from '@/hooks/use-file-upload';
import type { FileMetadata, FileWithPreview } from '@/hooks/use-file-upload';

type GalleryUploadProps = {
    accept?: string;
    className?: string;
    defaultImages?: FileMetadata[];
    maxFiles?: number;
    maxSize?: number;
    multiple?: boolean;
    onFilesChange?: (files: FileWithPreview[]) => void;
};

const defaultGalleryImages: FileMetadata[] = [
    {
        id: 'default-1',
        name: 'city.png',
        size: 44608,
        type: 'image/png',
        url: 'https://picsum.photos/1000/800?random=1',
    },
    {
        id: 'default-2',
        name: 'reader.png',
        size: 42144,
        type: 'image/png',
        url: 'https://picsum.photos/1000/800?random=2',
    },
    {
        id: 'default-3',
        name: 'landscape.png',
        size: 42144,
        type: 'image/png',
        url: 'https://picsum.photos/1000/800?random=3',
    },
];

export function Pattern({
    accept = 'image/*',
    className,
    defaultImages = defaultGalleryImages,
    maxFiles = 10,
    maxSize = 5 * 1024 * 1024,
    multiple = true,
    onFilesChange,
}: GalleryUploadProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>(
        {},
    );
    const [isPreviewLoading, setIsPreviewLoading] = useState(false);

    const [
        { files, isDragging, errors },
        {
            addFiles,
            clearFiles,
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
        initialFiles: defaultImages,
        maxFiles,
        maxSize,
        multiple,
        onFilesChange,
    });

    function isImage(file: File | FileMetadata) {
        return file.type.startsWith('image/');
    }

    function replaceFile(fileId: string) {
        const input = document.createElement('input');

        input.type = 'file';
        input.accept = accept;
        input.onchange = (event) => {
            const target = event.target as HTMLInputElement;
            const file = target.files?.[0];

            if (!file) {
                return;
            }

            removeFile(fileId);
            addFiles([file]);
        };
        input.click();
    }

    return (
        <div className={cn('w-full max-w-4xl', className)}>
            <div
                className={cn(
                    'relative rounded-lg border border-dashed p-8 text-center transition-colors',
                    isDragging
                        ? 'border-primary bg-primary/5'
                        : 'border-muted-foreground/25 hover:border-muted-foreground/50',
                )}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <input {...getInputProps()} className="sr-only" />

                <div className="flex flex-col items-center gap-4">
                    <div
                        className={cn(
                            'flex size-16 items-center justify-center rounded-full',
                            isDragging ? 'bg-primary/10' : 'bg-muted',
                        )}
                    >
                        <ImageIcon
                            className={cn(
                                'size-5',
                                isDragging
                                    ? 'text-primary'
                                    : 'text-muted-foreground',
                            )}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-semibold">
                            Upload images to gallery
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Drag and drop images here or click to browse
                        </p>
                        <p className="text-xs text-muted-foreground">
                            PNG, JPG, GIF up to {formatBytes(maxSize)} each (max{' '}
                            {maxFiles} files)
                        </p>
                    </div>

                    <Button type="button" onClick={openFileDialog}>
                        <UploadIcon data-icon="inline-start" />
                        Select images
                    </Button>
                </div>
            </div>

            {files.length > 0 && (
                <div className="mt-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <h4 className="text-sm font-medium">
                            Gallery ({files.length}/{maxFiles})
                        </h4>
                        <div className="text-xs text-muted-foreground">
                            Total:{' '}
                            {formatBytes(
                                files.reduce(
                                    (total, file) => total + file.file.size,
                                    0,
                                ),
                            )}
                        </div>
                    </div>
                    <Button
                        type="button"
                        onClick={clearFiles}
                        variant="outline"
                        size="sm"
                    >
                        Clear all
                    </Button>
                </div>
            )}

            {files.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {files.map((fileItem) => (
                        <div
                            key={fileItem.id}
                            className="group/item relative aspect-square"
                        >
                            {isImage(fileItem.file) && fileItem.preview ? (
                                <>
                                    {loadingImages[fileItem.id] !== false && (
                                        <div className="absolute inset-0 flex items-center justify-center rounded-lg border bg-muted/50">
                                            <Spinner className="size-6 text-muted-foreground" />
                                        </div>
                                    )}
                                    <img
                                        src={fileItem.preview}
                                        alt={fileItem.file.name}
                                        onLoad={() =>
                                            setLoadingImages(
                                                (currentLoadingImages) => ({
                                                    ...currentLoadingImages,
                                                    [fileItem.id]: false,
                                                }),
                                            )
                                        }
                                        className={cn(
                                            'size-full rounded-lg border object-cover transition-all group-hover/item:scale-105',
                                            loadingImages[fileItem.id] !== false
                                                ? 'opacity-0'
                                                : 'opacity-100',
                                        )}
                                    />
                                </>
                            ) : (
                                <div className="flex size-full items-center justify-center rounded-lg border bg-muted">
                                    <ImageIcon className="size-8 text-muted-foreground" />
                                </div>
                            )}

                            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover/item:opacity-100">
                                {fileItem.preview && (
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            setSelectedImage(
                                                fileItem.preview ?? null,
                                            );
                                            setIsPreviewLoading(true);
                                        }}
                                        variant="secondary"
                                        size="icon"
                                        className="size-7"
                                        aria-label="Preview image"
                                    >
                                        <ZoomInIcon />
                                    </Button>
                                )}
                                <Button
                                    type="button"
                                    onClick={() => replaceFile(fileItem.id)}
                                    variant="secondary"
                                    size="icon"
                                    className="size-7"
                                    aria-label="Edit image"
                                >
                                    <PencilIcon />
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => removeFile(fileItem.id)}
                                    variant="secondary"
                                    size="icon"
                                    className="size-7"
                                    aria-label="Delete image"
                                >
                                    <XIcon />
                                </Button>
                            </div>

                            <div className="absolute right-0 bottom-0 left-0 rounded-b-lg bg-black/70 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100">
                                <p className="truncate text-xs font-medium">
                                    {fileItem.file.name}
                                </p>
                                <p className="text-xs text-gray-300">
                                    {formatBytes(fileItem.file.size)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
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

            <Dialog
                open={!!selectedImage}
                onOpenChange={(open) => !open && setSelectedImage(null)}
            >
                <DialogContent className="w-full border-none bg-transparent p-0 shadow-none sm:max-w-xl [&_[data-slot=dialog-close]]:-end-7 [&_[data-slot=dialog-close]]:-top-7 [&_[data-slot=dialog-close]]:size-7 [&_[data-slot=dialog-close]]:rounded-full [&_[data-slot=dialog-close]]:bg-background [&_[data-slot=dialog-close]]:text-muted-foreground [&_[data-slot=dialog-close]]:hover:text-foreground">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Image Preview</DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center justify-center">
                        {selectedImage && (
                            <>
                                {isPreviewLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Spinner className="size-8 text-white" />
                                    </div>
                                )}
                                <img
                                    src={selectedImage}
                                    alt="Preview"
                                    onLoad={() => setIsPreviewLoading(false)}
                                    className={cn(
                                        'h-full w-auto rounded-lg object-contain transition-opacity duration-300',
                                        isPreviewLoading
                                            ? 'opacity-0'
                                            : 'opacity-100',
                                    )}
                                />
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
