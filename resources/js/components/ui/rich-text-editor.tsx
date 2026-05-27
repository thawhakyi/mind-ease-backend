import {
  BoldIcon,
  EraserIcon,
  Heading1Icon,
  Heading2Icon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  PilcrowIcon,
  Redo2Icon,
  StrikethroughIcon,
  UnderlineIcon,
  Undo2Icon,
} from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Toggle } from "@/components/ui/toggle"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type EditorCommand =
  | "bold"
  | "createLink"
  | "formatBlock"
  | "insertOrderedList"
  | "insertUnorderedList"
  | "italic"
  | "redo"
  | "removeFormat"
  | "strikeThrough"
  | "underline"
  | "undo"

type EditorFormat =
  | "bold"
  | "italic"
  | "orderedList"
  | "strikeThrough"
  | "underline"
  | "unorderedList"

type RichTextEditorProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  | "children"
  | "contentEditable"
  | "dangerouslySetInnerHTML"
  | "defaultValue"
  | "onChange"
> & {
  /** Emits editor HTML. Sanitize persisted user content before rendering it elsewhere. */
  onChange?: (value: string) => void
  defaultValue?: string
  disabled?: boolean
  editorClassName?: string
  placeholder?: string
  toolbarClassName?: string
  value?: string
}

type ToolbarButtonProps = {
  children: React.ReactNode
  disabled?: boolean
  label: string
  onClick: () => void
}

type ToolbarToggleProps = ToolbarButtonProps & {
  pressed: boolean
}

const activeFormatDefaults: Record<EditorFormat, boolean> = {
  bold: false,
  italic: false,
  orderedList: false,
  strikeThrough: false,
  underline: false,
  unorderedList: false,
}

function isHtmlEmpty(value: string) {
  return (
    value
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim().length === 0
  )
}

function normalizeUrl(value: string) {
  if (/^(https?:|mailto:|tel:)/i.test(value)) {
    return value
  }

  return `https://${value}`
}

function queryFormatState(format: EditorFormat) {
  if (typeof document === "undefined") {
    return false
  }

  const command =
    format === "unorderedList"
      ? "insertUnorderedList"
      : format === "orderedList"
        ? "insertOrderedList"
        : format

  return document.queryCommandState(command)
}

