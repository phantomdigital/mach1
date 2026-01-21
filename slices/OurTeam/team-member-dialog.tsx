"use client";

import { useState, useEffect } from "react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";
import { isFilled, type RichTextField, type KeyTextField, type LinkField, type ImageField } from "@prismicio/client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { obfuscateMailtoLink } from "@/lib/email-obfuscation";

interface TeamMemberDialogProps {
    member: {
        name: string;
        position: string;
        image: ImageField;
        bio: RichTextField;
        email: KeyTextField;
        linkedin: LinkField;
    };
    children: React.ReactNode;
}

export function TeamMemberDialog({ member, children }: TeamMemberDialogProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Only show dialog if there's bio or contact info
    const hasContent =
        isFilled.richText(member.bio) ||
        isFilled.keyText(member.email) ||
        isFilled.link(member.linkedin);

    // Handle dialog open/close and Lenis
    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        
        const lenis = (window as any).__lenis;
        if (lenis) {
            if (open) {
                lenis.stop();
            } else {
                lenis.start();
            }
        }
    };

    if (!hasContent) {
        return <>{children}</>;
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <button className="w-full text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 rounded-sm transition-all">
                    {children}
                </button>
            </DialogTrigger>
            <DialogContent className="flex flex-col p-0 gap-0 max-h-[90vh]">
                {/* Sticky Header */}
                <div className="sticky top-0 z-10 bg-white px-8 lg:px-12 pt-8 lg:pt-6 pb-6 border-b border-neutral-200">
                    <DialogHeader>
                        <DialogTitle>{member.name}</DialogTitle>
                        <p className="text-base text-neutral-600 mt-2">{member.position}</p>
                    </DialogHeader>
                </div>

                 {/* Scrollable Content */}
                 <div
                     className="flex-1 overflow-y-auto px-8 lg:px-12 py-6"
                     style={{
                         scrollbarWidth: 'thin',
                         scrollbarColor: '#d4d4d4 transparent'
                     }}
                 >
                     <div className="space-y-6">
                         {/* Bio */}
                         {isFilled.richText(member.bio) && (
                             <div>
                                 <h3 className="text-lg font-semibold text-neutral-800 mb-4">About</h3>
                                 <div className="prose prose-neutral max-w-none text-neutral-600 leading-relaxed">
                                     <PrismicRichText field={member.bio} />
                                 </div>
                             </div>
                         )}

                         {/* Contact Information */}
                         {(isFilled.keyText(member.email) || isFilled.link(member.linkedin)) && (
                             <div className="pt-6 border-t border-neutral-200">
                                 <h3 className="text-lg font-semibold text-neutral-800 mb-4">Contact</h3>
                                 <div className="space-y-3">
                                     {isFilled.keyText(member.email) && (
                                         <div className="flex items-center gap-3">
                                             <svg
                                                 className="w-5 h-5 text-neutral-400 flex-shrink-0"
                                                 fill="none"
                                                 viewBox="0 0 24 24"
                                                 stroke="currentColor"
                                             >
                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                             </svg>
                                             {member.email && (() => {
                                               const obfuscated = obfuscateMailtoLink(member.email);
                                               return (
                                                 <a
                                                   href={obfuscated.href}
                                                   className="text-neutral-800 hover:text-dark-blue transition-colors duration-150 border-b-2 border-transparent hover:border-dark-blue"
                                                   dangerouslySetInnerHTML={{ __html: obfuscated.display }}
                                                 />
                                               );
                                             })()}
                                         </div>
                                     )}
                                     {isFilled.link(member.linkedin) && (
                                         <div className="flex items-center gap-3">
                                             <svg
                                                 className="w-5 h-5 text-neutral-400 flex-shrink-0"
                                                 fill="currentColor"
                                                 viewBox="0 0 24 24"
                                             >
                                                 <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                             </svg>
                                             <PrismicNextLink
                                                 field={member.linkedin}
                                                 className="text-neutral-800 hover:text-dark-blue transition-colors duration-150 border-b-2 border-transparent hover:border-dark-blue"
                                             >
                                                 LinkedIn Profile
                                             </PrismicNextLink>
                                         </div>
                                     )}
                                 </div>
                             </div>
                         )}
                     </div>
                 </div>
            </DialogContent>
        </Dialog>
    );
}
