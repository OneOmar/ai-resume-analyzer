import React, {
  createContext,
  useContext,
  useState,
  type ReactNode
} from "react"
import { cn } from "~/lib/utils"

// Context holds active item state and toggle logic
type AccordionContextType = {
  activeItems: string[]
  toggleItem: (id: string) => void
  isItemActive: (id: string) => boolean
}

const AccordionContext = createContext<AccordionContextType | null>(null)

// Hook to access Accordion context
const useAccordion = () => {
  const ctx = useContext(AccordionContext)
  if (!ctx) throw new Error("Use Accordion parts inside <Accordion>")
  return ctx
}

// Main container
type AccordionProps = {
  children: ReactNode
  defaultOpen?: string       // optional default opened item
  allowMultiple?: boolean    // allow multiple items open at once
  className?: string
}

export const Accordion: React.FC<AccordionProps> = ({
  children,
  defaultOpen,
  allowMultiple = false,
  className
}) => {
  // Track currently active (opened) item IDs
  const [activeItems, setActiveItems] = useState<string[]>(
    defaultOpen ? [defaultOpen] : []
  )

  // Toggle open/close for a given item
  const toggleItem = (id: string) => {
    setActiveItems(prev =>
      allowMultiple
        ? prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        : prev.includes(id) ? [] : [id]
    )
  }

  const isItemActive = (id: string) => activeItems.includes(id)

  return (
    <AccordionContext.Provider value={{ activeItems, toggleItem, isItemActive }}>
      <div className={cn("space-y-2", className)}>{children}</div>
    </AccordionContext.Provider>
  )
}

// Single collapsible item container
type ItemProps = { id: string; children: ReactNode; className?: string }

export const AccordionItem: React.FC<ItemProps> = ({ children, className }) => (
  <div className={cn("overflow-hidden border-b border-gray-200", className)}>
    {children}
  </div>
)

// Clickable header that toggles its content
type HeaderProps = {
  itemId: string
  children: ReactNode
  className?: string
  icon?: ReactNode
  iconPosition?: "left" | "right"
}

export const AccordionHeader: React.FC<HeaderProps> = ({
  itemId,
  children,
  className,
  icon,
  iconPosition = "right"
}) => {
  const { toggleItem, isItemActive } = useAccordion()
  const isActive = isItemActive(itemId)

  // Default arrow icon rotates when open
  const defaultIcon = (
    <svg
      className={cn("w-5 h-5 transition-transform duration-200", {
        "rotate-180": isActive
      })}
      fill="none"
      stroke="#98A2B3"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  )

  return (
    <button
      onClick={() => toggleItem(itemId)}
      className={cn(
        "w-full px-4 py-3 text-left flex items-center justify-between cursor-pointer transition-colors duration-200 focus:outline-none",
        className
      )}
    >
      <div className="flex items-center space-x-3">
        {iconPosition === "left" && (icon || defaultIcon)}
        <div className="flex-1">{children}</div>
      </div>
      {iconPosition === "right" && (icon || defaultIcon)}
    </button>
  )
}

// Collapsible content shown when the item is active
type ContentProps = { itemId: string; children: ReactNode; className?: string }

export const AccordionContent: React.FC<ContentProps> = ({
  itemId,
  children,
  className
}) => {
  const { isItemActive } = useAccordion()
  const isActive = isItemActive(itemId)

  return (
    <div
      className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out",
        isActive ? "max-h-fit opacity-100" : "max-h-0 opacity-0",
        className
      )}
    >
      <div className="px-4 py-3">{children}</div>
    </div>
  )
}
