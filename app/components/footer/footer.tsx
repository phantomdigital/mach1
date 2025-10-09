import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { createClient } from "@/prismicio";
import { FooterCtaButtons } from "./footer-cta-buttons";
import type { FooterDocument } from "@/types.generated";

// Server component for footer
export default async function Footer() {
  const client = createClient();
  
  try {
    const footer = await client.getSingle("footer");
    
    return (
      <footer className="relative bg-dark-blue text-white overflow-hidden">
        {/* CTA Section with geometric background */}
        <div className="relative">
          {/* Full background */}
          <div className="absolute inset-0 w-full h-full bg-dark-blue"></div>
          
          {/* Clipped section container */}
          <div className="relative w-full max-w-[110rem] mx-auto py-24">
            {/* SVG Clip Path Definition */}
            <svg width="0" height="0" className="absolute">
              <defs>
                <clipPath id="footer-clip" clipPathUnits="objectBoundingBox">
                  <path d="M1,0.269 L0.839,0.013 C0.835,0.005 0.828,0.001 0.823,0 L0.495,0 L0.495,0.00006 L0,0.00006 L0,0.731 L0.160,0.987 C0.165,0.995 0.171,0.999 0.177,1 L0.505,1 L0.505,0.99994 L1,0.99994 L1,0.269 Z" />
                </clipPath>
              </defs>
            </svg>

            {/* Clipped content area */}
            <div 
              className="relative w-full mx-auto"
              style={{ 
                aspectRatio: '1279 / 579',
                clipPath: 'url(#footer-clip)'
              }}
            >
              {/* Background layer with optional image */}
              <div className="absolute inset-0 bg-gray-100">
                {/* Optional background image */}
                {footer.data.cta_section[0]?.background_image?.url && (
                  <PrismicNextImage
                    field={footer.data.cta_section[0].background_image}
                    className="absolute inset-0 w-full h-full object-cover"
                    alt=""
                  />
                )}
                
                {/* Overlay for better text readability when there's a background image */}
                {footer.data.cta_section[0]?.background_image?.url && (
                  <div className="absolute inset-0 bg-black/75"></div>
                )}
              </div>

              {/* Content layer */}
              <div className="absolute inset-0 flex items-center justify-center p-8 lg:p-12">
                <div className="text-center max-w-4xl mx-auto">
                  {/* Eyebrow text */}
                  {footer.data.cta_section[0]?.eyebrow_text && (
                    <div 
                      className={`text-sm font-medium uppercase tracking-wide mb-4 ${
                        footer.data.cta_section[0]?.background_image?.url ? 'text-white' : 'text-neutral-800'
                      }`}
                      style={{ fontFamily: '"space-mono", monospace', fontWeight: 400, fontStyle: 'normal' }}
                    >
                      {footer.data.cta_section[0].eyebrow_text}
                    </div>
                  )}
                  
                  {/* Main title */}
                  {footer.data.cta_section[0]?.title && (
                    <h2 
                      className={`text-4xl lg:text-5xl font-bold mb-6 ${
                        footer.data.cta_section[0]?.background_image?.url ? 'text-white' : 'text-neutral-800'
                      }`}
                      style={{ fontFamily: '"nextexit-variable", sans-serif', fontVariationSettings: '"ROUN" 0, "wght" 700' }}
                    >
                      {footer.data.cta_section[0].title}
                    </h2>
                  )}
                  
                  {/* Description */}
                  {footer.data.cta_section[0]?.description && (
                    <p 
                      className={`text-xl leading-relaxed mb-12 max-w-2xl mx-auto ${
                        footer.data.cta_section[0]?.background_image?.url ? 'text-white/90' : 'text-neutral-800'
                      }`}
                      style={{ fontFamily: '"nextexit-variable", sans-serif', fontVariationSettings: '"ROUN" 0, "wght" 400' }}
                    >
                      {footer.data.cta_section[0].description}
                    </p>
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
            </div>
          </div>
        </div>
        
        {/* Main Footer Content */}
        <div className="bg-mach1-blue relative">
          <div className="w-full max-w-[100rem] mx-auto px-4 lg:px-8 py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
              
              {/* Solutions Section */}
              {footer.data.solutions_section[0] && (
                <div>
                  <h3 
                    className="text-base font-semibold text-white mb-6"
                              style={{ fontFamily: '"nextexit-variable", sans-serif', fontVariationSettings: '"ROUN" 0, "wght" 400' }}
                  >
                    {footer.data.solutions_section[0].title || 'Solutions'}
                  </h3>
                  {footer.data.solutions_section[0].links && (
                    <ul className="space-y-3">
                      {footer.data.solutions_section[0].links.map((link: any, index: number) => (
                        <li key={index}>
                          <PrismicNextLink
                            field={link.link}
                            className="text-white text-[9.74px] font-medium underline hover:text-gray-200 transition-colors"
                            style={{ fontFamily: '"nextexit-variable", sans-serif', fontVariationSettings: '"ROUN" 0, "wght" 400' }}
                          >
                            {link.label}
                          </PrismicNextLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              
              {/* Specialties Section */}
              {footer.data.specialties_section[0] && (
                <div>
                  <h3 
                    className="text-base font-semibold text-white mb-6"
                              style={{ fontFamily: '"nextexit-variable", sans-serif', fontVariationSettings: '"ROUN" 0, "wght" 400' }}
                  >
                    {footer.data.specialties_section[0].title || 'Specialties'}
                  </h3>
                  {footer.data.specialties_section[0].links && (
                    <ul className="space-y-3">
                      {footer.data.specialties_section[0].links.map((link: any, index: number) => (
                        <li key={index}>
                          <PrismicNextLink
                            field={link.link}
                            className="text-white text-[9.74px] font-medium underline hover:text-gray-200 transition-colors"
                            style={{ fontFamily: '"nextexit-variable", sans-serif', fontVariationSettings: '"ROUN" 0, "wght" 400' }}
                          >
                            {link.label}
                          </PrismicNextLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              
              {/* Contact Section */}
              {footer.data.contact_section[0] && (
                <div>
                  <h3 
                    className="text-base font-semibold text-white mb-6"
                              style={{ fontFamily: '"nextexit-variable", sans-serif', fontVariationSettings: '"ROUN" 0, "wght" 400' }}
                  >
                    {footer.data.contact_section[0].title || 'Contact Us'}
                  </h3>
                  
                  {/* Locations */}
                  {footer.data.contact_section[0].locations && (
                    <div className="space-y-6">
                      {footer.data.contact_section[0].locations.map((location: any, index: number) => (
                        <div key={index} className="space-y-2">
                          {location.location_name && (
                            <div 
                              className="text-zinc-300/90 text-[8.64px] font-medium"
                              style={{ fontFamily: '"nextexit-variable", sans-serif', fontVariationSettings: '"ROUN" 0, "wght" 400' }}
                            >
                              {location.location_name}
                            </div>
                          )}
                          {location.address && (
                            <div 
                              className="text-white text-[9.74px] font-medium"
                              style={{ fontFamily: '"nextexit-variable", sans-serif', fontVariationSettings: '"ROUN" 0, "wght" 400' }}
                            >
                              <svg 
                                width="16" 
                                height="19" 
                                viewBox="0 0 16 19" 
                                fill="none" 
                                xmlns="http://www.w3.org/2000/svg"
                                className="inline-block mr-2 align-top mt-0.5"
                              >
                                <path d="M14.9387 7.77844C14.9387 13.0223 8.20174 17.5136 8.20174 17.5136C8.20174 17.5136 1.46484 13.0223 1.46484 7.77844C1.46484 4.05189 4.48733 1.0415 8.20174 1.0415C11.9161 1.0415 14.9387 4.06403 14.9387 7.77844Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M8.19099 10.024C9.43122 10.024 10.4366 9.01859 10.4366 7.77836C10.4366 6.53813 9.43122 5.53271 8.19099 5.53271C6.95076 5.53271 5.94531 6.53813 5.94531 7.77836C5.94531 9.01859 6.95076 10.024 8.19099 10.024Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              {location.address}
                            </div>
                          )}
                          {location.phone && (
                            <div 
                              className="text-white text-[9.74px] font-medium"
                              style={{ fontFamily: '"nextexit-variable", sans-serif', fontVariationSettings: '"ROUN" 0, "wght" 400' }}
                            >
                              <svg 
                                width="17" 
                                height="17" 
                                viewBox="0 0 17 17" 
                                fill="none" 
                                xmlns="http://www.w3.org/2000/svg"
                                className="inline-block mr-2 align-top mt-0.5"
                              >
                                <path d="M9.95179 4.26166C11.3477 4.52871 12.4402 5.62113 12.7073 7.01706M9.95179 1.46973C12.8772 1.79747 15.1835 4.10381 15.5113 7.01706M14.8072 12.6009V14.7008C14.8072 15.4777 14.1882 16.0967 13.4113 16.1088C13.3628 16.1088 13.3264 16.1088 13.2778 16.1088C11.1293 15.8782 9.0657 15.1378 7.24491 13.9604C5.55765 12.8922 4.12528 11.4598 3.05709 9.77255C1.87965 7.95176 1.13924 5.87607 0.908612 3.71541C0.83578 2.95068 1.40627 2.27092 2.171 2.19809C2.20741 2.19809 2.25594 2.19809 2.29235 2.19809H4.39238C5.09641 2.19809 5.69116 2.70789 5.78827 3.39979C5.87324 4.06741 6.04321 4.73503 6.27384 5.36624C6.46806 5.87606 6.34666 6.45873 5.95823 6.83503L5.07213 7.72112C6.0675 9.46908 7.512 10.9257 9.25996 11.9089L10.1461 11.0228C10.5345 10.6343 11.105 10.513 11.6148 10.7072C12.2461 10.9379 12.9137 11.1078 13.5813 11.1927C14.2853 11.2898 14.7951 11.8968 14.783 12.6129L14.8072 12.6009Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              {location.phone}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Additional Info */}
                  {footer.data.contact_section[0].additional_info && (
                    <div className="mt-6 space-y-2">
                      {footer.data.contact_section[0].additional_info.map((info: any, index: number) => (
                        <div 
                          key={index}
                          className="text-zinc-300/90 text-[8.64px] font-medium"
                              style={{ fontFamily: '"nextexit-variable", sans-serif', fontVariationSettings: '"ROUN" 0, "wght" 400' }}
                        >
                          {info.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Logo Section */}
              <div className="flex flex-col items-start lg:items-end">
                {footer.data.logo?.url && (
                  <div className="mb-8">
                    <PrismicNextImage
                      field={footer.data.logo}
                      className="h-24 w-auto"
                      alt=""
                    />
                  </div>
                )}
                
                {/* Legal Links */}
                {footer.data.legal_links && footer.data.legal_links.length > 0 && (
                  <div className="space-y-2">
                    {footer.data.legal_links.map((legalLink: any, index: number) => (
                      <PrismicNextLink
                        key={index}
                        field={legalLink.link}
                        className="block text-white text-[9.74px] font-medium underline hover:text-gray-200 transition-colors"
                              style={{ fontFamily: '"nextexit-variable", sans-serif', fontVariationSettings: '"ROUN" 0, "wght" 400' }}
                      >
                        {legalLink.label}
                      </PrismicNextLink>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Decorative line */}
            <div className="mt-16 mb-8">
              <svg 
                width="100%" 
                height="24" 
                viewBox="0 0 1146 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="w-full text-gray-300/80"
                preserveAspectRatio="none"
              >
                <path d="M1145.22 22.6439H44.4436C35.5461 22.6439 26.867 19.9005 19.596 14.778L0.332031 1.21924" stroke="currentColor" strokeOpacity="0.866667" strokeMiterlimit="10"/>
              </svg>
            </div>
            
            {/* Copyright */}
            <div className="text-center lg:text-left">
              <div 
                className="text-zinc-300/90 text-[8.99px] font-medium"
                style={{ fontFamily: '"nextexit-variable", sans-serif', fontVariationSettings: '"ROUN" 0, "wght" 500' }}
              >
                {footer.data.copyright_text}
                {footer.data.website_credit[0] && (
                  <>
                    {' '}
                    {footer.data.website_credit[0].text}{' '}
                    <PrismicNextLink
                      field={footer.data.website_credit[0].link}
                      className="underline hover:text-white transition-colors"
                    >
                      {footer.data.website_credit[0].link_text}
                    </PrismicNextLink>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  } catch (error) {
    console.error("Error fetching footer:", error);
    return (
      <footer className="bg-mach1-blue text-white py-16">
        <div className="w-full max-w-[100rem] mx-auto px-4 lg:px-8 text-center">
          <p>Footer content unavailable</p>
        </div>
      </footer>
    );
  }
}
