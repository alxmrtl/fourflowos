# 🚀 Sanity CMS Deployment Guide

## ✅ What's Ready

Your Sanity integration is complete and ready for production:

- ✅ All 12 Flow Key articles migrated to Sanity
- ✅ Rich text editor with proper formatting
- ✅ Webhook for instant updates set up
- ✅ Environment variables configured
- ✅ Production-ready API configuration

## 🔑 Environment Variables for Production

Add these to your hosting platform (Vercel, Netlify, etc.):

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=pz22ntol
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=skFsVNJgys3k7mpt1Mfrsn3y82nmd0MjNUHcesigTIGEE8RPbOvYotyQPL0NGMKtUbgw867fqrqIvdFEER9Fcr920WUw7SUZ958v1Gb4y6N7l8gV6A3jJ8dIYrMXxdX6osCrN3R3hQPSLGhR7C3mkkCK9iyunAg7zC2lHGATFsVsAHpFVA08
SANITY_REVALIDATE_SECRET=fourflow-webhook-secret-2024
```

## 🔗 Post-Deployment: Configure Webhook

After your site is live, set up the webhook in Sanity:

1. Go to: https://fourflowos.sanity.studio/desk/webhook
2. Or manually configure at: https://www.sanity.io/manage/personal/project/pz22ntol/api/webhooks
3. Add webhook URL: `https://your-domain.com/api/revalidate?secret=fourflow-webhook-secret-2024`
4. Select events: Create, Update, Delete
5. Filter: `_type == "contentItem"`

## 🎯 How It Works

### Content Management
- **Edit**: Go to https://fourflowos.sanity.studio
- **Rich Editor**: Full WYSIWYG editing with headings, formatting, lists
- **Metadata**: Tags, dimensions, difficulty, read time, etc.
- **Instant Updates**: Save in Sanity → appears on site immediately

### For Users
- **No More Git**: Content updates don't require code pushes
- **Real-time**: Changes appear within seconds on live site
- **Mobile Editing**: Sanity Studio works on mobile devices
- **Version History**: Built-in content versioning

## 🚀 Workflow After Deployment

1. **Content Creation**: Use Sanity Studio rich text editor
2. **Auto-sync**: Webhook triggers site rebuild on content changes
3. **Live Updates**: New content appears instantly on your site
4. **Code Changes**: Only push to git for design/functionality updates

## 🔧 Local Development

```bash
# Start Sanity Studio (content editor)
npm run sanity:dev

# Start Next.js (your website) 
npm run dev
```

- Sanity Studio: http://localhost:3333
- Next.js Site: http://localhost:3008

## 📊 Content Structure

Each article includes:
- Title & Description
- Rich text content with headings and formatting
- Dimension (Self, Space, Story, Spirit)
- Flow Key (12 keys available)
- Type (Learn or Practice)
- Tags, difficulty, read time
- Pinned status and ordering

## 🎉 You're All Set!

Your content management is now completely modernized:
- ✅ Easy editing with rich text
- ✅ Instant updates
- ✅ Mobile-friendly
- ✅ No technical barriers
- ✅ Professional CMS