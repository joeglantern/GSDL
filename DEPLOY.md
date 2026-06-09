# Deploy workflow

## Local — push changes

```bash
git add .
git commit -m "your message"
git push
```

## VPS — pull and rebuild

```bash
cd ~/gsdl-site
git pull
npm run build
pm2 restart gsdl-site
```
