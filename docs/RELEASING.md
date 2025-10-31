## Releasing new versions

### Release a beta version
```bash
git checkout -b pre-$(date +%Y%m%d)
pnpm exec changeset pre enter next
pnpm exec changeset # if there is no new changeset
pnpm exec changeset version
pnpm run release
```

### Release a major/minor/patch version
```bash
git checkout main
pnpm exec changeset # if there is no new changeset
git add . && git commit
pnpm exec changeset version
pnpm run release
git commit -am v{NEW.VERSION.NUMBER}
git push
git checkout -b v{NEW.VERSION.NUMBER}
git push # for posterity / future debugging
```
