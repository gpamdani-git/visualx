import React, { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { registerComponent } from '../../registry/ComponentRegistry';
import { CanvasNode } from '../../types/builder';
import { v4 as uuidv4 } from 'uuid';
import clsx from 'clsx';
import { LayoutPanelTop } from 'lucide-react';

export interface NavbarLink {
  id: string;
  label: string;
  url: string;
  type: 'link' | 'dropdown';
  subLinks?: { id: string; label: string; url: string }[];
}

export interface NativeNavbarProps {
  logoText?: string;
  logoUrl?: string;
  logoType?: 'text' | 'image';
  logoAlign?: 'left' | 'center';
  isSticky?: boolean;
  bgColor?: string;
  textColor?: string;
  hoverColor?: string;
  dropdownBgColor?: string;
  dropdownTextColor?: string;
  dropdownHoverBgColor?: string;
  mobileMenuBgColor?: string;
  mobileMenuTextColor?: string;
  links?: NavbarLink[];
}

const defaultLinks: NavbarLink[] = [
  { id: 'home', label: 'Home', url: '#', type: 'link' },
  { id: 'about', label: 'About', url: '#', type: 'link' },
  { 
    id: 'services', 
    label: 'Services', 
    url: '#', 
    type: 'dropdown',
    subLinks: [
      { id: 'web', label: 'Web Design', url: '#' },
      { id: 'seo', label: 'SEO', url: '#' }
    ]
  },
  { id: 'contact', label: 'Contact', url: '#', type: 'link' }
];

export const NativeNavbar: React.FC<NativeNavbarProps> = ({
  logoText = 'BrandName',
  logoUrl = '',
  logoType = 'text',
  logoAlign = 'left',
  isSticky = true,
  bgColor = '#ffffff',
  textColor = '#333333',
  hoverColor = '#0099ff',
  dropdownBgColor = '#ffffff',
  dropdownTextColor = '#333333',
  dropdownHoverBgColor = '#f3f4f6',
  mobileMenuBgColor = '#ffffff',
  mobileMenuTextColor = '#333333',
  links = defaultLinks
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <nav 
      className={clsx(
        'w-full z-50 border-b border-black/10 transition-colors relative',
        isSticky ? 'sticky top-0' : 'relative'
      )}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={clsx("flex justify-between items-center h-16 relative")}>
          
          {/* LEFT SIDE: Spacer (if center) or Logo (if left) */}
          <div className="flex flex-1 items-center justify-start">
            {logoAlign === 'left' && (
              <a href="#" className="flex shrink-0 font-bold text-xl tracking-tight no-underline">
                {logoType === 'image' && logoUrl ? (
                  <img src={logoUrl} alt={logoText} className="h-8 w-auto" />
                ) : (
                  <span style={{ color: textColor }}>{logoText}</span>
                )}
              </a>
            )}
          </div>

          {/* CENTER: Logo (if center) */}
          {logoAlign === 'center' && (
            <div className="flex shrink-0 items-center justify-center">
              <a href="#" className="font-bold text-xl tracking-tight no-underline">
                {logoType === 'image' && logoUrl ? (
                  <img src={logoUrl} alt={logoText} className="h-8 w-auto" />
                ) : (
                  <span style={{ color: textColor }}>{logoText}</span>
                )}
              </a>
            </div>
          )}

          {/* RIGHT SIDE: Desktop Navigation & Mobile Toggle */}
          <div className="flex flex-1 items-center justify-end">
            <div className="hidden md:flex space-x-6 items-center">
              {links.map((link) => (
                <div 
                  key={link.id} 
                  className="relative group h-16 flex items-center"
                  onMouseEnter={() => link.type === 'dropdown' && setActiveDropdown(link.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <a 
                    href={link.url}
                    className="flex items-center text-sm font-medium transition-colors no-underline"
                    style={{ color: textColor }}
                    onMouseOver={(e) => e.currentTarget.style.color = hoverColor}
                    onMouseOut={(e) => e.currentTarget.style.color = textColor}
                  >
                    {link.label}
                    {link.type === 'dropdown' && (
                      <ChevronDown size={14} className="ml-1 opacity-70" />
                    )}
                  </a>

                  {/* Dropdown Menu */}
                  {link.type === 'dropdown' && activeDropdown === link.id && link.subLinks && (
                    <div 
                      className="absolute top-16 right-0 w-48 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none"
                      style={{ backgroundColor: dropdownBgColor }}
                    >
                      {link.subLinks.map(sub => (
                        <a
                          key={sub.id}
                          href={sub.url}
                          className="block px-4 py-2 text-sm no-underline transition-colors"
                          style={{ color: dropdownTextColor }}
                          onMouseOver={(e) => { e.currentTarget.style.color = hoverColor; e.currentTarget.style.backgroundColor = dropdownHoverBgColor }}
                          onMouseOut={(e) => { e.currentTarget.style.color = dropdownTextColor; e.currentTarget.style.backgroundColor = 'transparent' }}
                        >
                          {sub.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden ml-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md hover:bg-black/5 focus:outline-none"
                style={{ color: textColor }}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-black/10 absolute top-16 left-0 w-full shadow-lg" style={{ backgroundColor: mobileMenuBgColor }}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <div key={link.id}>
                <a
                  href={link.url}
                  className="block px-3 py-2 rounded-md text-base font-medium no-underline transition-colors"
                  style={{ color: mobileMenuTextColor }}
                  onMouseOver={(e) => { e.currentTarget.style.color = hoverColor; e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)' }}
                  onMouseOut={(e) => { e.currentTarget.style.color = mobileMenuTextColor; e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                  {link.label}
                </a>
                {link.type === 'dropdown' && link.subLinks && (
                  <div className="pl-6 space-y-1">
                    {link.subLinks.map(sub => (
                      <a
                        key={sub.id}
                        href={sub.url}
                        className="block px-3 py-2 rounded-md text-sm font-medium opacity-80 no-underline transition-colors"
                        style={{ color: mobileMenuTextColor }}
                        onMouseOver={(e) => { e.currentTarget.style.color = hoverColor; e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)' }}
                        onMouseOut={(e) => { e.currentTarget.style.color = mobileMenuTextColor; e.currentTarget.style.backgroundColor = 'transparent' }}
                      >
                        {sub.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

// Register the component
registerComponent({
  id: 'Native_Navbar',
  name: 'Navigation Bar',
  category: 'Section',
  icon: <LayoutPanelTop size={24} />,
  isStrictWrapper: true,
  defaultProps: {
    logoType: 'text',
    logoText: 'BrandName',
    logoAlign: 'left',
    isSticky: true,
    bgColor: '#ffffff',
    textColor: '#333333',
    hoverColor: '#0099ff',
    dropdownBgColor: '#ffffff',
    dropdownTextColor: '#333333',
    dropdownHoverBgColor: '#f3f4f6',
    mobileMenuBgColor: '#ffffff',
    mobileMenuTextColor: '#333333',
    links: defaultLinks
  },
  propControls: {
    logoType: { type: 'select', options: ['text', 'image'], label: 'Logo Type' },
    logoText: { type: 'string', label: 'Logo Text' },
    logoUrl: { type: 'string', label: 'Logo URL' },
    logoAlign: { type: 'select', options: ['left', 'center'], label: 'Logo Alignment' },
    isSticky: { type: 'boolean', label: 'Sticky Navigation' },
    bgColor: { type: 'string', label: 'Background Color' },
    textColor: { type: 'string', label: 'Text Color' },
    hoverColor: { type: 'string', label: 'Hover Color' },
    dropdownBgColor: { type: 'string', label: 'Dropdown BG Color' },
    dropdownTextColor: { type: 'string', label: 'Dropdown Text Color' },
    dropdownHoverBgColor: { type: 'string', label: 'Dropdown Hover BG Color' },
    mobileMenuBgColor: { type: 'string', label: 'Mobile Menu BG Color' },
    mobileMenuTextColor: { type: 'string', label: 'Mobile Menu Text Color' },
    links: { type: 'list', label: 'Navigation Links' }
  },
  render: (props) => <NativeNavbar {...props} />,
  createNodeBlueprint: () => {
    const rootId = 'node_' + uuidv4().substring(0, 8);
    return {
      rootNodeId: rootId,
      nodeData: {
        [rootId]: {
          id: rootId,
          type: 'Native_Navbar',
          props: {
            logoType: 'text',
            logoText: 'BrandName',
            logoAlign: 'left',
            isSticky: true,
            bgColor: '#ffffff',
            textColor: '#333333',
            hoverColor: '#0099ff',
            dropdownBgColor: '#ffffff',
            dropdownTextColor: '#333333',
            dropdownHoverBgColor: '#f3f4f6',
            mobileMenuBgColor: '#ffffff',
            mobileMenuTextColor: '#333333',
            links: defaultLinks
          },
          childrenIds: [],
          responsiveStyles: { base: { widthType: 'fill', widthValue: 100 } }
        }
      }
    };
  }
});
