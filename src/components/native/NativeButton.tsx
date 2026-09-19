import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { registerComponent } from '../../registry/ComponentRegistry';
import { v4 as uuidv4 } from 'uuid';
import { MousePointerClick } from 'lucide-react';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      intent: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
        secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 shadow-sm',
        outline: 'border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-900',
        ghost: 'hover:bg-zinc-100 hover:text-zinc-900 text-zinc-600',
        destructive: 'bg-red-500 text-white hover:bg-red-600 shadow-sm',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 py-2',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10',
      },
      shape: {
        square: 'rounded-none',
        rounded: 'rounded-md',
        pill: 'rounded-full',
      }
    },
    defaultVariants: {
      intent: 'primary',
      size: 'md',
      shape: 'rounded',
    },
  }
);

export interface NativeButtonProps extends VariantProps<typeof buttonVariants> {
  text?: string;
  icon?: string; // We could integrate lucide-react dynamically, but simple for now
  fullWidth?: boolean;
}

export const NativeButton: React.FC<NativeButtonProps> = ({
  intent,
  size,
  shape,
  text = 'Button',
  fullWidth = false,
}) => {
  return (
    <button
      className={cn(buttonVariants({ intent, size, shape }), fullWidth && 'w-full')}
      onClick={(e) => {
        // Prevent default navigation if it's rendered inside a form in canvas
        e.preventDefault();
      }}
    >
      {text}
    </button>
  );
};

// Register the component
registerComponent({
  id: 'Native_Button',
  name: 'Smart Button',
  category: 'Atom',
  icon: <MousePointerClick size={24} />,
  isStrictWrapper: true,
  defaultProps: {
    text: 'Click Me',
    intent: 'primary',
    size: 'md',
    shape: 'rounded',
    fullWidth: false,
  },
  propControls: {
    text: { type: 'string', label: 'Button Text' },
    intent: {
      type: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
      label: 'Variant (Intent)',
    },
    size: {
      type: 'select',
      options: ['sm', 'md', 'lg', 'icon'],
      label: 'Size',
    },
    shape: {
      type: 'select',
      options: ['square', 'rounded', 'pill'],
      label: 'Shape',
    },
    fullWidth: { type: 'boolean', label: 'Full Width' },
  },
  render: (props) => <NativeButton {...props} />,
  createNodeBlueprint: () => {
    const rootId = 'node_' + uuidv4().substring(0, 8);
    return {
      rootNodeId: rootId,
      nodeData: {
        [rootId]: {
          id: rootId,
          type: 'Native_Button',
          props: {
            text: 'Smart Button',
            intent: 'primary',
            size: 'md',
            shape: 'rounded',
            fullWidth: false,
          },
          childrenIds: [],
          responsiveStyles: { base: { widthType: 'fit-content' } }
        }
      }
    };
  }
});
