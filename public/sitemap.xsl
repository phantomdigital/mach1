<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Sitemap | MACH1 Logistics</title>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin=""/>
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
        <style>
          :root {
            --mach1-dark: #141433;
            --mach1-red: #ed1e24;
            --mach1-black: #262626;
            --neutral-200: #e5e5e5;
            --neutral-600: #525252;
            --neutral-700: #404040;
          }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Manrope', system-ui, sans-serif;
            background: #fafafa;
            color: var(--mach1-black);
            line-height: 1.6;
            min-height: 100vh;
          }
          .header {
            background: var(--mach1-dark);
            color: white;
            padding: 2rem 1.5rem;
            text-align: center;
          }
          .header h1 {
            font-size: 1.75rem;
            font-weight: 700;
            margin-bottom: 0.25rem;
          }
          .header p {
            font-size: 0.9rem;
            opacity: 0.9;
          }
          .container {
            max-width: 48rem;
            margin: 0 auto;
            padding: 2rem 1.5rem;
          }
          .info {
            background: white;
            border-left: 4px solid var(--mach1-red);
            padding: 1rem 1.25rem;
            margin-bottom: 2rem;
            border-radius: 0 8px 8px 0;
            font-size: 0.9rem;
            color: var(--neutral-700);
          }
          .table-wrap {
            background: white;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.08);
            overflow: hidden;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th {
            background: var(--mach1-dark);
            color: white;
            text-align: left;
            padding: 0.875rem 1rem;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          td {
            padding: 0.75rem 1rem;
            border-bottom: 1px solid var(--neutral-200);
            font-size: 0.9rem;
          }
          tr:last-child td { border-bottom: none; }
          tr:hover td { background: #f8fafc; }
          td a {
            color: #0ea5e9;
            text-decoration: none;
            word-break: break-all;
          }
          td a:hover {
            color: var(--mach1-red);
            text-decoration: underline;
          }
          .priority { font-variant-numeric: tabular-nums; }
          .changefreq { text-transform: capitalize; }
          @media (max-width: 640px) {
            .hide-mobile { display: none; }
            th, td { padding: 0.625rem 0.75rem; font-size: 0.85rem; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>MACH1 Logistics</h1>
          <p>XML Sitemap</p>
        </div>
        <div class="container">
          <div class="info">
            This sitemap helps search engines discover and index our pages. You can view the raw XML in your browsers view source.
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>URL</th>
                  <th class="hide-mobile">Last Modified</th>
                  <th class="hide-mobile">Priority</th>
                  <th class="hide-mobile">Change Freq</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <tr>
                    <td><xsl:value-of select="position()"/></td>
                    <td>
                      <a href="{sitemap:loc}">
                        <xsl:value-of select="sitemap:loc"/>
                      </a>
                    </td>
                    <td class="hide-mobile">
                      <xsl:value-of select="sitemap:lastmod"/>
                    </td>
                    <td class="priority hide-mobile">
                      <xsl:value-of select="sitemap:priority"/>
                    </td>
                    <td class="changefreq hide-mobile">
                      <xsl:value-of select="sitemap:changefreq"/>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