function ToolbarButton({
  children,
  disabled,
  label,
  onClick,
}: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={disabled}
          aria-label={label}
          onMouseDown={(event) => event.preventDefault()}
          onClick={onClick}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

function ToolbarToggle({
  children,
  disabled,
  label,
  onClick,
  pressed,
}: ToolbarToggleProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Toggle
          type="button"
          variant="default"
          size="sm"
          pressed={pressed}
          disabled={disabled}
          aria-label={label}
          onMouseDown={(event) => event.preventDefault()}
          onPressedChange={onClick}
        >
          {children}
        </Toggle>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

function RichTextEditor({
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  className,
  defaultValue = "",
  disabled = false,
  editorClassName,
  onChange,
  placeholder = "Start writing...",
  toolbarClassName,
  value,
  ...props
}: RichTextEditorProps) {
  const editorRef = React.useRef<HTMLDivElement>(null)
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const editorValue = isControlled ? value : internalValue
  const [isEmpty, setIsEmpty] = React.useState(() => isHtmlEmpty(editorValue))
  const [activeFormats, setActiveFormats] =
    React.useState<Record<EditorFormat, boolean>>(activeFormatDefaults)

  const updateActiveFormats = React.useCallback(() => {
    setActiveFormats({
      bold: queryFormatState("bold"),
      italic: queryFormatState("italic"),
      orderedList: queryFormatState("orderedList"),
      strikeThrough: queryFormatState("strikeThrough"),
      underline: queryFormatState("underline"),
      unorderedList: queryFormatState("unorderedList"),
    })
  }, [])

  const syncValue = React.useCallback(() => {
    const nextValue = editorRef.current?.innerHTML ?? ""

    if (!isControlled) {
      setInternalValue(nextValue)
    }

    setIsEmpty(isHtmlEmpty(nextValue))
    onChange?.(nextValue)
    updateActiveFormats()
  }, [isControlled, onChange, updateActiveFormats])

  const runCommand = React.useCallback(
    (command: EditorCommand, commandValue?: string) => {
      if (disabled || typeof document === "undefined") {
        return
      }

      editorRef.current?.focus()
      document.execCommand(command, false, commandValue)
      syncValue()
    },
    [disabled, syncValue]
  )

  const createLink = React.useCallback(() => {
    if (disabled || typeof window === "undefined") {
      return
    }

    const url = window.prompt("Enter a URL")

    if (!url?.trim()) {
      return
    }

    runCommand("createLink", normalizeUrl(url.trim()))
  }, [disabled, runCommand])

  React.useEffect(() => {
    const editor = editorRef.current

    if (!editor || editor.innerHTML === editorValue) {
      return
    }

    editor.innerHTML = editorValue
    setIsEmpty(isHtmlEmpty(editorValue))
  }, [editorValue])

  React.useEffect(() => {
    if (typeof document === "undefined") {
      return
    }

    const handleSelectionChange = () => {
      if (!editorRef.current?.contains(document.activeElement)) {
        return
      }

      updateActiveFormats()
    }

    document.addEventListener("selectionchange", handleSelectionChange)

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange)
    }
  }, [updateActiveFormats])

  return (
    <div
      data-slot="rich-text-editor"
      data-disabled={disabled ? "" : undefined}
      className={cn(
        "overflow-hidden rounded-lg border border-input bg-background shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <TooltipProvider>
        <div
          data-slot="rich-text-editor-toolbar"
          className={cn(
            "flex flex-wrap items-center gap-1 border-b bg-muted/30 p-1.5",
            toolbarClassName
          )}
        >
          <ToolbarToggle
            label="Bold"
            pressed={activeFormats.bold}
            disabled={disabled}
            onClick={() => runCommand("bold")}
          >
            <BoldIcon />
          </ToolbarToggle>
          <ToolbarToggle
            label="Italic"
            pressed={activeFormats.italic}
            disabled={disabled}
            onClick={() => runCommand("italic")}
          >
            <ItalicIcon />
          </ToolbarToggle>
          <ToolbarToggle
            label="Underline"
            pressed={activeFormats.underline}
            disabled={disabled}
            onClick={() => runCommand("underline")}
          >
            <UnderlineIcon />
          </ToolbarToggle>
          <ToolbarToggle
            label="Strikethrough"
            pressed={activeFormats.strikeThrough}
            disabled={disabled}
            onClick={() => runCommand("strikeThrough")}
          >
            <StrikethroughIcon />
          </ToolbarToggle>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <ToolbarButton
            label="Heading 1"
            disabled={disabled}
            onClick={() => runCommand("formatBlock", "h1")}
          >
            <Heading1Icon />
          </ToolbarButton>
          <ToolbarButton
            label="Heading 2"
            disabled={disabled}
            onClick={() => runCommand("formatBlock", "h2")}
          >
            <Heading2Icon />
          </ToolbarButton>
          <ToolbarButton
            label="Paragraph"
            disabled={disabled}
            onClick={() => runCommand("formatBlock", "p")}
          >
            <PilcrowIcon />
          </ToolbarButton>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <ToolbarToggle
            label="Bullet list"
            pressed={activeFormats.unorderedList}
            disabled={disabled}
            onClick={() => runCommand("insertUnorderedList")}
          >
            <ListIcon />
          </ToolbarToggle>
          <ToolbarToggle
            label="Numbered list"
            pressed={activeFormats.orderedList}
            disabled={disabled}
            onClick={() => runCommand("insertOrderedList")}
          >
            <ListOrderedIcon />
          </ToolbarToggle>
          <ToolbarButton label="Link" disabled={disabled} onClick={createLink}>
            <LinkIcon />
          </ToolbarButton>
          <ToolbarButton
            label="Clear formatting"
            disabled={disabled}
            onClick={() => runCommand("removeFormat")}
          >
            <EraserIcon />
          </ToolbarButton>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <ToolbarButton
            label="Undo"
            disabled={disabled}
            onClick={() => runCommand("undo")}
          >
            <Undo2Icon />
          </ToolbarButton>
          <ToolbarButton
            label="Redo"
            disabled={disabled}
            onClick={() => runCommand("redo")}
          >
            <Redo2Icon />
          </ToolbarButton>
        </div>
      </TooltipProvider>
      <div
        ref={editorRef}
        data-slot="rich-text-editor-input"
        data-empty={isEmpty ? "" : undefined}
        role="textbox"
        aria-label={ariaLabelledBy ? undefined : (ariaLabel ?? placeholder)}
        aria-labelledby={ariaLabelledBy}
        aria-multiline="true"
        aria-readonly={disabled}
        contentEditable={!disabled}
        suppressContentEditableWarning
        className={cn(
          "min-h-40 max-w-none px-3 py-2 text-sm outline-none data-empty:before:pointer-events-none data-empty:before:text-muted-foreground data-empty:before:content-[attr(data-placeholder)] [&_a]:text-primary [&_a]:underline [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:text-xl [&_h2]:font-semibold [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6",
          editorClassName
        )}
        data-placeholder={placeholder}
        onBlur={updateActiveFormats}
        onInput={syncValue}
        onKeyUp={updateActiveFormats}
        onMouseUp={updateActiveFormats}
      />
    </div>
  )
}

export { RichTextEditor }
