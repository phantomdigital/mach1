# Weblate Translation Setup

This project uses **Weblate** for managing translations across 15 languages for global freight forwarding operations.

## 🌍 Supported Languages

### English Variants
- 🇦🇺 English (Australia) - `en-AU` (default)
- 🇳🇿 English (New Zealand) - `en-NZ`
- 🇺🇸 English (United States) - `en-US`
- 🇬🇧 English (United Kingdom) - `en-GB`
- 🇸🇬 English (Singapore) - `en-SG`

### Asia Pacific
- 🇨🇳 Chinese (Simplified) - `zh-CN`
- 🇹🇼 Chinese (Traditional) - `zh-TW`
- 🇯🇵 Japanese - `ja`
- 🇰🇷 Korean - `ko`
- 🇻🇳 Vietnamese - `vi`
- 🇹🇭 Thai - `th`
- 🇮🇩 Indonesian - `id`

### Europe
- 🇪🇸 Spanish - `es`
- 🇫🇷 French - `fr`
- 🇩🇪 German - `de`

## 🚀 Quick Start with Weblate

### Option 1: Hosted Weblate (Recommended)

1. **Sign up for Weblate**
   - Go to https://hosted.weblate.org/
   - Create a free account
   - Free for open source projects

2. **Create a New Component**
   - Click "Add new translation component"
   - Name: `MACH1 Logistics`
   - Repository: Link your GitHub/GitLab repository
   - File format: `JSON`
   - File mask: `messages/*.json`
   - Base file: `messages/en-AU.json`

3. **Configure Languages**
   - Add all 15 languages listed above
   - Set `en-AU` as the source language

4. **Invite Translators**
   - Invite your team or professional translators
   - Set permissions (translator, reviewer, admin)

### Option 2: Self-Hosted Weblate

1. **Install Docker**
   ```bash
   # Pull Weblate Docker image
   docker pull weblate/weblate
   
   # Run Weblate
   docker run -p 8080:8080 weblate/weblate
   ```

2. **Configure**
   - Access at `http://localhost:8080`
   - Follow setup wizard
   - Connect to your repository

## 📁 Translation File Structure

```
messages/
├── en-AU.json  (Source/Base)
├── en-NZ.json
├── en-US.json
├── en-GB.json
├── en-SG.json
├── zh-CN.json
├── zh-TW.json
├── ja.json
├── ko.json
├── es.json
├── fr.json
├── de.json
├── vi.json
├── th.json
└── id.json
```

## 🔄 Workflow

### For Developers:

1. **Add new translation keys**
   ```json
   // messages/en-AU.json
   {
     "navigation": {
       "newPage": "New Page Name"
     }
   }
   ```

2. **Commit and push**
   ```bash
   git add messages/en-AU.json
   git commit -m "Add new translation key"
   git push
   ```

3. **Weblate auto-syncs**
   - Weblate detects changes
   - Creates translation tasks
   - Notifies translators

### For Translators:

1. **Log in to Weblate**
2. **Select language**
3. **Translate strings**
4. **Submit for review**
5. **Weblate creates PR automatically**

## 🎯 Using Translations in Code

### In Server Components:
```typescript
import { useTranslations } from 'next-intl';

export default function Page() {
  const t = useTranslations('navigation');
  
  return <h1>{t('home')}</h1>
}
```

### In Client Components:
```typescript
'use client';
import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations('header');
  
  return <button>{t('getQuote')}</button>
}
```

## 🌐 Automatic Locale Detection

The site automatically detects user locale from:
1. **URL** - `/en-US/about`
2. **Browser language** - `Accept-Language` header
3. **IP geolocation** - Optional (requires additional setup)
4. **User preference** - Saved in cookies

## 🔧 Adding New Languages

1. **Update `i18n.ts`**
   ```typescript
   export const locales = [
     ...
     'pt', // Portuguese
   ] as const;
   ```

2. **Create translation file**
   ```bash
   cp messages/en-AU.json messages/pt.json
   ```

3. **Add to Weblate**
   - Go to Weblate dashboard
   - Add language
   - Start translating

## 💡 Best Practices

### For Developers:
- ✅ Use descriptive translation keys
- ✅ Keep strings atomic and reusable
- ✅ Add context comments in JSON
- ✅ Test with pseudo-localization
- ❌ Don't hardcode strings
- ❌ Don't concatenate translated strings

### For Translators:
- ✅ Maintain freight/logistics terminology
- ✅ Use formal tone for business
- ✅ Check pluralization rules
- ✅ Verify date/number formats
- ❌ Don't translate brand names
- ❌ Don't translate technical IDs

## 📊 Translation Progress

View real-time progress at:
- Weblate Dashboard
- Or add this badge to README:

```markdown
[![Translation status](https://hosted.weblate.org/widgets/mach1-logistics/-/svg-badge.svg)](https://hosted.weblate.org/engage/mach1-logistics/)
```

## 🆘 Support

- **Weblate Docs**: https://docs.weblate.org/
- **Next-intl Docs**: https://next-intl-docs.vercel.app/
- **Project Issues**: https://github.com/your-repo/issues

## 🔐 Security

Translation files are:
- ✅ Version controlled
- ✅ Reviewed before merge
- ✅ Scanned for injection attacks
- ✅ Validated for JSON format

---

**Ready to translate the world! 🌍**

