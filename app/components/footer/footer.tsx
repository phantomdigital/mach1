import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { createClient } from "@/prismicio";
import { FooterCtaButtons } from "./footer-cta-buttons";

// Server component for footer
export default async function Footer() {
  const client = createClient();
  
  try {
    const footer = await client.getSingle("footer");
    
    return (
      <>
        {/* CTA Section - Lighter Dark Blue */}
        <div className="bg-dark-blue ">
          <div className="w-full max-w-[100rem] mx-auto px-4 lg:px-8 py-16 lg:py-24">
            {/* Main title */}
            {footer.data.cta_section[0]?.title && (
              <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 lg:mb-10 max-w-4xl leading-tight">
                {footer.data.cta_section[0].title}
              </h2>
            )}
            
            {/* CTA Buttons */}
            <FooterCtaButtons
              primaryButton={
                footer.data.cta_section[0]?.primary_button_text && footer.data.cta_section[0]?.primary_button_link
                  ? {
                      text: footer.data.cta_section[0].primary_button_text,
                      link: footer.data.cta_section[0].primary_button_link,
                    }
                  : undefined
              }
              secondaryButton={
                footer.data.cta_section[0]?.secondary_button_text && footer.data.cta_section[0]?.secondary_button_link
                  ? {
                      text: footer.data.cta_section[0].secondary_button_text,
                      link: footer.data.cta_section[0].secondary_button_link,
                    }
                  : undefined
              }
            />
          </div>
        </div>
        
        {/* Main Footer Content */}
        <footer className="bg-dark-blue text-neutral-200relative overflow-hidden">
          <div className="w-full max-w-[100rem] mx-auto px-4 lg:px-8 py-16 lg:py-24">
            <div className="flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap gap-8 lg:gap-8 xl:gap-12 justify-between">
              
              {/* Generic Link Sections */}
              {footer.data.link_sections && footer.data.link_sections.map((section, index: number) => (
                section.section_title && section.links && section.links.length > 0 && (
                  <div key={index} className="w-full md:w-auto">
                    <h3 className="text-base lg:text-lg font-semibold text-white mb-4 lg:mb-6">
                      {section.section_title}
                    </h3>
                    <ul className="space-y-2 lg:space-y-3">
                      {section.links.map((link, linkIndex: number) => (
                        link.label && (
                          <li key={linkIndex}>
                            <PrismicNextLink
                              field={link.link}
                              className="text-neutral-300 text-sm lg:text-base font-normal hover:text-white hover:underline transition-colors"
                            >
                              {link.label}
                            </PrismicNextLink>
                          </li>
                        )
                      ))}
                    </ul>
                  </div>
                )
              ))}
              
              {/* Contact Section */}
              {footer.data.contact_section[0] && (
                <div className="w-full lg:w-auto">
                  <h3 className="text-base lg:text-lg font-semibold text-white mb-4 lg:mb-6">
                    {footer.data.contact_section[0].title || 'Contact Us'}
                  </h3>
                  
                  {/* Addresses Section with Location Icon */}
                  {footer.data.contact_section[0].addresses && footer.data.contact_section[0].addresses.length > 0 && (
                    <div className="mb-8 lg:mb-12">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-mach1-red flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg 
                            className="w-4 h-5 lg:w-5 lg:h-6"
                            viewBox="0 0 16 19" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M14.9387 7.77844C14.9387 13.0223 8.20174 17.5136 8.20174 17.5136C8.20174 17.5136 1.46484 13.0223 1.46484 7.77844C1.46484 4.05189 4.48733 1.0415 8.20174 1.0415C11.9161 1.0415 14.9387 4.06403 14.9387 7.77844Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M8.19099 10.024C9.43122 10.024 10.4366 9.01859 10.4366 7.77836C10.4366 6.53813 9.43122 5.53271 8.19099 5.53271C6.95076 5.53271 5.94531 6.53813 5.94531 7.77836C5.94531 9.01859 6.95076 10.024 8.19099 10.024Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h5 className="text-neutral-400 text-xs lg:text-sm font-medium mb-3 lg:mb-4 uppercase tracking-wider">
                            Locations
                          </h5>
                          <div className="space-y-3 lg:space-y-4">
                            {footer.data.contact_section[0].addresses.map((item, index: number) => (
                              item.address && (
                                <p key={index} className="text-neutral-200 text-sm lg:text-base font-normal leading-relaxed">
                                  {item.address}
                                </p>
                              )
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Phone Contacts Section with Phone Icon */}
                  {footer.data.contact_section[0].phone_contacts && footer.data.contact_section[0].phone_contacts.length > 0 && (
                    <div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-mach1-red flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg 
                            className="w-4 h-4 lg:w-5 lg:h-5"
                            viewBox="0 0 17 17" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9.95179 4.26166C11.3477 4.52871 12.4402 5.62113 12.7073 7.01706M9.95179 1.46973C12.8772 1.79747 15.1835 4.10381 15.5113 7.01706M14.8072 12.6009V14.7008C14.8072 15.4777 14.1882 16.0967 13.4113 16.1088C13.3628 16.1088 13.3264 16.1088 13.2778 16.1088C11.1293 15.8782 9.0657 15.1378 7.24491 13.9604C5.55765 12.8922 4.12528 11.4598 3.05709 9.77255C1.87965 7.95176 1.13924 5.87607 0.908612 3.71541C0.83578 2.95068 1.40627 2.27092 2.171 2.19809C2.20741 2.19809 2.25594 2.19809 2.29235 2.19809H4.39238C5.09641 2.19809 5.69116 2.70789 5.78827 3.39979C5.87324 4.06741 6.04321 4.73503 6.27384 5.36624C6.46806 5.87606 6.34666 6.45873 5.95823 6.83503L5.07213 7.72112C6.0675 9.46908 7.512 10.9257 9.25996 11.9089L10.1461 11.0228C10.5345 10.6343 11.105 10.513 11.6148 10.7072C12.2461 10.9379 12.9137 11.1078 13.5813 11.1927C14.2853 11.2898 14.7951 11.8968 14.783 12.6129L14.8072 12.6009Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                            {footer.data.contact_section[0].phone_contacts.map((contact, index: number) => (
                              <div key={index}>
                                {contact.contact_name && (
                                  <h5 className="text-neutral-400 text-xs lg:text-sm font-medium uppercase tracking-wider mb-2 lg:mb-3">
                                    {contact.contact_name}
                                  </h5>
                                )}
                                {contact.phone_number && (
                                  <p className="text-neutral-200 text-sm lg:text-base font-normal">
                                    {contact.phone_number}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Logo Section */}
              <div className="flex flex-col items-start lg:items-end justify-start gap-4 lg:gap-6 w-full lg:w-auto">
                {footer.data.logo?.url && (
                  <PrismicNextImage
                    field={footer.data.logo}
                    className="h-24 lg:h-32 xl:h-40 w-auto"
                    alt=""
                  />
                )}
                
                  {/* Social Media */}
                  {footer.data.social_media && footer.data.social_media.length > 0 && (
                    <div className="flex items-center gap-6 lg:gap-8 xl:gap-12 mt-auto">
                    {footer.data.social_media.map((social, index: number) => {
                      const platform = social.platform;
                      
                      // Define icons for each platform
                      const getSocialIcon = () => {
                        switch (platform) {
                          case 'LinkedIn':
                            return (
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                              </svg>
                            );
                          case 'Twitter':
                            return (
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                              </svg>
                            );
                          case 'Facebook':
                            return (
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                              </svg>
                            );
                          case 'Instagram':
                            return (
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                              </svg>
                            );
                          case 'YouTube':
                            return (
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                              </svg>
                            );
                          default:
                            return null;
                        }
                      };

                      return (
                        <PrismicNextLink
                          key={index}
                          field={social.url}
                          className="flex items-center justify-center w-10 h-10 rounded-full text-neutral-200 hover:bg-white/20 transition-all duration-200"
                          aria-label={`Visit us on ${platform}`}
                        >
                          {getSocialIcon()}
                        </PrismicNextLink>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            
            {/* Decorative line */}
            <div className="mt-12 lg:mt-16 mb-6 lg:mb-8">
              <svg 
                width="100%" 
                height="24" 
                viewBox="0 0 1146 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="w-full text-neutral-200/30"
                preserveAspectRatio="none"
              >
                <path d="M1145.22 22.6439H44.4436C35.5461 22.6439 26.867 19.9005 19.596 14.778L0.332031 1.21924" stroke="currentColor" strokeOpacity="0.866667" strokeMiterlimit="10"/>
              </svg>
            </div>
            

            {/* Copyright and Legal */}
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-6">
              {/* Legal Links - Left */}
              <div className="flex items-center flex-wrap justify-center lg:justify-start gap-3 lg:gap-4 order-2 lg:order-1">
                {footer.data.legal_links && footer.data.legal_links.slice(0, 2).map((legalLink, index: number) => (
                  <PrismicNextLink
                    key={index}
                    field={legalLink.link}
                    className="text-neutral-400 text-xs lg:text-sm font-normal hover:text-white hover:underline transition-colors"
                  >
                    {legalLink.label}
                  </PrismicNextLink>
                ))}
              </div>

              {/* Copyright - Right */}
              <p className="text-neutral-400 text-xs lg:text-sm font-normal text-center lg:text-right order-1 lg:order-2">
                {footer.data.copyright_text}
                {footer.data.website_credit[0] && (
                  <>
                    {' '}
                    {footer.data.website_credit[0].text}{' '}
                    <PrismicNextLink
                      field={footer.data.website_credit[0].link}
                      className="text-neutral-400 hover:text-white hover:underline transition-colors"
                    >
                      {footer.data.website_credit[0].link_text}
                    </PrismicNextLink>
                  </>
                )}
              </p>
            </div>
          </div>
        </footer>
      </>
    );
  } catch (error) {
    console.error("Error fetching footer:", error);
    return (
      <footer className="bg-dark-blue text-white py-16">
        <div className="w-full max-w-[100rem] mx-auto px-4 lg:px-8 text-center">
          <p>Footer content unavailable</p>
        </div>
      </footer>
    );
  }
}
