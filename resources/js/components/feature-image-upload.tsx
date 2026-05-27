import { PencilIcon, UploadIcon, XIcon } from 'lucide-react';
import type { DragEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

type FeatureImageUploadProps = {
    description?: string;
    error?: string;
    file: File | null;
    imagePath?: string | null;
    inputId: string;
    label?: string;
    legend: string;
    onChange: (file: File) => void;
    onRemove: () => void;
};

export function FeatureImageUpload({
    description = 'JPEG, PNG, up to 5 MB.',
    error,
    file,
    imagePath,
    inputId,
    label = 'Choose a file or drag & drop here.',
    legend,
    onChange,
    onRemove,
}: FeatureImageUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const imageUrl = imagePath ? storageUrl(imagePath) : null;

    function selectFile(files: FileList | null) {
        const selectedFile = files?.[0];

        if (selectedFile) {
            onChange(selectedFile);
        }
    }

    function removeImage() {
        if (inputRef.current) {
            inputRef.current.value = '';
        }

        onRemove();
    }

    return (
        <FieldSet className="rounded-lg border p-4">
            <FieldLegend>{legend}</FieldLegend>
            <FieldGroup>
                <Input
                    ref={inputRef}
                    id={inputId}
                    type="file"
                    accept="image/*"
                    aria-label={legend}
                    className="hidden"
                    onChange={(event) => selectFile(event.target.files)}
                />

                {file ? (
                    <SelectedImagePreview
                        key={`${file.name}-${file.lastModified}-${file.size}`}
                        file={file}
                        onEdit={() => inputRef.current?.click()}
                        onRemove={removeImage}
                    />
                ) : imageUrl ? (
                    <ImagePreviewCard
                        imageUrl={imageUrl}
                        title={imagePath?.split('/').pop()}
                        onEdit={() => inputRef.current?.click()}
                        onRemove={removeImage}
                    />
                ) : (
                    <UploadDropzone
                        description={description}
                        inputId={inputId}
                        label={label}
                        onBrowse={() => inputRef.current?.click()}
                        onDrop={(files) => selectFile(files)}
                    />
                )}

                <FieldError errors={error ? [{ message: error }] : undefined} />
            </FieldGroup>
        </FieldSet>
    );
}

function SelectedImagePreview({
    file,
    onEdit,
    onRemove,
}: {
    file: File;
    onEdit: () => void;
    onRemove: () => void;
}) {
    const [previewUrl] = useState(() => URL.createObjectURL(file));

    useEffect(() => {
        return () => URL.revokeObjectURL(previewUrl);
    }, [previewUrl]);

    return (
        <ImagePreviewCard
            imageUrl={previewUrl}
            title={file.name}
            onEdit={onEdit}
            onRemove={onRemove}
        />
    );
}

function storageUrl(path: string) {
    return `/storage/${path}`;
}

function UploadDropzone({
    description,
    inputId,
    label,
    onBrowse,
    onDrop,
}: {
    description: string;
    inputId: string;
    label: string;
    onBrowse: () => void;
    onDrop: (files: FileList | null) => void;
}) {
    function handleDrop(event: DragEvent<HTMLDivElement>) {
        event.preventDefault();
        onDrop(event.dataTransfer.files);
    }

    return (
        <div
            className="flex min-h-36 flex-col items-center justify-center rounded-lg border border-dashed p-5 text-center"
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
        >
            <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-muted">
                <UploadIcon className="size-5 text-muted-foreground" />
            </div>
            <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
            <FieldDescription>{description}</FieldDescription>
            <Button type="button" size="sm" className="mt-3" onClick={onBrowse}>
                <UploadIcon data-icon="start" />
                Browse File
            </Button>
        </div>
    );
}

function ImagePreviewCard({
    imageUrl,
    onEdit,
    onRemove,
    title,
}: {
    imageUrl: string;
    onEdit: () => void;
    onRemove: () => void;
    title?: string;
}) {
    return (
        <div className="group relative overflow-hidden rounded-md border bg-muted">
            <img
                src={imageUrl}
                alt="Featured image preview"
                className="aspect-square w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-background/90 p-2 backdrop-blur">
                <span className="min-w-0 truncate text-xs font-medium">
                    {title ?? 'Image'}
                </span>
                <div className="flex shrink-0 gap-1">
                    <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="size-7"
                        onClick={onEdit}
                        aria-label="Edit image"
                    >
                        <PencilIcon />
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="size-7"
                        onClick={onRemove}
                        aria-label="Remove image"
                    >
                        <XIcon />
                    </Button>
                </div>
            </div>
        </div>
    );
}
