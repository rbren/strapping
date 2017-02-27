webpack -p
git checkout gh-pages
rm -r ./dist
mv static/* ./
git commit -a -m "build gh-pages"
